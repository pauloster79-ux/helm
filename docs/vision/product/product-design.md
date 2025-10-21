# Helm - Product Design Document

**Version:** 1.0  
**Last Updated:** 2025-10-05  
**Status:** Draft

## 1. Executive Overview

### 1.1 Product Vision
Helm is an AI-augmented project management platform that eliminates the administrative burden of project management while maintaining exceptional data quality and project visibility. Unlike traditional PM tools that require constant manual updates and data cleanup, Helm uses AI as an intelligent assistant that validates inputs, proposes improvements, and generates insights—all while keeping humans in control of decisions.

### 1.2 Core Value Proposition
**"Spend time managing projects, not project data."**

Helm reduces the 40% of PM time typically spent on administrative tasks to under 10%, while actually improving data quality and stakeholder communication through AI-powered validation and intelligent automation.

### 1.3 Key Differentiators
1. **AI as Proposal Engine, Not Decision Maker** - Every change is proposed with rationale, never forced
2. **Transparent AI Costs** - See exactly what AI features cost, control usage
3. **Flexible Validation Depth** - Choose between speed and thoroughness per component
4. **Conversational Updates** - Update projects through natural language, not forms
5. **Document Intelligence** - AI learns from your documents to provide context-aware assistance

---

## 2. User Personas & Pain Points

### 2.1 Primary Persona: Sarah, The Overloaded PM
**Role:** Senior Project Manager at mid-size software company  
**Team Size:** 15-20 people across 3 projects  
**Experience:** 8 years in project management

**Current Pain Points:**
- Spends 3+ hours daily updating project data and chasing status updates
- Weekly reports take 2-3 hours to compile and often contain stale data
- Team members provide inconsistent, vague updates ("making progress")
- Constantly switching between 5+ tools (Jira, Slack, Excel, Confluence, email)
- Discovers risks and blockers too late because they're buried in comments
- Struggles to maintain consistent project documentation

**Goals:**
- Have real-time project visibility without constant manual updates
- Generate accurate reports in minutes, not hours
- Get early warning of risks and blockers
- Spend more time on strategic planning and stakeholder management
- Maintain single source of truth for project status

**Quote:** *"I feel like a data entry clerk instead of a project manager. By the time I've updated everything, the information is already out of date."*

### 2.2 Secondary Persona: Alex, The Technical Lead
**Role:** Engineering Team Lead  
**Team Size:** 5-7 developers  
**Experience:** 10 years development, 2 years as lead

**Current Pain Points:**
- Hates detailed status updates, sees them as bureaucracy
- PM tools feel disconnected from actual work (GitHub, IDE)
- Duplicate effort updating tickets and informing stakeholders
- Gets interrupted constantly for status questions
- Unclear dependencies cause unexpected blockers

**Goals:**
- Quick, conversational updates without leaving workflow
- Automatic extraction of progress from commits/PRs
- Clear visibility of dependencies and blockers
- Less time in status meetings

**Quote:** *"Just let me say 'task 23 is done, starting 24' without filling out seven fields."*

### 2.3 Tertiary Persona: Diana, The Executive Stakeholder
**Role:** VP of Product  
**Oversight:** 8-10 concurrent projects  
**Experience:** 15 years in product leadership

**Current Pain Points:**
- Reports arrive late or with inconsistent formatting
- Has to ask for updates rather than receiving them proactively
- Difficult to compare progress across projects
- Surprised by delays that should have been predictable
- Can't quickly drill down from high-level to details

**Goals:**
- Consistent, timely project visibility
- Early warning of risks affecting strategic goals
- Confidence in project data accuracy
- Self-service access to project details

**Quote:** *"I shouldn't have to chase people for updates or wonder if the data I'm seeing is accurate."*

### 2.4 Quaternary Persona: Jordan, The Individual Contributor
**Role:** Software Developer  
**Experience:** 3 years

**Current Pain Points:**
- Unclear task requirements waste development time
- Not sure what to work on next
- Afraid of breaking dependencies they don't know about
- Status updates feel like meaningless overhead

**Goals:**
- Clear task descriptions and acceptance criteria
- Understand how their work fits the bigger picture
- Quick updates without context switching
- Know immediately when blocked

**Quote:** *"Half the time I'm not sure what 'done' looks like for a task."*

---

## 3. User Journeys & Workflows

### 3.1 Journey: Morning Project Check-in (Sarah, PM)

