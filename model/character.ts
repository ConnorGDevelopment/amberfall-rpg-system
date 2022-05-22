import Check from "./check";
import { IFauna } from "./fauna";
import Job from "~/model/job";
import StatBlock from "~/model/stat-block";
import Skill from "~/model/skill";

export interface ICharacter {
  name: string;
  surname: string;

  baseStats: StatBlock;
  advances: StatBlock;
  otherAdvances: number;

  race: string;
  job: Job;

  currentHP: number;

  triumph: number;
  ruin: number;
}

export class Character implements ICharacter {
  id: string;

  name: string;
  surname: string;

  baseStats: StatBlock;

  advances: StatBlock;

  otherAdvances: number;

  race: string;

  job: Job;

  currentHP: number;

  triumph: number;
  ruin: number;

  constructor(params: IFauna<ICharacter>) {
    this.id = params.ref["@ref"].id

    this.name = params.data.name
    this.surname = params.data.surname
    this.baseStats = params.data.baseStats
    this.advances = params.data.advances
    this.otherAdvances = params.data.otherAdvances
    this.race = params.data.race
    this.job = params.data.job
    this.currentHP = params.data.currentHP
    this.triumph = params.data.triumph
    this.ruin = params.data.ruin
  }

  // For Vuex
  toJSON(excludeID?: boolean): ICharacter {
    const data = {...this}
    if(excludeID) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {id, ...dataProcessed} = data
      return dataProcessed
    } else {
      return data
    }
  }

  // Stats
  calcStat(character: Character, statName: keyof StatBlock, special?: 'half' | 'challenge'): number {
    const stat = character.baseStats[statName] + character.advances[statName] * 5
    switch (special) {
      case 'half':
        return Math.floor(stat / 2)
      case 'challenge':
        return stat - 50
      default:
        return stat
    }
  }

  genStats(special?: 'half' | 'challenge'): StatBlock {
    return {
      strength: this.calcStat(this, 'strength', special),
      dexterity: this.calcStat(this, 'dexterity', special),
      fortitude: this.calcStat(this, 'fortitude', special),
      intelligence: this.calcStat(this, 'intelligence', special),
      wisdom: this.calcStat(this, 'wisdom', special),
      charisma: this.calcStat(this, 'charisma', special)
    }
  }

  get stats(): StatBlock {
    return this.genStats();
  }

  get statsHalf(): StatBlock {
    return this.genStats('half')
  }

  get statsChallenge(): StatBlock {
    return this.genStats('challenge')
  }

  get level(): number {
    return Object.values(this.advances).reduce((prev, curr) => prev + curr, 0) + this.otherAdvances;
  }

  // Skills
  get proficiency(): Skill['name'][] {
    return [...this.job.skills]
  }

  // HP
  get maxHP(): number {
    const hpFortitudeBonus = Math.floor(Math.abs(this.statsChallenge.fortitude / 10))
    return (hpFortitudeBonus + this.job.bonusHP) * this.level
  }

  calcHP(amount: number): number {
    let newHP = this.currentHP
    if(this.currentHP + amount >= this.maxHP) {
      newHP = this.maxHP;
    } else if(this.currentHP + amount < this.maxHP && this.currentHP + amount >= 0) {
      newHP = newHP + amount
    } else if(this.currentHP + amount < 0) {
      newHP = 0
    }
    return newHP;
  }

  calcToken(tokenName: 'triumph' | 'ruin', amount: number): number {
    return this[tokenName] + amount
  }

  statCheck(statName: keyof StatBlock, challengeMod?: number, isHalf?: boolean, method?: Check['rollMethod']): Check {
    return new Check(isHalf ?  this.statsHalf[statName] : this.stats[statName], challengeMod || 0, method);
  }
}
