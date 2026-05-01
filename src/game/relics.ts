export interface RelicDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const RELICS: Record<string, RelicDef> = {
  quantum_battery: {
    id: "quantum_battery",
    name: "量子电池",
    description: "战斗开始时获得 5 点充能。",
    icon: "🔋",
  },
  tactical_hud: {
    id: "tactical_hud",
    name: "战术 HUD",
    description: "战斗开始时额外抽 2 张牌(仅首回合)。",
    icon: "🎯",
  },
  energy_core: {
    id: "energy_core",
    name: "能量核心",
    description: "每回合最大能量 +1。",
    icon: "⚡",
  },
  emergency_medkit: {
    id: "emergency_medkit",
    name: "应急医疗包",
    description: "每场战斗胜利后治疗 4 HP。",
    icon: "❤",
  },
  overload_buffer: {
    id: "overload_buffer",
    name: "过载缓冲",
    description: "反应堆超频不再失去 HP。",
    icon: "🛡",
  },
};

export const STARTER_RELIC_POOL = [
  "quantum_battery",
  "tactical_hud",
  "energy_core",
];

export const ELITE_RELIC_POOL = [
  "emergency_medkit",
  "overload_buffer",
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
