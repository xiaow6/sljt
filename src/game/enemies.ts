import type { EnemyDef, Intent } from "./types";

const atk = (value: number, hits = 1, text?: string): Intent => ({
  kind: "attack",
  value,
  hits,
  text: text ?? `攻击 ${value}${hits > 1 ? `×${hits}` : ""}`,
});
const blk = (value: number): Intent => ({ kind: "block", value, text: `防御 ${value}` });
const buff = (text: string): Intent => ({ kind: "buff", text });
const debuff = (text: string): Intent => ({ kind: "debuff", text });

export const ENEMIES: Record<string, EnemyDef> = {
  spore_swarm: {
    id: "spore_swarm",
    name: "孢子虫群",
    hp: 16,
    art: "enemies/spore_swarm.png",
    pattern: (turn) => {
      // alternates attack 5 / attack 3x2
      return turn % 2 === 0 ? atk(5) : atk(3, 2);
    },
  },
  biomech_drone: {
    id: "biomech_drone",
    name: "生物机甲",
    hp: 22,
    art: "enemies/biomech_drone.png",
    pattern: (turn) => {
      const r = turn % 3;
      if (r === 0) return atk(8);
      if (r === 1) return blk(6);
      return atk(4, 2);
    },
  },
  dormant_sentinel: {
    id: "dormant_sentinel",
    name: "休眠哨兵",
    hp: 28,
    art: "enemies/dormant_sentinel.png",
    pattern: (turn) => {
      // turn 0: buff/charge, then heavy hit
      if (turn === 0) return buff("充能中");
      if (turn === 1) return atk(14, 1, "重击 14");
      return turn % 2 === 0 ? atk(6) : blk(8);
    },
  },
  voidling: {
    id: "voidling",
    name: "虚空使徒",
    hp: 20,
    art: "enemies/voidling.png",
    pattern: (turn) => {
      if (turn % 3 === 0) return debuff("施加易伤 2");
      return atk(7);
    },
  },
  evolved: {
    id: "evolved",
    name: "进化体",
    hp: 48,
    isElite: true,
    art: "enemies/evolved.png",
    pattern: (turn) => {
      const r = turn % 4;
      if (r === 0) return atk(10);
      if (r === 1) return atk(5, 2);
      if (r === 2) return blk(10);
      return atk(15, 1, "猛击 15");
    },
  },
  weaver: {
    id: "weaver",
    name: "织网者",
    hp: 90,
    isBoss: true,
    art: "enemies/weaver.png",
    pattern: (turn) => {
      const r = turn % 5;
      if (r === 0) return debuff("撕裂时间 (易伤 3)");
      if (r === 1) return atk(12);
      if (r === 2) return atk(6, 3, "织网 6×3");
      if (r === 3) return blk(12);
      return atk(20, 1, "湮灭 20");
    },
  },
};
