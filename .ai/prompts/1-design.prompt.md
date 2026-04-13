# Design

- Check out `Accessing Task Documents` and `Accessing Script Files` in `.ai/config.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
  - The `Task.md` file should already exist.
  - If you cannot find the file, you are looking at a wrong folder.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to create an architecture-level design in `Task.md` — not implementation details.
- You are only allowed to update `Task.md`.
- You are not allowed to modify any other files.
- The phrasing of the request may look like asking for code change, but your actual work is to write the design document.
- The design should explain **what** changes and **why**, with supporting evidence from code or the knowledge base.

## Task.md Structure

- `# !!!TASK!!!`: This file always begins with this title.
- `# PROBLEM DESCRIPTION`: An exact copy of the problem description.
- `# UPDATES`: For multiple `## UPDATE` sections. Always exists even if empty.
  - `## UPDATE`: Each one has an exact copy of the update description.
- `# INSIGHTS AND REASONING`: Your analysis of the problem, affected components, and design decisions.
- `# AFFECTED PROJECTS`: Which parts of the project need building/testing after changes.
- `# !!!FINISHED!!!`: Marks the end of the document.

## Step 1. Identify the Problem

- Find `# Problem` or `# Update` in the LATEST chat message.
  - Ignore any of these titles in the chat history.
  - If there is nothing: it means you are accidentally stopped. Please continue your work.

### Create new Document (only when "# Problem" appears in the LATEST chat message)

Ignore this section if there is no "# Problem" in the LATEST chat message.

- Find and execute `prepare.sh` to create a fresh `Task.md`.
- Copy precisely my problem description from the LATEST chat message under `# PROBLEM DESCRIPTION`.
- Add an empty `# UPDATES` section.
- Mark the corresponding task in `Scrum.md` as taken with `[x]`.

### Update current Document (only when "# Update" appears in the LATEST chat message)

Ignore this section if there is no "# Update" in the LATEST chat message.

- Copy precisely my update description to a new `## UPDATE` sub-section in `# UPDATES`.
- Modify the design document according to my update.

## Step 2. Design Analysis

- Read the code base thoroughly to understand the affected areas.
- Leverage existing APIs and patterns — do not reinvent.
- If existing APIs are missing needed functionality, flag it explicitly.
- Never assume capabilities you can't prove from the code.
- Present multiple proposals with pros/cons when applicable.

## Step 3. Document Results

- Write your findings and reasoning in `# INSIGHTS AND REASONING`.
- List affected parts of the project in `# AFFECTED PROJECTS`, with:
  - What build commands to run
  - What tests to run (if applicable)
  - Any conditional steps

## Step 4. Mark the Completion

- Ensure there is a `# !!!FINISHED!!!` mark at the end of `Task.md`.