**Current State (Pain):**
1. Opens email (15 min) - Scattered updates, questions
2. Checks Slack (20 min) - More updates, missed messages
3. Opens Jira (30 min) - Updates tickets based on emails/Slack
4. Updates spreadsheet (15 min) - Manual risk tracking
5. Realizes data conflicts (10 min) - Fixes inconsistencies
6. Still missing updates from 3 team members

**Total: 90 minutes of administrative work**

**Future State with Helm (Magic):**
1. Opens Helm dashboard (2 min) - See overnight AI analysis
2. Reviews 5 grouped proposals (5 min):
   - "3 tasks marked done in Slack yesterday"
   - "New risk detected from task delays"
   - "Stakeholder update overdue"
3. Bulk approves routine updates (1 min)
4. Reviews critical risk proposal in detail (3 min)
5. Sends stakeholder update via AI draft (2 min)
6. Checks team progress visualization (2 min)

**Total: 15 minutes with higher data quality**

### 3.2 Journey: Quick Task Update (Alex, Tech Lead)

**Current State (Pain):**
1. Finishes coding feature
2. Switches to Jira (mental context switch)
3. Finds ticket (searching through boards)
4. Updates 5+ fields
5. Writes comment
6. Moves to new column
7. Assigns next ticket to self
8. Returns to coding (lost flow state)

**Total: 10-15 minutes + broken concentration**

**Future State with Helm (Magic):**
1. In Slack: "task 23 done, hit performance issue with auth module"
2. Helm responds: "✓ Updated. I noticed this might affect task 45. Should I flag a risk?"
3. "Yes"
4. "✓ Risk created and linked. Task 24 is next in your queue. Start it?"
5. "Yes"
6. Back to coding

**Total: 30 seconds, no context switch**

### 3.3 Journey: Weekly Report Generation (Sarah, PM)

**Current State (Pain):**
1. Export data from multiple tools (30 min)
2. Clean and reconcile data (45 min)
3. Create charts and summaries (45 min)
4. Write narrative sections (30 min)
5. Format for different stakeholders (30 min)
6. Realize data is already stale

**Total: 3 hours**

**Future State with Helm (Magic):**
1. "Generate weekly report for executives"
2. AI compiles report with:
   - Current status from all components
   - Automated risk analysis
   - Progress against milestones
   - Key decisions and blockers
3. Reviews AI-generated narrative (5 min)
4. Adjusts one section (5 min)
5. Approves distribution list
6. Auto-sends to stakeholders

**Total: 15 minutes**

### 3.4 Journey: New Project Setup (Sarah, PM)

**Current State (Pain):**
1. Create project in PM tool
2. Manually create 50+ tasks
3. Set up risk register in spreadsheet
4. Create stakeholder list in another doc
5. Configure Slack channel
6. Write project charter
7. No consistency with other projects

**Total: 2 days**

**Future State with Helm (Magic):**
1. Uploads project charter document
2. AI extracts: milestones, stakeholders, initial risks
3. Reviews AI proposals: "Create 15 tasks from requirements?"
4. Accepts with modifications
5. AI suggests: "Based on similar projects, consider these 5 risks"
6. Team invited, channels connected
7. Project ready with intelligent defaults

**Total: 2 hours**

### 3.5 Journey: Identifying and Escalating Blockers (Jordan, Developer)

**Current State (Pain):**
1. Stuck on authentication integration
2. Posts in Slack (maybe someone sees)
3. Waits... no response
4. Messages tech lead directly
5. Updates ticket status (if remembers)
6. Blocker not visible to PM for 2 days
7. Milestone at risk, discovered too late

**Future State with Helm (Magic):**
1. In Slack: "blocked on auth integration, need security team input"
2. Helm: "Created blocker B-12, flagged as High severity. Notifying security team and Sarah. This affects milestone M-3."
3. Security team member responds in thread
4. Issue resolved, Jordan updates: "unblocked, security provided workaround"
5. Helm: "✓ Blocker resolved. Task resuming. Milestone risk reduced."
6. Full visibility and audit trail maintained

---

## 4. Value Propositions

### 4.1 For Project Managers
**Save 15+ hours per week** on administrative tasks
- Automated report generation
- Intelligent data validation
- Bulk proposal processing
- Conversational updates

**Improve project outcomes** through better insights
- Early risk detection
- Dependency visualization
- Resource optimization
- Pattern recognition across projects

### 4.2 For Team Members
**Update in seconds, not minutes**
- Natural language updates
- No form filling
- Works where you work (Slack, Teams)
- Context-aware assistance

**Always know what to do next**
- Clear task descriptions
- Visible dependencies
- Smart task suggestions
- Blocker resolution help

