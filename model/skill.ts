import StatBlock from "~/model/stat-block";

export default interface Skill {
  name: string,
  statName: keyof StatBlock,
  advanced: boolean
}
