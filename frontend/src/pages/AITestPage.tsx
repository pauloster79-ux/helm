/**
 * AI Test Page
 * 
 * Demo page to test all Phase 3 AI components with mock data.
 * This works WITHOUT any backend - perfect for testing the UI!
 */

import React, { useState } from 'react';
import { AssistantPane } from '../components/ai/AssistantPane';
import { InlineSuggestion } from '../components/ai/InlineSuggestion';
import { useAIValidation } from '../hooks/useAIValidation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DatePicker } from '../components/ui/date-picker';

export default function AITestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [latestPosition, setLatestPosition] = useState('');
  
  // Use the AI validation hook with mock data
  const { 
    isAnalyzing, 
    suggestions, 
    issues,
    validate,
    validateAll 
  } = useAIValidation({
    projectId: '00000000-0000-0000-0000-000000000001', // Valid UUID for testing
    componentType: 'task',
    enabled: true,
    debounceMs: 1000
  });

  const handleApplySuggestion = (proposal: any) => {
    if (proposal.field === 'title') {
      setTitle(proposal.proposed_value);
      console.log('✅ Accepted proposal for title field');
    } else if (proposal.field === 'description') {
      setDescription(proposal.proposed_value);
      console.log('✅ Accepted proposal for description field');
    } else if (proposal.field === 'priority') {
      setPriority(proposal.proposed_value);
      console.log('✅ Accepted proposal for priority field');
    } else if (proposal.field === 'assignee') {
      setAssignee(proposal.proposed_value);
      console.log('✅ Accepted proposal for assignee field');
    } else if (proposal.field === 'start_date') {
      // Convert string to Date if needed
      const dateValue = typeof proposal.proposed_value === 'string' 
        ? new Date(proposal.proposed_value) 
        : proposal.proposed_value;
      setStartDate(dateValue);
      console.log('✅ Accepted proposal for start date field');
    } else if (proposal.field === 'end_date') {
      // Convert string to Date if needed
      const dateValue = typeof proposal.proposed_value === 'string' 
        ? new Date(proposal.proposed_value) 
        : proposal.proposed_value;
      setEndDate(dateValue);
      console.log('✅ Accepted proposal for end date field');
    } else if (proposal.field === 'latest_position') {
      setLatestPosition(proposal.proposed_value);
      console.log('✅ Accepted proposal for latest position field');
    }
  };

  const handleDismissSuggestion = (proposal: any) => {
    console.log('❌ Dismissed AI suggestion:', proposal.rationale);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateAll({ 
      title, 
      description, 
      priority, 
      assignee, 
      start_date: startDate ? startDate.toISOString().split('T')[0] : '', 
      end_date: endDate ? endDate.toISOString().split('T')[0] : '', 
      latest_position: latestPosition 
    });
    alert('Form submitted! Check the Assistant Pane for cross-project proposals.');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content Area - 70% */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Phase 3: AI Assistant Demo
            </h1>
            <p className="text-gray-600">
              Test the AI assistant features with mock data. Try typing vague titles like "fix bug" to see suggestions!
            </p>
          </div>

          {/* Developer Notice */}
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-lg">⚠️ Developer Testing Page</CardTitle>
              <CardDescription>
                This is a developer testing page. AI features are now integrated into the main app!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-orange-700">✅ Ready to use:</span>
                <span>Go to any project's Tasks page to create and edit tasks with AI assistance</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-orange-700">🔧 For testing:</span>
                <span>Use this page to test AI features in isolation or debug specific scenarios</span>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">🎯 How to Test</CardTitle>
              <CardDescription>
                This page demonstrates all Phase 3 AI features with mock data (no backend required)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">1.</span>
                <span>Try vague titles like "fix bug", "update", or "work on" → See inline proposals</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">2.</span>
                <span>Try short descriptions → Get proposals for acceptance criteria</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">3.</span>
                <span>Select priority from dropdown → Get format standardization proposals</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">4.</span>
                <span>Select assignee from dropdown → Get specific assignee proposals</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">5.</span>
                <span>Pick start/end dates → Get date format proposals</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">6.</span>
                <span>Try "blocked by API" in Latest Position → Get structured blocker proposals</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">7.</span>
                <span>Click "Accept Proposal" → Watch field update with animation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">8.</span>
                <span>Click "Dismiss" → Proposal disappears with feedback</span>
              </div>
            </CardContent>
          </Card>

          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Task (with AI Assistance)</CardTitle>
              <CardDescription>
                Start typing and watch AI suggestions appear in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Task Title *
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Try: "fix bug", "update", or any vague title
                  </p>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      validate('title', e.target.value);
                    }}
                    placeholder="Enter task title..."
                    className="w-full"
                  />
                  
                  {/* Inline suggestions for title */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'title')}
                    issues={issues.filter(i => i.field === 'title')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* Description Field */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Try short descriptions to trigger "missing information" suggestions
                  </p>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      validate('description', e.target.value);
                    }}
                    placeholder="Describe what needs to be done..."
                    className="w-full min-h-[100px]"
                  />
                  
                  {/* Inline suggestions for description */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'description')}
                    issues={issues.filter(i => i.field === 'description')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* Priority Field */}
                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select priority level or leave empty for AI suggestions
                  </p>
                  <Select
                    value={priority}
                    onValueChange={(value) => {
                      setPriority(value);
                      validate('priority', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority level..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Inline suggestions for priority */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'priority')}
                    issues={issues.filter(i => i.field === 'priority')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* Assignee Field */}
                <div>
                  <Label htmlFor="assignee" className="text-sm font-medium">
                    Assignee
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select team member or leave empty for AI suggestions
                  </p>
                  <Select
                    value={assignee}
                    onValueChange={(value) => {
                      setAssignee(value);
                      validate('assignee', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select team member..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alice-johnson">Alice Johnson (Frontend Dev)</SelectItem>
                      <SelectItem value="bob-smith">Bob Smith (Backend Dev)</SelectItem>
                      <SelectItem value="carol-williams">Carol Williams (DevOps)</SelectItem>
                      <SelectItem value="david-brown">David Brown (QA Engineer)</SelectItem>
                      <SelectItem value="emma-davis">Emma Davis (Product Manager)</SelectItem>
                      <SelectItem value="frank-miller">Frank Miller (Designer)</SelectItem>
                      <SelectItem value="grace-wilson">Grace Wilson (Data Analyst)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Inline suggestions for assignee */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'assignee')}
                    issues={issues.filter(i => i.field === 'assignee')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* Start Date Field */}
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select start date or leave empty for AI suggestions
                  </p>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      validate('start_date', date ? date.toISOString().split('T')[0] : '');
                    }}
                    placeholder="Pick a start date..."
                    className="w-full"
                  />
                  
                  {/* Inline suggestions for start date */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'start_date')}
                    issues={issues.filter(i => i.field === 'start_date')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* End Date Field */}
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select end date or leave empty for AI suggestions
                  </p>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      validate('end_date', date ? date.toISOString().split('T')[0] : '');
                    }}
                    placeholder="Pick an end date..."
                    className="w-full"
                  />
                  
                  {/* Inline suggestions for end date */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'end_date')}
                    issues={issues.filter(i => i.field === 'end_date')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* Latest Position Field */}
                <div>
                  <Label htmlFor="latestPosition" className="text-sm font-medium">
                    Latest Position
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Try: "blocked by API", "waiting for review", or leave empty for suggestions
                  </p>
                  <Textarea
                    id="latestPosition"
                    value={latestPosition}
                    onChange={(e) => {
                      setLatestPosition(e.target.value);
                      validate('latest_position', e.target.value);
                    }}
                    placeholder="Describe current status and progress..."
                    className="w-full min-h-[80px]"
                  />
                  
                  {/* Inline suggestions for latest position */}
                  <InlineSuggestion
                    proposals={suggestions.filter(s => s.field === 'latest_position')}
                    issues={issues.filter(i => i.field === 'latest_position')}
                    isAnalyzing={isAnalyzing}
                    onApply={handleApplySuggestion}
                    onDismiss={handleDismissSuggestion}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Create Task
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setPriority('');
                      setAssignee('');
                      setStartDate(undefined);
                      setEndDate(undefined);
                      setLatestPosition('');
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Current Values Display */}
          {(title || description || priority || assignee || startDate || endDate || latestPosition) && (
            <Card className="mt-6 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Current Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {title && (
                  <div>
                    <span className="font-medium">Title:</span> {title}
                  </div>
                )}
                {description && (
                  <div>
                    <span className="font-medium">Description:</span> {description}
                  </div>
                )}
                {priority && (
                  <div>
                    <span className="font-medium">Priority:</span> {priority}
                  </div>
                )}
                {assignee && (
                  <div>
                    <span className="font-medium">Assignee:</span> {assignee}
                  </div>
                )}
                {startDate && (
                  <div>
                    <span className="font-medium">Start Date:</span> {startDate.toLocaleDateString()}
                  </div>
                )}
                {endDate && (
                  <div>
                    <span className="font-medium">End Date:</span> {endDate.toLocaleDateString()}
                  </div>
                )}
                {latestPosition && (
                  <div>
                    <span className="font-medium">Latest Position:</span> {latestPosition}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Info */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ What's Working</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Real-time AI proposals (with 1-second debounce)</li>
              <li>• Inline proposal display with animations</li>
              <li>• Accept/Dismiss proposal actions</li>
              <li>• Comprehensive task field validation (title, description, priority, assignee, start/end dates, latest position)</li>
              <li>• Assistant Pane with proposals queue</li>
              <li>• AI configuration panel</li>
              <li>• All using enhanced mock data (no backend needed!)</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⏳ To Connect Real AI</h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Run database migrations in Supabase</li>
              <li>Create Edge Function or FastAPI service</li>
              <li>Update <code className="bg-yellow-100 px-1 rounded">useAIValidation.ts</code> to call real endpoint</li>
              <li>Add your OpenAI/Anthropic API key</li>
            </ol>
          </div>
        </div>
      </div>

      {/* AI Assistant Pane - 30% */}
      <AssistantPane 
        projectId="00000000-0000-0000-0000-000000000001"
        componentType="task"
        defaultCollapsed={false}
      />
    </div>
  );
}

