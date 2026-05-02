import type { EnemyDef, Intent } from "./types";

const atk = (value: number, hits = 1): Intent => ({
  kind: "attack",
  value,
  hits,
});
const blk = (value: number): Intent => ({ kind: "block", value });
const buff = (textKey: string): Intent => ({ kind: "buff", textKey });
const debuff = (textKey: string, value?: number): Intent => ({
  kind: "debuff",
  textKey,
  value,
});

export const ENEMIES: Record<string, EnemyDef> = {
  // ===== Act 1 =====
  spore_swarm: {
    id: "spore_swarm",
    name: "孢子虫群",
    hp: 16,
    art: "enemies/spore_swarm.png",
    pattern: (turn) => (turn % 2 === 0 ? atk(5) : atk(3, 2)),
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
      if (turn === 0) return buff("intent.charging");
      if (turn === 1) return atk(14);
      return turn % 2 === 0 ? atk(6) : blk(8);
    },
  },
  voidling: {
    id: "voidling",
    name: "虚空使徒",
    hp: 20,
    art: "enemies/voidling.png",
    pattern: (turn) =>
      turn % 3 === 0 ? debuff("intent.voidling.curse", 2) : atk(7),
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
      return atk(15);
    },
  },
  weaver: {
    id: "weaver",
    name: "织网者",
    hp: 90,
    isBoss: true,
    art: "enemies/weaver.png",
    pattern: (turn) => {
      if (turn > 0 && turn % 4 === 0)
        return {
          kind: "special",
          special: "weaver_rewind",
          textKey: "intent.weaver.rewind",
        };
      const r = turn % 5;
      if (r === 0)
        return { kind: "debuff", value: 3, textKey: "intent.weaver.rip" };
      if (r === 1) return atk(12);
      if (r === 2) return atk(6, 3);
      if (r === 3) return blk(12);
      return atk(20);
    },
  },

  // ===== Act 2 =====
  bio_titan: {
    id: "bio_titan",
    name: "生物泰坦",
    hp: 42,
    art: "enemies/bio_titan.png",
    pattern: (turn) => {
      const r = turn % 3;
      if (r === 0) return atk(11);
      if (r === 1) return atk(6, 2);
      return blk(10);
    },
  },
  swarm_queen: {
    id: "swarm_queen",
    name: "孢子母巢",
    hp: 36,
    art: "enemies/swarm_queen.png",
    pattern: (turn) => {
      const r = turn % 4;
      if (r === 0) return atk(9);
      if (r === 1)
        return { kind: "debuff", value: 2, textKey: "intent.queen.spread" };
      if (r === 2) return atk(4, 3);
      return blk(8);
    },
  },
  gravity_warden: {
    id: "gravity_warden",
    name: "引力监管者",
    hp: 130,
    isBoss: true,
    art: "enemies/gravity_warden.png",
    pattern: (turn) => {
      if (turn > 0 && turn % 3 === 0)
        return {
          kind: "special",
          special: "warden_compress",
          textKey: "intent.warden.compress",
        };
      const r = turn % 5;
      if (r === 0) return atk(16);
      if (r === 1) return atk(8, 2);
      if (r === 2)
        return { kind: "debuff", value: 2, textKey: "intent.warden.crush" };
      if (r === 3) return blk(20);
      return atk(24);
    },
  },

  // ===== Act 3 =====
  runic_priest: {
    id: "runic_priest",
    name: "符文祭司",
    hp: 44,
    art: "enemies/runic_priest.png",
    pattern: (turn) => {
      const r = turn % 4;
      if (r === 0)
        return { kind: "debuff", value: 3, textKey: "intent.priest.curse" };
      if (r === 1) return atk(10);
      if (r === 2) return blk(12);
      return atk(7, 2);
    },
  },
  silicon_inquisitor: {
    id: "silicon_inquisitor",
    name: "硅基审讯官",
    hp: 70,
    isElite: true,
    art: "enemies/silicon_inquisitor.png",
    pattern: (turn) => {
      const r = turn % 4;
      if (r === 0) return atk(14);
      if (r === 1) return atk(7, 2);
      if (r === 2) return blk(14);
      return atk(22);
    },
  },
  time_eater: {
    id: "time_eater",
    name: "蚀时者",
    hp: 54,
    art: "enemies/time_eater.png",
    pattern: (turn) => {
      const r = turn % 3;
      if (r === 0) return atk(12);
      if (r === 1) return atk(5, 3);
      return { kind: "debuff", value: 2, textKey: "intent.timeEater.warp" };
    },
  },
  council_speaker: {
    id: "council_speaker",
    name: "议会发言人",
    hp: 170,
    isBoss: true,
    art: "enemies/council_speaker.png",
    pattern: (turn) => {
      if (turn > 0 && turn % 3 === 0)
        return {
          kind: "special",
          special: "council_judgment",
          textKey: "intent.council.judgment",
        };
      const r = turn % 6;
      if (r === 0)
        return { kind: "debuff", value: 4, textKey: "intent.council.verdict" };
      if (r === 1) return atk(18);
      if (r === 2) return atk(10, 2);
      if (r === 3) return blk(20);
      if (r === 4) return atk(7, 4);
      return atk(30);
    },
  },

  // ===== Act 4 =====
  precursor_heart: {
    id: "precursor_heart",
    name: "先驱者之心",
    hp: 240,
    isBoss: true,
    art: "enemies/precursor_heart.png",
    pattern: (turn) => {
      if (turn > 0 && turn % 4 === 0)
        return {
          kind: "special",
          special: "heart_regen",
          textKey: "intent.heart.regen",
        };
      if (turn > 0 && turn % 5 === 0)
        return {
          kind: "special",
          special: "heart_collapse",
          textKey: "intent.heart.collapse",
        };
      const r = turn % 7;
      if (r === 0)
        return { kind: "debuff", value: 5, textKey: "intent.heart.corruption" };
      if (r === 1) return atk(20);
      if (r === 2) return atk(10, 3);
      if (r === 3) return blk(30);
      if (r === 4) return atk(15, 2);
      if (r === 6) return atk(8, 4);
      return atk(45);
    },
  },
};
