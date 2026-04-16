# !!!INVESTIGATE!!!

# PROBLEM DESCRIPTION

对话框需要跟随宠物一起移动。当前 `DialogueManager.showDialogue()` 仅在显示时通过 `setBounds()` 定位一次。之后宠物通过 `set-pet-position`（物理 tick ~60fps）和 `drag-move`（拖拽）持续移动，但对话窗口位置不再更新。

# UPDATES

# TESTS

N/A — 这是 UI 窗口跟随行为，涉及 BrowserWindow 的 `setBounds()` 调用，无法通过单元测试验证。需要手动验证：启动应用 → 触发对话 → 观察宠物行走时对话框是否跟随移动。

成功标准：对话框在显示期间（~4秒）始终保持在宠物上方，包括行走和拖拽时。

# PROPOSALS

## PROPOSAL No.1: Add updatePosition() to DialogueManager, call from pet position handlers [CONFIRMED]

在 DialogueManager 中添加 `updatePosition()` 方法和 `visible` 标志。当对话框可见时，在 `set-pet-position` 和 `drag-move` 的 IPC handler 中调用 `dialogueManager.updatePosition()` 同步位置。

优势：
- 与宠物位置更新完全同步（共享同一 IPC 触发点）
- 无额外定时器
- 逻辑简单，复用已有的位置计算

劣势：
- 每帧多一次 `setBounds()` 调用（开销可忽略，与宠物 `setBounds` 同量级）

### CODE CHANGE

**File: `src/main/dialogue-manager.ts`**

添加 `private visible = false` 标志和 `updatePosition()` 方法：
- `showDialogue()` 中设 `visible = true`
- `hideDialogue()` 隐藏窗口后设 `visible = false`
- `updatePosition()` 检查 `visible`，若可见则读取 petWindow 位置并更新 dialogueWindow

**File: `src/main/index.ts`**

在 `set-pet-position` 和 `drag-move` handler 末尾调用 `dialogueManager.updatePosition()`。

### RESULT

代码分析确认此方案正确：
1. 位置计算逻辑与 `showDialogue()` 一致（居中于宠物上方 + workArea 边界 clamp）
2. `visible` 标志确保仅在对话可见时执行 `setBounds()`，无隐藏时的开销
3. 覆盖两条位置更新路径：物理 tick（`set-pet-position`）和拖拽（`drag-move`）

## PROPOSAL No.2: Interval-based polling in DialogueManager [DENIED]

在 `showDialogue()` 启动 16ms 间隔定时器轮询 petWindow 位置，`hideDialogue()` 时清除。

被否决原因：
- 引入额外定时器，增加复杂度
- 与宠物位置更新存在微小时间差（最多 16ms 延迟）
- 不如 Proposal 1 直接挂载到同一 IPC 触发点精确

# !!!FINISHED!!!
