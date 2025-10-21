import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AIValidationRequest, AIValidationResponse } from './dto/ai.dto';

@Injectable()
export class AIService {
  private readonly aiServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8001');
  }

  async validateWithAI(
    request: AIValidationRequest,
    userId: string,
    projectId: string
  ): Promise<AIValidationResponse> {
    try {
      // Add user context to the request
      const enrichedRequest = {
        ...request,
        user_id: userId,
        project_id: projectId,
        // AI service will use its own API keys from environment
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/validate`, enrichedRequest)
      );

      // Log usage for cost tracking
      await this.logAIUsage(userId, projectId, response.data);

      return response.data;
    } catch (error) {
      console.error('AI validation error:', error);
      throw new HttpException(
        'AI validation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async acceptProposal(proposalId: string, modifications: any, userId: string) {
    // Implementation for accepting proposals
    // This would update the database and apply changes
    return { success: true, proposalId, appliedBy: userId };
  }

  async rejectProposal(proposalId: string, feedback: string, userId: string) {
    // Implementation for rejecting proposals
    return { success: true, proposalId, rejectedBy: userId };
  }

  async answerQuestion(projectId: string, question: string, userId: string) {
    try {
      // Call AI service to answer the question
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/answer-question`, {
          project_id: projectId,
          question: question,
          user_id: userId
        })
      );

      // Log usage for cost tracking
      await this.logAIUsage(userId, projectId, response.data);

      return response.data;
    } catch (error) {
      console.error('AI question answering error:', error);
      throw new HttpException(
        'Failed to answer question',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async logAIUsage(userId: string, projectId: string, response: any) {
    // Log AI usage for cost tracking and rate limiting
    console.log(`AI usage logged for user ${userId}, project ${projectId}:`, {
      tokens: response.usage_stats?.tokens_used,
      cost: response.usage_stats?.estimated_cost,
      model: response.usage_stats?.model
    });
  }
}