### 4.3 For Stakeholders
**Trust the data you see**
- AI-validated information
- Real-time accuracy
- Consistent formatting
- Audit trail for changes

**Get updates proactively**
- Automated stakeholder updates
- Risk escalations
- Milestone notifications
- Customized views

### 4.4 For Organizations
**Reduce PM overhead by 70%**
- Less time on admin
- More time on strategy
- Better project outcomes
- Lower project management costs

**Increase project success rate**
- Better risk management
- Earlier problem detection
- Improved communication
- Data-driven decisions

---

## 5. Success Metrics

### 5.1 Activation Metrics
- **Time to first AI proposal acceptance**: <10 minutes
- **Projects with AI enabled**: >90%
- **Team member adoption**: >75% using conversational updates within first week

### 5.2 Engagement Metrics
- **Daily active users**: >80% of team members
- **Proposals reviewed**: >90% within 24 hours
- **Conversational updates**: >60% of all updates
- **Document uploads**: Average 3+ per project

### 5.3 Value Metrics
- **Time saved per PM per week**: 15+ hours
- **Report generation time**: <15 minutes (was 3+ hours)
- **Data quality score**: >95% (AI-validated fields)
- **Stakeholder satisfaction**: 8+/10

### 5.4 Business Metrics
- **Customer retention**: >90% annual
- **Revenue per account growth**: 30% year-over-year (via AI usage)
- **Payback period**: <3 months
- **NPS score**: >50

---

## 6. Magic Moments to Prioritize

### 6.1 🎯 The First Accepted Proposal
**When:** During initial task creation  
**Experience:** User types vague task, AI suggests clear version, user thinks "Oh, that's exactly what I meant!"  
**Why it matters:** Builds immediate trust in AI assistance

### 6.2 🎯 The Five-Second Update
**When:** First conversational update  
**Experience:** "Task 23 done" → Everything updates automatically  
**Why it matters:** Shows dramatic efficiency gain

### 6.3 🎯 The Prevented Crisis
**When:** AI detects risk from patterns  
**Experience:** "I noticed these 3 tasks might cause you to miss your milestone"  
**Why it matters:** Demonstrates predictive value

### 6.4 🎯 The Perfect Report
**When:** First auto-generated report  
**Experience:** Stakeholder-ready report in 30 seconds  
**Why it matters:** Massive time savings, visible ROI

### 6.5 🎯 The Document Learning
**When:** Upload requirements document  
**Experience:** AI proposes all tasks from requirements  
**Why it matters:** Shows contextual intelligence

### 6.6 🎯 The Bulk Approval
**When:** Morning review of overnight proposals  
**Experience:** Review and approve 20 updates in 60 seconds  
**Why it matters:** Shows efficiency at scale

---

## 7. Anti-Patterns to Avoid

### 7.1 ❌ The Overwhelming AI
**Don't:** Flood users with proposals on day one  
**Instead:** Start with high-confidence suggestions, ramp up gradually

### 7.2 ❌ The Black Box
**Don't:** Make changes without explanation  
**Instead:** Always show rationale and evidence for proposals

### 7.3 ❌ The Forced Upgrade
**Don't:** Gate basic features behind AI usage  
**Instead:** Make AI valuable enough that users want it

### 7.4 ❌ The Grammar Nazi
**Don't:** Constantly propose minor wording changes  
**Instead:** Focus on material improvements to clarity and completeness

### 7.5 ❌ The Hallucinating Assistant
**Don't:** Generate proposals without sufficient context  
**Instead:** Be conservative, acknowledge uncertainty

### 7.6 ❌ The Permission Maze
**Don't:** Create complex approval hierarchies  
**Instead:** Simple, clear rules about who can approve what

### 7.7 ❌ The Integration Hell
**Don't:** Require complex setup for each integration  
**Instead:** One-click connections with smart defaults

### 7.8 ❌ The Hidden Costs
**Don't:** Surprise users with AI charges  
**Instead:** Transparent, predictable pricing with controls

---

## 8. Design Principles

### 8.1 Progressive Disclosure
Start simple, reveal power gradually
- Basic features work without AI
- AI assistance is discoverable but not mandatory
- Advanced features unlock as users gain confidence

### 8.2 Human in Control
AI proposes, humans decide
- Every AI action is a proposal
- Clear accept/reject/modify options
- Audit trail of all decisions

### 8.3 Contextual Intelligence
AI understands the full picture
- Learns from documents
- Considers project history
- Adapts to team patterns

### 8.4 Transparent Operations
No black boxes
- Show AI reasoning
- Display confidence levels
- Clear cost attribution

