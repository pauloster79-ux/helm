import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AIValidationRequest, AIValidationResponse } from './dto/ai.dto';
import { AIService } from './ai.service';

@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('validate')
  async validate(
    @Body() request: AIValidationRequest,
    @Request() req: any
  ): Promise<AIValidationResponse> {
    // Add user context for rate limiting and cost tracking
    const userId = req.user.id;
    const projectId = request.project_id;
    
    return this.aiService.validateWithAI(request, userId, projectId);
  }

  @Post('proposals/accept')
  async acceptProposal(
    @Body() body: { proposalId: string; modifications?: any },
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.aiService.acceptProposal(body.proposalId, body.modifications, userId);
  }

  @Post('proposals/reject')
  async rejectProposal(
    @Body() body: { proposalId: string; feedback?: string },
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.aiService.rejectProposal(body.proposalId, body.feedback, userId);
  }

  @Post('answer-question')
  async answerQuestion(
    @Body() body: { projectId: string; question: string },
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.aiService.answerQuestion(body.projectId, body.question, userId);
  }
}

