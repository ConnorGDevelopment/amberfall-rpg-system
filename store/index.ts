import { GetterTree, ActionTree, MutationTree } from 'vuex/types'
import { ICharacter } from '~/model/character'
import { IFauna } from '~/model/fauna'
import Job from '~/model/job'
import Skill from '~/model/skill'

export const state = () => ({
  characters: [] as IFauna<ICharacter>[],
  jobs: [] as IFauna<Job>[],
  skills: [] as IFauna<Skill>[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  characters: (state) => (state.characters)
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
