import {Store} from 'vuex'
import { initialiseStores } from '~/utils/store-accessor'
import CharStore from '~/store/chars'
import SkillStore from '~/store/skills'

const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = new Store({
  modules: {
    chars: CharStore,
    skills: SkillStore
  }
})
