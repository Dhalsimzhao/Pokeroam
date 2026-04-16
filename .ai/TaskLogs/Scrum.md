# !!!SCRUM!!!

# DESIGN REQUEST

在 PMD Collab（https://sprites.pmdcollab.org/）中，Sprites 的动作类型有限，无法表达宝可梦复杂的心情，且制作新的 Sprites Sheet 成本较高。但 Portraits 部分提供了丰富的表情头像图（Normal、Happy、Angry、Sad、Surprised 等十几种），目前未被利用。

需求：
1. 使用 PMD Collab Portraits 的不同表情图，在对话框中展示。
2. 桌面上的宝可梦在触发事件或随机时刻弹出对话框，左侧显示表情头像，右侧显示文字。
3. 提供一个 JSON 文件，定义对话数据结构（表情+文本），文本由人工后续填入。

目标：让宝可梦能表达更丰富的情绪，同时避免高成本的制图工作。

# UPDATES

## UPDATE

改进当前流程，使用 TDD。将测试从最后一步前移至实现之前，对可测试的 shared 层逻辑遵循 红(写失败测试) → 绿(写实现使测试通过) 的 TDD 循环。Electron 主进程和纯 UI 组件因依赖 BrowserWindow/React 渲染，不适合单元测试，保持原有顺序。

## UPDATE

在 TASK No.6（DialogueManager）之后、事件集成之前，新增一个调试任务：在托盘菜单中添加「测试对话」子菜单，列出所有事件类型，点击即可手动触发对应的对话弹窗。目的是让用户在接入真实事件之前就能方便地调试对话框的视觉效果、表情图显示和文字排版。

# TASKS

- [x] TASK No.1: Define dialogue types
- [x] TASK No.2: Write tests for dialogue data logic (RED)
- [x] TASK No.3: Implement dialogue data logic and create JSON (GREEN)
- [x] TASK No.4: Create dialogue window (main process + renderer entry)
- [x] TASK No.5: Build dialogue UI component
- [x] TASK No.6: Create DialogueManager and wire up IPC
- [x] TASK No.7: Add dialogue debug menu to tray
- [x] TASK No.8: Integrate dialogue triggers with existing events and idle system

## TASK No.1: Define dialogue types

建立对话系统的类型基础。此任务只创建类型定义，不包含任何运行时逻辑——纯类型无需测试。

对话数据采用两层结构：`default`（所有宝可梦通用）+ `species`（物种专属覆盖），触发时物种专属优先，未定义的事件类型自动 fallback 到 default。每条对话包含 `emotion`（决定显示哪个表情头像）和 `text`（对话文本，支持 `{name}` 占位符）。

事件类型包括：`idle`（随机闲聊）、`levelup`、`evolve`、`feed`、`drag`、`fall`、`fatigue`、`dailyReward`、`greeting`（启动打招呼）、`longIdle`（长时间未互动）。

### what to be done

- 在 `src/shared/types.ts` 中添加对话相关类型：
  - `DialogueEmotion` — 表情枚举类型（`'Normal' | 'Happy' | 'Pain' | 'Angry' | 'Worried' | 'Sad' | 'Crying' | 'Shouting' | 'Teary-Eyed' | 'Determined' | 'Joyous' | 'Inspired' | 'Surprised' | 'Dizzy' | 'Sigh' | 'Stunned'`）
  - `DialogueEntry` — 单条对话（`{ emotion: DialogueEmotion; text: string }`）
  - `DialogueEventType` — 事件类型（`'idle' | 'levelup' | 'evolve' | 'feed' | 'drag' | 'fall' | 'fatigue' | 'dailyReward' | 'greeting' | 'longIdle'`）
  - `DialogueData` — 完整数据结构（`{ default: Record<DialogueEventType, DialogueEntry[]>; species: Record<string, Partial<Record<DialogueEventType, DialogueEntry[]>>> }`）

### rationale

- 类型定义是所有后续任务的编译依赖，必须最先建立。
- 将类型单独拆为一个任务是因为 TDD 流程中下一步要先写测试——测试文件需要导入这些类型才能编译，所以类型必须先于测试存在。
- 纯类型定义没有运行时行为，不需要测试（TypeScript 编译器本身就是类型的验证器）。
- 类型放在 `src/shared/types.ts`，与现有 `PetAnimState`、`SpriteSheetConfig` 等类型并列，供主进程和渲染进程共用。

