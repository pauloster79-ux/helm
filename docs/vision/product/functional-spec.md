# Helm - Functional Specification

**Version:** 0.2  
**Last Updated:** 2025-10-05  
**Status:** Draft - In Discussion

---

## 1. Executive Summary

### 1.1 The Problem Helm Solves

Traditional project management tools treat data entry as a necessary evil—forms to fill, fields to update, status meetings to endure. Project managers spend 40% of their time on administrative overhead: chasing updates, cleaning inconsistent data, reconciling information across tools, and generating reports. Meanwhile, team members resent the bureaucracy, providing vague updates like "making progress" that offer little insight.

This creates a vicious cycle: poor data quality leads to more meetings and emails to understand true status, which increases overhead, which makes people resent the tools more, which degrades data quality further.

### 1.2 The Helm Approach

Helm fundamentally reimagines project management by treating **conversation as the primary interface** and **AI as an intelligent assistant** rather than forcing humans to adapt to rigid data structures.

**Core Philosophy:**
Instead of "fill out this form correctly," Helm says "tell me what's happening, I'll help structure it."

The platform enables project updates through natural conversation—whether in Slack, Teams, web chat, or the UI itself. Contributors simply describe their progress in their own words. The AI then:
1. Extracts structured data from natural language
2. Proposes improvements and missing information
3. Detects patterns, risks, and opportunities
4. Generates insights and recommendations

Critically, **AI proposes, humans decide**. Every AI suggestion requires explicit approval, maintaining human accountability while eliminating drudgery.

### 1.3 Key Differentiators

1. **Narrative-Driven Updates**: The "Latest Position" field captures progress as a running story, not forced status updates
2. **AI as Proposal Engine**: Every AI action is a proposal with clear rationale, never an autonomous change
3. **Flexible Validation Depth**: Choose between speed (rules-only) and thoroughness (full context) per component type
4. **Transparent AI Pricing**: See exactly what AI costs, control usage, understand value
5. **Conversational Interface**: Update projects where you work—Slack, Teams, chat—not another dashboard
6. **Document Intelligence**: AI reads your requirements, meeting notes, and designs to provide context-aware assistance
7. **Daily Analysis Engine**: Automated overnight analysis identifies patterns, risks, and opportunities

### 1.4 The Value Proposition

**For Project Managers:**
- Reduce administrative time from 40% to under 10%
- Generate stakeholder reports in minutes instead of hours
- Early warning of risks through pattern detection
- Single source of truth maintained automatically

**For Contributors:**
- Update tasks in seconds through natural language
- No more form-filling or duplicate status updates
- Clear understanding of what "done" means
- Context-aware assistance when needed

**For Organizations:**
- 70% reduction in PM overhead costs
- Improved project success rates through better visibility
- Data-driven decision making with trustworthy information
- Scalable PM capability without linear headcount growth

---

## 2. Core Principles

### 2.1 Flexibility as Foundation

**The Problem with One-Size-Fits-All:**
Every project has different needs. A small internal tool with 3 developers has vastly different requirements than a regulated healthcare system with 50 stakeholders. Yet most PM tools force everyone into the same rigid structure.

**Helm's Approach:**
Every project is independently configurable across multiple dimensions. This isn't just about turning features on/off—it's about adapting the entire AI assistance model to match project needs and constraints.

**Configuration Dimensions:**

**AI Model Selection:**
Projects can choose different AI models per component type. A high-stakes aerospace project might use GPT-4o for all validations (maximum intelligence, higher cost). A simple internal project might use GPT-4o-mini everywhere (good enough, minimal cost).

This flexibility acknowledges that:
- Not all project components need equal intelligence
- Budget constraints vary by organization and project
- Risk tolerance differs across domains
- Cost optimization should be controllable

**Validation Scope:**
Each component type can validate at different depths:
- **Rules-only**: Fast, cheap, catches obvious errors (typos, required fields)
- **Selective context**: Moderate speed/cost, validates against immediate dependencies
- **Full context**: Comprehensive, expensive, validates against entire project state

A critical path task might use full validation while routine documentation updates use rules-only.

**Validation Timing:**
Components can validate:
- **Synchronously**: Block until validated (for critical items)
- **Asynchronously**: Save immediately, validate in background (for routine updates)
- **On-demand**: Only validate when explicitly requested (for drafts)

**Component-Level Rules:**
Beyond AI configuration, each component type (Tasks, Risks, Decisions) has customizable:
- Required vs. optional fields
- Validation strictness
- Proposal aggressiveness
- Custom prompts and guidelines

**Why This Matters:**
This flexibility means Helm works for:
- Startups moving fast with minimal process
- Enterprises requiring comprehensive validation
- Regulated industries with audit requirements
- Budget-conscious teams optimizing AI spend
- Everything in between

### 2.2 Pricing Model

**The Hidden Cost of "Free" AI:**
Many tools advertise "AI-powered" features as if they're free value-adds. In reality, AI computation is expensive and those costs are either:
1. Hidden in inflated platform fees
2. Limited by undisclosed quotas
3. Subsidized short-term (then prices rise)
4. Low-quality due to cheap models

**Helm's Transparent Approach:**

**Two-Tier Structure:**
1. **Platform Fee**: Access to application, storage, base features, support
   - Small project (<10 users): $50/month
   - Medium (10-50 users): $150/month  
   - Large (50+ users): $500/month

2. **AI Usage Fee**: Actual AI costs + transparent margin (30-50%)
   - Billed based on real usage
   - Visible cost per operation
   - Customer controls usage
   - Prepaid credits available

**Why Separate Pricing?**
This acknowledges several realities:

**AI Erodes Traditional Cost Savings:**
Traditional PM software sells on "save PM time." But if AI costs $200/month while only saving $50 in PM labor, that's a bad deal. Transparent pricing lets customers make informed decisions.

**Usage Should Match Value:**
Heavy AI users (complex projects needing deep validation) should pay more than light users (simple projects with basic validation). Bundling would force simple projects to subsidize complex ones.

**Customer Control:**
Separate pricing enables:
- Budget caps and alerts
- Conscious cost/benefit decisions
- Experimentation without commitment
- Scaling usage as value is proven

**Trust Through Transparency:**
Showing actual AI costs builds trust and allows intelligent conversations about optimization. Customers can see "Full validation on Tasks costs $50/month but catches 15 risks—worth it" vs "Full validation on meeting notes costs $30/month but rarely finds issues—not worth it."

**The Business Model:**
Helm's margin on AI usage (30-50%) covers:
- Infrastructure and overhead
- Prompt engineering and optimization  
- Model management and updates
- Usage monitoring and reporting

The platform fee covers core development, support, and non-AI features.

This creates aligned incentives: Helm succeeds when customers get genuine value from AI, not when they're locked into expensive features they don't need.

### 2.3 Data Quality First

**The Traditional Approach:**
Most PM tools accept whatever data users provide, then:
- Generate reports with "garbage in, garbage out" problems
- Require manual cleanup cycles
- Force PMs to police data quality
- Result in declining data trust over time

**Helm's Validation Gateway:**
All inputs pass through validation before becoming project state. However, validation is not monolithic—it's adaptive:

**Validation != Blocking:**
Validation can be:
- **Blocking**: Must fix issues to save (for critical components)
- **Warning**: Save allowed but issues flagged (for routine updates)
- **Advisory**: Gentle suggestions, no barriers (for drafts)

**The Validation Philosophy:**
Validation should:
1. **Improve, not impede**: Make updates better without adding friction
2. **Educate, not punish**: Explain why something could be clearer
3. **Scale to context**: Critical items get thorough review, routine items get light touch
4. **Learn over time**: Adapt to team patterns and preferences

**What Validation Catches:**
- Vague descriptions ("fix the bug" → "fix authentication timeout for SSO users")
- Missing information ("implement feature" → needs acceptance criteria)
- Inconsistencies (task marked done but blockers still active)
- Unrealistic estimates (2-hour estimate for month-long task)
- Broken dependencies (circular dependencies, orphaned tasks)
- Risk/opportunity signals ("changing approach mid-task" → possible risk)

**The Result:**
Over time, validation creates a **virtuous cycle**:
1. Better data quality leads to better AI proposals
2. Better proposals lead to more trust and adoption
3. More adoption creates more data for AI learning
4. AI learns team patterns and becomes more helpful
5. Higher quality input becomes the norm

This is the opposite of traditional tools where data quality degrades over time as teams develop workarounds and "just get through the forms."

---

## 3. System Components

### Introduction: The Architecture Philosophy

Helm's system architecture reflects its core principle: **AI as assistant, not autopilot**. Every component in the system is designed around a clear proposal-review-action cycle that keeps humans in control while leveraging AI's analytical capabilities.

**The Proposal-Driven Architecture:**

Traditional PM tools have a simple flow: User inputs → Data saved → Reports generated.

Helm introduces an intermediary layer: User inputs → AI analysis → Proposals generated → User reviews → Data saved → Insights generated.

This might seem like additional complexity, but it serves multiple critical purposes:

1. **Quality Gateway**: Catch issues before they become project data
2. **Learning Opportunity**: Users learn better practices through AI suggestions
3. **Transparency**: Every AI action is visible and explainable
4. **Accountability**: Humans make final decisions, AI just advises
5. **Trust Building**: Users see AI's reasoning before accepting suggestions

**Component Interactions:**

The system components work together in orchestrated workflows:

```
User Action
    ↓
Conversational Interface or Web UI
    ↓
Core API Service
    ↓
AI Service Orchestrator (validates/analyzes)
    ↓
Proposal Service (creates proposals)
    ↓
User Reviews Proposals
    ↓
Accepted proposals → Core API Service → Data stored
Rejected proposals → Proposal Service → Learn from rejection
    ↓
Daily Analysis Engine (overnight)
    ↓
More proposals generated
    ↓
Cycle continues
```

**Key Design Decisions:**

**Asynchronous AI Processing:**
Most AI operations happen asynchronously to avoid blocking users. When you create a task, it saves immediately with rule-based validation. Deep AI analysis happens in the background and surfaces proposals when ready.

**Separation of Concerns:**
Each component has a single, clear responsibility:
- Core API manages project data
- AI Orchestrator manages all AI interactions
- Proposal Service manages suggestion lifecycle
- Document Service handles file processing
- Conversation Service handles multi-channel communication

This separation allows:
- Independent scaling (AI service can scale separately from core API)
- Technology choices (Python for AI, Node.js for API)
- Testing and deployment (can test proposal logic without touching core data)
- Cost optimization (AI service uses different infrastructure)

**Event-Driven Communication:**
Components communicate via events:
- "Task created" event triggers AI analysis
- "Document uploaded" event triggers extraction
- "Daily analysis time" event triggers overnight processing
- "Proposal accepted" event updates core data

This creates loose coupling—components don't need to know about each other's internal workings.

### 3.1 Project Assistant (AI Proposal System)

**Core Principle:** The AI acts as an intelligent assistant that makes proposals, not decisions. Every change requires human approval.

**The Problem This Solves:**

Traditional AI implementations in PM tools typically take one of two approaches, both flawed:

1. **Passive AI**: Sits quietly, only responds when explicitly asked. Requires users to know what questions to ask. Misses opportunities to help proactively.

2. **Autonomous AI**: Makes changes automatically "to be helpful." Users wake up to modified data they didn't authorize. Destroys trust when it makes mistakes. Creates accountability confusion ("Did I do that or did AI?").

Helm's Project Assistant takes a third path: **Proactive but Permissioned**.

**How It Works:**

The AI continuously observes project activity (new tasks, updated status, uploaded documents) and generates proposals when it identifies opportunities to:
- Improve clarity
- Catch mistakes
- Suggest missing information
- Detect patterns
- Predict issues

Each proposal includes:
- What it wants to change
- Why (the rationale)
- Evidence supporting the suggestion
- Confidence level (High/Medium/Low)
- Estimated impact

Users then decide: Accept, Modify, Reject, or Defer each proposal.

**The Key Innovation:**

The proposal system inverts the traditional AI relationship. Instead of:
- "AI, analyze this task" (user must remember to ask)

We have:
- "I noticed this task might impact Task 45. Should I add a dependency?" (AI proactively helps)

The difference is subtle but profound: AI takes initiative while humans retain control.

#### Proposal Types

**1. Field-Level Proposals** (during editing)

Generated in real-time as users type or edit fields.

**Improved Wording/Clarity:**
```
User types: "fix the login bug"
AI proposes: "Resolve SSO authentication timeout for returning users"
Rationale: "More specific about issue type and affected user segment"
Confidence: High
```

**Missing Information:**
```
User creates task with title and description but no acceptance criteria
AI proposes: 
  Acceptance Criteria:
  - [ ] Users can log in via SSO without timeout
  - [ ] Session persists for 24 hours
  - [ ] Error handling displays clear message
Rationale: "Based on description, these criteria capture completeness"
Confidence: Medium
```

**Consistency Corrections:**
```
User marks task "Done" but blocker still active
AI proposes: "Status should remain 'In Progress' while blocker exists, or resolve blocker first"
Rationale: "Tasks with active blockers cannot be complete"
Confidence: High
```

**Format Standardization:**
```
User enters risk: "API might fail"
AI proposes: "IF the third-party payment API experiences downtime THEN customer transactions will fail, resulting in lost revenue of $10K/hour"
Rationale: "Risk format should follow IF/THEN structure with specific impact"
Confidence: High
```

**2. Component-Level Proposals** (new items)

Generated when analyzing existing components suggests creating related items.

**New Tasks from Risks:**
```
Risk exists: "Database backup failure could cause data loss"
AI proposes: Create Task
  Title: "Implement automated backup verification"
  Owner: [Database Admin]
  Description: "Create daily automated tests of backup integrity to mitigate R-12"
Rationale: "Risk R-12 lacks mitigation tasks"
Evidence: "No existing tasks address backup verification"
Confidence: High
```

