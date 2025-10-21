import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export class AIValidationRequest {
  @IsString()
  project_id: string;

  @IsString()
  component_type: string;

  @IsOptional()
  @IsString()
  component_id?: string;

  @IsObject()
  component_data: Record<string, any>;

  @IsEnum(['rules_only', 'selective', 'full'])
  validation_scope: 'rules_only' | 'selective' | 'full';

  @IsOptional()
  @IsString()
  ai_provider?: string;

  @IsOptional()
  @IsString()
  ai_model?: string;
}

export class AIValidationResponse {
  success: boolean;
  issues: Array<{
    field: string;
    issue_type: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    suggestion?: string;
  }>;
  proposals: Array<{
    proposal_type: string;
    component_type: string;
    component_id?: string;
    changes: Record<string, any>;
    rationale: string;
    confidence: 'high' | 'medium' | 'low';
    evidence: string[];
    estimated_impact: string;
  }>;
  usage_stats: {
    tokens_used: number;
    estimated_cost: number;
    provider: string;
    model: string;
  };
  processing_time_ms: number;
}

