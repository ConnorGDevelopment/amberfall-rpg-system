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

  constructor(params: ICharacter) {
    this.name = params.name;
    this.surname = params.name;

    this.baseStats = params.baseStats;

    this.advances = params.advances;

    this.otherAdvances = params.otherAdvances;

    this.race = params.race;

    this.job = params.job;

    this.currentHP = params.currentHP;

    this.triumph = params.triumph;
    this.ruin = params.ruin;
  }

  // Stats
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

  halfStat(statName: keyof StatBlock): number {
    return Math.floor(this.stats[statName] / 2)
  }

  challengeModifier(statName: keyof StatBlock): number {
    return this.stats[statName] - 50
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
}
