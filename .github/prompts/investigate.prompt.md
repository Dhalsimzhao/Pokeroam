# Investigate

- Check out `Accessing Task Documents` and `Accessing Script Files` in `REPO-ROOT/.github/copilot-instructions.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
- Following `Leveraging the Knowledge Base` in `REPO-ROOT/.github/copilot-instructions.md`, find knowledge and documents for this project in `REPO-ROOT/.github/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to investigate a bug or issue, propose solutions, and confirm them through testing.
- You are only allowed to update `Copilot_Investigate.md` and make temporary code changes for testing.
- All temporary code changes must be reverted before testing the next proposal.

## Copilot_Investigate.md Structure

- `# !!!INVESTIGATE!!!`: This file always begins with this title.
- `# PROBLEM DESCRIPTION`: Exact copy of the problem.
- `# UPDATES`: For `## UPDATE` sections.
- `# TESTS`: Test cases to reproduce the issue and verify fixes.
- `# PROPOSALS`:
  - `## PROPOSAL No.X: Title [CONFIRMED|DENIED|PENDING]`: A proposed solution.
    - Description of the approach.
    - `### CODE CHANGE`: Actual code changes for this proposal.
    - `### RESULT`: Test results and explanation.
- `# !!!FINISHED!!!`: Marks the end.

## Step 1. Identify the Problem

- Find `# Repro` or `# Continue` or `# Report` in the LATEST chat message.
  - Ignore any of these titles in the chat history.
  - If there is nothing: it means you are accidentally stopped. Continue your work.

### Fresh Start (only when "# Repro" appears)

- Override `Copilot_Investigate.md` with `# !!!INVESTIGATE!!!`.
- Copy problem description under `# PROBLEM DESCRIPTION`.
- Add empty `# UPDATES`, `# TESTS`, `# PROPOSALS` sections.

### Continue (only when "# Continue" appears)

- Copy update to a new `## UPDATE` in `# UPDATES`.
- If the user disagrees with a proposal, mark it as `[DENIED]`.
- Continue investigation.

### Report (only when "# Report" appears)

- Finalize the investigation.
- Explain confirmed proposals, compare their strengths and weaknesses.
- Add `# !!!FINISHED!!!`.
- Stop.

## Step 2. Construct Tests

- Design test cases that reproduce the issue.
- Write them under `# TESTS`.
- Define clear success criteria: what does "fixed" look like?
- If testing is not applicable (e.g., UI-only issue), write "N/A" with explanation.

## Step 3. Confirm the Problem

- Run the tests to verify the issue is reproducible.
- If you cannot reproduce it, document why and ask for clarification.

## Step 4. Propose Solutions

- Develop multiple solution proposals.
- For each proposal:
  - Give it a number and descriptive title.
  - Describe the approach and rationale.
  - List the actual code changes under `### CODE CHANGE`.
  - Mark as `[PENDING]`.

## Step 5. Confirm Proposals

- For each `[PENDING]` proposal:
  1. Apply the code changes.
  2. Run the tests.
  3. Record results under `### RESULT`.
  4. Mark as `[CONFIRMED]` or `[DENIED]` with explanation.
  5. **Revert all code changes** before testing the next proposal.
- After all proposals are tested, add `# !!!FINISHED!!!`.
