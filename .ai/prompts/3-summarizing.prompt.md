# Summarizing

- Check out `Accessing Task Documents` and `Accessing Script Files` in `.ai/config.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
  - The `Execution.md` file should already exist.
  - If you cannot find the file, you are looking at a wrong folder.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to create a self-contained execution document in `Execution.md` from `Planning.md`.
- You are only allowed to update `Execution.md`.
- You are not allowed to modify any other files.
- All changes you need to make are already in `Planning.md`.

## Execution.md Structure

- `# !!!EXECUTION!!!`: This file always begins with this title.
- `# UPDATES`: For multiple `## UPDATE` sections. Always present even if empty.
- `# AFFECTED PROJECTS`: Build/test specifications.
- `# EXECUTION PLAN`: Code changes with complete context.
- `# FIXING ATTEMPTS`: (added during execution if fixes are needed)
- `# !!!FINISHED!!!`: Marks the end.

## Step 1. Identify the Problem

- Find `# Problem` or `# Update` in the LATEST chat message.
  - Ignore any of these titles in the chat history.
  - If there is nothing: it means you are accidentally stopped. Please continue your work.

### Create new Document (only when "# Problem" appears)

- Override `Execution.md` with only one title `# !!!EXECUTION!!!`.
- Add an empty `# UPDATES` section.
- Transfer the execution plan from `Planning.md`.

### Update current Document (only when "# Update" appears)

- Copy precisely my update to a new `## UPDATE` sub-section.
- Modify the execution document accordingly.

## Step 2. Transfer the Execution Plan

- Copy all code blocks exactly from `Planning.md`.
- Remove only the explanatory text between code blocks that isn't needed for execution.
- For each code block, include complete context:
  - Target file path
  - Location in the file (function name, surrounding code)
  - The complete code change
- Split code blocks that span multiple files or locations.
- Expand incomplete blocks to show full context.
- Never omit actual code — include everything from the planning document.

## Step 3. Quality Check

Ask yourself: Is `Execution.md` self-contained enough that someone can follow it to make actual code changes, without having to refer to `Planning.md`?

If not, add the missing context.

## Step 4. Mark the Completion

- Ensure there is a `# !!!FINISHED!!!` mark at the end of `Execution.md`.