**Risks from Task Descriptions:**
```
Task description mentions: "Switching to new API provider mid-sprint"
AI proposes: Create Risk
  Title: "API provider migration may introduce bugs"
  Probability: Medium
  Impact: Moderate
  Mitigation: "Allocate extra testing time, maintain fallback to old API for 2 weeks"
Rationale: "Mid-sprint API changes historically cause issues"
Evidence: "Similar change in Project Alpha caused 3-day delay"
Confidence: Medium
```

**Decisions Needed from Blockers:**
```
Blocker flagged: "Waiting on database choice - MySQL vs PostgreSQL"
AI proposes: Create Decision
  Question: "Select primary database for production deployment"
  Options:
    - MySQL: pros/cons listed
    - PostgreSQL: pros/cons listed
  Required by: Sprint 3 start (5 days)
  Stakeholders: Tech Lead, DevOps, DBA
Rationale: "Blocker B-12 requires architectural decision"
Confidence: High
```

**Milestones from Task Clusters:**
```
AI detects 12 tasks all tagged "MVP" with similar timeline
AI proposes: Create Milestone
  Name: "MVP Launch"
  Date: [based on latest task end date]
  Success Criteria: [extracted from task acceptance criteria]
  Dependent Tasks: [lists 12 tasks]
Rationale: "Task cluster suggests missing milestone"
Confidence: Medium
```

**3. Relationship Proposals**

Generated by analyzing connections between components.

**Missing Dependencies:**
```
Task A: "Deploy frontend changes"
Task B: "Update API endpoints"
Currently no dependency between them
AI proposes: Add dependency: Task B blocks Task A
Rationale: "Both modify user authentication flow; API must be deployed first"
Evidence: "Both tasks reference auth_controller.js and login endpoints"
Confidence: High
```

**Conflict Resolution:**
```
Task 23: Assigned to Sarah, due Oct 10
Task 45: Assigned to Sarah, due Oct 10
Both estimated at 3 days
AI proposes: Options to resolve conflict:
  1. Extend Task 23 to Oct 7, Task 45 starts Oct 8
  2. Reassign Task 45 to Mike (similar skills)
  3. Mark one task as lower priority
Rationale: "Sarah has 6 days of work scheduled for 5-day period"
Confidence: High
```

**Impact Assessments:**
```
User changes Task 23 end date from Oct 10 to Oct 15
AI proposes: Update affected items:
  - Task 45 start date: Oct 11 → Oct 16 (depends on Task 23)
  - Milestone M-3 date: Oct 20 → Oct 25 (includes Task 45)
  - Notify stakeholders of 5-day slip
Rationale: "Dependency chain requires date propagation"
Impact: "Affects 3 tasks, 1 milestone, delays customer demo"
Confidence: High
```

**Resource Reallocation:**
```
Sarah over-allocated at 140% for next sprint
Mike under-utilized at 40%
AI proposes: Reassign Tasks 67, 68 from Sarah to Mike
Rationale: "Mike has availability and required skills (authentication, frontend)"
Impact: "Balances team to 100% and 80% allocation"
Confidence: Medium (Mike has skills but less experience with this module)
```

#### Proposal Workflow

**1. AI Analyzes Input/Context**

When user creates or updates a component, AI:
- Loads relevant context (based on validation scope setting)
- Applies component-specific validation rules
- Checks for patterns and relationships
- Compares against historical data and documents

**2. Generates Proposal with Rationale**

If improvement opportunity detected, AI creates structured proposal:
```json
{
  "id": "prop_abc123",
  "type": "field_improvement",
  "component": "task",
  "componentId": "task_456",
  "action": "update",
  "changes": {
    "description": {
      "current": "fix the login bug",
      "proposed": "Resolve SSO authentication timeout affecting returning users after 24-hour session expiry"
    }
  },
  "rationale": "Specifies exact issue (timeout), cause (session expiry), and affected users (returning users)",
  "confidence": "high",
  "evidence": ["Common pattern in user support tickets", "Mentioned in Latest Position of Task 12"],
  "estimatedImpact": "Improves task clarity for handoff to QA team"
}
```

**3. Presents to Authorized User**

Proposals appear in context:
- **Inline (during editing)**: Suggestion appears below field being edited
- **Modal (after save)**: "I have 3 suggestions for this task"
- **Batch (daily review)**: Morning digest of overnight proposals
- **Chat**: "I noticed something about Task 23..."

**4. User Reviews and Decides**

Four possible actions:

**Accept** - Apply proposal as-is
```
User clicks "Accept"
→ Change applied immediately
→ Proposal marked accepted
→ AI learns: this pattern is helpful
→ Audit log records user accepted AI suggestion
```

**Modify** - Edit proposal then apply
```
User clicks "Modify"
→ Proposal opens in edit mode
→ User adjusts suggested text
→ Modified version applied
→ AI learns: direction right but details need human judgment
→ Audit log records user-modified version
```

**Reject** - Dismiss with optional reason
```
User clicks "Reject"
→ Optional feedback: "Why not helpful?"
  - Not applicable to this project
  - Incorrect assumption
  - Too nitpicky
  - Other: [free text]
→ Proposal marked rejected
→ AI learns: avoid similar suggestions
→ No data changed
```

**Defer** - Save for later consideration
```
User clicks "Defer"
→ Proposal moved to "Deferred" queue
→ Can review later in Proposal Dashboard
→ Doesn't block current work
→ After 30 days, auto-expires (user can re-trigger)
```

#### Configurable Parameters per Project Component

Each component type (Task, Risk, Decision, etc.) has independent AI configuration:

| Parameter | Options | Default | Impact |
|-----------|---------|---------|---------|
| **Model** | GPT-4o-mini<br>GPT-4o<br>Claude Haiku<br>Claude Sonnet | GPT-4o-mini | Intelligence vs. cost tradeoff |
| **Validation Scope** | Rules only<br>Selective context<br>Full context | Selective | Speed vs. thoroughness |
| **Proposal Timing** | Real-time<br>Batch<br>On-demand | Real-time | Immediacy vs. disruption |
| **Proposal Threshold** | Low (many)<br>Medium<br>High (critical only) | Medium | Frequency vs. usefulness |

**Example Configuration:**

```
Project: High-Stakes Healthcare System
- Tasks: GPT-4o, Full context, Real-time, Medium threshold
  (Critical for patient safety, worth the cost)
  
- Risks: GPT-4o, Full context, Real-time, Low threshold
  (Want every possible risk identified)
  
- Decisions: Claude Sonnet, Full context, Batch, Medium threshold
  (Complex reasoning, batch review works fine)
  
- Meeting Notes: GPT-4o-mini, Rules only, On-demand, High threshold
  (Just extract action items, keep it cheap)
```

```
Project: Simple Internal Tool
- Tasks: GPT-4o-mini, Selective context, Batch, Medium threshold
  (Basic validation, no rush)
  
- Risks: GPT-4o-mini, Selective context, On-demand, High threshold
  (Manual risk management is fine)
  
- Everything else: Minimal AI usage
  (Small project, optimize costs)
```

#### Validation Levels (Detailed)

**1. Rules-Only Validation** (~1-2 sec, ~$0.001/update)

**What it includes:**
- Grammar and spelling check
- Required field validation
- Format checking (e.g., dates, emails)
- Character limits
- Basic type checking (number vs. text)
- Regex pattern matching

**What it doesn't include:**
- No project context loaded
- No dependency checking
- No comparison to other components
- No historical analysis

**When to use:**
- Low-risk components (meeting notes, documentation)
- Frequent updates where speed matters
- Tight budgets
- Simple projects with minimal interdependencies

**Example proposals:**
- "Title should be capitalized"
- "Due date cannot be in the past"
- "Acceptance criteria should be a bulleted list"

**2. Selective Context Validation** (~4-8 sec, ~$0.02/update)

**What it includes:**
- Everything from rules-only
- Direct dependencies loaded (tasks this task depends on)
- Related components (same owner, same milestone)
- Recent changes (last 7 days in same area)
- Relevant documents (if tagged)

**Context window:**
- ~10-20 related components
- ~5,000 tokens of context

**What it doesn't include:**
- Full project history
- All documents
- Unrelated components
- Cross-project patterns

**When to use:**
- Most standard projects (default setting)
- Balance of speed and intelligence
- Components with clear dependencies
- Medium-complexity projects

**Example proposals:**
- "Task depends on Task 23 which is blocked—consider adjusting timeline"
- "Sarah is assigned 3 tasks due same day—possible over-allocation"
- "This task description conflicts with Decision D-12 made last week"

**3. Full Context Validation** (~10-20 sec, ~$0.05/update)

**What it includes:**
- Everything from selective context
- Entire project state (all tasks, risks, decisions, milestones)
- All project documents
- Full history and audit trail
- Cross-component analysis
- Pattern detection across project

**Context window:**
- Entire project (can be 50,000+ tokens for large projects)
- All documents and history

**When to use:**
- Critical components (key milestones, major risks)
- High-stakes decisions
- Complex projects with many interdependencies
- When comprehensive analysis is worth the cost/time
- Compliance-required projects

**Example proposals:**
- "This approach conflicts with architecture decision from 3 months ago"
- "Similar task in Phase 1 took 3x longer than estimated—adjust timeline"
- "Pattern detected: 5 tasks delayed due to API team availability—create risk"
- "This milestone date is unrealistic based on historical velocity (12 story points/sprint vs. 30 planned)"

#### Component-Specific Rules

Each component type has customized validation logic and proposal patterns. Detailed prompts are in Section 14, but key differences:

**Tasks:**
- Focus on clarity and actionability
- Acceptance criteria completeness
- Dependency logic
- Resource allocation

**Risks:**
- IF/THEN structure enforcement
- Mitigation quality assessment
- Probability/impact realism
- Related risk detection

**Decisions:**
- Option completeness (at least 2 viable options)
- Rationale depth
- Stakeholder identification
- Impact assessment

**Milestones:**
- Success criteria measurability
- Timeline feasibility
- Dependency completeness
- Stakeholder alignment

**Blockers:**
- Severity appropriateness
- Resolution path clarity
- Escalation triggers
- Impact scope

#### Learning and Adaptation

The Project Assistant learns from user behavior:

**Acceptance Patterns:**
- If users consistently accept description improvements → increase proposal frequency
- If users consistently reject format suggestions → reduce them

**Rejection Feedback:**
- "Too nitpicky" feedback → raise proposal threshold
- "Not applicable" → learn project-specific exceptions
- Pattern of rejections → adjust model or prompt

**Team Patterns:**
- Learn team's vocabulary and terminology
- Adapt to project-specific standards
- Recognize recurring patterns
- Build project-specific knowledge base

**Cross-Project Learning:**
- Successful patterns from Project A inform proposals for similar Project B
- Industry-specific best practices emerge
- Common anti-patterns identified

**The Feedback Loop:**
```
Proposal Generated
    ↓
User Reviews
    ↓
User Accepts/Rejects with optional feedback
    ↓
Feedback logged to AI learning system
    ↓
Future proposals adjusted based on patterns
    ↓
Over time, proposals become more relevant
```

This creates a virtuous cycle where the AI becomes more helpful the longer you use Helm.

### 3.2 Proposal Management System

**Proposal States:**
- **Pending** - Awaiting review
- **Accepted** - Applied to project
- **Modified** - Accepted with changes
- **Rejected** - Dismissed
- **Deferred** - Saved for later

**Proposal Tracking:**
- Who proposed (AI or human)
- When proposed
- Rationale/evidence
- Who reviewed
- Decision made
- Feedback provided

**Batch Proposal Modes:**

**1. Daily Review Mode**
- AI collects proposals throughout the day
- Presents consolidated list for review
- User can bulk accept/reject
- Reduces interruption, increases efficiency

**2. Real-time Mode**
- Proposals appear immediately
- Inline with user workflow
- Best for critical items
- More interactive experience

**3. Weekly Planning Mode**
- AI analyzes project holistically
- Generates strategic proposals
- Presented in planning sessions
- Focus on bigger picture changes

**Authorization Levels:**
- **Self-proposals**: User can accept AI proposals for their own items
- **Team-proposals**: Team leads can accept proposals for team items  
- **Project-proposals**: PMs can accept all proposals
- **Structural-proposals**: Only admins can accept schema/configuration changes

### 3.3 Project Assistant Intelligence Enhancement

**Document-Aware Context:**
The Project Assistant continuously learns from project documents to provide better proposals and insights.

**Document Processing:**
- **On upload**: AI reads and indexes new documents
- **Extracts**: Key information, decisions, requirements
- **Updates understanding**: Refreshes project context
- **Cross-references**: Validates against existing components

**Enhanced Proposal Generation:**
With document access, the AI can:
- Propose tasks from requirements documents
- Identify risks from technical designs
- Extract action items from meeting notes
- Suggest stakeholders from project plans
- Validate decisions against documented strategies
- Flag inconsistencies between documents and project state

**Context Memory:**
- AI maintains awareness of all project documents
- References relevant documents in proposals
- Updates proposals when documents change
- Flags when documents become stale

**Example Usage:**
1. User uploads "Q1 Planning Meeting Notes"
2. AI extracts: 3 decisions, 5 action items, 2 risks
3. AI proposes: Create tasks for action items
4. User accepts proposals
5. AI links tasks back to source document

### 3.4 Daily Analysis Engine

**Purpose:** Proactive overnight analysis that identifies patterns, predicts issues, and generates strategic recommendations

**The Problem with Reactive PM:**

Traditional project management is inherently reactive:
- Problems discovered when deadlines miss
- Risks identified after they materialize
- Resource conflicts noticed when work stops
- Trends visible only in retrospective

Project managers spend their days firefighting instead of preventing fires.

