import type { PetAnimState, PokemonSpriteSet } from '../../../shared/types'

import bulbasaurIdle from '../../../../resources/sprites/bulbasaur/Idle-Anim.png'
import bulbasaurWalk from '../../../../resources/sprites/bulbasaur/Walk-Anim.png'
import bulbasaurSleep from '../../../../resources/sprites/bulbasaur/Sleep-Anim.png'
import bulbasaurHop from '../../../../resources/sprites/bulbasaur/Hop-Anim.png'
import bulbasaurEat from '../../../../resources/sprites/bulbasaur/Eat-Anim.png'
import bulbasaurPose from '../../../../resources/sprites/bulbasaur/Pose-Anim.png'
import bulbasaurCharge from '../../../../resources/sprites/bulbasaur/Charge-Anim.png'
import bulbasaurSwing from '../../../../resources/sprites/bulbasaur/Swing-Anim.png'
import bulbasaurHurt from '../../../../resources/sprites/bulbasaur/Hurt-Anim.png'
import ivysaurIdle from '../../../../resources/sprites/ivysaur/Idle-Anim.png'
import ivysaurWalk from '../../../../resources/sprites/ivysaur/Walk-Anim.png'
import ivysaurSleep from '../../../../resources/sprites/ivysaur/Sleep-Anim.png'
import ivysaurHop from '../../../../resources/sprites/ivysaur/Hop-Anim.png'
import ivysaurCharge from '../../../../resources/sprites/ivysaur/Charge-Anim.png'
import ivysaurSwing from '../../../../resources/sprites/ivysaur/Swing-Anim.png'
import ivysaurHurt from '../../../../resources/sprites/ivysaur/Hurt-Anim.png'
import venusaurIdle from '../../../../resources/sprites/venusaur/Idle-Anim.png'
import venusaurWalk from '../../../../resources/sprites/venusaur/Walk-Anim.png'
import venusaurSleep from '../../../../resources/sprites/venusaur/Sleep-Anim.png'
import venusaurHop from '../../../../resources/sprites/venusaur/Hop-Anim.png'
import venusaurCharge from '../../../../resources/sprites/venusaur/Charge-Anim.png'
import venusaurSwing from '../../../../resources/sprites/venusaur/Swing-Anim.png'
import venusaurHurt from '../../../../resources/sprites/venusaur/Hurt-Anim.png'
import charmanderIdle from '../../../../resources/sprites/charmander/Idle-Anim.png'
import charmanderWalk from '../../../../resources/sprites/charmander/Walk-Anim.png'
import charmanderSleep from '../../../../resources/sprites/charmander/Sleep-Anim.png'
import charmanderHop from '../../../../resources/sprites/charmander/Hop-Anim.png'
import charmanderEat from '../../../../resources/sprites/charmander/Eat-Anim.png'
import charmanderPose from '../../../../resources/sprites/charmander/Pose-Anim.png'
import charmanderCharge from '../../../../resources/sprites/charmander/Charge-Anim.png'
import charmanderSwing from '../../../../resources/sprites/charmander/Swing-Anim.png'
import charmanderHurt from '../../../../resources/sprites/charmander/Hurt-Anim.png'
import charmeleonIdle from '../../../../resources/sprites/charmeleon/Idle-Anim.png'
import charmeleonWalk from '../../../../resources/sprites/charmeleon/Walk-Anim.png'
import charmeleonSleep from '../../../../resources/sprites/charmeleon/Sleep-Anim.png'
import charmeleonHop from '../../../../resources/sprites/charmeleon/Hop-Anim.png'
import charmeleonEat from '../../../../resources/sprites/charmeleon/Eat-Anim.png'
import charmeleonPose from '../../../../resources/sprites/charmeleon/Pose-Anim.png'
import charmeleonCharge from '../../../../resources/sprites/charmeleon/Charge-Anim.png'
import charmeleonSwing from '../../../../resources/sprites/charmeleon/Swing-Anim.png'
import charmeleonHurt from '../../../../resources/sprites/charmeleon/Hurt-Anim.png'
import charizardIdle from '../../../../resources/sprites/charizard/Idle-Anim.png'
import charizardWalk from '../../../../resources/sprites/charizard/Walk-Anim.png'
import charizardSleep from '../../../../resources/sprites/charizard/Sleep-Anim.png'
import charizardHop from '../../../../resources/sprites/charizard/Hop-Anim.png'
import charizardCharge from '../../../../resources/sprites/charizard/Charge-Anim.png'
import charizardSwing from '../../../../resources/sprites/charizard/Swing-Anim.png'
import charizardHurt from '../../../../resources/sprites/charizard/Hurt-Anim.png'
import squirtleIdle from '../../../../resources/sprites/squirtle/Idle-Anim.png'
import squirtleWalk from '../../../../resources/sprites/squirtle/Walk-Anim.png'
import squirtleSleep from '../../../../resources/sprites/squirtle/Sleep-Anim.png'
import squirtleHop from '../../../../resources/sprites/squirtle/Hop-Anim.png'
import squirtleEat from '../../../../resources/sprites/squirtle/Eat-Anim.png'
import squirtlePose from '../../../../resources/sprites/squirtle/Pose-Anim.png'
import squirtleCharge from '../../../../resources/sprites/squirtle/Charge-Anim.png'
import squirtleSwing from '../../../../resources/sprites/squirtle/Swing-Anim.png'
import squirtleHurt from '../../../../resources/sprites/squirtle/Hurt-Anim.png'
import wartortleIdle from '../../../../resources/sprites/wartortle/Idle-Anim.png'
import wartortleWalk from '../../../../resources/sprites/wartortle/Walk-Anim.png'
import wartortleSleep from '../../../../resources/sprites/wartortle/Sleep-Anim.png'
import wartortleHop from '../../../../resources/sprites/wartortle/Hop-Anim.png'
import wartortleCharge from '../../../../resources/sprites/wartortle/Charge-Anim.png'
import wartortleSwing from '../../../../resources/sprites/wartortle/Swing-Anim.png'
import wartortleHurt from '../../../../resources/sprites/wartortle/Hurt-Anim.png'
import blastoiseIdle from '../../../../resources/sprites/blastoise/Idle-Anim.png'
import blastoiseWalk from '../../../../resources/sprites/blastoise/Walk-Anim.png'
import blastoiseSleep from '../../../../resources/sprites/blastoise/Sleep-Anim.png'
import blastoiseHop from '../../../../resources/sprites/blastoise/Hop-Anim.png'
import blastoiseCharge from '../../../../resources/sprites/blastoise/Charge-Anim.png'
import blastoiseSwing from '../../../../resources/sprites/blastoise/Swing-Anim.png'
import blastoiseHurt from '../../../../resources/sprites/blastoise/Hurt-Anim.png'
import pikachuIdle from '../../../../resources/sprites/pikachu/Idle-Anim.png'
import pikachuWalk from '../../../../resources/sprites/pikachu/Walk-Anim.png'
import pikachuSleep from '../../../../resources/sprites/pikachu/Sleep-Anim.png'
import pikachuHop from '../../../../resources/sprites/pikachu/Hop-Anim.png'
import pikachuEat from '../../../../resources/sprites/pikachu/Eat-Anim.png'
import pikachuPose from '../../../../resources/sprites/pikachu/Pose-Anim.png'
import pikachuCharge from '../../../../resources/sprites/pikachu/Charge-Anim.png'
import pikachuSwing from '../../../../resources/sprites/pikachu/Swing-Anim.png'
import pikachuHurt from '../../../../resources/sprites/pikachu/Hurt-Anim.png'
import raichuIdle from '../../../../resources/sprites/raichu/Idle-Anim.png'
import raichuWalk from '../../../../resources/sprites/raichu/Walk-Anim.png'
import raichuSleep from '../../../../resources/sprites/raichu/Sleep-Anim.png'
import raichuHop from '../../../../resources/sprites/raichu/Hop-Anim.png'
import raichuEat from '../../../../resources/sprites/raichu/Eat-Anim.png'
import raichuPose from '../../../../resources/sprites/raichu/Pose-Anim.png'
import raichuCharge from '../../../../resources/sprites/raichu/Charge-Anim.png'
import raichuSwing from '../../../../resources/sprites/raichu/Swing-Anim.png'
import raichuHurt from '../../../../resources/sprites/raichu/Hurt-Anim.png'
import jigglypuffIdle from '../../../../resources/sprites/jigglypuff/Idle-Anim.png'
import jigglypuffWalk from '../../../../resources/sprites/jigglypuff/Walk-Anim.png'
import jigglypuffSleep from '../../../../resources/sprites/jigglypuff/Sleep-Anim.png'
import jigglypuffHop from '../../../../resources/sprites/jigglypuff/Hop-Anim.png'
import jigglypuffEat from '../../../../resources/sprites/jigglypuff/Eat-Anim.png'
import jigglypuffPose from '../../../../resources/sprites/jigglypuff/Pose-Anim.png'
import jigglypuffCharge from '../../../../resources/sprites/jigglypuff/Charge-Anim.png'
import jigglypuffSwing from '../../../../resources/sprites/jigglypuff/Swing-Anim.png'
import jigglypuffHurt from '../../../../resources/sprites/jigglypuff/Hurt-Anim.png'
import wigglytuffIdle from '../../../../resources/sprites/wigglytuff/Idle-Anim.png'
import wigglytuffWalk from '../../../../resources/sprites/wigglytuff/Walk-Anim.png'
import wigglytuffSleep from '../../../../resources/sprites/wigglytuff/Sleep-Anim.png'
import wigglytuffHop from '../../../../resources/sprites/wigglytuff/Hop-Anim.png'
import wigglytuffCharge from '../../../../resources/sprites/wigglytuff/Charge-Anim.png'
import wigglytuffSwing from '../../../../resources/sprites/wigglytuff/Swing-Anim.png'
import wigglytuffHurt from '../../../../resources/sprites/wigglytuff/Hurt-Anim.png'
import psyduckIdle from '../../../../resources/sprites/psyduck/Idle-Anim.png'
import psyduckWalk from '../../../../resources/sprites/psyduck/Walk-Anim.png'
import psyduckSleep from '../../../../resources/sprites/psyduck/Sleep-Anim.png'
import psyduckHop from '../../../../resources/sprites/psyduck/Hop-Anim.png'
import psyduckPose from '../../../../resources/sprites/psyduck/Pose-Anim.png'
import psyduckCharge from '../../../../resources/sprites/psyduck/Charge-Anim.png'
import psyduckSwing from '../../../../resources/sprites/psyduck/Swing-Anim.png'
import psyduckHurt from '../../../../resources/sprites/psyduck/Hurt-Anim.png'
import golduckIdle from '../../../../resources/sprites/golduck/Idle-Anim.png'
import golduckWalk from '../../../../resources/sprites/golduck/Walk-Anim.png'
import golduckSleep from '../../../../resources/sprites/golduck/Sleep-Anim.png'
import golduckHop from '../../../../resources/sprites/golduck/Hop-Anim.png'
import golduckCharge from '../../../../resources/sprites/golduck/Charge-Anim.png'
import golduckSwing from '../../../../resources/sprites/golduck/Swing-Anim.png'
import golduckHurt from '../../../../resources/sprites/golduck/Hurt-Anim.png'
import slowpokeIdle from '../../../../resources/sprites/slowpoke/Idle-Anim.png'
import slowpokeWalk from '../../../../resources/sprites/slowpoke/Walk-Anim.png'
import slowpokeSleep from '../../../../resources/sprites/slowpoke/Sleep-Anim.png'
import slowpokeHop from '../../../../resources/sprites/slowpoke/Hop-Anim.png'
import slowpokeCharge from '../../../../resources/sprites/slowpoke/Charge-Anim.png'
import slowpokeSwing from '../../../../resources/sprites/slowpoke/Swing-Anim.png'
import slowpokeHurt from '../../../../resources/sprites/slowpoke/Hurt-Anim.png'
import slowbroIdle from '../../../../resources/sprites/slowbro/Idle-Anim.png'
import slowbroWalk from '../../../../resources/sprites/slowbro/Walk-Anim.png'
import slowbroSleep from '../../../../resources/sprites/slowbro/Sleep-Anim.png'
import slowbroHop from '../../../../resources/sprites/slowbro/Hop-Anim.png'
import slowbroCharge from '../../../../resources/sprites/slowbro/Charge-Anim.png'
import slowbroSwing from '../../../../resources/sprites/slowbro/Swing-Anim.png'
import slowbroHurt from '../../../../resources/sprites/slowbro/Hurt-Anim.png'
import gastlyIdle from '../../../../resources/sprites/gastly/Idle-Anim.png'
import gastlyWalk from '../../../../resources/sprites/gastly/Walk-Anim.png'
import gastlySleep from '../../../../resources/sprites/gastly/Sleep-Anim.png'
import gastlyHop from '../../../../resources/sprites/gastly/Hop-Anim.png'
import gastlyCharge from '../../../../resources/sprites/gastly/Charge-Anim.png'
import gastlySwing from '../../../../resources/sprites/gastly/Swing-Anim.png'
import gastlyHurt from '../../../../resources/sprites/gastly/Hurt-Anim.png'
import haunterIdle from '../../../../resources/sprites/haunter/Idle-Anim.png'
import haunterWalk from '../../../../resources/sprites/haunter/Walk-Anim.png'
import haunterSleep from '../../../../resources/sprites/haunter/Sleep-Anim.png'
import haunterHop from '../../../../resources/sprites/haunter/Hop-Anim.png'
import haunterCharge from '../../../../resources/sprites/haunter/Charge-Anim.png'
import haunterSwing from '../../../../resources/sprites/haunter/Swing-Anim.png'
import haunterHurt from '../../../../resources/sprites/haunter/Hurt-Anim.png'
import gengarIdle from '../../../../resources/sprites/gengar/Idle-Anim.png'
import gengarWalk from '../../../../resources/sprites/gengar/Walk-Anim.png'
import gengarSleep from '../../../../resources/sprites/gengar/Sleep-Anim.png'
import gengarHop from '../../../../resources/sprites/gengar/Hop-Anim.png'
import gengarEat from '../../../../resources/sprites/gengar/Eat-Anim.png'
import gengarPose from '../../../../resources/sprites/gengar/Pose-Anim.png'
import gengarCharge from '../../../../resources/sprites/gengar/Charge-Anim.png'
import gengarSwing from '../../../../resources/sprites/gengar/Swing-Anim.png'
import gengarHurt from '../../../../resources/sprites/gengar/Hurt-Anim.png'
import eeveeIdle from '../../../../resources/sprites/eevee/Idle-Anim.png'
import eeveeWalk from '../../../../resources/sprites/eevee/Walk-Anim.png'
import eeveeSleep from '../../../../resources/sprites/eevee/Sleep-Anim.png'
import eeveeHop from '../../../../resources/sprites/eevee/Hop-Anim.png'
import eeveeEat from '../../../../resources/sprites/eevee/Eat-Anim.png'
import eeveePose from '../../../../resources/sprites/eevee/Pose-Anim.png'
import eeveeCharge from '../../../../resources/sprites/eevee/Charge-Anim.png'
import eeveeSwing from '../../../../resources/sprites/eevee/Swing-Anim.png'
import eeveeHurt from '../../../../resources/sprites/eevee/Hurt-Anim.png'
import vaporeonIdle from '../../../../resources/sprites/vaporeon/Idle-Anim.png'
import vaporeonWalk from '../../../../resources/sprites/vaporeon/Walk-Anim.png'
import vaporeonSleep from '../../../../resources/sprites/vaporeon/Sleep-Anim.png'
import vaporeonHop from '../../../../resources/sprites/vaporeon/Hop-Anim.png'
import vaporeonCharge from '../../../../resources/sprites/vaporeon/Charge-Anim.png'
import vaporeonSwing from '../../../../resources/sprites/vaporeon/Swing-Anim.png'
import vaporeonHurt from '../../../../resources/sprites/vaporeon/Hurt-Anim.png'
import jolteonIdle from '../../../../resources/sprites/jolteon/Idle-Anim.png'
import jolteonWalk from '../../../../resources/sprites/jolteon/Walk-Anim.png'
import jolteonSleep from '../../../../resources/sprites/jolteon/Sleep-Anim.png'
import jolteonHop from '../../../../resources/sprites/jolteon/Hop-Anim.png'
import jolteonEat from '../../../../resources/sprites/jolteon/Eat-Anim.png'
import jolteonPose from '../../../../resources/sprites/jolteon/Pose-Anim.png'
import jolteonCharge from '../../../../resources/sprites/jolteon/Charge-Anim.png'
import jolteonSwing from '../../../../resources/sprites/jolteon/Swing-Anim.png'
import jolteonHurt from '../../../../resources/sprites/jolteon/Hurt-Anim.png'
import flareonIdle from '../../../../resources/sprites/flareon/Idle-Anim.png'
import flareonWalk from '../../../../resources/sprites/flareon/Walk-Anim.png'
import flareonSleep from '../../../../resources/sprites/flareon/Sleep-Anim.png'
import flareonHop from '../../../../resources/sprites/flareon/Hop-Anim.png'
import flareonEat from '../../../../resources/sprites/flareon/Eat-Anim.png'
import flareonPose from '../../../../resources/sprites/flareon/Pose-Anim.png'
import flareonCharge from '../../../../resources/sprites/flareon/Charge-Anim.png'
import flareonSwing from '../../../../resources/sprites/flareon/Swing-Anim.png'
import flareonHurt from '../../../../resources/sprites/flareon/Hurt-Anim.png'
import pichuIdle from '../../../../resources/sprites/pichu/Idle-Anim.png'
import pichuWalk from '../../../../resources/sprites/pichu/Walk-Anim.png'
import pichuSleep from '../../../../resources/sprites/pichu/Sleep-Anim.png'
import pichuHop from '../../../../resources/sprites/pichu/Hop-Anim.png'
import pichuEat from '../../../../resources/sprites/pichu/Eat-Anim.png'
import pichuPose from '../../../../resources/sprites/pichu/Pose-Anim.png'
import pichuCharge from '../../../../resources/sprites/pichu/Charge-Anim.png'
import pichuSwing from '../../../../resources/sprites/pichu/Swing-Anim.png'
import pichuHurt from '../../../../resources/sprites/pichu/Hurt-Anim.png'

