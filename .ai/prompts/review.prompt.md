# Review

- Check out `Accessing Task Documents` in `.ai/config.md` for context about mentioned `*.md` files.
- All `*.md` files should exist; you should not create any new files unless explicitly instructed.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to review a document as one member of a review panel.
- The mentioned `Copilot_Review.md` and `Copilot_Review_*_*.md` files are in `.ai/TaskLogs/`.
- Each model writes its review to a separate file.
- When you are asked to create a `Copilot_Review_*_*.md`, you are only allowed to create your own review file.
- Document review should consider the knowledge base.
- Document review should consider learnings from `KnowledgeBase/Learning.md`, `Learning/Learning_Coding.md`, and `Learning/Learning_Testing.md` if they exist.

## Identify the Review Board Team

- In the LATEST chat message there should be a section called `## Reviewer Board Files`.
- Model and their file name fragment is bullet-listed: `{ModelName} -> Copilot_Review_{Finished|Writing}_{FileNameFragment}.md`.
- If you cannot find this section, stop immediately.

## Copilot_Review_*_*.md Structure

- `# Review Target: {TargetDocumentName}`
- `## Opinion`: Your opinion of the target document.
- `## Replies`
  - `### AGREE with {ModelName}` without content.
  - `### DISAGREE with {ModelName}`: your opinion about other models' opinions or replies to you.

## Step 1. Identify the Target Document to Review

- Find the title in the LATEST chat message:
  - `# Scrum`: review `Copilot_Scrum.md`, focus only on unfinished tasks (`- [ ]`).
  - `# Design`: review `Copilot_Task.md`, from `# INSIGHTS AND REASONING` to the end.
  - `# Plan`: review `Copilot_Planning.md`, from `# EXECUTION PLAN` to the end.
  - `# Summary`: review `Copilot_Execution.md`, from `# EXECUTION PLAN` to the end.
  - `# Final`: skip to `Final Review` section.
  - `# Apply`: skip to `Apply Review` section.
- If there is nothing: it means you are accidentally stopped. Continue your work.

## Step 2. Identify Documents from the Review Board

- You are one of the models. `YourFileNameFragment` is your own file name fragment.
- All reviews from the PREVIOUS ROUND should be `Copilot_Review_Finished_{FileNameFragment}.md`.
- You write `Copilot_Review_Writing_{FileNameFragment}.md` in the CURRENT ROUND.

## Step 3. Read Context

- Read the target document identified in Step 1.
- Read all `Reviewer Board Files` except yours from the PREVIOUS ROUND:
  - If you can't find a file, disagree with that model and explain.
  - Note their opinions and their replies to you.

## Step 4. Write Your Review

- Create: `Copilot_Review_Writing_{YourFileNameFragment}.md`
  - If this file already exists, you have already completed the review — stop.
- Complete the document:
  - `## Opinion`: Your complete summarized feedback. Don't omit anything from previous rounds.
  - `## Replies`: For each other model, either `### AGREE with {ModelName}` (no content) or `### DISAGREE with {ModelName}` (explain why).

### Review the Architecture

- SOLID principles apply:
  - Single responsibility: each module/component has one job.
  - Open-closed: extend through new code, not modifying existing working code.
  - Liskov substitution: subtypes must be substitutable for their base types.
  - Interface segregation: prefer small, focused interfaces over large ones.
  - Dependency inversion: depend on abstractions, not concretions.
- The design should be compatible with existing constructions and patterns in the codebase.
- Respect Electron's process isolation: main process logic stays in main, renderer logic stays in renderer, communication goes through IPC.

### Review the Code Quality

- The most important rule is that the code should look like other files in the codebase.
- TRY YOUR BEST to prevent code duplication.
- TypeScript strict mode must be satisfied — no escape hatches like `as any` or `@ts-ignore` without compelling reason.
- React components should use functional style with hooks. No class components.
- Avoid premature abstraction — three similar lines are better than a premature helper.

### Review with Learnings

- Check `KnowledgeBase/Learning.md`, `Learning/Learning_Coding.md`, `Learning/Learning_Testing.md`.
- Each item has a `[SCORE]` — pay attention to high-score items (frequently repeated mistakes).
- Apply all learnings and find what could be improved.

### Review with the Knowledge Base

- Nothing should conflict with the knowledge base.
- If the knowledge base is imprecise about the code, point it out.

## Final Review (only when `# Final` appears in the LATEST chat message)

### Step F1. Verify Convergence

- Execute `copilot-prepare-review.sh` to rename Writing → Finished files.
- Collect all `Copilot_Review_Finished_*.md` files.
- Ensure:
  - All models in the review board have files.
  - All target the same document.
  - No disagreements remain in `## Replies`.

### Step F2. Create the Summary

- Read all `## Opinion` sections.
- Consolidate into a single cohesive review in `Copilot_Review.md`.
  - Title: `# Review Target: {TargetDocumentName}`
  - DO NOT mention which model offered which opinion.
  - Ignore comments against `# !!!SOMETHING!!!` markers.

## Apply Review (only when `# Apply` appears in the LATEST chat message)

### Step A1. Identify the Target Document

- `Copilot_Review.md` title tells you which document to update.
- Follow the corresponding prompt file:
  - `Copilot_Scrum.md` → `0-scrum.prompt.md`
  - `Copilot_Task.md` → `1-design.prompt.md`
  - `Copilot_Planning.md` → `2-planning.prompt.md`
  - `Copilot_Execution.md` → `3-summarizing.prompt.md`

### Step A2. Apply the Review

- Treat the review content as an `# Update` and follow the corresponding prompt.

### Step A3. Clean Up

- Delete all `Copilot_Review_*_*.md` files.
- Delete `Copilot_Review.md`.
