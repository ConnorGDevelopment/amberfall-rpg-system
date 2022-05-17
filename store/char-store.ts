import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Character, ICharacter } from '~/model/character'


const ambrose: ICharacter = {
  name: 'Ambrose',
  surname: 'Smith',

  baseStats: {
    strength: 30,
    dexterity: 30,
    fortitude: 30,
    intelligence: 30,
    wisdom: 30,
    charisma: 30
  },

  advances: {
    strength: 0,
    dexterity: 0,
    fortitude: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  },

  otherAdvances: 6,

  race: 'Human',

  job: {
    name: 'Gloomwalker',
    bonusHP: 6,
    advanceBlock: {
      strength: 0,
      dexterity: 0,
      fortitude: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    skills: ['Athletics']
  },

  currentHP: 48,

  triumph: 0,
  ruin: 0
}

const baxter: ICharacter = {
  name: 'Baxter',
  surname: 'Davenport',
  baseStats: {
    strength: 30,
    dexterity: 30,
    fortitude: 30,
    intelligence: 30,
    wisdom: 30,
    charisma: 30
  },

  advances: {
    strength: 0,
    dexterity: 0,
    fortitude: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  },

  otherAdvances: 6,

  race: 'Human',

  job: {
    name: 'Mutant',
    bonusHP: 6,
    advanceBlock: {
      strength: 0,
      dexterity: 0,
      fortitude: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    skills: ['Athletics']
  },

  currentHP: 48,

  triumph: 0,
  ruin: 0
}

/*
const maya: ICharacter = {
  name: 'Maya',
  baseStats: {
    strength: 25,
    dexterity: 40,
    fortitude: 45,
    intelligence: 25,
    wisdom: 45,
    charisma: 25
  },
  race: 'Aasimar',
  job: {
    name: 'Starcaller',
    bonusHP: 4
  },
  advances: {
    strength: 0,
    dexterity: 0,
    fortitude: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    other: 0
  },
  skills: []
}

const melia: ICharacter = {
  name: 'Melia',
  surname: 'Jedlík',
  baseStats: {
    strength: 20,
    dexterity: 20,
    fortitude: 25,
    intelligence: 55,
    wisdom: 25,
    charisma: 60
  },
  race: 'Reborn',
  job: {
    name: 'Egotist',
    bonusHP: 4
  },
  advances: {
    strength: 0,
    dexterity: 0,
    fortitude: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    other: 0
  },
  skills: []
}

const sparrow: ICharacter = {
  name: 'Sparrow',
  baseStats: {
    strength: 20,
    dexterity: 50,
    fortitude: 35,
    intelligence: 20,
    wisdom: 35,
    charisma: 50
  },
  race: 'Changeling',
  job: {
    name: 'Soulknife',
    bonusHP: 4
  },
  advances: {
    strength: 0,
    dexterity: 0,
    fortitude: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    other: 0
  },
  skills: []
} */

@Module({
  name: 'modules/chars',
  stateFactory: true,
  namespaced: true,
})
export default class Chars extends VuexModule {
  characterBank: ICharacter[] = [
    ambrose,
    baxter
    /* baxter,
    maya,
    melia,
    sparrow */
  ]

  activeCharacter: ICharacter | null = null

  get character() {
    return (characterName: string) => this.characterBank.find(
      character => character.name === characterName
    )
  }

  @Mutation
  selectCharacter(character: ICharacter) {
    this.activeCharacter = character
  }

  @Mutation
  updateCharacter(character: Character) {
    const characterIndex = this.characterBank.findIndex((bankCharacter: ICharacter) => bankCharacter.name === character.name)
    if(characterIndex > -1) {
      this.characterBank[characterIndex] = character.toJSON()
    }
  }
}