## TASK No.2: Write tests for dialogue data logic (RED)

**TDD 红色阶段**：在实现任何逻辑之前，先编写 `dialogue-data.ts` 的完整测试用例。测试此时应全部失败（模块尚未实现）。

这些测试定义了对话数据查询模块的预期行为契约，包括 fallback 逻辑、随机选取、占位符替换和边界情况。

### what to be done

- 创建 `src/shared/dialogue-data.test.ts`，编写以下测试用例：
  - **fallback 逻辑**：
    - 物种专属对话存在时，`getDialogue('pikachu', 'idle')` 应从 pikachu 的 idle 列表中返回
    - 物种专属对话不存在时，`getDialogue('pikachu', 'levelup')` 应 fallback 到 default 的 levelup 列表
    - 物种完全不存在时，`getDialogue('unknown', 'idle')` 应 fallback 到 default
  - **随机选取**：
    - 同一事件类型下有多条对话时，多次调用 `getDialogue()` 应能返回不同的条目（验证随机性）
  - **占位符替换**：
    - `resolveDialogueText('{name}好！', { name: '皮卡丘' })` 应返回 `'皮卡丘好！'`
    - 多个占位符：`resolveDialogueText('{name}是{type}属性', { name: '皮卡丘', type: '电' })` 应全部替换
    - 无占位符时原文返回
  - **边界情况**：
    - 对话数组为空时，`getDialogue()` 应返回一个安全默认值（不崩溃）
    - 未知的事件类型应 fallback 到 default 或返回安全默认值
- 测试使用 vitest，可构造测试用的 mock 对话数据（不依赖实际 JSON 文件），通过依赖注入或模块 mock 将测试数据传入 `getDialogue()`。

### rationale

- **TDD 核心**：先写测试再写实现，确保每行实现代码都是由失败的测试驱动出来的，避免过度设计或遗漏边界情况。
- 此任务必须紧接 TASK No.1 之后：测试需要导入 `DialogueEventType`、`DialogueEntry` 等类型才能编译，但不需要 `dialogue-data.ts` 的实际实现。
- `dialogue-data.ts` 是纯逻辑的 shared 模块，不依赖 Electron 或 React，天然适合单元测试和 TDD。
- fallback 逻辑是对话系统的核心——如果 fallback 行为有错，可能导致空对话、崩溃或显示错误物种的文本。测试先行能确保此逻辑被严格定义。
- 占位符替换虽然简单，但缺少测试容易在后续扩展时引入 bug（如新增占位符类型时忘记处理）。

## TASK No.3: Implement dialogue data logic and create JSON (GREEN)

**TDD 绿色阶段**：实现 `dialogue-data.ts` 的查询逻辑和对话数据 JSON 文件，使 TASK No.2 中的所有测试通过。

### what to be done

- 创建 `resources/dialogues/dialogue-data.json`，按 `DialogueData` 结构填入所有事件类型的空文本条目：
  - `default` 部分：每个事件类型预设 2-3 条不同表情的对话模板（text 留空）
  - `species` 部分：为 pikachu、charmander 等代表性物种预设少量专属对话模板
- 创建 `src/shared/dialogue-data.ts`，导出以下函数：
  - `getDialogue(speciesName: string, eventType: DialogueEventType, data?: DialogueData): DialogueEntry` — 根据物种和事件类型随机选取一条对话，物种专属优先，fallback 到 default。可选 `data` 参数支持测试注入。
  - `resolveDialogueText(text: string, vars: Record<string, string>): string` — 替换 `{name}` 等占位符。
- 运行 `pnpm test` 确认 TASK No.2 的所有测试通过。
- 如有测试暴露的设计问题，在此任务中调整实现（不修改测试的预期行为）。

### rationale

- **TDD 绿色阶段**：目标是用最简单的实现使测试全部通过。测试已在 TASK No.2 中定义了行为契约，此处只需满足契约即可。
- `getDialogue()` 接受可选的 `data` 参数是为了支持测试注入——测试可以传入 mock 数据而不依赖实际 JSON 文件，这是 TASK No.2 中测试设计的要求。
- JSON 数据文件放在 `resources/` 下与现有 sprites 资源并列，符合项目资源组织规范。
- 参考 `src/shared/pokemon-data.ts` 的模式：数据定义 + 查询函数在同一模块中。
- 此任务完成后，对话系统的数据层已经过测试验证，后续任务可以放心调用。