const RIGHT = 2

const BULBASAUR_SPRITES: PokemonSpriteSet = {
  idle: {
    src: bulbasaurIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 3,
    durations: [40, 6, 6],
    row: RIGHT
  },
  walk: {
    src: bulbasaurWalk,
    frameWidth: 40,
    frameHeight: 40,
    frameCount: 6,
    durations: [4, 4, 4, 4, 4, 4],
    row: RIGHT
  },
  sleep: {
    src: bulbasaurSleep,
    frameWidth: 24,
    frameHeight: 24,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: bulbasaurHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: bulbasaurEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: bulbasaurPose,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 5,
    durations: [8, 1, 3, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: bulbasaurCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: bulbasaurSwing,
    frameWidth: 72,
    frameHeight: 72,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: bulbasaurHurt,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const IVYSAUR_SPRITES: PokemonSpriteSet = {
  idle: {
    src: ivysaurIdle,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [40, 12, 12, 12],
    row: RIGHT
  },
  walk: {
    src: ivysaurWalk,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: ivysaurSleep,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: ivysaurHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: ivysaurCharge,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: ivysaurSwing,
    frameWidth: 72,
    frameHeight: 72,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: ivysaurHurt,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const VENUSAUR_SPRITES: PokemonSpriteSet = {
  idle: {
    src: venusaurIdle,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [30, 16, 12, 16],
    row: RIGHT
  },
  walk: {
    src: venusaurWalk,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [8, 16, 8, 16],
    row: RIGHT
  },
  sleep: {
    src: venusaurSleep,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: venusaurHop,
    frameWidth: 40,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: venusaurCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: venusaurSwing,
    frameWidth: 72,
    frameHeight: 72,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: venusaurHurt,
    frameWidth: 48,
    frameHeight: 48,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const CHARMANDER_SPRITES: PokemonSpriteSet = {
  idle: {
    src: charmanderIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [12, 8, 8, 8],
    row: RIGHT
  },
  walk: {
    src: charmanderWalk,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: RIGHT
  },
  sleep: {
    src: charmanderSleep,
    frameWidth: 32,
    frameHeight: 24,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: charmanderHop,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: charmanderEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: charmanderPose,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: charmanderCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: charmanderSwing,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: charmanderHurt,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const CHARMELEON_SPRITES: PokemonSpriteSet = {
  idle: {
    src: charmeleonIdle,
    frameWidth: 32,
    frameHeight: 56,
    frameCount: 6,
    durations: [40, 2, 3, 3, 3, 2],
    row: RIGHT
  },
  walk: {
    src: charmeleonWalk,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: charmeleonSleep,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: charmeleonHop,
    frameWidth: 40,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: charmeleonEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: charmeleonPose,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: charmeleonCharge,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: charmeleonSwing,
    frameWidth: 80,
    frameHeight: 88,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: charmeleonHurt,
    frameWidth: 48,
    frameHeight: 64,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const CHARIZARD_SPRITES: PokemonSpriteSet = {
  idle: {
    src: charizardIdle,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 4,
    durations: [15, 15, 15, 15],
    row: RIGHT
  },
  walk: {
    src: charizardWalk,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: charizardSleep,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: charizardHop,
    frameWidth: 48,
    frameHeight: 96,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: charizardCharge,
    frameWidth: 48,
    frameHeight: 48,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: charizardSwing,
    frameWidth: 88,
    frameHeight: 96,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: charizardHurt,
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const SQUIRTLE_SPRITES: PokemonSpriteSet = {
  idle: {
    src: squirtleIdle,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 8,
    durations: [30, 2, 2, 4, 4, 4, 2, 2],
    row: RIGHT
  },
  walk: {
    src: squirtleWalk,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [12, 8, 12, 8],
    row: RIGHT
  },
  sleep: {
    src: squirtleSleep,
    frameWidth: 24,
    frameHeight: 24,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: squirtleHop,
    frameWidth: 32,
    frameHeight: 72,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: squirtleEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: squirtlePose,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: squirtleCharge,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: squirtleSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: squirtleHurt,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const WARTORTLE_SPRITES: PokemonSpriteSet = {
  idle: {
    src: wartortleIdle,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 4,
    durations: [40, 2, 2, 2],
    row: RIGHT
  },
  walk: {
    src: wartortleWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: wartortleSleep,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: wartortleHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: wartortleCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: wartortleSwing,
    frameWidth: 72,
    frameHeight: 72,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: wartortleHurt,
    frameWidth: 48,
    frameHeight: 48,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const BLASTOISE_SPRITES: PokemonSpriteSet = {
  idle: {
    src: blastoiseIdle,
    frameWidth: 40,
    frameHeight: 40,
    frameCount: 8,
    durations: [32, 12, 4, 4, 4, 4, 4, 8],
    row: RIGHT
  },
  walk: {
    src: blastoiseWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 14, 8, 14],
    row: RIGHT
  },
  sleep: {
    src: blastoiseSleep,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: blastoiseHop,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: blastoiseCharge,
    frameWidth: 40,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: blastoiseSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: blastoiseHurt,
    frameWidth: 40,
    frameHeight: 40,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const PIKACHU_SPRITES: PokemonSpriteSet = {
  idle: {
    src: pikachuIdle,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 6,
    durations: [40, 2, 3, 3, 3, 2],
    row: RIGHT
  },
  walk: {
    src: pikachuWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: pikachuSleep,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: pikachuHop,
    frameWidth: 40,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: pikachuEat,
    frameWidth: 24,
    frameHeight: 48,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: pikachuPose,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: pikachuCharge,
    frameWidth: 40,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: pikachuSwing,
    frameWidth: 80,
    frameHeight: 96,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: pikachuHurt,
    frameWidth: 48,
    frameHeight: 64,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const RAICHU_SPRITES: PokemonSpriteSet = {
  idle: {
    src: raichuIdle,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 6,
    durations: [40, 2, 4, 4, 4, 2],
    row: RIGHT
  },
  walk: {
    src: raichuWalk,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: raichuSleep,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: raichuHop,
    frameWidth: 40,
    frameHeight: 96,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: raichuEat,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: raichuPose,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: raichuCharge,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: raichuSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: raichuHurt,
    frameWidth: 56,
    frameHeight: 64,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const JIGGLYPUFF_SPRITES: PokemonSpriteSet = {
  idle: {
    src: jigglypuffIdle,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 5,
    durations: [25, 8, 15, 8, 15],
    row: RIGHT
  },
  walk: {
    src: jigglypuffWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 5,
    durations: [6, 4, 4, 4, 6],
    row: RIGHT
  },
  sleep: {
    src: jigglypuffSleep,
    frameWidth: 24,
    frameHeight: 24,
    frameCount: 2,
    durations: [35, 35],
    row: 0
  },
  happy: {
    src: jigglypuffHop,
    frameWidth: 24,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: jigglypuffEat,
    frameWidth: 24,
    frameHeight: 24,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: jigglypuffPose,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: jigglypuffCharge,
    frameWidth: 24,
    frameHeight: 24,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: jigglypuffSwing,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: jigglypuffHurt,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const WIGGLYTUFF_SPRITES: PokemonSpriteSet = {
  idle: {
    src: wigglytuffIdle,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    durations: [40, 4, 6, 4],
    row: RIGHT
  },
  walk: {
    src: wigglytuffWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: wigglytuffSleep,
    frameWidth: 24,
    frameHeight: 24,
    frameCount: 2,
    durations: [35, 35],
    row: 0
  },
  happy: {
    src: wigglytuffHop,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: wigglytuffCharge,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: wigglytuffSwing,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: wigglytuffHurt,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const PSYDUCK_SPRITES: PokemonSpriteSet = {
  idle: {
    src: psyduckIdle,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 4,
    durations: [16, 20, 16, 20],
    row: RIGHT
  },
  walk: {
    src: psyduckWalk,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 12, 8, 12],
    row: RIGHT
  },
  sleep: {
    src: psyduckSleep,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 2,
    durations: [35, 35],
    row: 0
  },
  happy: {
    src: psyduckHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  levelup: {
    src: psyduckPose,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: psyduckCharge,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: psyduckSwing,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: psyduckHurt,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const GOLDUCK_SPRITES: PokemonSpriteSet = {
  idle: {
    src: golduckIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [40, 20, 40, 20],
    row: RIGHT
  },
  walk: {
    src: golduckWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 12, 8, 12],
    row: RIGHT
  },
  sleep: {
    src: golduckSleep,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [35, 35],
    row: 0
  },
  happy: {
    src: golduckHop,
    frameWidth: 40,
    frameHeight: 96,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: golduckCharge,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: golduckSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: golduckHurt,
    frameWidth: 56,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const SLOWPOKE_SPRITES: PokemonSpriteSet = {
  idle: {
    src: slowpokeIdle,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [40, 8, 8, 8],
    row: RIGHT
  },
  walk: {
    src: slowpokeWalk,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: slowpokeSleep,
    frameWidth: 32,
    frameHeight: 16,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: slowpokeHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: slowpokeCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: slowpokeSwing,
    frameWidth: 64,
    frameHeight: 88,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: slowpokeHurt,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const SLOWBRO_SPRITES: PokemonSpriteSet = {
  idle: {
    src: slowbroIdle,
    frameWidth: 40,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 30],
    row: RIGHT
  },
  walk: {
    src: slowbroWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 12, 8, 12],
    row: RIGHT
  },
  sleep: {
    src: slowbroSleep,
    frameWidth: 32,
    frameHeight: 24,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: slowbroHop,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: slowbroCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: slowbroSwing,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: slowbroHurt,
    frameWidth: 56,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const GASTLY_SPRITES: PokemonSpriteSet = {
  idle: {
    src: gastlyIdle,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 6,
    durations: [10, 10, 10, 10, 10, 10],
    row: RIGHT
  },
  walk: {
    src: gastlyWalk,
    frameWidth: 48,
    frameHeight: 64,
    frameCount: 12,
    durations: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    row: RIGHT
  },
  sleep: {
    src: gastlySleep,
    frameWidth: 24,
    frameHeight: 56,
    frameCount: 8,
    durations: [6, 6, 6, 16, 6, 6, 6, 16],
    row: 0
  },
  happy: {
    src: gastlyHop,
    frameWidth: 48,
    frameHeight: 104,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: gastlyCharge,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: gastlySwing,
    frameWidth: 88,
    frameHeight: 104,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: gastlyHurt,
    frameWidth: 56,
    frameHeight: 64,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const HAUNTER_SPRITES: PokemonSpriteSet = {
  idle: {
    src: haunterIdle,
    frameWidth: 32,
    frameHeight: 56,
    frameCount: 4,
    durations: [14, 8, 14, 8],
    row: RIGHT
  },
  walk: {
    src: haunterWalk,
    frameWidth: 32,
    frameHeight: 56,
    frameCount: 10,
    durations: [6, 6, 6, 10, 6, 6, 6, 6, 10, 6],
    row: RIGHT
  },
  sleep: {
    src: haunterSleep,
    frameWidth: 32,
    frameHeight: 56,
    frameCount: 6,
    durations: [8, 8, 20, 8, 8, 20],
    row: 0
  },
  happy: {
    src: haunterHop,
    frameWidth: 32,
    frameHeight: 96,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: haunterCharge,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: haunterSwing,
    frameWidth: 80,
    frameHeight: 88,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: haunterHurt,
    frameWidth: 40,
    frameHeight: 64,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const GENGAR_SPRITES: PokemonSpriteSet = {
  idle: {
    src: gengarIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 8,
    durations: [40, 4, 3, 3, 3, 3, 3, 4],
    row: RIGHT
  },
  walk: {
    src: gengarWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: gengarSleep,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: gengarHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: gengarEat,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: gengarPose,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [12, 2, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: gengarCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: gengarSwing,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: gengarHurt,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const EEVEE_SPRITES: PokemonSpriteSet = {
  idle: {
    src: eeveeIdle,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 2,
    durations: [16, 16],
    row: RIGHT
  },
  walk: {
    src: eeveeWalk,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 7,
    durations: [4, 4, 4, 4, 6, 2, 2],
    row: RIGHT
  },
  sleep: {
    src: eeveeSleep,
    frameWidth: 32,
    frameHeight: 24,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: eeveeHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: eeveeEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: eeveePose,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 5,
    durations: [8, 1, 3, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: eeveeCharge,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: eeveeSwing,
    frameWidth: 80,
    frameHeight: 72,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: eeveeHurt,
    frameWidth: 48,
    frameHeight: 48,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const VAPOREON_SPRITES: PokemonSpriteSet = {
  idle: {
    src: vaporeonIdle,
    frameWidth: 40,
    frameHeight: 56,
    frameCount: 2,
    durations: [60, 16],
    row: RIGHT
  },
  walk: {
    src: vaporeonWalk,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: vaporeonSleep,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: vaporeonHop,
    frameWidth: 56,
    frameHeight: 104,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  evolve: {
    src: vaporeonCharge,
    frameWidth: 56,
    frameHeight: 64,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: vaporeonSwing,
    frameWidth: 104,
    frameHeight: 104,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: vaporeonHurt,
    frameWidth: 48,
    frameHeight: 48,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const JOLTEON_SPRITES: PokemonSpriteSet = {
  idle: {
    src: jolteonIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 2,
    durations: [60, 16],
    row: RIGHT
  },
  walk: {
    src: jolteonWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 10, 8, 10],
    row: RIGHT
  },
  sleep: {
    src: jolteonSleep,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: jolteonHop,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: jolteonEat,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: jolteonPose,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 5,
    durations: [8, 1, 3, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: jolteonCharge,
    frameWidth: 48,
    frameHeight: 48,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: jolteonSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: jolteonHurt,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const FLAREON_SPRITES: PokemonSpriteSet = {
  idle: {
    src: flareonIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [12, 16, 12, 16],
    row: RIGHT
  },
  walk: {
    src: flareonWalk,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [8, 8, 8, 8],
    row: RIGHT
  },
  sleep: {
    src: flareonSleep,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: flareonHop,
    frameWidth: 32,
    frameHeight: 80,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: flareonEat,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: flareonPose,
    frameWidth: 24,
    frameHeight: 48,
    frameCount: 5,
    durations: [8, 1, 3, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: flareonCharge,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: flareonSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: flareonHurt,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

const PICHU_SPRITES: PokemonSpriteSet = {
  idle: {
    src: pichuIdle,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    durations: [32, 4, 6, 6],
    row: RIGHT
  },
  walk: {
    src: pichuWalk,
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 8,
    durations: [6, 6, 6, 6, 6, 6, 6, 6],
    row: RIGHT
  },
  sleep: {
    src: pichuSleep,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: pichuHop,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: pichuEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: pichuPose,
    frameWidth: 24,
    frameHeight: 48,
    frameCount: 5,
    durations: [8, 1, 3, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: pichuCharge,
    frameWidth: 24,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: pichuSwing,
    frameWidth: 80,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: pichuHurt,
    frameWidth: 40,
    frameHeight: 48,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  },
}

export const POKEMON_SPRITES: Record<number, PokemonSpriteSet> = {
  1: BULBASAUR_SPRITES,
  2: IVYSAUR_SPRITES,
  3: VENUSAUR_SPRITES,
  4: CHARMANDER_SPRITES,
  5: CHARMELEON_SPRITES,
  6: CHARIZARD_SPRITES,
  7: SQUIRTLE_SPRITES,
  8: WARTORTLE_SPRITES,
  9: BLASTOISE_SPRITES,
  25: PIKACHU_SPRITES,
  26: RAICHU_SPRITES,
  39: JIGGLYPUFF_SPRITES,
  40: WIGGLYTUFF_SPRITES,
  54: PSYDUCK_SPRITES,
  55: GOLDUCK_SPRITES,
  79: SLOWPOKE_SPRITES,
  80: SLOWBRO_SPRITES,
  92: GASTLY_SPRITES,
  93: HAUNTER_SPRITES,
  94: GENGAR_SPRITES,
  133: EEVEE_SPRITES,
  134: VAPOREON_SPRITES,
  135: JOLTEON_SPRITES,
  136: FLAREON_SPRITES,
  172: PICHU_SPRITES,
}

// PMD Collab Idle sheets often cycle through 4–8 frames with enough body
// motion to read as walking-in-place. Collapse idle to a 2-frame breathing
// loop (long rest on frame 0, brief dip to frame 1) so the pet looks
// stationary but alive. Cached for stable object identity so
// useAnimationLoop doesn't re-subscribe every render; cache key includes the
// tick values so dev-panel sliders take effect immediately.
type SpriteSheetConfigT = import('../../../shared/types').SpriteSheetConfig
const idleCache = new Map<string, SpriteSheetConfigT>()

export function getSpriteConfig(
  speciesId: number,
  animState: PetAnimState,
  idleTicks?: { rest: number; dip: number }
): SpriteSheetConfigT | null {
  const spriteSet = POKEMON_SPRITES[speciesId]
  if (!spriteSet) return null
  const base = spriteSet[animState] ?? spriteSet['idle']
  if (!base) return null
  if (animState === 'idle') {
    const rest = Math.max(1, Math.round(idleTicks?.rest ?? 110))
    const dip = Math.max(1, Math.round(idleTicks?.dip ?? 8))
    const key = `${speciesId}:${rest}:${dip}`
    let cached = idleCache.get(key)
    if (!cached) {
      cached = base.frameCount >= 2
        ? { ...base, frameCount: 2, durations: [rest, dip] }
        : { ...base, frameCount: 1, durations: [base.durations[0]] }
      idleCache.set(key, cached)
    }
    return cached
  }
  return base
}
