# Knowledge Base Index — PokéRoam

## Main Process

### Design Explanation

#### Pet Window Position Management
- Position update pipeline: renderer physics → IPC → main process `setBounds()`
- **Critical**: Must use `setBounds()` not `setPosition()` on Windows — transparent windows grow width with `setPosition()`
- Three call sites: physics tick (60Hz), drag-move, periodic bounds check (5s)
- Dual-level boundary clamping: renderer-side velocity reversal + main-side coordinate clamping
- Click-through: 16ms cursor polling against hit regions reported every 500ms
- Debug tooling: tray-menu overlay + Playwright dimension monitor script
- [Design Explanation](MainProcess/PetWindowPositionManagement.md)

### Choosing APIs

{{SLOT_KB_MAIN_APIS: Add API documentation entries here as needed.}}

## Renderer — Pet

### Design Explanation

{{SLOT_KB_PET_RENDERER: Add knowledge base entries about the pet renderer here.}}

### Choosing APIs

{{SLOT_KB_PET_APIS: Add API entries here.}}

## Renderer — Panel

### Design Explanation

{{SLOT_KB_PANEL_RENDERER: Add knowledge base entries about the panel renderer here.}}

### Choosing APIs

{{SLOT_KB_PANEL_APIS: Add API entries here.}}

## Shared

### Design Explanation

{{SLOT_KB_SHARED: Add knowledge base entries about shared code here.}}

### Choosing APIs

{{SLOT_KB_SHARED_APIS: Add API entries here.}}
