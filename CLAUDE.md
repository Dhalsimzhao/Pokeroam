# CLAUDE.md

- Read `.ai/config.md` before starting any work. It contains project architecture, commands, coding conventions, tool configurations, and knowledge base access.
- If any `*.prompt.md` file is referenced, take immediate action following the instructions in that file.

## AI-Assisted Development Workflow

### Step 1. Load the Correct Prompt

Check the **first word** of my request to determine which prompt file to follow. Both English and Chinese triggers are accepted:

| English | 中文 | Prompt file | Purpose |
|---------|------|-------------|---------|
| `scrum` | `拆解` | `.ai/prompts/0-scrum.prompt.md` | Break down a problem into tasks |
| `design` | `设计` | `.ai/prompts/1-design.prompt.md` | Architecture-level design |
| `plan` | `规划` | `.ai/prompts/2-planning.prompt.md` | Detailed implementation planning |
| `summarize` | `摘要` | `.ai/prompts/3-summarizing.prompt.md` | Create execution summary |
| `execute` | `执行` | `.ai/prompts/4-execution.prompt.md` | Apply code changes |
| `verify` | `验证` | `.ai/prompts/5-verifying.prompt.md` | Build & test verification |
| `review` | `评审` | `.ai/prompts/review.prompt.md` | Multi-model review board |
| `refine` | `提炼` | `.ai/prompts/refine.prompt.md` | Extract learnings from completed tasks |
| `kb` | `知识库` | `.ai/prompts/kb.prompt.md` | Knowledge base management |
| `investigate` | `排查` | `.ai/prompts/investigate.prompt.md` | Bug investigation |

If the first word is not recognized, treat it as a normal conversation — no prompt file needed.

Special case: `execute and verify` / `执行并验证` — run execution first, then verification sequentially.

### Step 2. Transform the Request

The **second word** becomes a markdown header (`# Word`) passed to the prompt file. Both English and Chinese second words are accepted — always transform to the English header.

| Command | 中文等价 | Transforms to | Action |
|---------|---------|---------------|--------|
| `scrum problem ...` | `拆解 新 ...` | `# Problem ...` | Create new scrum, break into tasks |
| `scrum update ...` | `拆解 更新 ...` | `# Update ...` | Modify existing tasks |
| `scrum learn` | `拆解 学习` | `# Learn` | Extract learnings from user edits |
| `design problem ...` | `设计 新 ...` | `# Problem ...` | Create new architecture design |
| `design update ...` | `设计 更新 ...` | `# Update ...` | Modify existing design |
| `plan problem ...` | `规划 新 ...` | `# Problem ...` | Create new implementation plan |
| `plan update ...` | `规划 更新 ...` | `# Update ...` | Modify existing plan |
| `summarize problem ...` | `摘要 新 ...` | `# Problem ...` | Create new execution summary |
| `summarize update ...` | `摘要 更新 ...` | `# Update ...` | Modify existing summary |
| `execute` | `执行` | *(no transform)* | Apply code changes from execution doc |
| `execute update ...` | `执行 更新 ...` | `# Update ...` | Apply with modifications |
| `verify` | `验证` | *(no transform)* | Build & test verification |
| `execute and verify` | `执行并验证` | *(both sequentially)* | Execute then verify |
| `review scrum` | `评审 拆解` | `# Scrum` | Review task breakdown |
| `review design` | `评审 设计` | `# Design` | Review architecture design |
| `review plan` | `评审 规划` | `# Plan` | Review implementation plan |
| `review summary` | `评审 摘要` | `# Summary` | Review execution summary |
| `review final` | `评审 定稿` | `# Final` | Consolidate all reviews |
| `review apply` | `评审 应用` | `# Apply` | Apply review feedback to target doc |
| `refine` | `提炼` | *(no transform)* | Extract learnings from backup logs |
| `kb topic ...` | `知识库 主题 ...` | `# Topic ...` | Research a topic for KB |
| `kb ask ...` | `知识库 问 ...` | `# Ask ...` | Ask a follow-up question |
| `kb draft ...` | `知识库 草稿 ...` | `# Draft ...` | Draft KB document |
| `kb improve ...` | `知识库 改进 ...` | `# Improve ...` | Improve existing KB draft |
| `kb execute` | `知识库 写入` | `# Execute` | Write KB draft into knowledge base |
| `investigate repro ...` | `排查 复现 ...` | `# Repro ...` | Start fresh bug investigation |
| `investigate continue ...` | `排查 继续 ...` | `# Continue ...` | Continue with new info |
| `investigate report` | `排查 报告` | `# Report` | Finalize investigation report |

If the first word is not in this table, treat it as a normal conversation.

### Step 3. Resolve File References

If the request contains a file path (e.g., `@docs/plans/feature.md` or just `docs/plans/feature.md`), read that file and use its content as the problem/update description. The `@` prefix is optional.

Examples:
- `scrum problem @docs/plans/evolution-animation.md` → read the file, treat its content as the `# Problem` description
- `拆解 新 docs/plans/evolution-animation.md` → same effect
- `scrum problem 我想添加进化动画` → inline text, no file to read

When a file is referenced:
1. Read the file content
2. Use the full file content as the body after the transformed header (`# Problem`, `# Update`, etc.)

When no file is referenced, use the remaining text after the second word as the description body.

### Step 4. Execute

Read the referenced prompt file, pass the transformed request, and begin work immediately.
