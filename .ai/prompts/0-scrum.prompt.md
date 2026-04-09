# Scrum

- Check out `Accessing Task Documents` and `Accessing Script Files` in `.ai/config.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
  - The `Copilot_Scrum.md` file should already exist, it may or may not contain content from the last scrum.
  - If you cannot find the file, you are looking at a wrong folder.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to finish a design document in `Copilot_Scrum.md` to address a problem.
- You are only allowed to update `Copilot_Scrum.md`.
- You are not allowed to modify any other files.
- The phrasing of the request may look like asking for code change, but your actual work is to write the design document.
- "Task" in the request always means a task under the `# TASKS` section in the design document.

## Copilot_Scrum.md Structure

- `# !!!SCRUM!!!`: This file always begins with this title.
- `# DESIGN REQUEST`: An exact copy of the problem description I gave you.
- `# UPDATES`: For multiple `## UPDATE` sections. It should always exist even if there is no update.
  - `## UPDATE`: There could be multiple occurrences. Each one has an exact copy of the update description I gave you.
- `# TASKS`:
  - A bullet list of all tasks, each task is in the format of `- [ ] TASK No.X: The Task Title`.
  - `## TASK No.X: The Task Title`: A task.
    - A comprehensive description about the goal of this task.
    - `### what to be done`: A clear definition of what needs to be changed or implemented.
    - `### rationale`: Reasons about why you think it is necessary to have this task, why you think it is the best for the task to be in this order.
- `# Impact to the Knowledge Base`:
  - `## ComponentName`: What needs to be changed or added to the knowledge base for this component.

## Step 1. Identify the Problem

- The problem I would like to solve is in the chat messages sent with this request.
- Find `# Problem` or `# Update` or `# Learn` in the LATEST chat message.
  - Ignore any of these titles in the chat history.
  - If there is nothing: it means you are accidentally stopped. Please continue your work.

### Create new Document (only when "# Problem" appears in the LATEST chat message)

Ignore this section if there is no "# Problem" in the LATEST chat message.
I am starting a fresh new request.

- You should override `Copilot_Scrum.md` with only one title `# !!!SCRUM!!!`.
  - At the moment, `Copilot_Scrum.md` may contain old tasks from previous requests, even if it may look like the document is already finished for the current scrum, always clean it up.
- After overriding, copy precisely my problem description in `# Problem` from the LATEST chat message under `# DESIGN REQUEST`.
- Add an empty `# UPDATES` section after `# DESIGN REQUEST`.

### Update current Document (only when "# Update" appears in the LATEST chat message)

Ignore this section if there is no "# Update" in the LATEST chat message.
I am going to propose some change to `Copilot_Scrum.md`.

- Copy precisely my problem description in `# Update` from the LATEST chat message to the `# UPDATES` section, with a new sub-section `## UPDATE`.
- The new `## UPDATE` should be appended to the end of the existing `# UPDATES` section (before `# TASKS`).
- When the number of tasks needs to be changed, due to inserting/removing/splitting/merging tasks:
  - Adjust task numbers of unaffected tasks accordingly, throughout the document.
  - Replace the affected tasks with new content, DO NOT TOUCH unaffected tasks.
- Follow my update to change the design document.

### Learning (only when "# Learn" appears in the LATEST chat message)

Ignore this section if there is no "# Learn" in the LATEST chat message.
I made important updates to the source code manually during the execution of the last task.

- Skip every step before Step 6.
- Find the `Step 6. Learning` section for more instruction.

## Step 2. Understand the Goal and Quality Requirement

- Your goal is to help me break down the problem into small tasks, write it down to `Copilot_Scrum.md`.
- Each task should be:
  - Small enough to only represent a single idea or feature upgrade.
  - Deliver a complete piece of functionality.
  - Not mixing functionality and test cases in the same task.
    - When new tests are required, writing new test cases should be in separate tasks.
    - If test cases are better categorized and grouped, create each task per group.
    - For refactoring work, existing tests might already cover most scenarios. Carefully review them and only add new tests if necessary.
    - If you think any current test case must be updated or improved, explain why.
  - For a test planning task:
    - The test plan is about writing unit/integration tests. Do not include end-to-end tests or manual tests unless specifically requested.
    - Pure UI/visual changes (CSS, layout, animations) are hard to unit-test. You can skip the test plan for these but must provide a rationale.
    - Electron main process code that depends heavily on BrowserWindow, tray, or OS-level APIs is difficult to unit-test in isolation. Prefer E2E tests (Playwright) for these, or skip with rationale.
    - Shared logic (data transforms, XP calculations, type utilities) should always have unit tests.
    - Renderer-side hooks and state logic can be tested with vitest + React Testing Library when the logic is non-trivial.
    - You do not need to design test cases at this moment. Instead consider testability, how many existing components are affected, and whether existing tests already cover them.
  - Well ordered. At the end of each task, the project should be able to compile or pass type checks.
