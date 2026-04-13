# Execution

- Check out `Accessing Task Documents` and `Accessing Script Files` in `.ai/config.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
- Following `Leveraging the Knowledge Base` in `.ai/config.md`, find knowledge and documents for this project in `.ai/KnowledgeBase/Index.md`.

## Goal and Constraints

- Your goal is to apply all code changes described in `Execution.md` to the actual source code.
- You must ensure the source code compiles (type checks pass).
- You must ensure all tests pass (if applicable).
- You should follow `Execution.md` as closely as possible, but use your judgment for obvious errors.

## Step 1. Identify the Problem

- Find `# Update` in the LATEST chat message.
  - If an update appears, add it to `Execution.md` and modify source code accordingly.
  - If no update exists, proceed with executing the plan already documented.

## Step 2. Apply Code Changes

- Follow the `# EXECUTION PLAN` in `Execution.md` step by step.
- Apply each code change to the specified file and location.
- Mark completed steps with `[DONE]` annotations in `Execution.md`.

## Step 3. Make Sure the Code Compiles

- Each attempt of build-fix process should be executed in a sub agent.
  - One build-fix process includes one attempt with the following instructions.
  - The main agent should call different sub agent for each build-fix process.
  - Do not build and retrieve build results in the main agent.

### Use a sub agent for building and fixing

#### Build the Project

- Check `# AFFECTED PROJECTS` in `Execution.md` to find what to build.
- Run the build/typecheck command and check for errors.

#### Fix Compile Errors

- If there are compilation errors, address all of them:
  - Only fix warnings caused by your code change, not pre-existing ones.
  - Carefully identify whether the issue is in the callee side or the caller side. Check similar code before deciding.
  - For every attempt of fixing:
    - Explain why the original change did not work.
    - Explain what you need to do.
    - Explain why you think it would solve the build break.
    - Log these in `Execution.md`, with section `## Fixing attempt No.<attempt_number>` in `# FIXING ATTEMPTS`.

#### Code Generation

- Check if any code generation is necessary (see `Execution.md` and `config.md`).
- If code generation is needed, run the appropriate commands.

#### Finishing

- Exit the sub agent and tell the main agent to go back to `Step 3. Make Sure the Code Compiles`.

## Step 4. Run Tests

- Each attempt of test-fix process should be executed in a sub agent.
  - The main agent should call a different sub agent for each test-fix process.
  - Do not test and retrieve results in the main agent.

### Use a sub agent for running and fixing tests

#### Execute Tests

- Run unit tests: `pnpm test`
- Run E2E tests (if affected): `pnpm test:e2e`
- Check `# AFFECTED PROJECTS` in `Execution.md` to determine which tests to run.
- Make sure any newly added test cases are actually executed.

#### Fix Failed Tests

- If any test fails:
  - Identify the cause by reading relevant source code and test expectations.
  - Use `console.log()` or debugger as needed.
  - Apply fixes to source files. DO NOT delete any test case.
  - For every attempt of fixing:
    - Explain why the original change did not work.
    - Explain what you need to do.
    - Explain why you think it would solve the test break.
    - Log these in `Execution.md`, with section `## Fixing attempt No.<attempt_number>` in `# FIXING ATTEMPTS`.
- After fixing, exit the sub agent and tell the main agent to go back to `Step 3. Make Sure the Code Compiles`.

## Step 5. Code Quality

- Verify indentation matches surrounding code style.
- Ensure line breaks follow project conventions.
- Remove whitespace from empty lines.
- Only modify existing files; don't create new ones unless explicitly instructed.

## Step 6. Check it Again

- Go back to `Step 3. Make Sure the Code Compiles`, follow all instructions again.
- When everything compiles and all tests pass, you are done.
