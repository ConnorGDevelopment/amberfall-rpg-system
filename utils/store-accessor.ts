/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import CharStore from '~/store/chars'
import SkillStore from '~/store/skills';

let charStore: CharStore;
let skillStore: SkillStore

function initialiseStores(store: Store<any>): void {
  charStore = getModule(CharStore, store)
  skillStore = getModule(SkillStore, store)
}

export {initialiseStores, charStore, skillStore}
