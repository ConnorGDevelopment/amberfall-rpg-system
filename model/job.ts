import StatBlock from "~/model/stat-block";
import Skill from "~/model/skill";

export default interface Job {
  name: string;
  bonusHP: number;
  advanceBlock: StatBlock;
  skills: Skill['name'][];
}
