import {Store} from 'vuex'
import { initialiseStores } from '~/utils/store-accessor'
import CharStore from '~/store/char-store'
import SkillStore from '~/store/skill-store'

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
