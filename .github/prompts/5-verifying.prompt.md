# Verifying

- Check out `Accessing Task Documents` and `Accessing Script Files` in `REPO-ROOT/.github/copilot-instructions.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
  - The `Copilot_Execution.md` file should already exist.
  - If you cannot find the file, you are looking at a wrong folder.
- Following `Leveraging the Knowledge Base` in `REPO-ROOT/.github/copilot-instructions.md`, find knowledge and documents for this project in `REPO-ROOT/.github/KnowledgeBase/Index.md`.

## Goal and Constraints

- All instructions in `Copilot_Execution.md` should have been applied to the source code. Your goal is to verify it.
- You must ensure the source code compiles (type checks pass).
- You must ensure all tests pass (if applicable).
- Until everything passes, ensure there is a `# !!!VERIFIED!!!` mark at the end of `Copilot_Execution.md`.

## Step 1. Check and Respect My Code Changes

- If you spot any difference between `Copilot_Execution.md` and the source code:
  - **It means I edited them. I have my reason. DO NOT change the code to match `Copilot_Execution.md`.**
  - Write down every difference you spotted, make a `## User Update Spotted` section in the `# UPDATES` section in `Copilot_Execution.md`.

This is critical — the user's manual edits always take priority over the execution document.

## Step 2. Make Sure the Code Compiles

- Each attempt of build-fix process should be executed in a sub agent.
  - One build-fix process includes one attempt with the following instructions.
  - The main agent should call a different sub agent for each build-fix process.
  - Do not build and retrieve build results in the main agent.

### Use a sub agent for the following instructions

#### Build the Project

- Check `# AFFECTED PROJECTS` in `Copilot_Execution.md` to find what to build.
- Run the build/typecheck command and check for errors and warnings.

#### Fix Compile Errors

- If there are compilation errors, address all of them:
  - Only fix warnings caused by your code change, not pre-existing ones.
  - Carefully identify whether the issue is in the callee side or the caller side. Check similar code before deciding.
  - For every attempt of fixing:
    - Explain why the original change did not work.
    - Explain what you need to do.
    - Explain why you think it would solve the build break.
    - Log these in `Copilot_Execution.md`, with section `## Fixing attempt No.<attempt_number>` in `# FIXING ATTEMPTS`.

#### Code Generation

- Check if any code generation is necessary.
- If needed, run the appropriate commands.

#### Finishing

- Exit the current sub agent and tell the main agent to go back to `Step 2`.

## Step 3. Run Tests

- Each attempt of test-fix process should be executed in a sub agent.
  - The main agent should call a different sub agent for each test-fix process.
  - Do not test and retrieve results in the main agent.

### Use a sub agent for running and fixing tests

#### Execute Tests

- Run unit tests: `pnpm test`
- Run E2E tests (if affected): `pnpm test:e2e`
- Check `# AFFECTED PROJECTS` in `Copilot_Execution.md` for which tests to run.
- Make sure any newly added test cases are actually executed.

#### Identify the Cause of Failure

- Refer to `Copilot_Task.md` and `Copilot_Planning.md` for context, keep the target unchanged.
- Dig into related source code carefully, make your assumption about the root cause.
- Use `console.log()` to verify code paths and variable values.
- When you have made a few guesses without progress, try a more systematic approach — add logging at each branching point.
- Even when a failure is not related to your change, take care of it.

#### Fix Failed Tests

- Apply fixes to source files. DO NOT delete any test case.
- For every attempt of fixing:
  - Explain why the original change did not work.
  - Explain what you need to do.
  - Explain why you think it would solve the test break.
  - Log these in `Copilot_Execution.md`, with section `## Fixing attempt No.<attempt_number>` in `# FIXING ATTEMPTS`.
- After fixing, exit the sub agent and tell the main agent to go back to `Step 2. Make Sure the Code Compiles`.

## Step 4. Check it Again

- Go back to `Step 2. Make Sure the Code Compiles`, follow all instructions and all steps again.
- When everything passes, add `# !!!VERIFIED!!!` to the end of `Copilot_Execution.md`.
