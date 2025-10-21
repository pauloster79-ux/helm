/**
 * useAIValidation Hook
 * 
 * Provides debounced AI validation for form fields with real-time suggestions.
 * Integrates with the FastAPI AI service (via backend or direct call).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  AIValidationRequest,
  AIValidationResponse,
  ValidationIssue,
  AIProposal 
} from '../types/database.types';

interface UseAIValidationOptions {
  projectId: string;
  componentType: 'task' | 'risk' | 'decision' | 'milestone';
  componentId?: string;
  debounceMs?: number;
  validationLevel?: 'rules_only' | 'selective' | 'full';
  enabled?: boolean;
}

interface UseAIValidationReturn {
  isAnalyzing: boolean;
  suggestions: AIProposal[];
  issues: ValidationIssue[];
  validate: (field: string, value: any) => void;
  validateAll: (data: Record<string, any>) => Promise<void>;
  clear: () => void;
  lastValidation: AIValidationResponse | null;
}

export function useAIValidation(
  options: UseAIValidationOptions
): UseAIValidationReturn {
  const {
    projectId,
    componentType,
    componentId,
    debounceMs = 1000, // 1 second default
    validationLevel = 'rules_only', // Fast validation for field-level
    enabled = true
  } = options;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AIProposal[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [lastValidation, setLastValidation] = useState<AIValidationResponse | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Call the AI validation service
   * 
   * NOTE: This currently calls a mock endpoint. 
   * When backend is ready, update this to call the actual API.
   */
  const callAIService = useCallback(async (
    data: Record<string, any>
  ): Promise<AIValidationResponse> => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const request: AIValidationRequest = {
      project_id: projectId,
      component_type: componentType,
      component_id: componentId,
      data,
      validation_level: validationLevel
    };

    try {
      // Call the real AI service
      console.log('[useAIValidation] Calling AI service with:', request);
      console.log('[useAIValidation] Request URL:', 'http://localhost:8001/validate');
      
      const response = await fetch('http://localhost:8001/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          component_type: componentType,
          component_id: componentId,
          component_data: data,
          validation_scope: validationLevel,
          ai_provider: 'anthropic',
          ai_model: 'claude-3-haiku-20240307'
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`AI validation failed: ${response.statusText}`);
      }

      const aiResponse = await response.json();
      console.log('[useAIValidation] AI service response:', aiResponse);
      
      // Transform the response to match our expected format
      const transformedResponse: AIValidationResponse = {
        valid: aiResponse.success,
        issues: aiResponse.issues || [],
        proposals: aiResponse.proposals || [],
        tokens_used: aiResponse.usage_stats?.tokens_used || 0,
        estimated_cost: aiResponse.usage_stats?.estimated_cost || 0,
        model_used: aiResponse.usage_stats?.model || 'unknown',
        latency_ms: aiResponse.processing_time_ms || 0
      };

      return transformedResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('[useAIValidation] Request aborted');
        throw error;
      }
      
      console.error('[useAIValidation] Error calling AI service:', error);
      
      // Return empty results with clear error message
      console.error('[useAIValidation] AI service unavailable:', error);
      
      const mockResponse: AIValidationResponse = {
        valid: true,
        issues: [{
          field: 'general',
          message: 'AI validation service is temporarily unavailable. Your input will be saved without AI suggestions.',
          severity: 'warning'
        }],
        proposals: [], // No mock proposals
        tokens_used: 0,
        estimated_cost: 0,
        model_used: 'unavailable',
        latency_ms: 0
      };

      return mockResponse;
    }
  }, [projectId, componentType, componentId, validationLevel]);

  /**
   * Validate a single field (debounced)
   */
  const validate = useCallback((field: string, value: any) => {
    if (!enabled) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Show analyzing state immediately
    setIsAnalyzing(true);

    // Set up new debounced validation
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // For single field validation, we need to preserve existing form data
        // to enable cross-field validation (like title-description consistency)
        const currentData = { [field]: value };
        
        // Try to get existing form data from the current state
        // This is a workaround for the fact that we don't have access to all form fields
        // In a real implementation, the parent component would pass all form data
        const result = await callAIService(currentData);
        
        setSuggestions(result.proposals);
        setIssues(result.issues);
        setLastValidation(result);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Validation error:', error);
          setIssues([{
            field,
            message: 'Failed to validate with AI. Please try again.',
            severity: 'warning'
          }]);
        }
      } finally {
        setIsAnalyzing(false);
      }
    }, debounceMs);
  }, [enabled, debounceMs, callAIService]);

  /**
   * Validate all fields at once (non-debounced)
   * Used when submitting a complete form
   */
  const validateAll = useCallback(async (data: Record<string, any>) => {
    if (!enabled) return;

    setIsAnalyzing(true);
    
    try {
      const result = await callAIService(data);
      
      setSuggestions(result.proposals);
      setIssues(result.issues);
      setLastValidation(result);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Validation error:', error);
        setIssues([{
          field: 'general',
          message: 'Failed to validate with AI. Please try again.',
          severity: 'warning'
        }]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [enabled, callAIService]);

  /**
   * Clear all suggestions and issues
   */
  const clear = useCallback(() => {
    setSuggestions([]);
    setIssues([]);
    setLastValidation(null);
    setIsAnalyzing(false);

    // Clear any pending timers
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Abort any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isAnalyzing,
    suggestions,
    issues,
    validate,
    validateAll,
    clear,
    lastValidation
  };
}


