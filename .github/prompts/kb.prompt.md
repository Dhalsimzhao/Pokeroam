# Update Knowledge Base

- Check out `Accessing Task Documents` and `Accessing Script Files` in `REPO-ROOT/.github/copilot-instructions.md` for context about mentioned `*.md` and `*.sh` files.
- All `*.md` and `*.sh` files should exist; you should not create any new files unless explicitly instructed.
  - The `Copilot_KB.md` file should already exist, it may or may not contain content from the last knowledge base writing.
  - If you cannot find the file, you are looking at a wrong folder.
- Following `Leveraging the Knowledge Base` in `REPO-ROOT/.github/copilot-instructions.md`, find knowledge and documents for this project in `REPO-ROOT/.github/KnowledgeBase/Index.md`.
  - `Index.md` below means this file.

## Goal and Constraints

- Your goal is to draft a document for the knowledge base in `Copilot_KB.md`.
- You are only allowed to update `Copilot_KB.md` and the knowledge base.
- You are not allowed to modify any other files.
- The phrasing of the request may look like asking for code change, but your actual work is to write the knowledge base document.
- Code references must be wrapped in either `single-line` or ```multi-line``` quotes.

## Copilot_KB.md Structure

- `# !!!KNOWLEDGE BASE!!!`: This file always begins with this title.
- `# DESIGN REQUEST`: The exact copy of the problem description.
- `# INSIGHT`: Your insight about the topic after deep research.
- `# ASKS`:
  - `## QUESTION`: Exact copy of a question I gave you.
  - `### ANSWER`: Your insight after deep research.
- `# DRAFT`:
  - `## DRAFT REQUEST`: Exact copy of the draft request.
  - `## IMPROVEMENTS`:
    - `### IMPROVEMENT`: Exact copy of improvement requests.
  - `## (API|DESIGN) EXPLANATION`: The title and where to put it in `Index.md`.
  - `## DOCUMENT`: The drafted KB document.

## Identify the Problem

- Find `# Topic` or `# Ask` or `# Draft` or `# Improve` or `# Execute` in the LATEST chat message.
- Ignore any of these titles in the chat history.
  - If there is nothing: it means you are accidentally stopped. Continue your work by reading `Copilot_KB.md`.

### Research on a Topic (only when "# Topic" appears)

- Override `Copilot_KB.md` with only `# !!!KNOWLEDGE BASE!!!`.
- Copy problem description under `# DESIGN REQUEST`.
- Add `# INSIGHT`, `# ASKS`, `# DRAFT` (with empty sub-sections).
- Follow `Steps for Topic` below to fill `# INSIGHT`.
- DO NOT TOUCH the `# DRAFT` part.

### Answer a Question (only when "# Ask" appears)

- Copy question to a new `## QUESTION` under `# ASKS` (before `# DRAFT`).
- Follow `Steps for Ask` below to fill `### ANSWER`.
- DO NOT TOUCH the `# DRAFT` part.

### Draft the KB Document (only when "# Draft" appears)

- Copy draft request to `## DRAFT REQUEST`.
- Follow `Steps for Draft` below.

### Improve the KB Document (only when "# Improve" appears)

- Copy improvement request to a new `### IMPROVEMENT` (before `## DOCUMENT`).
- Follow `Steps for Improve` below.

### Add the KB Document to KB (only when "# Execute" appears)

- Follow `Steps for Execute` below.

## Steps for Topic

- Complete the `# INSIGHT` section about the topic in `# DESIGN REQUEST`.
- The topic is around a feature of the project involving multiple components.
- Find out details about:
  - The entry point.
  - The core part.
  - Whether there are multiple branches/cases — find all of them.
  - Whether there are recursive calls — find the structure.
- Explain the design: architecture, component organization, execution flows, design patterns.
- Each point should provide proof from the source code.
- Keep the content compact:
  - Refer to source code by function/component name, not code snippets.
  - Do not use line numbers (code changes rapidly).
  - Focus on design and logic — why and how, not code translation.

## Steps for Ask

- Answer the question in `### ANSWER`.
- Fix `# INSIGHT` if anything is wrong.

## Steps for Draft

- Keep everything before `# DRAFT` unchanged.
- Read everything before `# DRAFT` carefully — draft based on all information there.
- Decide the document type:
  - `## API EXPLANATION (Component)` — about API usage and contracts.
  - `## DESIGN EXPLANATION (Component)` — about how APIs work together and implementation.
- Draft under `## DOCUMENT`:
  - Based entirely on source code and all findings before `# DRAFT`.
  - Use every detail from the research. Reorganize Q&A format into proper document structure.
  - Keep mentioning names (not high-level abstractions).
  - Multiple levels of markdown headings with bullet points are preferred.

## Steps for Improve

- Update `## DOCUMENT` based on improvement request.

## Steps for Execute

- Based on `## API EXPLANATION` or `## DESIGN EXPLANATION`:
  - Create a new section in `Index.md` under the appropriate project/component.
  - Use bullet points for the description.
  - Create the document file with content from `## DOCUMENT`.
- Keep `Copilot_KB.md` unchanged.
