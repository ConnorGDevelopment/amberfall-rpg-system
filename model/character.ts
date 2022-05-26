import { NuxtAxiosInstance } from "@nuxtjs/axios";
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

export class Character {
  id: string;
  private data: ICharacter;

  get name(): string {return this.data.name};
  get surname(): string {return this.data.surname}

  get baseStats(): StatBlock {return this.data.baseStats};
  get advances(): StatBlock {return this.data.advances};
  get otherAdvances(): number {return this.data.otherAdvances}
  get race(): string {return this.data.race}
  get job(): Job {return this.data.job}

  get currentHP(): number {return this.data.currentHP}
  setCurrentHP(axios: NuxtAxiosInstance, amount: number ): void {
    if(this.currentHP + amount >= this.maxHP) {
      this.data.currentHP = this.maxHP
    } else if(this.currentHP + amount < this.maxHP && this.currentHP + amount >= 0) {
      this.data.currentHP = this.data.currentHP + amount
    } else if(this.currentHP + amount < 0) {
      this.data.currentHP = 0
    }
    axios.post('/.netlify/functions/update-hp', { id: this.id, currentHP: this.currentHP })
  }


  get triumph(): number {return this.data.triumph}
  get ruin(): number {return this.data.ruin};
  setToken(axios: NuxtAxiosInstance, tokenName: 'triumph' | 'ruin', amount: number) {
    if(this[tokenName] + amount >= 0) {
      this.data[tokenName] = this.data[tokenName] + amount;
    }
    axios.post('/.netlify/functions/update-tokens', {id: this.id, triumph: this.triumph, ruin: this.ruin})
  }

  constructor(params: IFauna<ICharacter>) {
    this.id = params.ref["@ref"].id
    this.data = params.data
  }

  // For Vuex
  toJSON(): ICharacter {
    return this.data
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

  statCheck(statName: keyof StatBlock, challengeMod?: number, isHalf?: boolean, method?: Check['rollMethod']): Check {
    return new Check(isHalf ?  this.statsHalf[statName] : this.stats[statName], challengeMod || 0, method);
  }
}
