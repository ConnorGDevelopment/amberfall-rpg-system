import { Module, VuexModule } from 'vuex-module-decorators'
import { SkillName } from '~/store/skills'

export interface StatBlock {
  strength: number,
  dexterity: number,
  fortitude: number,
  intelligence: number,
  wisdom: number,
  charisma: number
}

interface Job {
  name: string,
  // Hit Point Bonus
  bonusHP: number
}

type AdvanceBlock = StatBlock & {other: number}

export interface ICharacter {
  name: string,
  surname?: string

  baseStats: StatBlock,
  advances: AdvanceBlock,

  race: string,
  job: Job,

  skills: SkillName[]
}

export class Character implements ICharacter {
  name: string;
  surname?: string | undefined;
  race: string;

  baseStats: StatBlock;

  job: Job;
  advances: AdvanceBlock;

  skills: SkillName[];

  currentHP: number;

  constructor(params: ICharacter) {
    this.name = params.name;
    this.surname = params.surname;
    this.race = params.race;

    this.baseStats = params.baseStats;

    this.job = params.job;
    this.advances = params.advances;

    this.skills = params.skills

    this.currentHP = this.maxHP;
  }


  halfStat(statName: keyof StatBlock): number {
    return Math.floor(this.stats[statName] / 2)
  }

  challengeModifier(statName: keyof StatBlock): number {
    return this.stats[statName] - 50
  }

  get level(): number {
    return Object.values(this.advances).reduce((prev, curr) => prev + curr, 0)
  }

  get maxHP(): number {
    const hpFortitudeBonus = Math.floor(Math.abs(this.challengeModifier('fortitude') / 10))

    return (hpFortitudeBonus + this.job.bonusHP) * this.level
  }

  changeHP(amount: number): void {
    if(this.currentHP + amount >= this.maxHP) {
      this.currentHP = this.maxHP;
    } else if(this.currentHP + amount < this.maxHP && this.currentHP + amount >= 0) {
      this.currentHP = this.currentHP + amount;
    } else if(this.currentHP + amount < 0) {
      this.currentHP = 0
    }
  }

  get stats(): StatBlock {
    function calcStat(character: Character, statName: keyof StatBlock): number {
      return character.baseStats[statName] + character.advances[statName] * 5
    }

    return {
      strength: calcStat(this, 'strength'),
      dexterity: calcStat(this, 'dexterity'),
      fortitude: calcStat(this, 'fortitude'),
      intelligence: calcStat(this, 'intelligence'),
      wisdom: calcStat(this, 'wisdom'),
      charisma: calcStat(this, 'charisma')
    }
  }
}

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
  race: 'Human',
  job: {
    name: 'Gloomwalker',
    bonusHP: 6
  },
  advances: {
    strength: 0,
    dexterity: 0,
    fortitude: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    other: 6
  },
  skills: ['Athletics']
}

const baxter: ICharacter = {
  name: 'Baxter',
  surname: 'Davenport',
  baseStats: {
    strength: 20,
    dexterity: 20,
    fortitude: 20,
    intelligence: 55,
    wisdom: 50,
    charisma: 40
  },
  race: 'Human',
  job: {
    name: 'Mutant',
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
}

@Module({
  name: 'chars',
  stateFactory: true,
  namespaced: true,
})
export default class CharStore extends VuexModule {
  characters: ICharacter[] = [
    ambrose,
    baxter,
    maya,
    melia,
    sparrow
  ]

  get character() {
    return (characterName: string) => this.characters.find(
      character => character.name === characterName
    )
  }
}
