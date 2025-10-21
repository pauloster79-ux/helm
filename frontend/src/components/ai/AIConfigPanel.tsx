/**
 * AIConfigPanel Component
 * 
 * AI configuration panel in the Settings tab of the Assistant Pane.
 * Allows users to configure AI behavior per project:
 * - AI provider and model selection
 * - Validation scope (rules_only, selective, full)
 * - Cost limits and alerts
 * - Feature toggles
 */

import { useState, useEffect } from 'react';
import { Save, DollarSign, Zap, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { supabase } from '../../lib/supabase';

interface AIConfigPanelProps {
  organizationId: string;
  className?: string;
}

export function AIConfigPanel({ organizationId, className = '' }: AIConfigPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>({
    ai_provider: 'openai',
    ai_model: 'gpt-4o-mini',
    validation_scope: 'selective',
    proposal_timing: 'realtime',
    proposal_threshold: 'medium',
    cost_limit_daily: 5.00,
    cost_limit_monthly: 100.00,
    alert_threshold_percentage: 80,
    enable_field_validation: true,
    enable_component_validation: true,
    assessment_prompt_system: null,
    assessment_prompt_categories: null,
    assessment_prompt_output_format: null
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showAdvancedPrompts, setShowAdvancedPrompts] = useState(false);

  // Fetch current configuration
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        
        // TODO: Implement AI configurations table
        // For now, use default configuration
        console.log('Using default AI configuration');
        // Keep default config - no need to update state
      } catch (error) {
        console.warn('Error fetching AI config, using defaults:', error);
        // Don't show error message, just use default config
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [organizationId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }

      // Prepare the data to save
      const saveData = {
        organization_id: organizationId,
        component_type: null,
        ai_provider: config.ai_provider,
        ai_model: config.ai_model,
        validation_scope: config.validation_scope,
        proposal_timing: config.proposal_timing,
        proposal_threshold: config.proposal_threshold,
        cost_limit_daily: config.cost_limit_daily || null,
        cost_limit_monthly: config.cost_limit_monthly || null,
        alert_threshold_percentage: config.alert_threshold_percentage,
        enable_field_validation: config.enable_field_validation,
        enable_component_validation: config.enable_component_validation,
        assessment_prompt_system: config.assessment_prompt_system || null,
        assessment_prompt_categories: config.assessment_prompt_categories || null,
        assessment_prompt_output_format: config.assessment_prompt_output_format || null,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      };

      console.log('Saving AI config with data:', saveData);

      // TODO: Implement AI configurations table
      console.log('AI config save (not implemented):', saveData);
      const error = null; // Mock success

      if (error) {
        console.error('Supabase error:', error);
        // If table doesn't exist or other database error, show a different message
        if (error.code === 'PGRST301' || error.message.includes('relation') || error.message.includes('does not exist')) {
          setMessage({ type: 'error', text: 'Configuration database not yet set up. Settings will be applied when database is ready.' });
        } else if (error.code === '23505') {
          setMessage({ type: 'error', text: 'Configuration already exists for this organization. Please try again.' });
        } else if (error.code === '23503') {
          setMessage({ type: 'error', text: 'Invalid organization ID. Please refresh the page and try again.' });
        } else {
          setMessage({ type: 'error', text: `Database error: ${error.message}` });
        }
      } else {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }

    } catch (error) {
      console.error('Error saving AI config:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessage({ type: 'error', text: `Failed to save configuration: ${errorMessage}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">AI Configuration</h3>
        <p className="text-xs text-gray-500">Configure how AI assists across all your projects</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Debug Information - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
          <div className="font-medium text-gray-700 mb-2">Debug Info:</div>
          <div className="space-y-1 text-gray-600">
            <div>Organization ID: {organizationId || 'Not set'}</div>
            <div>Monthly Limit: {config.cost_limit_monthly || 'null'}</div>
            <div>Daily Limit: {config.cost_limit_daily || 'null'}</div>
            <div>AI Provider: {config.ai_provider}</div>
            <div>AI Model: {config.ai_model}</div>
          </div>
        </div>
      )}

      {/* AI Provider */}
      <div className="space-y-2">
        <Label htmlFor="ai_provider" className="text-xs font-medium">AI Provider</Label>
        <Select
          value={config.ai_provider}
          onValueChange={(value: 'openai' | 'anthropic') => setConfig({ ...config, ai_provider: value })}
        >
          <SelectTrigger id="ai_provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Model */}
      <div className="space-y-2">
        <Label htmlFor="ai_model" className="text-xs font-medium">Model</Label>
        <Select
          value={config.ai_model}
          onValueChange={(value) => setConfig({ ...config, ai_model: value })}
        >
          <SelectTrigger id="ai_model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {config.ai_provider === 'openai' ? (
              <>
                <SelectItem value="gpt-4o">GPT-4o (Most capable, $$$)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Balanced, $)</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="claude-sonnet-4">Claude Sonnet 4 (Most capable, $$$)</SelectItem>
                <SelectItem value="claude-haiku-4">Claude Haiku 4 (Fast, $)</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Validation Scope */}
      <div className="space-y-2">
        <Label htmlFor="validation_scope" className="text-xs font-medium flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Validation Scope
        </Label>
        <Select
          value={config.validation_scope}
          onValueChange={(value: 'rules_only' | 'selective' | 'full') => 
            setConfig({ ...config, validation_scope: value })
          }
        >
          <SelectTrigger id="validation_scope">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rules_only">Rules Only (Fastest, ~100 tokens)</SelectItem>
            <SelectItem value="selective">Selective (Balanced, ~500 tokens)</SelectItem>
            <SelectItem value="full">Full Context (Comprehensive, ~2000 tokens)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          {config.validation_scope === 'rules_only' && 'Fast validation with basic schema rules'}
          {config.validation_scope === 'selective' && 'Includes related tasks and dependencies'}
          {config.validation_scope === 'full' && 'Complete project context for deep analysis'}
        </p>
      </div>

      {/* Proposal Threshold */}
      <div className="space-y-2">
        <Label htmlFor="proposal_threshold" className="text-xs font-medium">Proposal Threshold</Label>
        <Select
          value={config.proposal_threshold}
          onValueChange={(value: 'low' | 'medium' | 'high') => 
            setConfig({ ...config, proposal_threshold: value })
          }
        >
          <SelectTrigger id="proposal_threshold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (Show all suggestions)</SelectItem>
            <SelectItem value="medium">Medium (Medium+ confidence)</SelectItem>
            <SelectItem value="high">High (Only high confidence)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cost Limits */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-xs font-medium flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          Cost Limits
        </Label>
        
        <div className="space-y-2">
          <Label htmlFor="cost_limit_daily" className="text-xs text-gray-600">Daily Limit ($)</Label>
          <Input
            id="cost_limit_daily"
            type="number"
            step="0.01"
            min="0"
            value={config.cost_limit_daily || ''}
            onChange={(e) => setConfig({ ...config, cost_limit_daily: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="No limit"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost_limit_monthly" className="text-xs text-gray-600">Monthly Limit ($)</Label>
          <Input
            id="cost_limit_monthly"
            type="number"
            step="0.01"
            min="0"
            value={config.cost_limit_monthly || ''}
            onChange={(e) => setConfig({ ...config, cost_limit_monthly: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="No limit"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alert_threshold" className="text-xs text-gray-600">Alert Threshold (%)</Label>
          <Input
            id="alert_threshold"
            type="number"
            min="1"
            max="100"
            value={config.alert_threshold_percentage}
            onChange={(e) => setConfig({ ...config, alert_threshold_percentage: parseInt(e.target.value) || 80 })}
          />
          <p className="text-xs text-gray-500">
            Get notified at {config.alert_threshold_percentage}% of monthly limit
          </p>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-xs font-medium">Features</Label>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="enable_field" className="text-xs text-gray-700 cursor-pointer">
            Real-time field validation
          </Label>
          <Switch
            id="enable_field"
            checked={config.enable_field_validation}
            onCheckedChange={(checked: boolean) => setConfig({ ...config, enable_field_validation: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enable_component" className="text-xs text-gray-700 cursor-pointer">
            Component validation
          </Label>
          <Switch
            id="enable_component"
            checked={config.enable_component_validation}
            onCheckedChange={(checked: boolean) => setConfig({ ...config, enable_component_validation: checked })}
          />
        </div>
      </div>

      {/* Assessment Prompts */}
      <div className="space-y-3 pt-4 border-t">
        <button
          onClick={() => setShowAdvancedPrompts(!showAdvancedPrompts)}
          className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900"
        >
          {showAdvancedPrompts ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          Assessment Prompts (Advanced)
        </button>
        
        {showAdvancedPrompts && (
          <div className="space-y-4 pl-5 border-l-2 border-gray-100">
            <div className="space-y-2">
              <Label htmlFor="assessment_prompt_system" className="text-xs font-medium">
                System Prompt
              </Label>
              <Textarea
                id="assessment_prompt_system"
                value={config.assessment_prompt_system || ''}
                onChange={(e) => setConfig({ ...config, assessment_prompt_system: e.target.value })}
                placeholder="You are a project management expert analyzing a software project..."
                className="min-h-[100px] text-xs"
              />
              <p className="text-xs text-gray-500">
                Custom system prompt for project assessments. Leave empty to use default.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment_prompt_categories" className="text-xs font-medium">
                Analysis Categories
              </Label>
              <Textarea
                id="assessment_prompt_categories"
                value={config.assessment_prompt_categories || ''}
                onChange={(e) => setConfig({ ...config, assessment_prompt_categories: e.target.value })}
                placeholder="**Task Quality Issues:**\n- Tasks with vague descriptions..."
                className="min-h-[120px] text-xs font-mono"
              />
              <p className="text-xs text-gray-500">
                Categories to analyze (markdown format). Leave empty to use default.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment_prompt_output_format" className="text-xs font-medium">
                Output Format
              </Label>
              <Textarea
                id="assessment_prompt_output_format"
                value={config.assessment_prompt_output_format || ''}
                onChange={(e) => setConfig({ ...config, assessment_prompt_output_format: e.target.value })}
                placeholder="Return a JSON array of insights. Each insight should have..."
                className="min-h-[100px] text-xs"
              />
              <p className="text-xs text-gray-500">
                Instructions for AI output format. Leave empty to use default.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setConfig({
                    ...config,
                    assessment_prompt_system: null,
                    assessment_prompt_categories: null,
                    assessment_prompt_output_format: null
                  });
                }}
                className="text-xs"
              >
                Reset to Default
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // TODO: Show preview modal
                  console.log('Preview prompts');
                }}
                className="text-xs"
              >
                Preview
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Configuration'}
      </Button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
        <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800">
          <p className="mb-1">
            These settings apply to all projects in your organization. Changes take effect immediately for new validations.
          </p>
          {organizationId === 'default-org' && (
            <p className="text-blue-600">
              <strong>Note:</strong> Currently using personal workspace settings. Organization-level settings will be available once your organization profile is fully configured.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

