/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import CharStore from '~/store/char-store'
import SkillStore from '~/store/skill-store';

let chars: CharStore;
let skills: SkillStore

function initialiseStores(store: Store<any>): void {
  chars = getModule(CharStore, store)
  skills = getModule(SkillStore, store)
}

export {initialiseStores, chars, skills}
