# Refine

- Check out `Accessing Script Files` in `.ai/config.md` for context about mentioned `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to extract learnings from completed task logs and write them to learning files.
- The `KnowledgeBase` and `Learning` folders are in `.ai/`.
- You are not allowed to modify any source code.
- Write learnings to these files, including not only best practices but the user's preferences:
  - `KnowledgeBase/Learning.md`: Learnings that apply across projects (general best practices).
  - `Learning/Learning_Coding.md`: Learnings specific to this project's source code.
  - `Learning/Learning_Testing.md`: Learnings specific to this project's test code.
- Put learnings in `Learning/` instead of `KnowledgeBase/` when the knowledge is specific to this project.

## Document Structure (Learning.md, Learning_Coding.md, Learning_Testing.md)

- `# !!!LEARNING!!!`: This file always begins with this title.
- `# Orders`: Bullet points of each learning and its counter: `- TITLE [COUNTER]`.
- `# Refinements`:
  - `## Title`: Learning and its actual content.

## Step 1. Find the Earliest Backup Folder

- Execute `copilot-prepare.sh --earliest` to get the path to the earliest backup folder.
- If the script fails, there is no material to learn from — stop.

## Step 2. Read All Documents

- Read all files in the earliest backup folder. These may include:
  - `Copilot_Task.md`
  - `Copilot_Planning.md`
  - `Copilot_Execution.md`
  - `Copilot_Execution_Finding.md`

## Step 3. Extract Findings

- Focus on:
  - All `## UPDATE` sections across documents.
  - `# Comparing to User Edit` from `Copilot_Execution_Finding.md`.
- Identify learnings about:
  - Best practices and coding preferences.
  - Mistakes made and corrections applied.
  - Patterns the user prefers or dislikes.
  - Insights into the user's philosophy about code quality, style, or approach.

## Step 4. Write Learnings

- For each finding, determine the appropriate file based on categorization in `Goal and Constraints`.
- Each finding must have a short title including the key idea.
  - This will be read by you in the future. Ensure title and content include enough constraints so you know clearly what it covers.
  - When mentioning a function name, if the naming is too general, include its class/module/namespace.
- Determine if the finding is new or matches an existing learning:
  - **New**: Add `- TITLE [1]` to `# Orders` and a new `## Title` section under `# Refinements`.
  - **Existing**: Increase its counter.
    - If the finding does not conflict with existing content, modify the content.
    - If it conflicts, keep the counter but update the content (the user improved and has a different idea now).
- Keep `# Orders` sorted by counter in descending order.

## Step 5. Delete the Processed Folder

- After all learnings are written, delete the earliest backup folder that was processed.