- During making the design document:
  - Take into consideration the knowledge base, finding anything helpful for the current problem.
  - Read through the code base carefully. The project is complicated, one small decision may have wide impact on other parts.
  - Think thoroughly.

## Step 3. Finish the Document

- Break the problem into tasks.
- In each task, describe it with a high-level and comprehensive description.
  - A task must be at least updating some code — it must not be just learning or analyzing.
  - Reading, thinking and planning is your immediate work to complete the design document.
- Following the description, there should also be:
  - `### what to be done`: A clear definition of what needs to be changed or implemented.
    - Keep it high-level. You can mention what should be done to update a certain group of files/classes, but do not include actual code.
  - `### rationale`:
    - Reasons about why this task is necessary, why this ordering is best.
    - Supporting evidence from source code or knowledge base.
      - If you can't find anything from the knowledge base, think about what can be added, but do not update it now.

### Tips about Designing

- Leverage existing code and libraries as much as you can.
- Source code is subject to modification but prefer extending over rewriting.
- The project should be organized in a modular way. In most cases you use existing code as API to complete a new feature.
- If you think any existing API should offer functionality but is currently missing something:
  - Point it out. A separate task to update it is recommended.
  - DO NOT make assumptions you can't prove from the code.
- If you have multiple proposals for a task:
  - List all of them with pros and cons.
  - You should decide which is the best one.

## Step 4. Identify Changes to Knowledge Base

- It is important to keep the knowledge base up to date.
- You must read through relevant topics in the knowledge base, including target files of hyperlinks.
- Identify if anything needs to change as tasks could impact the knowledge base.
- Identify if anything needs to be added as tasks could introduce new concepts.
- Put them under the `# Impact to the Knowledge Base` section.
- Keep the knowledge base concise — only guidelines and design insights, not code translations.
- It is fine that you find nothing to change or add.

## Step 5. Mark the Completion

- Ensure there is a `# !!!FINISHED!!!` mark at the end of `Copilot_Scrum.md`.

## Step 6. Learning (only when "# Learn" appears in the LATEST chat message)

- Ignore this section if there is no "# Learn" in the LATEST chat message.

### Step 6.1. Identify the Last Completed Task

- Identify the last completed task.
- The current `Copilot_Task.md`, `Copilot_Planning.md` and `Copilot_Execution.md` are associated to that task.

### Step 6.2. Identify My Inputs

- Read through `Copilot_Execution.md`. There may be some fixing attempts, done by you.
- Compare existing source code with `Copilot_Execution.md`, finding what is changed.
  - Don't rely on `git` to identify changes, as I always commit periodically. Compare actual source code with `Copilot_Execution.md`.
  - During comparing, take into consideration the fixing attempts, as sometimes you didn't update the main content.
- Identify all differences between the document and the source code:
  - If caused by any fixing attempts, ignore it.
  - If caused by any `# UPDATE`, ignore it.
  - If any fixing attempt was reverted:
    - It may be canceled by a further fixing attempt, ignore it.
    - Otherwise it was a user edit.
  - Any other difference is a user edit.
- If there is no `# !!!VERIFIED!!!` in `Copilot_Execution.md`, it means you failed to deliver the task. My edit will also reflect the final solution.
- Carefully read through and analyze all user edits, understand my preferences about the source code.

### Step 6.3 Write Down Findings

- If every change is ignored by the rules above, skip this step.
- Create a new file `Copilot_Execution_Finding.md` with topic `# Comparing to User Edit`.
  - Should stay in the same folder as `Copilot_Execution.md`.
- Add your findings to `Copilot_Execution_Finding.md`.

### Step 6.4 Learn

- There will be multiple `# UPDATES` or `# FIXING ATTEMPTS` or `# Comparing to User Edit` sections across the task documents.
- These files recorded how you interpreted the last completed task, and how I wanted you to adjust.
- Find out what you can learn about my philosophy and preferences.
- Check all future tasks, apply what you have learned, and adjust accordingly.
  - For each unfinished task that can be improved, update related content in `Copilot_Scrum.md`.

### Step 6.5 Backup

- You must only run this step after finishing all above steps.
- Find and execute `copilot-prepare.sh --backup`.
  - Remember the first line of the output — it has the absolute path to the backup folder.
  - This backs up and deletes `Copilot_Task.md`, `Copilot_Planning.md`, `Copilot_Execution.md`, and `Copilot_Execution_Finding.md`.
