# 宝可梦表情对话系统

## 背景

PMD Collab（https://sprites.pmdcollab.org/）提供了 Sprites 和 Portraits 两类素材：
- **Sprites**：动作精灵图（Idle、Walk、Sleep 等），目前已在项目中使用，但动作种类有限
- **Portraits**：表情头像图，每个宝可梦有十几种不同表情（Normal、Happy、Angry、Sad、Surprised 等），目前未被使用

制作新的 Sprites Sheet 成本很高，而 Portraits 已有丰富的表情资源可以直接利用。通过引入表情对话框系统，可以让桌面宝可梦表达更丰富的情感，而不需要额外制图。

## 需求描述

### 核心功能

桌面宠物在特定事件触发或随机时刻弹出一个对话框，对话框左侧显示宝可梦的表情头像，右侧显示文字内容。

### 对话框 UI

```
┌────────────────────────────────┐
│ ┌──────┐                       │
│ │      │  对话文本内容...       │
│ │ 表情 │  可以有多行文字        │
│ │      │                       │
│ └──────┘                       │
└────────────────────────────────┘
```

- 对话框出现在宝可梦的上方（或附近合适的位置）
- 左侧为 Portrait 表情图（从 PMD Collab 获取）
- 右侧为对话文本
- 对话框在一定时间后自动消失，或用户点击后关闭

### 表情素材来源

使用 PMD Collab 的 Portrait 资源。每个宝可梦有以下常见表情（不同宝可梦可用表情数量不同）：

| 表情 ID | 英文名 | 含义 |
|---------|--------|------|
| Normal | Normal | 普通 |
| Happy | Happy | 开心 |
| Pain | Pain | 痛苦 |
| Angry | Angry | 生气 |
| Worried | Worried | 担忧 |
| Sad | Sad | 难过 |
| Crying | Crying | 哭泣 |
| Shouting | Shouting | 呐喊 |
| Teary-Eyed | Teary-Eyed | 泪目 |
| Determined | Determined | 坚定 |
| Joyous | Joyous | 喜悦 |
| Inspired | Inspired | 受鼓舞 |
| Surprised | Surprised | 惊讶 |
| Dizzy | Dizzy | 眩晕 |
| Sigh | Sigh | 叹气 |
| Stunned | Stunned | 震惊 |

素材存放路径建议：`resources/portraits/{species}/` 下按表情命名（如 `Normal.png`、`Happy.png`）。

### 触发机制

对话框可以在以下场景触发：

1. **随机闲聊**：宝可梦在桌面上闲逛时，随机弹出一段话（类似现有 `useIdleEvents` 的随机事件机制）
2. **事件触发**：特定游戏事件发生时弹出，例如：
   - 升级时
   - 进化时
   - 喂食时
   - 被拖拽/摔落时
   - 疲劳警告时
   - 每日奖励时
   - 刚启动程序时（打招呼）
   - 长时间未互动时

### 对话数据格式（JSON）

提供一个 JSON 文件，按宝可梦物种和事件类型组织对话数据，后续由人工填入对话文本。

```jsonc
{
  // 默认对话（所有宝可梦通用，当该物种没有专属对话时使用）
  "default": {
    // 随机闲聊
    "idle": [
      { "emotion": "Normal", "text": "" },
      { "emotion": "Happy", "text": "" },
      { "emotion": "Sigh", "text": "" }
    ],
    // 事件触发
    "levelup": [
      { "emotion": "Joyous", "text": "" },
      { "emotion": "Happy", "text": "" }
    ],
    "evolve": [
      { "emotion": "Determined", "text": "" },
      { "emotion": "Surprised", "text": "" }
    ],
    "feed": [
      { "emotion": "Happy", "text": "" },
      { "emotion": "Joyous", "text": "" }
    ],
    "drag": [
      { "emotion": "Surprised", "text": "" },
      { "emotion": "Dizzy", "text": "" }
    ],
    "fall": [
      { "emotion": "Pain", "text": "" },
      { "emotion": "Stunned", "text": "" }
    ],
    "fatigue": [
      { "emotion": "Worried", "text": "" },
      { "emotion": "Sad", "text": "" }
    ],
    "dailyReward": [
      { "emotion": "Happy", "text": "" },
      { "emotion": "Joyous", "text": "" }
    ],
    "greeting": [
      { "emotion": "Happy", "text": "" },
      { "emotion": "Normal", "text": "" }
    ],
    "longIdle": [
      { "emotion": "Sad", "text": "" },
      { "emotion": "Worried", "text": "" }
    ]
  },

  // 物种专属对话（覆盖 default 中的对应条目）
  "species": {
    "pikachu": {
      "idle": [
        { "emotion": "Happy", "text": "" },
        { "emotion": "Inspired", "text": "" }
      ],
      "greeting": [
        { "emotion": "Joyous", "text": "" }
      ]
      // 未定义的事件类型 fallback 到 default
    },
    "charmander": {
      "idle": [
        { "emotion": "Normal", "text": "" },
        { "emotion": "Determined", "text": "" }
      ]
    }
    // ... 其他宝可梦
  }
}
```

**设计要点**：
- 每个事件类型下有一个数组，触发时随机选取一条
- `emotion` 字段决定左侧显示哪个表情图
- `text` 字段为对话文本，后续人工填入
- 物种专属对话优先于默认对话；未定义的事件类型自动 fallback 到 `default`
- `text` 支持 `{name}` 占位符，运行时替换为宝可梦的中文名

### 技术实现要点

1. **Portrait 资源管理**
   - 从 PMD Collab 下载所需宝可梦的 Portrait 图片
   - 存放在 `resources/portraits/{species}/` 下
   - 图片为 40x40 像素的 PNG

2. **对话框窗口方案**
   - 方案 A：在现有 pet-window 中渲染对话框（pet-window 尺寸需要动态调整）
   - 方案 B：创建一个新的 dialogue-window（独立的 BrowserWindow，更灵活）
   - 推荐方案 B，与现有架构（pet-window + panel-window）一致

3. **对话框组件**
   - React 组件，包含表情图 + 文字气泡
   - 自动定位到宝可梦上方
   - 显示时长可配置（默认 3-5 秒）
   - 渐入渐出动画

4. **事件集成**
   - 在现有 IPC 事件（`pet-level-up`、`pet-evolve`、`fatigue-warning` 等）中添加对话触发
   - 在 `useIdleEvents` 中添加随机闲聊触发
   - 新增 `greeting` 和 `longIdle` 事件检测

## 非目标（不在本次范围内）

- 不制作新的 Sprites Sheet
- 不实现对话选择/分支系统
- 不实现宝可梦之间的对话

## 参考

- PMD Collab Sprites & Portraits：https://sprites.pmdcollab.org/
- 现有随机事件系统：`src/renderer/src/pet/useIdleEvents.ts`
- 现有 IPC 事件：`pet-level-up`、`pet-evolve`、`fatigue-warning`、`save-data-changed`