### 8.5 Workflow Integration
Meet users where they work
- Slack/Teams native
- Email updates
- API for custom integrations

### 8.6 Speed as a Feature
Every interaction should feel instant
- Async AI processing
- Optimistic UI updates
- Smart caching

---

## 9. Competitive Positioning

### 9.1 vs. Traditional PM Tools (Jira, Asana, Monday)
**Their weakness:** Require constant manual updates, no intelligence  
**Our strength:** AI validates and improves data quality automatically

### 9.2 vs. AI-First Tools (Notion AI, ClickUp AI)
**Their weakness:** AI as add-on feature, not core architecture  
**Our strength:** AI deeply integrated into every workflow

### 9.3 vs. Enterprise PM (Microsoft Project, ServiceNow)
**Their weakness:** Complex, expensive, slow to adopt  
**Our strength:** Start using in minutes, value in first day

### 9.4 vs. Build-Your-Own (Spreadsheets, Custom Tools)
**Their weakness:** High maintenance, no intelligence  
**Our strength:** Best practices built-in, continuous improvement

---

## 10. Product Evolution Roadmap

### Phase 1: Foundation (Months 1-3)
- Core project components
- Basic AI validation
- Web interface
- Slack integration

### Phase 2: Intelligence (Months 4-6)
- Document learning
- Pattern recognition
- Predictive analytics
- Multi-channel support

### Phase 3: Scale (Months 7-12)
- Enterprise features
- Advanced integrations
- Custom AI models
- Industry templates

### Phase 4: Platform (Year 2)
- API ecosystem
- Third-party plugins
- Industry-specific versions
- AI customization tools

---

## 11. Key Product Decisions

### 11.1 AI-First, But Not AI-Only
The product must function without AI, but AI makes it magical. This ensures:
- Lower barrier to entry
- Fallback during AI outages
- User control over costs
- Gradual AI adoption

### 11.2 Proposals Over Automation
Every AI suggestion is a proposal because:
- Maintains human accountability
- Builds trust through transparency
- Allows learning from rejections
- Prevents runaway AI costs

### 11.3 Document-Aware Context
Documents are first-class citizens because:
- Projects exist beyond tool boundaries
- Rich context improves AI quality
- Reduces duplicate data entry
- Preserves institutional knowledge

### 11.4 Transparent Pricing
AI costs are visible because:
- Builds trust with customers
- Allows cost optimization
- Demonstrates value clearly
- Prevents bill shock

---

## 12. Measuring Success

### 12.1 Leading Indicators (Daily/Weekly)
- Proposal acceptance rate
- Time to first value
- Daily active users
- AI usage per project

### 12.2 Lagging Indicators (Monthly/Quarterly)
- Time saved per PM
- Project success rate improvement
- Customer retention
- Revenue per customer

### 12.3 Quality Metrics
- Data completeness score
- Update frequency
- Report accuracy
- Stakeholder satisfaction

---

## Appendix A: Detailed Magic Moment Flows

### A.1 First Task Creation with AI

1. User clicks "New Task"
2. Types: "fix the login bug"
3. As they type, AI suggests: "Fix SSO authentication timeout issue"
4. User tabs to description
5. AI pre-fills: "Users experience session timeout when authenticating via SSO after 24-hour period. Need to implement refresh token mechanism."
6. User thinks: "Wow, it understood what I meant"
7. AI suggests owner based on skills
8. AI identifies dependency on auth module task
9. User saves with 80% less typing
10. Trust in AI established

### A.2 Crisis Prevention Flow

1. Tuesday: Developer updates task: "might be delayed"
2. AI creates risk proposal: "3-day delay likely"
3. PM accepts risk
4. Thursday: Another task delayed
5. AI escalates: "Pattern detected: Milestone M-3 at risk. 60% chance of missing date based on velocity"
6. AI proposes: "Schedule risk review with stakeholders"
7. PM accepts, meeting scheduled
8. Issue addressed before it becomes crisis
9. Stakeholder trust increased

---

## Appendix B: Persona Validation Questions

For user research, validate these assumptions:

**For PMs:**
1. How many hours per week on administrative tasks?
2. Most painful part of current PM tools?
3. How often is project data out of date?

**For Team Members:**
1. How long does a typical status update take?
2. Preferred method of communication?
3. Biggest friction in current tools?

**For Stakeholders:**
1. How often do you need to ask for updates?
2. Trust level in project data accuracy?
3. Time to get answers to project questions?

---

*This document serves as the north star for product decisions and prioritization. It should be updated as we learn from users and evolve the product vision.*