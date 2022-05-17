import { GetterTree, ActionTree, MutationTree } from 'vuex/types'
import Skill from '~/model/skill'

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
    const keyCast = key as Skill['statName']

    skillGroup[keyCast].forEach(skill => {
      skills.push({
        name: skill,
        statName: keyCast,
        advanced
      })
    })
  })
  return skills
}


export const state = () => ({
  characters: [],
  jobs: [],
  skills: [...skillGen(skillMap.basic, false), ...skillGen(skillMap.advanced, true)]
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  characters: (state) => (state.characters)
}

export const mutations: MutationTree<RootState> = {

  loadFauna: (state, payload) => {
    state.jobs = payload.jobs.data

    state.characters = payload.characters.data.map((character: any) => {
      character.data.job = payload.jobs.data.find((job: any) => job.ref['@ref'].id === character.data.job['@ref'].id)
      return character
    })
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }) {
    const faunaData = await this.$axios.get('/.netlify/functions/load-fauna').then((response) => {
      return response.data
    })
    commit('loadFauna', faunaData)
  }
}