**The Daily Analysis Approach:**

While users sleep, Helm's AI analyzes the entire project with fresh eyes, asking:
- What patterns are emerging?
- What risks are developing?
- What opportunities exist?
- What needs PM attention tomorrow?

**The Vision:**
Every morning, PMs start with AI-generated insights:
- "3 tasks show a pattern suggesting timeline risk"
- "Sarah is over-allocated next sprint"  
- "Customer demo milestone looks achievable, but buffer is thin"
- "5 decisions are overdue, blocking 8 tasks"

Instead of discovering these through painful experience, PMs get early warnings with time to act.

**How It Works**

**Nightly Schedule:**
- Runs at configured time (default: 2 AM project timezone)
- Full context analysis (entire project state)
- Uses GPT-4o for maximum intelligence
- Generates comprehensive analysis report
- Creates proposal batch for morning review

**Analysis Process:**

**1. Data Collection (5 minutes)**
- Load all project components
- Gather all Latest Position updates from past 24 hours
- Read recent comments and decisions
- Check document changes
- Review previous analysis for comparison

**2. Pattern Detection (10 minutes)**

**Task Patterns:**
- Velocity trends (are we slowing down?)
- Blocker frequency (increasing?)
- Status distribution (too many "in progress"?)
- Update frequency (which tasks going stale?)
- Owner patterns (who's overloaded?)

**Risk Evolution:**
- Which risks increasing in probability?
- New risks emerging from patterns?
- Mitigation tasks making progress?
- Compound risks (multiple risks related)?

**Timeline Analysis:**
- Critical path changes
- Dependency chain delays
- Milestone confidence levels
- Buffer consumption rate
- Historical velocity vs. plan

**Resource Patterns:**
- Allocation balance
- Skill gaps
- Bottleneck resources
- Upcoming availability conflicts

**3. Issue Prediction (5 minutes)**

The AI asks "what if?" questions:

"If current trends continue..."
- Which milestones will miss?
- Which risks will materialize?
- Which resources will be overloaded?
- Which decisions will become urgent?

**Confidence Scoring:**
- High confidence: Clear data, consistent pattern
- Medium confidence: Some data, probable pattern
- Low confidence: Limited data, possible pattern

**4. Recommendation Generation (5 minutes)**

For each identified issue, AI generates actionable proposals:

**Example:**
```
Issue Detected:
Tasks 23, 45, 67 all delayed by authentication dependency
All owned by Sarah, all due next sprint
Pattern: Authentication module is bottleneck

Recommendations:
1. [High Priority] Create task: "Accelerate auth module completion"
   - Assign to Mike to assist Sarah
   - Move deadline up by 3 days
   
2. [Medium Priority] Risk proposal: "Auth module delay risk"
   - Probability: High
   - Impact: Moderate (affects 3 tasks, 1 milestone)
   - Mitigation: Parallel workstream created
   
3. [Low Priority] Decision needed: "Simplify auth requirements?"
   - Option A: Proceed with full OAuth 2.0
   - Option B: Start with simpler API key auth
   - Trade-off: Security vs. timeline
```

**5. Report Compilation (5 minutes)**

All findings packaged into:

**Executive Summary:**
- Top 3 items needing attention
- Overall project health score
- Key metrics vs. yesterday

**Detailed Sections:**
- Schedule confidence
- Risk evolution  
- Resource optimization
- Stakeholder communications
- Action items for PM

**6. Proposal Batch Creation**

All recommendations converted to proposals awaiting PM review.

**Analysis Types**

**Risk Evolution Analysis:**

**What it detects:**
- Risks increasing in likelihood
- New risks from recent updates
- Mitigation tasks falling behind
- Risk clusters (multiple related risks)

**Example Output:**
```
Risk R-12: "API vendor reliability" 
Status: Probability increased Low → Medium
Evidence: 
- Latest Position from Task 23: "API had 2 outages this week"
- Latest Position from Task 45: "Implementing error handling for API failures"
Pattern: Team is coding defensively, suggests reliability concern

Recommendation: 
→ Update risk probability to Medium
→ Create mitigation task: "Implement API circuit breaker"
→ Schedule vendor discussion about SLA
```

**Schedule Confidence Analysis:**

**What it calculates:**
- Probability of meeting each milestone
- Critical path stability
- Buffer health
- Velocity trends

**Methodology:**
- Historical velocity: Completed tasks / planned tasks
- Current progress: Tasks done / total tasks
- Remaining work: Story points or count
- Time remaining: Days until milestone
- Risk factors: Active blockers, dependencies

**Example Output:**
```
Milestone: "Beta Launch" (Oct 30, 15 days away)

Confidence: 65% (Medium-Low)

Analysis:
- Planned: 30 tasks
- Complete: 18 tasks (60%)
- Remaining: 12 tasks
- Avg velocity: 1.2 tasks/day
- Days needed: 10 days (leaves 5-day buffer)

Concerns:
- 3 tasks currently blocked
- Task 45 (critical path) hasn't updated in 4 days
- Sarah over-allocated next week (vacation)

Recommendations:
→ Unblock 3 tasks this week (priority 1)
→ Check on Task 45 status
→ Reassign 2 of Sarah's tasks to Mike
```

**Resource Optimization:**

**What it identifies:**
- Over-allocated resources
- Under-utilized resources
- Skill mismatches
- Upcoming conflicts

**Example Output:**
```
Resource Imbalances Detected:

Over-allocated:
- Sarah: 140% next sprint (14 days work, 10 days available)
  Tasks: 23, 45, 67, 78, 89
  
Under-utilized:
- Mike: 60% next sprint (6 days work, 10 days available)
  Skills overlap: Authentication, Frontend (matches Sarah)

Recommendation:
→ Reassign Tasks 78, 89 from Sarah to Mike
  Impact: Balances to Sarah 100%, Mike 80%
  Risk: Mike less familiar with this module (add 1 day buffer)
```

**Stakeholder Communication Needs:**

**What it monitors:**
- Last communication date vs. preference
- Upcoming milestones they care about
- Recent risks affecting their areas
- Decisions requiring their input

**Example Output:**
```
Stakeholder Communication Overdue:

John Smith (Sponsor - prefers weekly updates)
Last update: 12 days ago
Areas of interest affected:
- Milestone M-3 date shifted by 5 days
- New risk R-15 affects budget

Recommendation:
→ Send update today
→ Draft generated (review below)
→ Schedule 15-min call to discuss timeline change

[AI-generated update draft shown]
```

**Configuration**

**Analysis Schedule:**
- Frequency: Daily, Weekly, or Custom schedule
- Time: When to run (default: 2 AM)
- Scope: Which components to analyze
- Depth: Quick scan vs. comprehensive analysis

**Cost Control:**
- Enable/disable analysis per project
- Analysis complexity level (affects cost)
- Cost cap (stop if exceeds threshold)

**Estimated Costs:**
~$5/month per project for daily analysis with GPT-4o
- Could be $2/month with GPT-4o-mini
- Could be $15/month for very large projects (50+ team members)

**Notification Preferences:**
- Who receives analysis report
- Delivery method (email, Slack, in-app)
- Summary vs. full report
- Urgency threshold for immediate alerts

**Integration with Proposal System**

Daily analysis findings become proposals:

**Morning Workflow:**
```
8:00 AM - PM opens Helm

Dashboard shows:
"Overnight Analysis Complete - 12 proposals generated"

Proposals grouped by urgency:
🔴 High Priority (3)
- Unblock 3 tasks today
- Adjust Sarah's allocation
- Update Stakeholder John

🟡 Medium Priority (6)  
- Create 2 new risks
- Update 1 milestone date
- Schedule 2 decisions

🟢 Low Priority (3)
- Archive 2 completed tasks
- Update 1 outdated document

PM reviews in 10 minutes, accepts 8, modifies 2, rejects 2
```

**Why This is Powerful:**

**Traditional Approach:**
- PM manually reviews project
- Takes 30-60 minutes daily
- Relies on PM noticing patterns
- Often reactive (problems already occurred)

**Helm's Daily Analysis:**
- AI reviews comprehensively
- Delivers findings in 10 minutes
- Identifies patterns humans miss
- Proactively predicts issues

**The Result:**
PMs spend less time monitoring, more time acting. Early warnings prevent crises.

**Learning Over Time**

The Daily Analysis Engine improves with use:

**Project-Specific Learning:**
- Learns your team's velocity patterns
- Recognizes project-specific risks
- Adapts to your planning style
- Understands stakeholder preferences

**Cross-Project Intelligence:**
- Patterns from similar projects
- Industry-specific insights
- Team performance benchmarks
- Best practice recommendations

**Feedback Loop:**
When PMs accept/reject proposals:
- Acceptance → "This pattern is important here"
- Rejection → "This pattern is noise for this project"
- Over time, proposals become more relevant

**Why Daily (Not Real-Time) Analysis?**

**The Question:** Why not analyze continuously?

**The Answer:** Daily cadence balances insight with cost and noise:

**Real-time would:**
- Generate too many proposals (notification fatigue)
- Cost significantly more (constant AI analysis)
- React to temporary fluctuations (noise vs. signal)
- Interrupt PMs constantly

**Daily analysis:**
- Batches findings (review once, efficiently)
- Costs ~$5/month (affordable)
- Identifies true patterns (24 hours of data)
- Fits PM workflow (morning planning ritual)

**Exception:** Critical issues can trigger immediate alerts:
- Milestone suddenly becomes at-risk
- Critical blocker created
- Major stakeholder concern raised

But routine pattern detection happens overnight.

**Success Metrics**

**How we measure Daily Analysis value:**

**Early Detection Rate:**
- % of issues identified before they impact timeline
- Average advance warning time (days before due date)

**Action Rate:**
- % of high-priority proposals accepted
- Time from proposal to action

**Prevention Rate:**
- Issues avoided vs. historical baseline
- Fires prevented vs. fires fought

**Time Savings:**
- PM hours saved on manual analysis
- Reporting time reduction

**Target:** Daily analysis should save 5+ PM hours/week while costing <$10/week in AI usage.

### 3.5 Conversational Interface

**Integration Architecture:**
Platform-agnostic conversational layer that adapts to multiple channels through a common interface.

**Channel Support:**
- Slack (via adapter)
- Microsoft Teams (via adapter)
- Web chat (built-in)
- Email (via adapter)
- SMS (via adapter)
- Custom integrations (via webhook adapter)

**Core Capabilities (channel-independent):**
- Prompted updates ("Time for your weekly check-in")
- Ad-hoc updates ("Task 23 is blocked")
- Queries ("What are top risks?", "Show me Joe's tasks")
- **Proposal delivery** ("I noticed Task 23 might impact Task 45. Should I add a dependency?")
- **Approval collection** ("3 proposals waiting for your review")
- Rich formatting (when channel supports it)

**Conversation Flow for Proposals:**
1. User: "Task 23 is blocked on authentication"
2. AI: "I understand Task 23 is blocked. I propose:
   - Creating a new Risk: 'Authentication module delay'
   - Updating Task 23 status to 'Blocked'
   - Notifying the Auth team
   
   Approve all, select items, or reject?"
3. User: "Approve updating status and risk, skip notification"
4. AI: "✓ Task 23 status updated to Blocked
   ✓ Risk R-45 created: 'Authentication module delay'
   ✗ Notification skipped"

**Channel Adapter Interface:**
Each channel implements:
- `sendMessage(userId, content, options)` - send to user
- `sendNotification(userId, notification)` - proactive alerts
- `handleIncoming(message)` - process user input
- `supportsRichContent()` - capability detection
- `formatContent(content, format)` - adapt content to channel

**Model Selection:**
- Simple queries: GPT-4o-mini (~$0.003/query)
- Complex queries: GPT-4o (~$0.01/query)

**Cost:** ~$1.20/month per project (assuming ~7 queries/day)

**Configuration per Project:**
- Enabled channels
- Default channel for notifications
- User channel preferences
- Channel-specific settings (e.g., Slack workspace, Teams tenant)

### 3.6 Report Generation

**Types:**
- Executive summaries
- Team status reports
- Risk assessments
- Stakeholder updates

**Model:** GPT-4o (~$0.50 per report)

**Features:**
- Scheduled generation
- Custom templates
- Multi-format export (PDF, Markdown, HTML)
- Stakeholder-specific views

---

## 4. Project Components

### Introduction: Component Design Philosophy

**The Building Blocks of Project Management**

Helm organizes project information into distinct component types, each serving a specific purpose in project management. This modular approach offers several benefits:

**Clear Mental Models:**
Each component answers a specific question:
- **Tasks**: What work needs doing?
- **Risks**: What could go wrong?
- **Decisions**: What choices need making?
- **Milestones**: What are our major achievements?
- **Blockers**: What's preventing progress?
- **Resources**: Who's doing the work?
- **Stakeholders**: Who cares about this project?
- **Documents**: What context informs our work?

**Specialized AI Assistance:**
Each component type has customized AI prompts and validation rules. The AI that validates a task (checking for clarity and acceptance criteria) uses different logic than AI validating a risk (checking IF/THEN structure and mitigation quality).

**Flexible Data Capture:**
Components can have different validation strictness. Critical components (milestones, major risks) might require full validation, while routine components (status updates) use lightweight validation.

**Relationship Mapping:**
Components link to each other, creating a web of project knowledge:
- Tasks link to Risks (mitigation tasks)
- Decisions link to Tasks (implementation tasks)  
- Blockers link to Tasks (what's blocked)
- Milestones link to Tasks (what must complete)

This creates a rich, interconnected project model instead of flat lists.

**Evolution Over Time:**
As Helm matures, new component types can be added without disrupting existing ones. Each component is self-contained with its own:
- Data model
- Validation rules
- AI prompts
- UI views
- Permissions

**Component Commonalities**

While each component type is unique, they share common patterns:

**Standard Fields:**
- `id` - Unique identifier
- `created_at` / `created_by` - Creation tracking
- `updated_at` / `updated_by` - Modification tracking
- `project_id` - Parent project

**AI Interaction:**
- Validation on creation/update
- Proposal generation
- Relationship detection
- Pattern analysis

**User Interface:**
- List view (table with filters)
- Detail view (full information)
- Edit mode (with inline AI suggestions)
- Activity history

**Collaboration:**
- Comments on each component
- @mentions and notifications
- Related components section
- Change history

**Permissions:**
- Role-based access (PM/Contributor/Viewer)
- Owner-based rules (can edit own items)
- Component-specific overrides

**The Separation of Plan vs. Execution**

A key architectural decision in Helm is the distinction between planning and execution:

**Plan (Section 4.1):**
- PM-only view and editing
- Strategic scheduling
- Resource allocation
- Dependency management
- Timeline optimization
- Gantt chart visualization

**Tasks (Section 4.2):**
- Contributor execution view
- Progress tracking
- Status updates
- Latest Position narrative
- Blocker flagging

This separation acknowledges different roles:
- **PM's job**: Decide when, who, and sequence (the plan)
- **Contributor's job**: Decide how and report status (the execution)

The plan fields (dates, dependencies, owner) are not editable by contributors during execution. This prevents:
- Uncoordinated timeline changes
- Broken dependency chains
- Resource conflicts
- Commitment confusion

If a contributor needs more time, they report it via Latest Position, and PM decides whether to adjust the plan.

This is a **deliberate constraint** that creates clarity and accountability.

**How Components Work Together**

**Example Scenario: New Feature Development**

1. **Requirements Document** uploaded
   - AI extracts 5 features

2. **PM reviews proposals**, accepts 4 tasks
   - Tasks created with acceptance criteria from doc

3. **Task 23 Latest Position**: "Harder than expected, switching approach"
   - AI proposes Risk: "Technical complexity risk"

4. **PM accepts risk**, assigns mitigation
   - New task created: "Prototype alternative approach"

5. **Blocker flagged**: "Waiting on security review"
   - AI proposes Decision needed: "Security architecture choice"

6. **Decision made**: "Use OAuth 2.0"
   - Tasks updated with new acceptance criteria

7. **Tasks progress** through Latest Position updates
   - AI tracks toward Milestone

8. **Milestone approaching**:
   - AI generates stakeholder update proposal
   - PM reviews and sends

This shows how components interact in a realistic workflow:
- Documents seed Tasks
- Tasks surface Risks
- Risks create mitigation Tasks
- Blockers identify Decisions needed
- Decisions update Tasks
- Tasks progress toward Milestones
- Stakeholders stay informed

The AI continuously analyzes these relationships, proposing connections and flagging gaps.

**Component Lifecycle States**

Most components follow a common lifecycle:

**Draft** → **Active** → **Complete/Closed** → **Archived**

**Draft:**
- Being created or refined
- Not yet official project state
- Lower validation strictness
- Can delete without audit trail impact

**Active:**
- Official project record
- Subject to full validation
- Appears in all relevant views
- Changes create audit trail

**Complete/Closed:**
- Work finished (tasks done, risks mitigated, decisions made)
- Still visible for reference
- Can reopen if needed
- Historical data for analysis

**Archived:**
- No longer relevant
- Removed from default views
- Preserved for audit/history
- Can restore if needed

### 4.1 Plan (PM Only)

**Purpose:** Project planning and timeline management

**Design Philosophy:**
The Plan view is where project managers think strategically about the "when" and "who" of project execution. It's separate from task execution because planning requires a holistic view that individual contributors shouldn't be burdened with. The PM needs to see the entire forest, while contributors focus on their trees.

**Why Plan and Tasks are Separate:**

Traditional PM tools blur the line between planning and execution, allowing anyone to change dates or dependencies. This creates chaos:
- Contributors adjust dates without understanding downstream impacts
- Dependencies break when tasks are reordered
- Resource conflicts emerge from uncoordinated changes
- Commitments to stakeholders become meaningless

Helm enforces a clear boundary: **PMs plan, Contributors execute**.

**Core Elements:**

**Hierarchical Task Structure:**
- Tasks and subtasks (unlimited nesting)
- Visual indentation shows relationships
- Collapse/expand sections for focus
- Drag-and-drop to reorganize

**Dependencies:**
- Finish-to-Start (most common): Task B starts when Task A finishes
- Start-to-Start: Tasks begin simultaneously
- Finish-to-Finish: Tasks must finish together
- Start-to-Finish: (rare, but supported)

**Timeline and Scheduling:**
- Start/end dates for each task
- Duration calculations
- Working days vs. calendar days
- Holiday and vacation handling
- Time zone awareness

**Resource Assignments:**
- Assign owner (single person accountable)
- Assign additional resources (helpers)
- Allocation percentage (% of their time)
- Skills matching recommendations

**Critical Path Visualization:**
- Auto-calculated based on dependencies and durations
- Highlighted in red on Gantt chart
- Shows which tasks directly impact project completion
- Buffer time displayed

**Views:**

**Table View:**
- Spreadsheet-like interface
- Columns: Task, Owner, Start, End, Duration, Dependencies, Status, Progress
- Inline editing (click to change)
- Bulk operations (multi-select and update)
- Filters: By milestone, resource, status, overdue
- Sort by any column
- Grouping: By milestone, owner, status

**Gantt Chart View:**
- Visual timeline of all tasks
- Horizontal bars showing duration
- Dependency lines connecting related tasks
- Critical path highlighted
- Milestone markers (diamond shapes)
- Resource swim lanes (optional grouping)
- Drag bars to adjust dates
- Drag ends to change duration
- Drag entire bar to shift dates maintaining duration
- Today line (vertical line showing current date)
- Zoom: Day/Week/Month/Quarter views

**AI Capabilities:**

**Missing Task Detection:**
```
Scenario: PM creates milestone "Beta Launch" with 5 tasks

AI analyzes:
- Beta launch typically requires: Development, Testing, Documentation, Deployment
- Current tasks: Development, Testing
- Missing: Documentation, Deployment

AI proposes:
"Create tasks for:
- Documentation (3 days, after Development)
- Deployment (1 day, after Testing)
Based on typical beta launch requirements"
```

**Dependency Validation:**
```
Scenario: Task A depends on Task B, but Task A starts before Task B

AI flags:
"Dependency conflict: Task A cannot start Oct 5 if it depends on 
Task B which doesn't finish until Oct 10.

Suggested fixes:
1. Move Task A start to Oct 11
2. Remove dependency
3. Move Task B earlier"
```

**Timeline Optimization:**
```
Scenario: 3 tasks scheduled sequentially but could be parallel

AI proposes:
"Tasks 12, 13, 14 are scheduled in sequence but have no dependencies.
Running in parallel saves 10 days:
- Current: Oct 1 → Oct 30
- Optimized: Oct 1 → Oct 20"
```

**Resource Conflict Warnings:**
```
Scenario: Sarah assigned to 3 tasks simultaneously

AI warns:
"Sarah over-allocated Oct 15-20:
- Task 12: 40% allocation
- Task 13: 40% allocation  
- Task 14: 30% allocation
Total: 110% (impossible)

Suggested fixes:
1. Stagger tasks sequentially
2. Reassign Task 14 to Mike
3. Reduce scope of one task"
```

**Unrealistic Schedule Detection:**
```
Scenario: Complex integration task estimated at 2 hours

AI flags:
"Task 23 'Integrate payment gateway with 3 systems' estimated at 2 hours
seems unrealistic.

Evidence:
- Similar tasks in past projects: 2-3 days
- Industry benchmark: 1-2 days
- Complexity factors: 3 systems, security requirements

Suggested duration: 2 days"
```

**Key Actions:**

**Create Task Structure:**
1. Add task with title
2. Set dates (or let AI suggest based on dependencies)
3. Assign owner
4. Add dependencies if needed
5. Nest subtasks if complex

**Manage Dependencies:**
1. Select task in table view
2. Click "Dependencies" column
3. Search for tasks to depend on
4. Choose relationship type
5. Gantt auto-updates

**Optimize Timeline:**
1. Request AI analysis
2. Review optimization proposals
3. Accept/modify suggestions
4. Timeline adjusts automatically

**Balance Resources:**
1. View resource allocation report
2. Identify over/under-allocated periods
3. Accept AI rebalancing proposals
4. Or manually reassign tasks

**Access Control:**
- **Project Managers**: Full edit access
- **Contributors**: Read-only (can view plan but not change it)
- **Viewers/Stakeholders**: Read-only

**Why PM-Only?**

Allowing contributors to edit the plan would:
- Break carefully orchestrated dependencies
- Create resource conflicts
- Invalidate commitments to stakeholders
- Require constant re-planning by PM

Instead, contributors communicate needs via Latest Position:
- "This will take 3 more days than planned"
- "Blocked waiting for security review"
- "Could start earlier if API team finishes their part"

PM sees these signals and adjusts the plan accordingly, maintaining coherent project structure.

### 4.2 Tasks

**Purpose:** Task execution and progress tracking

**Design Philosophy:**
Traditional PM tools treat tasks as forms to fill—rigid structures with 20+ fields where most updates feel like bureaucratic overhead. Team members spend more time updating fields than describing actual progress. This creates resistance, leading to vague updates and stale data.

Helm takes a radically different approach: **tasks are narratives, not forms**. The core question isn't "fill out these 15 fields" but rather "what's happening with this work?" We minimize structured fields and maximize natural language capture through the "Latest Position" concept.

**The Minimal Field Philosophy:**
Each field must justify its existence by answering:
1. Is this truly necessary for the project to function?
2. Can AI infer this instead of forcing manual entry?
3. Does this enable better decisions or just create data for data's sake?

We ruthlessly eliminate fields that don't meet this bar.

#### Core Fields

**Identity & Planning (Set by PM in Plan View):**

**`title`** (string, required)
- Clear, action-oriented task name
- Should start with a verb when possible
- AI validates clarity and specificity
- Example: "Implement SSO authentication for mobile app" (good) vs. "Fix login" (too vague)

**`owner`** (Resource reference, required)
- Single person accountable for task completion
- Selected from project resources
- Cannot be changed by contributor (prevents responsibility shifting)
- AI warns if owner over-allocated

**`start_date`** (date, optional)
- When work should begin
- Set by PM in Plan view based on dependencies
- Provides timeline context
- Not editable by contributor (planning vs. execution boundary)

**`end_date`** (date, optional)
- When work should complete
- Set by PM considering dependencies and commitments
- Affects critical path calculations
- Not editable by contributor (but can flag for PM review via Latest Position)

**`dependencies`** (array of task IDs, optional)
- What must complete before this task can start
- What this task blocks from starting
- Managed by PM in Plan view
- Visualized in Gantt chart
- AI validates for circular dependencies

**Execution Fields (Editable by Owner/Contributor):**

**`status`** (enum, required)
- **To Do**: Not started, ready to begin (or waiting on dependencies)
- **In Progress**: Actively being worked on
- **Review**: Work complete, awaiting review/approval
- **Done**: Fully complete and accepted

*Why only 4 statuses?*
More statuses create confusion and process overhead. These four cover the essential states while keeping things simple. Teams that need more granularity can use Latest Position to describe nuances ("In Progress - blocked awaiting decision" vs "In Progress - coding complete, writing tests").

**`description`** (markdown text, required)
- **What** needs to be done
- **Why** it matters (business context)
- **Key constraints** or considerations
- AI validates for clarity and completeness
- Should be understandable by someone new to the project

*Example of good description:*
```
Implement refresh token mechanism for SSO authentication.

Currently, users are logged out after 24 hours regardless of activity, 
creating poor UX for power users. This task implements JWT refresh tokens 
to extend sessions for active users while maintaining security.

Constraints:
- Must work with existing Auth0 integration
- Should not break mobile app compatibility
- Need to handle edge case of expired refresh tokens
```

**`acceptance_criteria`** (markdown list, strongly recommended)
- Specific, measurable conditions that define "done"
- Testable/verifiable statements
- AI proposes criteria based on description
- Eliminates ambiguity about completion

*Example:*
```
- [ ] User session extends automatically when active
- [ ] Session expires after 7 days of inactivity
- [ ] Mobile app handles refresh token flow
- [ ] Unit tests achieve 90%+ coverage
- [ ] Documentation updated in wiki
```

**`progress_percentage`** (integer 0-100, optional)
- Self-reported completion estimate
- Updates automatically based on Latest Position when mentioned
- Helps visualize work completion
- Not meant to be precise—"about 60% done" is fine

*Why keep this field?*
While Latest Position provides rich narrative, progress % offers at-a-glance visibility. It's the difference between "reading the journey" (Latest Position) and "seeing the speedometer" (progress %). Both serve different needs—narrative for depth, percentage for quick scanning.

**`latest_position`** (append-only timeline, optional but highly encouraged)
- **This is the heart of Helm's task model**
- Running narrative of progress, blockers, decisions, and learnings
- Chronological log automatically timestamped and attributed
- Natural language updates from any channel (Slack, Teams, chat, web)
- AI reads this to understand true task status

#### Latest Position: Deep Dive

**What is Latest Position?**
Think of it as a captain's log for the task—a chronological narrative of what's happening. Instead of forcing updates into structured fields, contributors simply describe progress in their own words, and the system preserves this as a timeline.

**How It Works:**

**Entry Methods:**
1. **Slack/Teams**: `"Task 23: Found the timeout issue in auth_handler.js, implementing fix"`
2. **Web chat**: `"Making good progress on the SSO integration, about 70% done"`
3. **Web UI**: Quick update textbox below task details
4. **Voice**: Spoken updates transcribed (mobile or desk)

**Auto-Enrichment:**
Each entry is automatically enhanced with:
- **Timestamp**: Exact time of update
- **User attribution**: Who made the update
- **Formatting**: Rendered as readable timeline
- **AI parsing**: Extracted signals (status changes, blockers, risks)

**Example Latest Position Timeline:**

```
📅 Oct 5, 10:15 AM - Sarah Chen
Starting work on the SSO integration today. Planning to use the existing 
Auth0 library with JWT refresh tokens.

📅 Oct 5, 2:30 PM - Sarah Chen
Hit a blocker - Auth0 library doesn't support our version of SAML. 
Researching alternatives. Might need to switch approaches.

[AI detected blocker, proposed creating Blocker B-12]

📅 Oct 6, 9:00 AM - Sarah Chen
Found a workaround using a SAML bridge component. Back on track. 
About 40% complete now.

📅 Oct 6, 3:45 PM - Sarah Chen
Integration working! All the main flows are functional. Running through 
test scenarios now. Should be ready for review tomorrow.

📅 Oct 7, 11:00 AM - Sarah Chen
Tests passing, edge cases handled. Moving to review status.

[AI detected completion, proposed status change to Review]
```

**What AI Learns from Latest Position:**

The AI continuously analyzes Latest Position entries to:

**1. Detect Implicit Status Changes:**
- "Starting work" → propose status: In Progress
- "Ready for review" → propose status: Review
- "Tests passing" → propose status: Done

**2. Identify Blockers:**
- "Stuck on", "blocked by", "waiting for" → propose Blocker creation
- "Can't proceed until" → flag dependency issue

**3. Extract Progress Indicators:**
- "60% complete", "almost done", "halfway through"
- Updates progress % automatically

**4. Flag Risks:**
- "Switching approach", "harder than expected" → propose Risk
- "Timeline might slip" → alert PM

**5. Recognize Learning:**
- "Found better approach", "discovered X" → capture for future tasks
- Build knowledge base of solutions

**6. Suggest Next Actions:**
- "Ready for testing" → suggest linking QA task
- "Deployment complete" → propose task completion

**7. Answer Stakeholder Questions:**
- "What's blocking Task 23?" → AI summarizes from Latest Position
- "Why did approach change?" → AI quotes relevant entry

**Why Latest Position is Powerful:**

**Low Friction:**
No forms to fill, just tell the story. Updates take 10-20 seconds instead of 2-3 minutes.

**Rich Context:**
Captures not just WHAT happened, but WHY. "Switched from OAuth to SAML" is data. "Switched because OAuth library doesn't support our SSO provider" is knowledge.

**No Lost Information:**
Everything is preserved chronologically. Six months later, someone can understand the task's journey.

**AI Gold Mine:**
Natural language is what AI excels at understanding. Structured fields hide context that Latest Position preserves.

**Human Readable:**
Stakeholders can read the actual narrative instead of deciphering status codes and field changes.

**Institutional Memory:**
When Sarah leaves the team, her thought process and decisions remain documented.

**Reduces Meetings:**
Questions like "what's the status?" are answered by reading Latest Position instead of scheduling calls.

**Metadata (System-Managed):**

**`id`** (string, auto-generated)
- Unique task identifier
- Used in references and dependencies

**`created_at`** (timestamp)
- When task was created
- Audit trail

**`created_by`** (user reference)
- Who created the task
- Useful for questions about intent

**`updated_at`** (timestamp)
- Last modification time
- Helps identify stale tasks

**`updated_by`** (user reference)
- Last person to modify
- Audit trail

#### Views

**List View** (Sortable/Filterable)
- Table format showing: Title, Owner, Status, Progress %, Due Date
- Quick filters: My Tasks, By Status, By Owner, Overdue
- Inline status updates via dropdown
- Click to expand Latest Position preview
- Shows 💬 icon with comment count
- Color coding by status

**Board View** (Kanban-Style)
- Columns: To Do | In Progress | Review | Done
- Drag cards between columns to update status
- Card shows: Title, Owner avatar, Progress bar, Due date
- Quick-edit panel on click
- Filter by owner or search

**My Tasks View** (Personal Dashboard)
- Contributor's personal workspace
- Sections: Today | This Week | Later | Blocked
- Smart sorting: approaching due dates first, then blockers
- One-click status updates
- Quick Latest Position entry box
- Shows AI suggestions relevant to my tasks

**Task Detail View:**
- Full task information
- Latest Position timeline (prominent)
- Acceptance criteria checklist
- Progress slider
- Comments section (separate from Latest Position)
- Related items (dependencies, blockers, risks)
- Activity history
- AI proposals for this task

#### AI Capabilities

**During Task Creation:**
- Improves title clarity
- Enhances description with structure
- Proposes acceptance criteria
- Suggests owner based on skills
- Identifies potential dependencies
- Recommends initial estimate

**During Updates:**
- Validates status transitions make sense
- Parses Latest Position for signals
- Suggests next tasks when one completes
- Detects blockers before they're formally reported
- Identifies when PM attention needed

**Daily Analysis:**
- Flags tasks that haven't updated in >3 days
- Identifies tasks at risk of missing deadlines
- Suggests resource reallocation
- Patterns across similar tasks

**For Stakeholders:**
- Summarizes Latest Position on demand
- Answers questions about task status
- Generates task-level reports
- Explains delays or changes

#### Access Control

**Project Managers:**
- Create/edit all tasks
- View all fields
- Change plan fields (dates, dependencies, owner)
- Accept/reject AI proposals for any task

**Contributors:**
- Create tasks (subject to PM review for plan fields)
- Edit tasks they own (execution fields only)
- View all tasks (read-only for others)
- Update Latest Position on own tasks
- Cannot change: dates, dependencies, owner (plan fields)

**Viewers/Stakeholders:**
- Read-only access to all tasks
- Can view Latest Position timeline
- Can read comments
- Cannot edit anything

#### Why This Minimal Approach Works

**Traditional Task Fields We Deliberately Omit:**

❌ **Priority** - Often bikeshedded, rarely acted upon. If it's urgent, it shows in Latest Position and PM can adjust dates.

❌ **Effort Estimate** - Nice to have, but creates estimation bureaucracy. If needed later, can be added.

❌ **Tags/Labels** - Can add when real filtering needs emerge. Starting with them leads to tag proliferation.

❌ **Story Points** - Agile estimation can be added for teams that want it, but not required by default.

❌ **Time Logged** - Detailed time tracking is separate concern. If needed for billing, can integrate.

❌ **Actual Start/End** - Latest Position timestamps capture this naturally.

❌ **Watchers** - Over-complicated. Comments notify @mentions, stakeholders subscribe to areas of interest.

**The Philosophy:**
Start minimal. Add fields only when clear need emerges across multiple projects. Every field is an implicit promise to maintain data, and unnecessary fields create data debt.

By keeping tasks simple—a clear title, ownership, timeline, and a narrative of progress—we maximize signal and minimize noise. The Latest Position field provides the richness that structured fields can never capture.

### 4.3 Comments System

**Purpose:** Structured communication and collaboration on components

**The Distinction: Latest Position vs. Comments**

It's critical to understand that Helm has TWO different communication mechanisms, each serving distinct purposes:

| Aspect | Latest Position | Comments |
|--------|----------------|----------|
| **Purpose** | Progress narrative | Discussion & questions |
| **Owner** | Task owner (single voice) | Anyone (multi-party) |
| **Scope** | Task-specific only | Any component |
| **Nature** | "Here's where I am" | "Here's what we need to discuss" |
| **Frequency** | Frequent updates | As-needed conversation |
| **Structure** | Chronological log | Threaded discussions |
| **Editing** | Append-only | Can edit/delete |

**When to Use Latest Position:**
- Reporting progress on your task
- Describing what you're working on
- Noting blockers or challenges you're facing
- Explaining approach changes
- Capturing decisions you made while working
- Documenting learnings or discoveries

**When to Use Comments:**
- Asking questions about requirements
- Discussing approach with teammates
- Requesting clarification from stakeholders
- Debating technical decisions
- Providing feedback or review notes
- Cross-team coordination

**Example Showing the Difference:**

```
TASK: Implement password reset flow

LATEST POSITION (Sarah's progress narrative):
[Oct 5, 10am] Starting implementation of email-based reset flow
[Oct 5, 2pm] Basic flow working, now adding rate limiting
[Oct 5, 4pm] Rate limiting complete, starting on token expiry logic

COMMENTS (Team discussion):
[Mike]: Should we require users to re-enter their username or just 
        use the email they provide?
[Sarah]: Good question. Let me check the security requirements.
[PM]: @SecurityTeam - can you weigh in on this?
[Security]: Email-only is fine, but require 2FA on first login after reset
[Sarah]: Got it, I'll add 2FA requirement to acceptance criteria
```

In this example:
- **Latest Position** = Sarah's personal log of progress
- **Comments** = Team collaborating on requirements

#### Comment Types

To help organize discussions, comments can be typed:

**Status Update**
- Progress reports from non-owners
- External team updates ("API is ready for integration")
- Milestone-related announcements
- When to use: Informing others of relevant changes

**Question**
- Requests for information
- Clarification needs
- When to use: You need input to proceed

**Answer**
- Response to a question
- Providing requested information
- When to use: Replying to questions

**Note**
- General information
- Documentation of decisions made in other forums
- Reference links
- When to use: Capturing context for future reference

**Decision**
- Micro-decisions made in comments
- Quick choices that don't warrant formal Decision component
- When to use: Small decisions that should be documented but don't need full Decision workflow

#### Features

**Threading & Context:**
- Comments attach to specific components (Tasks, Risks, Decisions, Milestones, etc.)
- Threaded replies for focused discussions
- Component context shown in comment
- Can reference other components with #TaskID syntax

**@Mentions & Notifications:**
- @mention users to notify them
- Mentioned users receive notification based on their preferences
- Can @mention teams or roles (future enhancement)
- Mention creates implied "watching" of the thread

**AI Integration:**

The AI actively participates in the comments ecosystem:

**Extracting Action Items:**
When someone writes: "We should add error handling for that edge case"
AI proposes: "Create task: Implement error handling for [edge case]?"

**Answering Questions:**
When someone asks: "What's the current status of Task 23?"
AI can respond: "Based on Latest Position, Task 23 is 60% complete. Sarah reported the integration is working but tests are still running."

**Detecting Decisions:**
When discussion resolves to: "Let's go with Option B"
AI proposes: "Convert this to formal Decision component?"

**Identifying Risks:**
When someone mentions: "This might impact the mobile app too"
AI flags: "Should we create a risk for mobile impact?"

**Suggesting Component Creation:**
- Prolonged blocker discussion → "Create Blocker component?"
- Repeated questions → "Add to FAQ document?"
- Debate about approach → "Create Decision to resolve this?"

**Answering from Context:**
AI can answer questions by reading:
- Latest Position timelines
- Other comments in thread
- Related components
- Project documents
- Historical patterns

#### Comment Lifecycle

**Active Discussions:**
- Comments start as "open"
- Show prominently in component view
- Appear in activity feeds
- Generate notifications

**Resolved Threads:**
- Can be marked "resolved" by anyone
- Collapse by default (but remain accessible)
- Show as icon: 💬 3 (3 resolved comments)
- Can be reopened if needed

**Stale Questions:**
- AI flags unanswered questions after 24 hours
- Sends reminder to mentioned users
- Escalates to PM if critical and >48 hours old

#### Comment Display

**In Component View:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK: Implement password reset flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Latest Position timeline displayed here]

━━━ Comments (3) ━━━

💬 Mike Johnson · 2 hours ago
Should we require username re-entry or just email?

  ↳ Sarah Chen · 1 hour ago
    Good question, checking security reqs...
    
  ↳ AI Assistant · 30 min ago
    Per Security policy doc v2.1, email-only is 
    acceptable if 2FA required on next login.
    
💬 RESOLVED (2 messages) ━━━━━━━━━━━━
```

**In Activity Feed:**
- Recent comments across all components
- Highlights @mentions to current user
- Filter by: My mentions, Questions, Unresolved

#### Search & Discovery

**Comment Search:**
- Full-text search across all comments
- Filter by: Author, Component type, Date range, Resolved status
- Search within: Current project, All my projects, Organization

**FAQ Generation:**
- AI identifies frequently asked questions
- Suggests creating FAQ document
- Auto-generates FAQ from comment patterns

#### Access Control

**Who Can Comment:**
- **Project Managers**: Can comment on anything
- **Contributors**: Can comment on any component in project
- **Viewers/Stakeholders**: Can comment (participate in discussion)

*Note: Even viewers can comment because discussion is different from editing. Stakeholders should be able to ask questions without full edit rights.*

**Who Can Resolve:**
- Anyone can mark comments resolved
- Component owner has "final say" if dispute
- Auto-resolves if answer is marked and questioner confirms

**Moderation:**
- PM can delete inappropriate comments
- Audit trail preserved (shows "comment deleted by PM")

#### Why Both Latest Position AND Comments?

**The Question:** "Why not just have one communication stream?"

**The Answer:** They serve fundamentally different purposes and mixing them creates confusion.

**Latest Position** is:
- **Single-voice narrative**: One person (task owner) telling their story
- **Progress-focused**: What's happening with the work
- **Chronological log**: Sequential updates showing journey
- **Owner's responsibility**: Keeps team informed
- **AI's primary input**: Parsed for status, blockers, risks

**Comments** are:
- **Multi-party discussion**: Team collaborating
- **Question/answer**: Resolving ambiguities
- **Non-linear**: Threads, replies, tangents
- **Collaborative knowledge**: Shared understanding
- **AI's secondary input**: Context and decisions

**Real-World Analogy:**
- Latest Position = Captain's log (one person documenting the journey)
- Comments = Crew meeting (team discussing decisions and challenges)

Both are essential. The captain's log tells you what happened. The crew meeting helps decide what should happen.

**Without Latest Position:**
Teams default to putting progress updates in comments, which:
- Mixes progress with discussion (hard to extract status)
- Makes it unclear who's responsible for updates
- Creates notification noise
- Hides actual progress in long threads

**Without Comments:**
Teams can't collaborate effectively:
- Questions go unanswered
- Discussions happen in Slack and get lost
- Decisions aren't documented
- Cross-team coordination suffers

**Together:**
Latest Position + Comments creates a complete picture:
- What happened (Latest Position)
- Why it happened (Comments provide context)
- What we discussed (Comments preserve decisions)
- What we learned (Both contribute to knowledge)

This separation is a **core design principle** of Helm.

### 4.4 Risks

**Core fields:**
- Description, category
- Probability, impact
- Mitigation strategy
- Owner (from Resources), review date

**AI validates:**
- Risk clarity
- Mitigation adequacy
- Impact assessment realism
- Action item linkage

### 4.5 Decisions

**Core fields:**
- Question/problem statement
- Options considered
- Selected option
- Rationale, decision date
- Decision maker (from Resources)
- Related comments

**AI validates:**
- Problem clarity
- Option completeness
- Rationale consistency
- Impact assessment

### 4.6 Milestones

**Core fields:**
- Name, target date
- Success criteria
- Dependencies
- Status indicators
- Related comments

**AI validates:**
- Criteria measurability
- Dependency alignment
- Timeline feasibility
- Stakeholder alignment

### 4.7 Blockers

**Core fields:**
- Title, description of blockage
- Severity (Critical/High/Medium/Low)
- Items blocked (Tasks/Milestones)
- Owner (from Resources)
- Resolution needed by date
- Current status
- Related comments

**AI validates:**
- Clarity of issue
- Appropriate severity
- Resolution plan exists
- Owner assigned
- Escalation needed

### 4.8 Resources

**Two-tier structure:**

**Global Resources (Organization level):**
- Name, email, title
- Department, reporting line
- Skills and certifications
- Standard role
- Overall availability
- Hourly rate (optional)

**Project Resources (Project level):**
- Resource (linked to Global)
- Project role
- Allocation % (10-100%)
- Start/end dates on project
- Specific responsibilities

**AI validates:**
- Over-allocation warnings
- Skills match requirements
- Missing key roles
- Capacity vs. workload

### 4.7 Stakeholders

**Core fields:**
- Name, title, organization/department
- Email, preferred contact method
- Role in project (Sponsor/Customer/Reviewer/Advisor/Observer)
- Communication frequency (Daily/Weekly/Milestone/As-needed)
- Areas of interest (components/modules they care about)
- Report subscriptions (which reports they receive)
- Last communication date

**AI validates:**
- Communication frequency being met
- Relevant updates for interests
- Missing stakeholders for decisions
- Report distribution appropriate

### 4.8 Documents

**Purpose:** Process and manage project documents to enhance AI context and project understanding

**The Document Intelligence Philosophy:**

Most PM tools treat documents as attachments—dead files that sit in storage, referenced occasionally, but never truly integrated into the project. This creates several problems:

**The Information Silo Problem:**
- Requirements live in Word docs
- Decisions happen in meeting notes  
- Technical details exist in design documents
- Project context is scattered across 10+ files
- PM tools only know what's manually entered

This forces project managers to:
- Manually transcribe information from documents to PM tool
- Maintain duplicate information (document AND PM tool)
- Reconcile conflicts when they diverge
- Miss important details buried in documents

**Helm's Approach: Documents as First-Class Citizens**

Instead of treating documents as static attachments, Helm actively reads, understands, and learns from them. Documents become living context that continuously informs AI proposals and project understanding.

**The Vision:**
Upload your requirements document → AI extracts tasks, identifies risks, suggests stakeholders → You review and approve → Project structure created from your existing documentation.

No manual transcription. No duplicate maintenance. Documents and structured project data stay synchronized.

**Core Fields:**

**Identification:**
- **Title** - Document name
- **Description** - Brief summary of content
- **File or content** - Uploaded file (PDF, Word, Markdown) or pasted text
- **Version number** - Tracks document revisions (auto-incremented)
- **Created/uploaded date** - When added to project

**Categorization:**
- **Document type** - Predefined categories that affect AI processing:
  - **Requirements**: Feature specs, user stories, functional specs
  - **Design**: Technical architecture, API specs, UI mockups  
  - **Meeting Notes**: Decisions, action items, discussions
  - **Reports**: Status reports, retrospectives, analyses
  - **Reference**: Standards, policies, external docs
  - **Other**: Miscellaneous project documentation

- **Tags/categories** - Custom labels for organization
- **Status** - Lifecycle stage:
  - **Draft**: Work in progress, AI reads but low confidence
  - **Review**: Under review, proposals flagged for validation
  - **Final**: Approved, high confidence for AI to use
  - **Archived**: Superseded by newer version, AI knows to prioritize newer

**Authorship & Access:**
- **Author** - Who created/uploaded (from Resources)
- **Last updated date** - Most recent modification
- **Access control** - Who can view/edit (usually project-wide but can be restricted)

**AI Capabilities:**

**1. Reading & Indexing**

When a document is uploaded, AI:

**Extracts text content:**
- PDF → Full text extraction
- Word → Text with structure (headings, lists)
- Markdown → Parsed with formatting
- Images → OCR if needed (future enhancement)

**Identifies document structure:**
- Sections and headings
- Lists and tables  
- Key concepts and terminology
- Cross-references to other documents

**Generates embeddings:**
- Vector representations of content
- Enables semantic search
- Powers "find similar" functionality
- Used for context retrieval

**Creates searchable index:**
- Full-text search
- Section-level references
- Keyword extraction
- Topic clustering

**2. Information Extraction**

The AI actively extracts structured information based on document type:

**From Requirements Documents:**
```
Input: Requirements doc with section:
"The system must support SSO login via SAML 2.0. 
Users should remain logged in for 7 days. 
Failed login attempts should be rate-limited to 
prevent brute force attacks."

AI Extracts & Proposes:
→ Task: "Implement SAML 2.0 SSO authentication"
  Acceptance Criteria:
  - [ ] SAML 2.0 integration complete
  - [ ] Session persists 7 days
  - [ ] Rate limiting on failed attempts

→ Risk: "SAML integration may require external vendor coordination"
  Source: Requirements doc, Section 3.1
```

**From Meeting Notes:**
```
Input: Meeting notes with:
"Decided to go with PostgreSQL over MySQL due to 
better JSON support. Action: Sarah to research 
backup solutions. John raised concern about 
migration timeline."

AI Extracts & Proposes:
→ Decision: "Select PostgreSQL for primary database"
  Rationale: "Better JSON support per team discussion"
  Source: Planning Meeting 10/5

→ Task: "Research PostgreSQL backup solutions"
  Owner: Sarah
  Source: Planning Meeting 10/5, action items

→ Risk: "Database migration timeline may be aggressive"
  Source: Concern raised by John in Planning Meeting
```

**From Design Documents:**
```
Input: Technical design showing API architecture

AI Extracts & Proposes:
→ Tasks for each API endpoint
→ Dependencies based on architecture diagram
→ Risks around integration points
→ Technical decisions captured for reference
```

**3. Consistency Checking**

The AI continuously validates documents against project state:

**Detecting Conflicts:**
```
Scenario:
- Design doc specifies "Use PostgreSQL"
- 3 tasks reference "MySQL setup"

AI flags:
"Inconsistency detected: Design doc specifies PostgreSQL 
but Tasks 23, 45, 67 reference MySQL. Which is correct?"

Proposal:
→ Review and align database decision
→ Update either document or tasks
```

**Identifying Gaps:**
```
Scenario:
- Requirements doc lists 15 features
- Only 8 have associated tasks

AI proposes:
"7 requirements have no implementation tasks:
[Lists the 7 with document references]
Should I create tasks for these?"
```

**Flagging Outdated Information:**
```
Scenario:
- Project plan shows different milestones than requirements doc
- Requirements doc last updated 3 months ago

AI suggests:
"Requirements doc is stale (90 days old) and conflicts 
with current milestones. Archive or update?"
```

**4. Contextual Awareness**

Documents provide rich context for AI proposals:

**Example: Task Creation**
```
Without documents:
User: "Create authentication task"
AI: "Can you specify what authentication method?"

With documents (AI reads requirements doc):
User: "Create authentication task"  
AI: "Based on requirements doc section 3.1, I propose:
     'Implement SAML 2.0 SSO authentication with 7-day 
     session persistence and rate limiting'
     Is this correct?"
```

**Example: Risk Detection**
```
Without documents:
AI can only spot risks from task data

With documents (AI reads meeting notes):
AI: "Meeting notes from 10/5 show John's concern about 
     migration timeline. This appears to be materializing 
     as Tasks 23, 45 are delayed. Create risk?"
```

**Example: Answering Questions**
```
Stakeholder: "What was the rationale for choosing PostgreSQL?"

Without documents:
AI: "I don't have that information"

With documents:
AI: "Per Planning Meeting notes from 10/5, PostgreSQL was 
     selected for its superior JSON support, which is needed 
     for our flexible schema requirements. See Decision D-12."
```

**5. Proposal Generation from Documents**

Documents are a primary source for AI proposals:

**Document Upload Workflow:**
```
1. PM uploads "Q3 Requirements v2.pdf"

2. AI processes document:
   - Extracts 12 feature descriptions
   - Identifies 5 potential risks
   - Finds 3 stakeholders mentioned
   - Detects 2 external dependencies

3. AI generates proposals:
   → Create 12 tasks (one per feature)
   → Create 5 risks
   → Add 3 stakeholders to project
   → Flag 2 dependencies for review

4. PM reviews proposals in batch:
   - Accepts 10 tasks (modifies 2)
   - Accepts 4 risks (rejects 1 as duplicate)
   - Accepts all stakeholders
   - Accepts dependency flags

5. Result: Requirements doc → Structured project in 10 minutes
   instead of hours of manual transcription
```

**6. Document Versioning & History**

**Version Control:**
- Each upload creates new version
- Previous versions retained and accessible
- AI knows which version is "current"
- Can compare versions to see changes

**Version-Aware Proposals:**
```
Scenario:
Requirements v1.0 → 5 tasks created
Requirements v2.0 uploaded (3 requirements changed)

AI proposes:
"Requirements updated. Changes detected:
- Requirement 3.1: Authentication method changed from 
  OAuth to SAML → Update Task 23
- Requirement 4.2: New feature added → Create Task 68
- Requirement 5.1: Feature removed → Archive Task 45"
```

**Historical Context:**
- AI can reference old versions for context
- "This was changed in v2.0 because..."
- Helps answer "why did we decide this?" questions

**Document Processing Pipeline:**

```
Upload Document
    ↓
Content Extraction (PDF→text, Word→text, etc.)
    ↓
Structure Analysis (headings, sections, lists)
    ↓
Semantic Analysis (extract key concepts)
    ↓
Generate Embeddings (for search & similarity)
    ↓
Type-Specific Extraction (requirements→tasks, etc.)
    ↓
Generate Proposals
    ↓
Store in Document Service + Vector DB
    ↓
Available for AI Context & Search
```

**Use Cases & Benefits:**

**Use Case 1: New Project Kickoff**
```
Day 1: Upload project charter, requirements, initial design
AI extracts: 
- 30 tasks
- 15 risks
- 8 key decisions to make
- 12 stakeholders

Result: Project structure 80% complete from documents
```

**Use Case 2: Meeting Notes Processing**
```
Weekly: Upload meeting notes
AI extracts:
- 5 action items → Tasks
- 3 decisions made → Decision records
- 2 concerns raised → Risks
- 1 stakeholder communication needed

Result: No manual action item transcription
```

**Use Case 3: Keeping Docs in Sync**
```
Monthly: Update requirements doc
AI detects changes and proposes:
- Task updates for modified requirements
- New tasks for added requirements
- Archive tasks for removed requirements

Result: PM tool stays synchronized with documentation
```

**Use Case 4: Stakeholder Questions**
```
Anytime: "Why did we choose this approach?"
AI answers by referencing:
- Design doc section 4.2
- Decision D-12 from meeting notes
- Historical context from previous discussions

Result: Institutional knowledge preserved and accessible
```

**Integration with Other Components:**

Documents inform all component types:

**Tasks:**
- Requirements docs → Task creation
- Design docs → Technical acceptance criteria
- Meeting notes → Action item tasks

**Risks:**
- Design docs → Technical risks
- Meeting notes → Concerns raised
- Previous project retrospectives → Lessons learned

**Decisions:**
- Meeting notes → Decision capture
- Design docs → Architecture choices
- Requirements → Feature trade-offs

**Stakeholders:**
- All docs → Mentioned stakeholders
- Org charts → Stakeholder hierarchy
- Communication plans → Update schedules

**Document Management UI:**

**Document Library:**
- List view: Title, Type, Version, Last Updated, Author
- Filter by type, status, date range
- Search across content (not just titles)
- Version history per document

**Document Viewer:**
- Rendered document (PDF viewer, Markdown renderer)
- AI-extracted highlights (key sections, action items)
- Related components (tasks, risks created from this doc)
- Version comparison tool

**Upload & Processing:**
- Drag-drop or browse upload
- Processing progress indicator
- Proposal preview before accepting
- Batch acceptance of document-generated proposals

**Privacy & Security:**

**Document Access:**
- Default: All project members can view
- Option: Restrict sensitive docs to PM/leadership only
- Audit trail of who accessed what

**AI Processing:**
- Documents processed by AI but not stored by AI provider
- Embeddings stored in Helm's vector database
- Original files in encrypted blob storage
- Can opt-out of AI processing (doc stored but not analyzed)

**Data Retention:**
- Active project: All versions retained
- Archived project: Configurable retention policy
- Right to deletion: Can purge document and all AI extractions

**Why Document Intelligence Matters:**

**The Traditional Problem:**
Projects generate dozens of documents but PM tools ignore them. This creates:
- Duplicate data entry
- Stale information
- Lost context
- Inaccessible knowledge

**Helm's Solution:**
Documents become living project context:
- Single source of truth
- AI keeps structured data aligned with docs
- Historical context preserved
- Knowledge accessible through AI

**The Result:**
- 60% less manual data entry
- Better alignment between docs and PM tool
- Improved institutional knowledge
- Faster onboarding (new team members read AI summaries of docs)

---

## 5. User Experience

### 5.1 Onboarding Flow
1. Create project with basic info
2. Configure AI settings (model, proposal frequency)
3. Set up integration channels
4. Import existing data (optional)
5. Add team members (Resources) and assign roles
6. Identify key stakeholders
7. First guided update with proposal examples

### 5.2 Daily Workflow

**Morning:**
- AI sends daily digest via preferred channel
- **Pending proposals from overnight analysis**
- Highlights needing attention
- Suggested actions for the day

**During work:**
- Quick updates via chat ("Task 23 done")
- **AI responds with any proposals** ("Since Task 23 is done, should I move Task 24 to 'In Progress'?")
- User approves/rejects inline
- Updates applied only after approval

**End of day:**
- Optional prompted check-in
- **Review batch proposals**
- Quick status collection
- Tomorrow's priorities

### 5.3 Proposal Review Interfaces

**Web UI - Proposal Dashboard:**
- List of pending proposals
- Grouped by type/component
- Bulk actions available
- Filtering and search
- Proposal history/audit trail

**Chat Interface:**
- Inline approve/reject buttons
- "Review all proposals" command
- Voice approval support ("Approve the first two")
- Quick preview of impact

**Email Digest:**
- Daily/weekly proposal summaries
- Click-through to web for review
- Reply-to-approve for simple cases

### 5.4 Weekly Workflow
- **Strategic proposal review session**
- Automated report generation with proposed improvements
- Risk review with proposed mitigations
- Schedule analysis with proposed adjustments
- Stakeholder communication prep

---

## 6. Cost Model

### 6.1 Platform Costs
**Per project/month:**
- Small (<10 users): $50
- Medium (10-50 users): $150
- Large (50+ users): $500

**Includes:**
- Storage, backup
- Web interface
- Basic integrations
- Support

### 6.2 AI Costs (transparent pass-through + margin)

**Estimated per project/month:**
- Validation: ~$8-12
- Daily analysis: ~$5
- Conversations: ~$1-2
- Reports: ~$2-4
- **Total:** ~$15-22

**Customer pricing:**
- Show actual AI costs
- Apply 30-50% margin
- Allow prepaid credits
- Usage alerts and caps

---

## 7. Configuration Management

### 7.1 Project-Level Settings
- Default AI model
- Default validation scope
- Integration channels
- Report schedules
- Cost controls

### 7.2 Component-Level Settings
For each component type (Task, Risk, etc.):
- Validation rules
- Required fields
- AI model override
- Validation timing
- Custom prompts

### 7.3 User-Level Settings
- Preferred communication channel
- Notification preferences
- Report subscriptions
- Language/timezone

---

## 8. Success Metrics

### 8.1 Data Quality
- 95% of validated inputs pass internal consistency checks
- 80% of inputs accepted without rework
- 90% reduction in contradictory data vs. baseline

### 8.2 Efficiency
- 70% reduction in time to generate status reports
- 50% reduction in PM time spent on data cleanup
- Average update time: <30 seconds (async validation)

### 8.3 Adoption
- 60% of updates come through AI gateway
- 75% of stakeholders use conversational interface
- 4/5 average satisfaction rating

### 8.4 Economic
- AI costs remain <5% of platform revenue per project
- Demonstrated ROI: >20x (AI cost vs. PM time saved)

---

## 10. Proposal Templates

### 10.1 Task Proposals

**Template Structure:**
```
Action: [Create/Update/Delete/Link]
Component: Task [ID if exists]
Title: [Proposed title]
Changes:
  - Field: [Current] → [Proposed]
  - Field: [Current] → [Proposed]
Rationale: [Why this change matters]
Impact: [What this affects]
Confidence: [High/Medium/Low]
Evidence: [Data supporting proposal]
```

**Common Task Proposals:**

**1. Clarity Enhancement**
   - Action: Update Task T-23
   - Title: "Fix login bug"
   - Changes:
     - Description: "fix the login" → "Resolve authentication timeout error occurring when users access via SSO after 24-hour session expiry"
   - Rationale: Specifies exact issue and conditions
   - Confidence: High

**2. Missing Dependencies**
   - Action: Link Task T-45
   - Changes:
     - Add dependency: T-23 blocks T-45
   - Rationale: T-45 requires authentication module from T-23
   - Evidence: Both tasks modify auth_handler.js
   - Impact: T-45 start date shifts by 3 days

**3. New Task from Risk**
   - Action: Create Task
   - Title: "Implement database backup verification"
   - Triggered by: Risk R-12 (Data loss risk)
   - Owner: [Suggested from team skills]
   - Priority: High
   - Rationale: Mitigates identified risk R-12

### 10.2 Risk Proposals

**Template Structure:**
```
Action: [Create/Update/Escalate/Close]
Component: Risk [ID if exists]
Title: [Risk statement]
Changes:
  - Probability: [Current] → [Proposed]
  - Impact: [Current] → [Proposed]
  - Mitigation: [Current] → [Proposed]
Triggers: [What prompted this proposal]
Evidence: [Supporting data/patterns]
Recommended actions: [Specific steps]
```

**Common Risk Proposals:**

**1. Risk Detection**
   - Action: Create Risk
   - Title: "Third-party API dependency may affect launch"
   - Probability: Medium
   - Impact: High
   - Triggers: Multiple tasks reference external API with no fallback
   - Evidence: Tasks T-23, T-45, T-67 all require PaymentAPI
   - Recommended actions: 
     - Create fallback task
     - Add API monitoring
     - Document manual process

**2. Risk Escalation**
   - Action: Escalate Risk R-23
   - Changes:
     - Probability: Low → High
     - Status: Monitoring → Active
   - Triggers: 3 related issues reported this week
   - Evidence: Tasks T-12, T-15 delayed due to this risk
   - Recommended actions: Schedule risk review meeting

**3. Mitigation Improvement**
   - Action: Update Risk R-34
   - Changes:
     - Mitigation: "Will monitor" → "1. Daily automated health checks 2. Failover system ready 3. Escalation path documented"
   - Rationale: Current mitigation too vague
   - Confidence: High

### 10.3 Decision Proposals

**Template Structure:**
```
Action: [Create/Update/Request]
Component: Decision [ID if exists]
Question: [What needs to be decided]
Context: [Why now]
Options identified:
  1. [Option with pros/cons]
  2. [Option with pros/cons]
Recommendation: [If AI has one]
Required by: [Date/Milestone]
Stakeholders: [Who should be involved]
```

**Common Decision Proposals:**

**1. Decision Required**
   - Action: Create Decision
   - Question: "Select authentication provider for v2.0"
   - Context: T-23 blocked pending this decision
   - Options identified:
     1. Keep current OAuth (pro: no migration, con: lacking features)
     2. Switch to Auth0 (pro: better features, con: migration effort)
     3. Build custom (pro: full control, con: maintenance burden)
   - Required by: Sprint 3 start
   - Stakeholders: Tech Lead, Security, Product

**2. Decision Documentation**
   - Action: Update Decision D-15
   - Changes:
     - Rationale: [empty] → "Selected based on cost-benefit analysis showing 40% reduction in auth-related support tickets"
     - Impact assessment: [empty] → "Affects 12 tasks, 2-week implementation"
   - Rationale: Decisions need clear documentation for future reference

### 10.4 Milestone Proposals

**Template Structure:**
```
Action: [Create/Update/Split/Merge]
Component: Milestone [ID if exists]
Name: [Milestone name]
Changes:
  - Date: [Current] → [Proposed]
  - Criteria: [Current] → [Proposed]
Impact analysis:
  - Affected tasks: [List]
  - Affected risks: [List]
  - Stakeholder impact: [Description]
Rationale: [Why this change]
```

**Common Milestone Proposals:**

**1. Date Adjustment**
   - Action: Update Milestone M-3
   - Name: "Beta Launch"
   - Changes:
     - Date: March 15 → March 22
   - Impact analysis:
     - Affected tasks: 15 tasks need rescheduling
     - Affected risks: R-23 probability reduces
     - Stakeholder impact: Customer communications needed
   - Rationale: Critical path analysis shows 5-day minimum delay

**2. Success Criteria Clarification**
   - Action: Update Milestone M-5
   - Changes:
     - Criteria: "System working" → "1. All P1 features deployed 2. Performance <200ms response 3. Security audit passed 4. Documentation complete"
   - Rationale: Current criteria not measurable
   - Confidence: High

### 10.5 Batch Proposal Template

**For multiple related proposals:**
```
Proposal Set: [Theme/Trigger]
Generated: [Date/Time]
Trigger: [Daily analysis/User action/Pattern detected]

Proposals (5 items):
1. ✓ [Quick summary] - High confidence
2. ✓ [Quick summary] - High confidence  
3. ? [Quick summary] - Medium confidence
4. ✓ [Quick summary] - High confidence
5. ⚠ [Quick summary] - Low confidence

Actions available:
[Accept All] [Accept Selected] [Review Each] [Reject All] [Defer]

Estimated impact if all accepted:
- Schedule: [impact]
- Resources: [impact]
- Risks: [impact]
```

### 10.6 Proposal Confidence Indicators

**High Confidence (✓)**
- Based on explicit data
- Clear patterns detected
- Industry best practices
- Fixing obvious errors

**Medium Confidence (?)**
- Inference from partial data
- Common patterns but not universal
- Subjective improvements
- Multiple valid options exist

**Low Confidence (⚠)**
- Limited data available
- Unusual situation
- Experimental suggestion
- Potential controversy

---

## 11. Proposal Examples

### 10.1 Field-Level Proposal
**Context:** User editing a Risk description  
**User types:** "server might fail"  
**AI proposes:** "Production authentication server may experience unplanned downtime affecting user login capabilities"  
**Rationale:** "More specific about impact and which server"  
**User action:** Accepts proposal

### 10.2 Component Creation Proposal
**Context:** Daily analysis detects pattern  
**AI proposes:** New Risk: "Database capacity reaching 85% with current growth rate"  
**Evidence:** "Based on 3-week trend, will hit limit in ~10 days"  
**Linked items:** Tasks T-45, T-67 will increase load  
**User action:** Accepts and assigns to DBA team

### 10.3 Dependency Proposal
**Context:** User creates new task  
**User input:** "Deploy payment gateway update"  
**AI proposes:** Add dependencies to:
- T-23: "Complete payment API testing"
- T-45: "Update security certificates"  
**Rationale:** "These tasks modify same components"  
**User action:** Accepts T-23, rejects T-45

### 10.4 Batch Proposals
**Context:** Monday morning planning  
**AI presents:**
1. Close 3 completed tasks (owners confirmed done)
2. Escalate 2 risks (probability increased based on new data)
3. Create follow-up task from last week's decision
4. Adjust milestone date (dependencies shifted)  
**User action:** Bulk accepts 1-3, reviews #4 separately

### 10.7 Proposal Presentation Rules

**Confidence Display:**
- All confidence levels shown by default
- Users can filter by confidence if needed
- Low confidence proposals included to maintain transparency
- AI learning benefits from seeing what gets rejected

**Batch Size:**
- No hard limit on proposal counts
- Smart pagination for large sets (show 10, then "Show more...")
- User can request "Show all" if desired
- Performance considerations handled by UI/UX

**Smart Grouping:**
- Related proposals automatically grouped
- Grouping criteria:
  - Same component affected
  - Same module/area of project
  - Cascading changes (one triggers another)
  - Same underlying issue/pattern
- Group actions available:
  - "Accept group" / "Reject group"
  - "Expand group" to see individual items
  - Groups show aggregate confidence

**Example Grouped Proposal:**
```
🔗 Authentication Module Updates (4 proposals)
├── ✓ Update Task T-23: Clarify SSO timeout issue
├── ✓ Create Risk: Third-party auth API dependency  
├── ? Add dependency: T-23 blocks T-45
└── ✓ Update Milestone M-3: Adjust for auth delays

[Accept Group] [Review Each] [Reject Group]
```

**Priority Levels:** 
- Not implemented initially
- Future consideration based on user feedback

**Custom Templates:**
- Not available initially  
- Standard templates ensure consistency
- Future consideration for enterprise tier

### 10.9 Document-Based Proposals

**Template Structure:**
```
Action: [Create/Update/Flag inconsistency]
Source: [Document name and section]
Confidence: [High/Medium/Low based on doc age and clarity]
Proposal: [Specific action]
Evidence: [Quote or reference from document]
Impact: [What this affects]
```

**Common Document-Driven Proposals:**

**1. Requirement to Task**
   - Action: Create Task
   - Source: "Requirements Doc v2.3, Section 4.1"
   - Proposal: Create task "Implement user authentication"
   - Evidence: "System must support SSO login"
   - Confidence: High (recent, clear requirement)

**2. Meeting Action Items**
   - Action: Create Tasks (batch)
   - Source: "Planning Meeting Notes - Jan 15"
   - Proposals:
     - Task: "Review security audit" (assigned to: Joe per notes)
     - Task: "Update deployment guide" (due: Jan 30 per notes)
     - Decision: "Use AWS for hosting" (already decided per notes)
   - Confidence: High (direct extraction)

**3. Inconsistency Detection**
   - Action: Flag inconsistency
   - Source: "Tech Design v1.0" vs Current Tasks
   - Finding: Design specifies PostgreSQL, tasks reference MySQL
   - Proposal: Review and align database decision
   - Confidence: High (clear contradiction)

**4. Stale Document Warning**
   - Action: Request update
   - Source: "Project Plan v1.0"
   - Finding: Document shows milestones from 3 months ago
   - Proposal: Archive or update document
   - Impact: May be causing confusion

### 10.10 Stakeholder Communication Proposals

**Template Structure:**
```
Action: [Notify/Update/Request input/Schedule meeting]
Stakeholder(s): [Names and roles]
Trigger: [What prompted this]
Suggested message: [Draft communication]
Channel: [Email/Meeting/Report]
Urgency: [Immediate/Today/This week]
```

**Common Stakeholder Proposals:**

**1. Overdue Update**
   - Action: Send update
   - Stakeholder: John Smith (Sponsor)
   - Trigger: Last update 15 days ago (prefers weekly)
   - Suggested message: Project status summary with key achievements and upcoming milestones
   - Channel: Email
   - Urgency: Today

**2. Decision Input Needed**
   - Action: Request input
   - Stakeholder: Security Team (Reviewer)
   - Trigger: Decision D-15 involves authentication approach
   - Subject: Input needed on authentication architecture
   - Channel: Meeting
   - Urgency: This week

**3. Risk Notification**
   - Action: Notify
   - Stakeholder: Customer Success (Customer representative)
   - Trigger: New risk affects user experience
   - Content: Risk assessment and mitigation plan
   - Channel: Email
   - Urgency: Today

**4. Milestone Communication**
   - Action: Prepare update
   - Stakeholders: All Milestone subscribers
   - Trigger: Beta Launch in 5 days
   - Content: Readiness assessment and success criteria status
   - Channel: Report + Meeting
   - Urgency: This week

---

## 13. User Permissions and Roles

### 13.1 Role Structure (V1)

**Three core roles with clear boundaries:**

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| **Viewer/Stakeholder** | Read-only access for oversight | View dashboards, reports, and project status |
| **Contributor** | Team members doing the work | Create/edit own items, approve proposals while editing |
| **Project Manager** | Project leadership | Edit all items, approve all proposals, configure AI |

### 13.2 Detailed Role Permissions

#### 13.2.1 Viewer/Stakeholder
**Can:**
- View all dashboards and metrics
- View all reports
- Read all project components (tasks, risks, decisions, milestones)
- Receive notifications and updates
- Access project chat in read-only mode

**Cannot:**
- Edit any content
- Approve any proposals
- Configure any settings
- Create new items

**Use Cases:**
- Executive stakeholders
- Clients monitoring progress
- External auditors
- Team members from other projects

#### 13.2.2 Contributor
**Can:**
- Create new items (tasks, risks, decisions)
- Edit items they own
- View all project content
- Receive and respond to AI proposals **while actively editing/creating**
- Accept/reject proposals for their current work session
- Use Project Assistant for queries and updates

**Cannot:**
- Edit items owned by others
- Approve proposals outside their editing session
- Configure AI settings
- Manage other users
- Access cost/usage data

**Proposal Interaction:**
- Only see proposals when in edit/create mode
- Proposals are contextual to current work
- Can accept, reject, or modify proposals
- Proposals expire when editing session ends

**Use Cases:**
- Developers
- Designers  
- Analysts
- Any team member doing project work

#### 13.2.3 Project Manager
**Can:**
- Everything Contributors can do
- Edit ANY items regardless of owner
- Receive ALL proposals generated outside editing sessions:
  - Daily AI analysis proposals
  - Pattern-detected proposals
  - Risk escalation proposals
  - Cross-component proposals
  - Strategic recommendations
- Approve/reject proposals in batch or individually
- Configure all AI settings:
  - Model selection per component
  - Validation depth
  - Proposal frequency
  - Cost limits
- Manage users and assign roles
- View AI usage and costs
- Generate and schedule reports
- Override any contributor decisions

**Cannot:**
- Modify system-wide settings (future Admin role)
- Access other projects without assignment

**Proposal Interaction:**
- Receives proposals via:
  - Dashboard notifications
  - Email digests
  - Project Assistant
  - Dedicated proposal queue
- Can bulk approve/reject
- Can delegate temporarily (future enhancement)

**Use Cases:**
- Project Managers
- Product Owners
- Team Leads (in small teams)

### 13.3 Ownership Model

**Simple ownership rules:**
- Creator becomes the default owner
- Only owner and PMs can edit an item
- PM can reassign ownership
- Orphaned items (owner removed) become PM-owned

### 13.4 Proposal Routing

**Clear routing logic:**

| Proposal Type | Recipient | When |
|--------------|-----------|------|
| Field improvements | Active editor | During edit session |
| Validation issues | Active editor | During create/edit |
| New item suggestions | Project Manager | Daily analysis |
| Cross-component | Project Manager | When detected |
| Risk escalations | Project Manager | When triggered |
| Strategic proposals | Project Manager | Weekly analysis |

### 13.5 Permission Scenarios

**Scenario 1: Creating a Task**
1. Contributor creates new task
2. AI proposes improvements inline
3. Contributor accepts/rejects
4. Task saved with accepted proposals
5. Contributor owns the task

**Scenario 2: Daily Analysis**
1. AI runs overnight analysis
2. Generates 10 proposals
3. PM receives notification
4. PM reviews in batch
5. Accepts 7, rejects 3
6. Changes applied to project

**Scenario 3: Risk Escalation**
1. AI detects pattern suggesting new risk
2. Proposal sent to PM
3. PM reviews and accepts
4. Risk created, PM assigns owner
5. Owner notified of new risk

### 13.6 Future Permission Enhancements (V2+)

**Documented for future consideration:**
- Team Lead role (between Contributor and PM)
- Delegation mechanisms
- Department-specific permissions
- Approval workflows
- Guest access
- Custom roles

---

## 14. AI Prompts per Component

### 14.1 Plan Prompt

```
When validating or proposing improvements for project plans:

TASK CREATION: Suggest new tasks when:
- Requirements document mentions features not tasked
- Dependencies need intermediate tasks
- Milestones lack sufficient tasks to achieve them
- Standard project phases are missing (testing, documentation)
- Risks need mitigation tasks

DEPENDENCY ANALYSIS: Validate and propose:
- Logical sequence (design before build)
- No circular dependencies
- No orphaned tasks
- Parallel work opportunities
- Critical path optimization

TIMELINE REALISM: Check for:
- Reasonable durations for task complexity
- Buffer time for integration/testing
- Resource availability vs. assignments
- External dependency alignment
- Historical velocity patterns

RESOURCE OPTIMIZATION: Suggest:
- Load balancing across team
- Skill-to-task matching
- Bottleneck resolution
- Over-allocation warnings

GANTT INTELLIGENCE: When viewing Gantt:
- Highlight critical path
- Show resource conflicts visually
- Suggest schedule compression opportunities
- Flag unrealistic timelines
- Identify slack time that could be utilized

PROPOSALS: Focus on:
- Missing tasks for completeness
- Dependency corrections
- Timeline optimizations
- Resource rebalancing
- Risk mitigation tasks
```

### 14.2 Task Prompt

```
When validating or proposing improvements for tasks:

CLARITY: Ensure the task description clearly states WHAT needs to be done and WHY it matters. It should be understandable by someone joining the project tomorrow.

COMPLETENESS: Check for:
- Clear acceptance criteria (how we know it's done)
- Realistic effort estimate
- Assigned owner
- Appropriate status

ACTIONABILITY: The task should:
- Start with an action verb (Create, Update, Review, Fix, etc.)
- Be achievable by one person or a small team
- Be completable within a reasonable timeframe (suggest splitting if >5 days)

DEPENDENCIES: Identify and suggest:
- What this task might be blocked by
- What other tasks this might block
- Whether the sequence makes logical sense

LATEST POSITION ANALYSIS: When reading Latest Position entries:
- Detect implicit status changes ("starting work", "ready for review")
- Identify blockers mentioned ("stuck on", "waiting for")
- Extract progress indicators ("60% done", "almost finished")
- Flag risks ("harder than expected", "switching approach")
- Recognize learnings and solutions
- Suggest next actions

PROPOSALS: When suggesting improvements:
- Keep the core intent unchanged
- Improve clarity without adding unnecessary complexity
- Use the project's established terminology
- Flag potential risks or issues this task might create

FORMAT: Title should be concise (under 10 words), description should provide context and acceptance criteria.
```

### 14.3 Risk Prompt

```
When validating or proposing improvements for risks:

STRUCTURE: Risks should follow the format:
"IF [specific trigger event] THEN [concrete impact on project]"
Example: "IF the payment API provider has an outage THEN customer transactions will fail, potentially losing $10K per hour"

ASSESSMENT: Ensure both probability and impact are specified:
- Probability: Low (unlikely) / Medium (possible) / High (probable)
- Impact: Minor (minimal effect) / Moderate (noticeable delays) / Severe (major delays) / Critical (project failure)

SPECIFICITY: Risks should be:
- Specific enough to monitor
- Measurable in impact
- Time-bound where relevant
- Assigned to someone who can monitor/mitigate

MITIGATION: For Medium/High probability or Severe/Critical impact:
- Mitigation must be actionable, not just "monitor"
- Should reduce probability OR impact
- Include concrete steps, not wishes
- Consider both preventive and contingent actions

PROPOSALS: When suggesting new risks:
- Base on patterns in tasks, dependencies, or timeline
- Consider external factors mentioned in descriptions
- Flag when multiple small risks could compound
- Identify risks from missing information

AVOID: Vague risks like "project might be delayed" or "things could go wrong"
```

### 14.4 Decision Prompt

```
When validating or proposing improvements for decisions:

QUESTION: The decision should pose a clear question that:
- Has a finite set of possible answers
- Is relevant to the project now or soon
- Identifies who needs to make the decision
- Explains why the decision matters

OPTIONS: Each decision should document:
- At least 2 viable options (if only one option, it's not a decision)
- Pros and cons for each option
- Rough cost/effort implications
- Impact on timeline or other components

DOCUMENTATION: Once decided:
- The rationale must explain WHY this option was chosen
- Impact assessment should note what changes as a result
- Follow-up actions should be identified

TIMING: Flag if:
- The decision is blocking active work
- The decision deadline has passed
- The decision might become irrelevant soon

PROPOSALS: When suggesting decisions:
- Identify when tasks are blocked awaiting direction
- Notice when assumptions need validation
- Flag when multiple people are making conflicting assumptions
- Recognize when risks could be mitigated by making a decision

FORMAT: Question should be answerable with a clear choice. Avoid open-ended strategic questions that can't be closed.
```

### 14.5 Milestone Prompt

```
When validating or proposing improvements for milestones:

CLARITY: Milestones should represent:
- A significant achievement or deliverable
- A clear point in time
- Something stakeholders care about
- A natural point to assess progress

SUCCESS CRITERIA: Must be:
- Objective and measurable (not "system works well")
- Binary - either achieved or not
- Listed as specific checklist items
- Verifiable by someone outside the team

DEPENDENCIES: Check that:
- All tasks required for the milestone are identified
- The timeline is realistic given the dependencies
- There's buffer time for integration/testing
- Critical path is understood

TIMING: Validate:
- Date is realistic given current progress
- Earlier milestones don't conflict
- External dependencies are considered
- Team capacity supports the date

PROPOSALS: When suggesting improvements:
- Recommend splitting if criteria are too complex
- Suggest additional milestones if gaps are >1 month
- Flag if success criteria are subjective
- Identify missing dependencies from tasks

AVOID: Milestones that are just task completions, internal-only checkpoints (unless critical for team), or vague achievements.
```

### 14.6 Blocker Prompt

```
When validating or proposing improvements for blockers:

DISTINCTION FROM RISK: Blockers are problems happening NOW that are preventing progress. They require immediate action, not future mitigation.

CLARITY: Blockers should state:
- What is currently blocked or broken
- Why it cannot proceed
- What specific help is needed
- When resolution is needed by

SEVERITY ASSESSMENT:
- Critical: All work stopped, milestone at risk
- High: Multiple people/tasks blocked
- Medium: Workaround exists but inefficient
- Low: Inconvenient but work continues

OWNERSHIP: Every blocker needs:
- An owner driving resolution
- Clear next action defined
- Escalation path if not resolved
- Regular updates on progress

RESOLUTION PATH: Should include:
- What's needed to unblock
- Who can help
- Alternative approaches considered
- Dependencies for resolution

PROPOSALS: When suggesting blockers:
- Convert risks to blockers when triggers occur
- Flag when tasks marked "blocked" lack a corresponding blocker
- Identify when multiple tasks blocked by same issue
- Suggest escalation when resolution is overdue
- Propose owner based on expertise needed

RELATIONSHIPS: Link to:
- All blocked tasks
- Related risks that materialized
- Decisions needed to unblock
- Resources who can help
```

### 14.7 Resource Prompt

```
When validating or proposing improvements for resources:

ALLOCATION: Check for:
- Over-allocation (>100% across all projects)
- Under-utilization (<50% with no explanation)
- Allocation mismatches with task assignments
- Time-based conflicts (vacation, other commitments)

SKILLS MATCHING: Validate:
- Required skills exist in team
- Task assignments match expertise
- Knowledge transfer risks (single points of failure)
- Training needs identified

CAPACITY PLANNING: Monitor:
- Upcoming bottlenecks
- Workload distribution
- Critical path resources
- Buffer availability for issues

TEAM COMPOSITION: Suggest when:
- Key roles are missing
- Ratios seem off (e.g., 10 devs, 1 tester)
- No clear backup for critical roles
- Escalation path unclear
