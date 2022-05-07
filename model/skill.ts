import StatBlock from "~/model/stat-block";

export default interface Skill {
  name: string,
  stat: keyof StatBlock,
  advanced: boolean
}
