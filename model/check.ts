import rollDice from "./roll";

export default class Check {
  rollMethod: 'advantage' | 'flat' | 'disadvantage' = 'flat';
  log: number[] = [];

  get value(): number {
    if(this.rollMethod === 'advantage') {
      return Math.min(...this.log)
    } else if(this.rollMethod === 'disadvantage') {
      return Math.max(...this.log)
    } else {
      return this.log[0]
    }
  }

  get success(): boolean {
    if(this.value <= this.target) {
      return true
    } else {
      return false
    }
  }

  get triumph(): boolean {
    if(this.value <= Math.floor(this.target / 2)) {
      return true
    } else {
      return false
    }
  }

  get ruin(): boolean {
    if(this.value >= Math.floor(this.target * 2)) {
      return true
    } else {
      return false
    }
  }

  constructor(public target: number, rollMethod?: Check['rollMethod']) {
    if(rollMethod) { this.rollMethod = rollMethod };

    this.log.push(rollDice(1, 100));

    if(this.rollMethod === 'advantage' || this.rollMethod === 'disadvantage') {
      this.log.push(rollDice(1, 100))
    }
  }
}
