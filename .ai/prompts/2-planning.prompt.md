# Planning

- Check out `Accessing Task Documents` and `Accessing Script Files` in `.ai/config.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
  - The `Planning.md` file should already exist.
  - If you cannot find the file, you are looking at a wrong folder.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to create a detailed implementation plan in `Planning.md` based on the design in `Task.md`.
- You are only allowed to update `Planning.md`.
- You are not allowed to modify any other files.

## Planning.md Structure

- `# !!!PLANNING!!!`: This file always begins with this title.
- `# UPDATES`: For multiple `## UPDATE` sections. Always present even if empty.
- `# AFFECTED PROJECTS`: Which parts need building/testing.
- `# EXECUTION PLAN`: Numbered steps with detailed code changes.
- `# !!!FINISHED!!!`: Marks the end.

## Step 1. Identify the Problem

- Find `# Problem` or `# Update` in the LATEST chat message.
  - Ignore any of these titles in the chat history.
  - If there is nothing: it means you are accidentally stopped. Please continue your work.

### Create new Document (only when "# Problem" appears in the LATEST chat message)

- Override `Planning.md` with only one title `# !!!PLANNING!!!`.
- Add an empty `# UPDATES` section.
- Read `Task.md` thoroughly for context and goals.
- Develop detailed planning based on the design document.

### Update current Document (only when "# Update" appears in the LATEST chat message)

- Copy precisely my update to a new `## UPDATE` sub-section in `# UPDATES`.
- Modify the planning document accordingly.

## Step 2. Create the Execution Plan

- Reference `Task.md` for the design context and goals.
- For each step in the execution plan:
  - Describe what source code modifications are needed.
  - Provide actual code proposals with explanations.
  - Explain **why** changes are necessary, not just **what** changes.
  - Avoid redundant comments for obvious code.
- The plan should include all tests that cover the changes.
  - Test plans should cover edge cases, not just happy paths.

## Step 3. Document Affected Projects

- List what needs to be built and tested in `# AFFECTED PROJECTS`.
- Specify build commands and test commands in execution order.
- Note any conditional triggers (e.g., "only if step 3 changed file X").

## Step 4. Mark the Completion

- Ensure there is a `# !!!FINISHED!!!` mark at the end of `Planning.md`.
