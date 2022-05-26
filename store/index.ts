import { GetterTree, ActionTree, MutationTree } from 'vuex/types'
import { Character, ICharacter } from '~/model/character'
import { IFauna } from '~/model/fauna'
import Job from '~/model/job'
import Skill from '~/model/skill'

export const state = () => ({
  characters: [] as IFauna<ICharacter>[],
  jobs: [] as IFauna<Job>[],
  skills: [] as IFauna<Skill>[],
  test: [] as any
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  allCharacters: (state) => (state.characters.map((character: IFauna<ICharacter>) => new Character(character))),

  findCharacter: (state) => (characterName: string) => {
    return state.characters.find((character: IFauna<ICharacter>) => character.data.name === characterName)
  },

  allSkills: (state) => (state.skills.map((skill: IFauna<Skill>) => skill.data)),
}

export const mutations: MutationTree<RootState> = {
  loadFauna: (state, payload) => {
    state.jobs = payload.jobs.data
    state.skills = payload.skills.data

    state.characters = payload.characters.data.map((character: any) => {
      character.data.job = payload.jobs.data.find((job: any) => job.data.name === character.data.job).data
      character.data.job.skills = character.data.job.skills.map((skillName: any) => {
        return payload.skills.data.find((skill: any) => skill.data.name === skillName).data
      })
      return character
    })
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }) {
    const faunaData = await this.$axios.get('/.netlify/functions/load-fauna').then((response) => {
      return response.data
    })
    commit('loadFauna', faunaData)
  },
}
