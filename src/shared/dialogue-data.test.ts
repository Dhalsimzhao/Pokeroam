import { describe, it, expect } from 'vitest'
import { getDialogue, resolveDialogueText } from './dialogue-data'
import type { DialogueData } from './types'

/** Standard mock data for most tests */
const mockData: DialogueData = {
  default: {
    idle: [
      { emotion: 'Normal', text: '在想什么呢...' },
      { emotion: 'Happy', text: '今天天气真好！' }
    ],
    levelup: [
      { emotion: 'Joyous', text: '{name}升级了！' }
    ],
    evolve: [
      { emotion: 'Determined', text: '{name}在进化！' }
    ],
    feed: [
      { emotion: 'Happy', text: '好吃！' }
    ],
    drag: [
      { emotion: 'Surprised', text: '哇！' }
    ],
    fall: [
      { emotion: 'Pain', text: '好痛...' }
    ],
    fatigue: [
      { emotion: 'Worried', text: '该休息了' }
    ],
    dailyReward: [
      { emotion: 'Joyous', text: '有奖励！' }
    ],
    greeting: [
      { emotion: 'Happy', text: '你好！' }
    ],
    longIdle: [
      { emotion: 'Sad', text: '好无聊...' }
    ],
    moodHappy: [
      { emotion: 'Happy', text: '心情真好！' }
    ],
    moodEat: [
      { emotion: 'Joyous', text: '好吃！' }
    ],
    moodSleep: [
      { emotion: 'Sigh', text: 'Zzz...' }
    ]
  },
  species: {
    pikachu: {
      idle: [
        { emotion: 'Inspired', text: 'Pika!' },
        { emotion: 'Happy', text: 'Pikachu!' },
        { emotion: 'Joyous', text: 'Pika pika!' }
      ]
    }
  }
}

/** Mock data with empty arrays for edge case testing */
const mockDataEmpty: DialogueData = {
  default: {
    idle: [],
    levelup: [],
    evolve: [],
    feed: [],
    drag: [],
    fall: [],
    fatigue: [],
    dailyReward: [],
    greeting: [],
    longIdle: [],
    moodHappy: [],
    moodEat: [],
    moodSleep: []
  },
  species: {}
}

describe('getDialogue', () => {
  it('returns species-specific dialogue when available', () => {
    const result = getDialogue('pikachu', 'idle', mockData)
    const expected = mockData.species.pikachu!.idle!
    expect(expected).toContainEqual(result)
  })

  it('falls back to default when species has no override for event', () => {
    const result = getDialogue('pikachu', 'levelup', mockData)
    const expected = mockData.default.levelup
    expect(expected).toContainEqual(result)
  })

  it('falls back to default when species is not in data', () => {
    const result = getDialogue('mewtwo', 'idle', mockData)
    const expected = mockData.default.idle
    expect(expected).toContainEqual(result)
  })

  it('randomly selects from available dialogues', () => {
    const results = new Set<string>()
    for (let i = 0; i < 20; i++) {
      results.add(getDialogue('pikachu', 'idle', mockData).emotion)
    }
    expect(results.size).toBeGreaterThan(1)
  })

  it('returns safe default when dialogue array is empty', () => {
    const result = getDialogue('pikachu', 'idle', mockDataEmpty)
    expect(result).toEqual({ emotion: 'Normal', text: '' })
  })
})

describe('resolveDialogueText', () => {
  it('replaces single placeholder', () => {
    expect(resolveDialogueText('{name}好！', { name: '皮卡丘' })).toBe('皮卡丘好！')
  })

  it('replaces multiple placeholders', () => {
    expect(
      resolveDialogueText('{name}是{type}属性', { name: '皮卡丘', type: '电' })
    ).toBe('皮卡丘是电属性')
  })

  it('returns original text when no placeholders', () => {
    expect(resolveDialogueText('普通文本', { name: '皮卡丘' })).toBe('普通文本')
  })

  it('preserves unmatched placeholders', () => {
    expect(resolveDialogueText('{name}{unknown}', { name: '皮卡丘' })).toBe('皮卡丘{unknown}')
  })

  it('handles empty vars object', () => {
    expect(resolveDialogueText('{name}', {})).toBe('{name}')
  })
})
