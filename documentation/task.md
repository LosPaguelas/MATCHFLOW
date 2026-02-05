## Crudzaso · – Part 2

MatchFlow moves to Phase 2, focusing on inherited code stabilization and monetization. Teams receive existing code from another team with no handover and must treat it as a real legacy system, fixing issues and extending business logic.

## Main Objectives

1. Stabilization of Inherited Code
   Teams must analyze the received repository and fix:

- Functional bugs and broken flows
- Incomplete features from Part 1
- Reservation, blocking, matching, Open to Work, contact rules
- json-server integration issues
- Refactoring is allowed but must be documented.

2. Candidate Subscription Plans (Reservation Capacity Domain)
   Core concept: Candidate plan controls how many companies can reserve the same candidate simultaneously.

#### Free Candidate

- Max 1 active reservation
- If reserved → other companies cannot reserve
- Visibility behavior = inherited from Part 1 (hidden or marked reserved)
- Pro Candidate – Level 1
- Max 2 simultaneous reservations
- System must block the 3rd reservation
- Pro Candidate – Level 2
- Max 5 simultaneous reservations
- System must block the 6th reservation
- Enforcement Rule
- Must be enforced at business logic layer (service/controller)
- UI checks alone are invalid

---

### Company Subscription Plans (Visibility & Filtering Domain)

Core concept: Company plan controls what candidates they can see and how they can filter them.

- Free Company
- Default MatchFlow visibility rules
- Limited filtering (basic filters only)
- Cannot bypass reservation blocking
- Business Company
- Enhanced candidate visibility (group decision)
- Advanced filters (e.g., skill-based filters)
- Potential higher search/match limits
- Enterprise Company
- Can see all candidates, including reserved ones
- Full filtering freedom (skills, attributes, custom filters)
- Still cannot reserve if candidate reached reservation limit
- Cross-Plan Global Business Rules (Hard System Constraints)

- These rules override all plans:
- Reservation Blocking Rule
- Even Enterprise companies cannot bypass reservation limits
- Single Active Plan Rule
- Each candidate and company must have exactly one active plan
- Real-Time Enforcement
- Upgrading/downgrading plan immediately changes system behavior

---

### Technical Enforcement Layer (Architecture Relation)

Where logic must live (not UI):

- Reservation validation service
- Candidate visibility service
- Company filtering service
- Plan middleware / policy layer

Example conceptual flow:

- Company → Search Candidates → Plan Policy Check → Data Returned
- Company → Reserve Candidate → Candidate Plan Policy Check → Allow/Block

3. Plan Management Rules

- Every user/company has exactly one active plan
- Plans must be clearly identifiable
- Upgrades/downgrades change behavior immediately
- Payments are simulated

4. Presentation Requirement (15 min)

- Each member must speak. Include:
- Product/Business
- What MatchFlow is and its problem
- Match-first hiring model
- Monetization strategy
- Explanation of plans
- Technical
- Inherited code overview
- Fixes and improvements
- Plan enforcement logic
- Challenges and solutions
- Reflection
- Difficulties with legacy code
- Improvements with more time
- Lessons learned
- Documentation Requirements

### Repository must document:

- Fixes and refactors
- Plan rules and enforcement
- Architectural decisions
- How to run the project
- Updated README + crudactivity-MatchFlow.md
- Core Business Rules (from Part 1)
- Candidates visible only when Open to Work = true
- Companies create matches (candidates never apply)
- Match linked to company + job offer + candidate
- Match states: pending, contacted, interview, hired, discarded
- Reservation blocks other companies from reserving
- Contact info visible only after contacted state
- json-server + fetch + caching required
- Technical & Team Requirements
- Git Flow (main, develop, feature/\*)
- Conventional Commits

#### GitHub Organization with TLs as owners

- README with setup, decisions, and team info
- If you want, I can also produce:
- A super short cheat sheet (20%)
- A checklist of tasks for your team
- A technical architecture proposal for implementing plans
- A presentation slide outline (ready to present)