## TASK No.4: Create dialogue window (main process + renderer entry)

创建对话框的渲染窗口，作为一个新的 BrowserWindow，与现有 pet-window、panel-window 并列。

对话窗口的特性：
- 透明、无边框、always-on-top（与 pet-window 相同）
- 尺寸约 300x100，定位在宝可梦上方
- 不可聚焦、不在任务栏显示
- 默认隐藏，由 DialogueManager 控制显隐

### what to be done

- 创建 `src/main/dialogue-window.ts`，导出 `createDialogueWindow()` 函数：
  - BrowserWindow 配置：transparent、frameless、alwaysOnTop、skipTaskbar、focusable: false、resizable: false
  - 初始位置：隐藏（show: false）
  - 使用相同的 preload 脚本
  - 加载 `dialogue.html`
- 创建 `src/renderer/dialogue.html`，参考 `pet.html` 的结构，透明背景，引用 `./src/dialogue/main.tsx`。
- 创建 `src/renderer/src/dialogue/main.tsx`，React 入口，渲染 `<App />` 组件（TASK No.5 实现，此处先放占位）。
- 修改 `electron.vite.config.ts`，在 `renderer.build.rollupOptions.input` 中添加 `dialogue` 入口。
- 在 `src/main/index.ts` 中创建 `dialogueWindow`（与 petWindow、panelWindow 并列），调用 `createDialogueWindow()`。

### rationale

- 独立 BrowserWindow 方案与现有架构一致（pet-window + panel-window + dialogue-window 三窗口模式），避免修改 pet-window 尺寸带来的 `setBounds()` 和 click-through 问题。
- 知识库 `PetWindowPositionManagement.md` 明确指出 pet-window 是 128x128 固定尺寸且必须用 `setBounds()` 更新，动态调整尺寸风险较高。
- 参考 `pet-window.ts` 和 `panel-window.ts` 的创建模式，保持代码风格一致。
- 此任务建立了渲染表面，是 UI 组件（TASK No.5）和 DialogueManager（TASK No.6）的前提。
- 不为此任务编写单元测试：BrowserWindow 创建是 Electron 平台 API 调用，依赖完整的 Electron 运行时，适合 E2E 测试而非单元测试。

## TASK No.5: Build dialogue UI component

实现对话框的 React 组件：左侧表情头像 + 右侧文字气泡，带渐入渐出动画。

Portrait 素材需要预先从 PMD Collab 下载，存放在 `resources/portraits/{speciesName}/{Emotion}.png`（如 `resources/portraits/pikachu/Happy.png`）。每个表情图为 40x40 像素 PNG。本任务仅负责 UI 渲染，不包含素材下载脚本（素材由人工下载放入）。

### what to be done

- 创建 `src/renderer/src/dialogue/App.tsx`，作为对话窗口的主组件：
  - 接收 IPC 推送的对话数据（speciesName、emotion、text）
  - 监听 `dialogue-show` 和 `dialogue-hide` IPC 事件
  - 展示时渐入动画，隐藏时渐出动画
- 创建 `src/renderer/src/dialogue/DialogueBubble.tsx`，对话气泡组件：
  - 左侧：Portrait 表情图，从 `resources/portraits/{speciesName}/{emotion}.png` 加载
  - 右侧：文字内容，支持多行
  - 视觉风格：半透明圆角背景，像素风格与 pet-window 协调
- 在 `src/preload/index.ts` 中添加对话相关 IPC 监听器（接收端）。
- 在 `src/renderer/src/env.d.ts` 中添加对话相关 API 类型声明。

### rationale

- UI 组件依赖 TASK No.4 提供的渲染表面（dialogue.html + main.tsx 入口）。
- Portrait 图片路径约定（`resources/portraits/{speciesName}/{emotion}.png`）与现有 sprites 资源组织方式一致（`resources/sprites/{speciesName}/`）。
- IPC 监听器在此任务中添加，因为 UI 组件需要接收数据来渲染——这与 `pet/App.tsx` 中 `onPetStateUpdate` 的模式一致。
- 渐入渐出动画提升用户体验，使对话框出现/消失更自然。
- 不为此任务编写单元测试：对话气泡是纯 UI/视觉组件（CSS 布局 + 动画），无复杂业务逻辑，难以通过单元测试有效验证视觉效果。

