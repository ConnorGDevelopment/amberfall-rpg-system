import Vuex from 'vuex'
import { initialiseStores } from '~/utils/store-accessor'
import Chars from '~/store/char-store'
import Skills from '~/store/skill-store'

const initializer = (store: any) => initialiseStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = new Vuex.Store({
  modules: {
    chars: Chars,
    skills: Skills
  }
})
