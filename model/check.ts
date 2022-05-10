import rollDice from "./roll";

export default class Check {
  method: 'advantage' | 'flat' | 'disadvantage' = 'flat';
  log: number[] = [];

  get value(): number {
    if(this.method === 'advantage') {
      return Math.min(...this.log)
    } else if(this.method === 'disadvantage') {
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

  constructor(public target: number, method?: Check['method']) {
    if(method) { this.method = method };

    this.log.push(rollDice(1, 100));

    if(this.method === 'advantage' || this.method === 'disadvantage') {
      this.log.push(rollDice(1, 100))
    }
  }
}