## TASK No.6: Create DialogueManager and wire up IPC

创建主进程中的 DialogueManager，负责：
1. 加载对话数据 JSON
2. 根据物种和事件类型选取对话（调用 TASK No.3 已测试通过的 `getDialogue()`）
3. 控制对话窗口的显示位置（跟随宠物）和定时关闭
4. 通过 IPC 向对话窗口推送/关闭对话

### what to be done

- 创建 `src/main/dialogue-manager.ts`：
  - `DialogueManager` 类，持有对话窗口引用和宠物窗口引用
  - `showDialogue(speciesName: string, eventType: DialogueEventType)` 方法：
    - 调用 `getDialogue()` 选取对话
    - 调用 `resolveDialogueText()` 替换占位符
    - 计算对话窗口位置（宠物窗口当前位置上方）
    - 通过 `dialogueWindow.setBounds()` 定位窗口（遵循 setBounds 规则）
    - 通过 `dialogueWindow.webContents.send('dialogue-show', data)` 推送数据
    - 显示窗口，设置 alwaysOnTop
    - 启动定时器（默认 4 秒后自动调用 `hideDialogue()`）
  - `hideDialogue()` 方法：
    - 通过 `dialogueWindow.webContents.send('dialogue-hide')` 通知关闭
    - 短暂延迟后隐藏窗口（等动画播完）
  - 防止对话重叠：新对话到来时，取消前一个的定时器
- 在 `src/main/index.ts` 中：
  - 初始化 DialogueManager，传入 dialogueWindow 和 petWindow 引用
  - 将 DialogueManager 实例暴露给后续事件集成使用

### rationale

- DialogueManager 遵循项目中其他 Manager 的模式（SaveManager、GrowthManager、FatigueDetector、DailyRewardManager），集中管理对话逻辑。
- 对话窗口位置必须跟随宠物窗口，通过 `petWindow.getPosition()` 获取当前位置并偏移。
- 窗口定位使用 `setBounds()` 而非 `setPosition()`，严格遵循知识库中的 Windows 透明窗口约束。
- 自动定时关闭 + 防重叠逻辑确保对话不会堆积或干扰用户。
- 核心数据查询逻辑（`getDialogue()`、`resolveDialogueText()`）已在 TASK No.2-3 中经过 TDD 验证，DialogueManager 只负责调用和编排，降低了此层的 bug 风险。
- 不为此任务编写单元测试：DialogueManager 重度依赖 BrowserWindow（`setBounds()`、`webContents.send()`、`show()`/`hide()`），适合 E2E 测试。

## TASK No.7: Add dialogue debug menu to tray

在托盘菜单中添加「测试对话」调试子菜单，使用户可以在接入真实事件之前手动触发任意类型的对话弹窗，方便调试对话框的视觉效果、表情图显示和文字排版。

调试菜单列出所有 `DialogueEventType` 事件类型（idle、levelup、evolve、feed、drag、fall、fatigue、dailyReward、greeting、longIdle），点击任意一项即调用 `dialogueManager.showDialogue()` 触发当前桌面宝可梦的对应对话。

此菜单仅在开发调试时使用，可在后续版本中移除或保留为隐藏功能。

### what to be done

- 修改 `src/main/tray-manager.ts` 的 `buildTrayMenu()` 函数：
  - 在 `options` 参数中新增 `onTestDialogue?: (eventType: string) => void` 回调
  - 在 Debug Overlay 菜单项之后添加「测试对话」子菜单
  - 子菜单包含 10 个事件类型选项，每个选项点击时调用 `onTestDialogue(eventType)`
- 修改 `src/main/index.ts`：
  - 在 `rebuildTray()` 中传入 `onTestDialogue` 回调
  - 回调实现：获取当前桌面宝可梦的 speciesName，调用 `dialogueManager.showDialogue(speciesName, eventType)`
- 在 `src/shared/i18n/types.ts` 的 `Locale` 接口中添加 `testDialogue: string` 字段
- 在中英文 locale 文件中添加对应翻译（如「测试对话」/「Test Dialogue」）

### rationale

