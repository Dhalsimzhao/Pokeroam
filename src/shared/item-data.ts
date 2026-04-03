import type { ItemDefinition } from './types'

export const ITEMS: ItemDefinition[] = [
  {
    id: 'moomoo-milk',
    name: 'Moomoo Milk',
    nameZh: '哞哞牛奶',
    description: 'Heals and makes Pokemon happy',
    category: 'food',
    holdable: false
  },
  {
    id: 'rare-candy',
    name: 'Rare Candy',
    nameZh: '神奇糖果',
    description: 'Instantly raises level by 1',
    category: 'food',
    holdable: false
  },
  {
    id: 'exp-share',
    name: 'Exp. Share',
    nameZh: '学习装置',
    description: 'Holder gains same XP as active Pokemon',
    category: 'equipment',
    holdable: true
  },
  {
    id: 'fire-stone',
    name: 'Fire Stone',
    nameZh: '火之石',
    description: 'Evolves certain Pokemon',
    category: 'equipment',
    holdable: false
  },
  {
    id: 'water-stone',
    name: 'Water Stone',
    nameZh: '水之石',
    description: 'Evolves certain Pokemon',
    category: 'equipment',
    holdable: false
  },
  {
    id: 'thunder-stone',
    name: 'Thunder Stone',
    nameZh: '雷之石',
    description: 'Evolves certain Pokemon',
    category: 'equipment',
    holdable: false
  },
  {
    id: 'moon-stone',
    name: 'Moon Stone',
    nameZh: '月之石',
    description: 'Evolves certain Pokemon',
    category: 'equipment',
    holdable: false
  }
]

/** Look up an item definition by its id. */
export function getItemById(id: string): ItemDefinition | undefined {
  return ITEMS.find((item) => item.id === id)
}
