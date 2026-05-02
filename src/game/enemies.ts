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
    pattern: (turn) => (turn % 3 === 0 ? debuff("施加易伤 2") : atk(7)),
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
      // Signature: every 4 turns, "时空回溯" — discard 2 random hand cards + 2 weak.
      if (turn > 0 && turn % 4 === 0)
        return {
          kind: "special",
          special: "weaver_rewind",
          text: "时空回溯 (弃 2 张 + 虚弱 2)",
        };
      const r = turn % 5;
      if (r === 0) return { kind: "debuff", value: 3, text: "撕裂时间 (易伤 3)" };
      if (r === 1) return atk(12);
      if (r === 2) return atk(6, 3, "织网 6×3");
      if (r === 3) return blk(12);
      return atk(20, 1, "湮灭 20");
    },
  },

  // ===== Act 2 — 生物核心 =====
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
      if (r === 1) return debuff("孢子蔓延 (易伤 2)");
      if (r === 2) return atk(4, 3, "孢子群 4×3");
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
      // Signature: every 3 turns, "重力压缩" — apply 2 vuln + 2 weak (compound).
      if (turn > 0 && turn % 3 === 0)
        return {
          kind: "special",
          special: "warden_compress",
          text: "重力压缩 (易伤 2 + 虚弱 2)",
        };
      const r = turn % 5;
      if (r === 0) return atk(16);
      if (r === 1) return atk(8, 2);
      if (r === 2) return { kind: "debuff", value: 2, text: "引力压制 (易伤 2)" };
      if (r === 3) return blk(20);
      return atk(24, 1, "奇点撞击 24");
    },
  },

  // ===== Act 3 — 议会塔 =====
  runic_priest: {
    id: "runic_priest",
    name: "符文祭司",
    hp: 44,
    art: "enemies/runic_priest.png",
    pattern: (turn) => {
      const r = turn % 4;
      if (r === 0) return debuff("符文诅咒 (易伤 3)");
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
      return atk(22, 1, "刑讯 22");
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
      if (r === 1) return atk(5, 3, "时刃 5×3");
      return debuff("时间错乱 (易伤 2)");
    },
  },
  council_speaker: {
    id: "council_speaker",
    name: "议会发言人",
    hp: 170,
    isBoss: true,
    art: "enemies/council_speaker.png",
    pattern: (turn) => {
      // Signature: every 3 turns, "议会判决" — damage based on player hand size.
      if (turn > 0 && turn % 3 === 0)
        return {
          kind: "special",
          special: "council_judgment",
          text: "议会判决 (5 × 手牌数 伤害)",
        };
      const r = turn % 6;
      if (r === 0) return { kind: "debuff", value: 4, text: "议会判决 (易伤 4)" };
      if (r === 1) return atk(18);
      if (r === 2) return atk(10, 2);
      if (r === 3) return blk(20);
      if (r === 4) return atk(7, 4, "符文齐射 7×4");
      return atk(30, 1, "终审 30");
    },
  },

  // ===== Act 4 — 先驱者之心 =====
  precursor_heart: {
    id: "precursor_heart",
    name: "先驱者之心",
    hp: 240,
    isBoss: true,
    art: "enemies/precursor_heart.png",
    // Phase signature: every 4 turns "原初再生" — heal 20. At low HP, every 2 turns
    // applies "时空崩塌" (vulnerable + weak).
    pattern: (turn) => {
      if (turn > 0 && turn % 4 === 0)
        return {
          kind: "special",
          special: "heart_regen",
          text: "原初再生 (治疗 20)",
        };
      if (turn > 0 && turn % 5 === 0)
        return {
          kind: "special",
          special: "heart_collapse",
          text: "时空崩塌 (易伤 3 + 虚弱 3)",
        };
      const r = turn % 7;
      if (r === 0) return { kind: "debuff", value: 5, text: "源初腐化 (易伤 5)" };
      if (r === 1) return atk(20);
      if (r === 2) return atk(10, 3, "心搏冲击 10×3");
      if (r === 3) return blk(30);
      if (r === 4) return atk(15, 2);
      if (r === 6) return atk(8, 4, "终焉齐射 8×4");
      return atk(45, 1, "存在抹消 45");
    },
  },
};