- 此任务放在 TASK No.6（DialogueManager）之后，因为它依赖 DialogueManager 的 `showDialogue()` 方法。
- 放在事件集成（TASK No.8）之前，让用户在接入真实事件前就能独立调试对话框的所有视觉表现。
- 利用现有的托盘菜单系统（`tray-manager.ts`），与已有的 Debug Overlay 开关模式一致——无需引入新的 UI 入口。
- 参考 `buildTrayMenu()` 的 `options` 扩展模式（已有 `debugEnabled` 和 `onDebugToggle`），保持接口风格一致。
- 不为此任务编写单元测试：托盘菜单是 Electron 平台 API（`Menu.buildFromTemplate`），适合手动验证。

## TASK No.8: Integrate dialogue triggers with existing events and idle system

将对话系统接入现有的游戏事件和随机闲聊系统，使对话在正确的时机触发。

### what to be done

- 在 `src/main/index.ts` 的事件触发点调用 `dialogueManager.showDialogue()`：
  - `pet-level-up` 发送处（升级时）→ 触发 `'levelup'` 对话
  - `pet-evolve` 发送处（进化时）→ 触发 `'evolve'` 对话
  - `context-menu-feed` 处理后（喂食时）→ 触发 `'feed'` 对话
  - `fatigue-warning` 发送处 → 触发 `'fatigue'` 对话
  - `claim-daily-reward` 成功后 → 触发 `'dailyReward'` 对话
  - 应用启动后、宠物窗口加载完成后 → 触发 `'greeting'` 对话
- 新增拖拽和摔落的对话触发：
  - 在 `drag-move` IPC handler 中添加标记，当拖拽结束后触发 `'drag'` 对话
  - 监听宠物的 falling 状态结束后触发 `'fall'` 对话（通过新增 IPC 事件，从 pet renderer 在落地时通知 main）
- 新增随机闲聊触发：
  - 在主进程中添加一个定时器（类似 `startIdleXpTick` 模式），每 2-5 分钟检查一次，随机决定是否触发 `'idle'` 对话
  - 仅在宠物在桌面上（activePokemonId 存在）时触发
- 新增 `longIdle` 触发：
  - 在主进程中跟踪最后一次用户交互时间（键盘事件、拖拽等）
  - 超过一定时间（如 10 分钟）未交互时，触发一次 `'longIdle'` 对话
- 需要获取当前宝可梦的 speciesName 传入 `showDialogue()`，通过 `getSpeciesById()` 从 saveData 中查找。

### rationale

- 这是整个功能的最后一步——前七个任务建立了数据（经 TDD 验证）、窗口、UI、管理器和调试入口，此任务将它们全部串联到真实的游戏事件中。
- 事件触发点的选择基于对 `src/main/index.ts` 的仔细阅读：
  - `pet-level-up` 在 `use-item`（rare-candy）和 `growthManager.tickIdle/addKeyboardXp` 的 broadcast 中触发。
  - `pet-evolve` 在 `use-item` 的进化石和等级进化检查中触发。
  - `fatigue-warning` 在 `startIdleXpTick` 的定时检查中触发。
  - `context-menu-feed` 在右键菜单中触发（但具体的喂食逻辑在 pet renderer 处理，需要通过 IPC 回传结果）。
- 随机闲聊放在主进程而非渲染进程的 `useIdleEvents`，因为：
  - 对话内容需要访问物种数据和对话 JSON，这些数据在主进程更容易管理
  - 对话窗口的显隐控制在主进程
  - 避免在渲染进程增加复杂度
- `longIdle` 检测复用现有 `keyboardMonitor` 的交互数据，避免重复实现。
- 不为此任务编写单元测试：事件集成是在主进程中的各个 IPC handler 和定时器中插入调用，高度依赖 Electron 运行时，适合 E2E 或手动验证。

# Impact to the Knowledge Base

## Main Process

需要新增一条关于对话系统架构的知识库条目，涵盖：
- 三窗口架构升级为 pet-window + panel-window + dialogue-window
- DialogueManager 的职责和对话窗口定位策略
- 对话触发点列表及其在 `index.ts` 中的位置

`PetWindowPositionManagement.md` 可能需要更新，提及对话窗口与宠物窗口的位置联动关系。

## Shared

需要新增一条关于对话数据系统的知识库条目，涵盖：
- 对话数据 JSON 的两层结构（default + species fallback）
- 事件类型列表和含义
- Portrait 资源的组织约定（`resources/portraits/{speciesName}/{Emotion}.png`）

# !!!FINISHED!!!
