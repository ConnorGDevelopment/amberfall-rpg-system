import { Module, VuexModule } from 'vuex-module-decorators'
import { StatBlock } from './chars'

const skillMap = {
  basic: {
    strength: [
      'Athletics',
      'Intimidate'
    ],
    dexterity: [
      'Acrobatics',
      'Sleight of Hand',
      'Stealth'
    ],
    fortitude: [],
    intelligence: [
      'History',
      'Inspect',
      'Nature',
      'Religion',
      'Search'
    ],
    wisdom: [
      'Animal Handling',
      'Focus',
      'Insight',
      'Perception',
      'Survival'
    ],
    charisma: [
      'Command',
      'Deception',
      'Gossip',
      'Haggle',
      'Persuasion'
    ]
  },
  advanced: {
    strength: [],
    dexterity: [
      'Pick Lock',
      'Shadowing'
    ],
    fortitude: [],
    intelligence: [
      'Arcana',
      'Disguise',
      'Investigation',
      'Lip Reading',
      'Occult',
      'Psionics'
    ],
    wisdom: [
      'Medicine',
      'Public Speaking',
      'Sixth Sense'
    ],
    charisma: [
      'Blather',
      'Etiquette',
      'Guile',
      'Networking',
      'Performance'
    ]
  }
}

interface Skill {
  name: string,
  stat: keyof StatBlock,
  advanced: boolean
}

function skillGen(skillGroup: {
  strength: string[],
  dexterity: string[],
  fortitude: string[],
  intelligence: string[],
  wisdom: string[],
  charisma: string[]
}, advanced: boolean): Skill[] {
  const skills: Skill[] = []
  Object.keys(skillGroup).forEach(key => {
    const keyCast = key as Skill['stat']

    skillGroup[keyCast].forEach(skill => {
      skills.push({
        name: skill,
        stat: keyCast,
        advanced
      })
    })
  })
  return skills
}



@Module({
  name: 'skills',
  stateFactory: true,
  namespaced: true,
})
export default class SkillStore extends VuexModule {
  skills: Skill[] = [...skillGen(skillMap.basic, false), ...skillGen(skillMap.advanced, true)]
}

export type SkillName = SkillStore['skills'][number]['name']
