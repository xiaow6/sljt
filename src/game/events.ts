// Random events (mystery nodes) — gambling, blood-pact, mystery-box themed.
//
// Each event has 1-4 choices. Each choice has a label + optional cost hint, and a
// resolver function that mutates the run state and returns a result message.

import type { CardDef, RunState } from "./types";
import { CARDS, REWARD_POOL_IDS } from "./cards";

export interface EventChoice {
  label: string;
  hint?: string;
  enabled?: (run: RunState) => boolean;
  resolve: (run: RunState) => string; // returns flavor result text
}

export interface EventDef {
  id: string;
  name: string;
  icon: string;
  flavor: string;
  choices: EventChoice[];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function damagePlayer(run: RunState, n: number) {
  // Events ignore the in-combat self-harm floor; an event can drop you to 1 HP min.
  run.playerHp = Math.max(1, run.playerHp - n);
}

function healPlayer(run: RunState, n: number) {
  run.playerHp = Math.min(run.playerMaxHp, run.playerHp + n);
}

function randomRewardCard(): CardDef {
  const id = pickRandom(REWARD_POOL_IDS);
  return { ...CARDS[id] };
}

function addCurseInfection(run: RunState) {
  // A curse pseudo-card. We don't have a curse system yet; we approximate by
  // adding a useless "感染" card that costs energy and does nothing.
  const curse: CardDef = {
    id: "curse_infection",
    name: "感染",
    cost: 1,
    type: "skill",
    target: "self",
    description: "感染。无效果。无法消除。",
    art: "cards/laser_shot.png", // placeholder art
    effect: {},
    archetype: "neutral",
  };
  run.deck.push(curse);
}

export const EVENTS: EventDef[] = [
  {
    id: "blood_altar",
    name: "血祭祭坛",
    icon: "🩸",
    flavor:
      "你在走廊深处发现一座由生骨垒起的祭坛,中央悬浮着一颗跳动的紫色心脏。墙上的符文正在等待献祭。",
    choices: [
      {
        label: "献祭 10 HP,换一件随机稀有遗物",
        hint: "−10 HP · +遗物",
        enabled: (run) => run.playerHp > 11,
        resolve: (run) => {
          damagePlayer(run, 10);
          const pool = ["quantum_battery", "tactical_hud", "energy_core", "emergency_medkit", "overload_buffer"]
            .filter((r) => !run.relics.includes(r));
          if (pool.length === 0) return "你献血了,但祭坛已空。";
          const r = pickRandom(pool);
          run.relics.push(r);
          return `祭坛接受了你的血祭。你获得了遗物。`;
        },
      },
      {
        label: "拒绝。",
        resolve: () => "你转身离开。心脏跳动声仍在脑中回响。",
      },
    ],
  },

  {
    id: "quantum_roulette",
    name: "量子赌轮",
    icon: "🎰",
    flavor:
      "一座先驱者赌轮悬浮在空荡的房间里,刻盘上写着「亏与赚」。你听见千万种可能的命运在低语。",
    choices: [
      {
        label: "下注。50% 概率获 50 金币,50% 概率失 5 HP。",
        hint: "赌一把",
        resolve: (run) => {
          if (Math.random() < 0.5) {
            run.gold += 50;
            return "赌轮停在金色一侧。+50 金币。";
          }
          damagePlayer(run, 5);
          return "赌轮停在血色一侧。−5 HP。";
        },
      },
      {
        label: "重注。50% 概率获 120 金币,50% 概率失 12 HP。",
        hint: "all in",
        enabled: (run) => run.playerHp > 13,
        resolve: (run) => {
          if (Math.random() < 0.5) {
            run.gold += 120;
            return "命运站在你这边。+120 金币。";
          }
          damagePlayer(run, 12);
          return "你听见赌轮发出冷笑。−12 HP。";
        },
      },
      {
        label: "走开。",
        resolve: () => "你侧过身离开。",
      },
    ],
  },

  {
    id: "mystery_crate",
    name: "盲盒补给箱",
    icon: "📦",
    flavor:
      "走廊上躺着一只密封的先驱者补给箱。封面上写着古老的运算符号——可能是奖励,也可能是陷阱。",
    choices: [
      {
        label: "打开。",
        hint: "随机结果",
        resolve: (run) => {
          const roll = Math.random();
          if (roll < 0.3) {
            const card = randomRewardCard();
            run.deck.push(card);
            return `箱内静静躺着一张稀有卡:${card.name}。`;
          }
          if (roll < 0.55) {
            healPlayer(run, 20);
            return "一只医疗模块自动展开,治疗 20 HP。";
          }
          if (roll < 0.75) {
            run.gold += 60;
            return "箱内是 60 金币。";
          }
          if (roll < 0.92) {
            damagePlayer(run, 8);
            return "箱内的神经毒气泄露。−8 HP。";
          }
          addCurseInfection(run);
          return "箱内空空如也,但你的牌库里多了一张「感染」。";
        },
      },
      {
        label: "走开。",
        resolve: () => "你不喜欢未知。",
      },
    ],
  },

  {
    id: "ancient_pact",
    name: "古老契约",
    icon: "📜",
    flavor:
      "一道无形的低语穿透你的头盔:「永远割舍一片血肉,我们便赠予你两份秘技。」",
    choices: [
      {
        label: "签约。−5 最大 HP,获 2 张随机稀有卡。",
        hint: "永久换卡",
        enabled: (run) => run.playerMaxHp > 30,
        resolve: (run) => {
          run.playerMaxHp -= 5;
          run.playerHp = Math.min(run.playerHp, run.playerMaxHp);
          const a = randomRewardCard();
          const b = randomRewardCard();
          run.deck.push(a, b);
          return `契约成立。你失去 5 最大 HP,获得 ${a.name}、${b.name}。`;
        },
      },
      {
        label: "撕毁契约。",
        resolve: () => "低语沉入虚空。",
      },
    ],
  },

  {
    id: "overload_trial",
    name: "过载实验",
    icon: "⚡",
    flavor:
      "舱内有一台无人值守的过载实验装置。能让你的身体经历短暂的能量灌注——风险自负。",
    choices: [
      {
        label: "插入插管。失去 1/4 当前 HP,接下来 3 战开局 +5 充能。",
        hint: "短期 buff",
        resolve: (run) => {
          const loss = Math.max(1, Math.floor(run.playerHp / 4));
          damagePlayer(run, loss);
          // We piggyback on relics array — add a temp marker. Alternatively use
          // preloadedHack-style stash. For MVP we just give the quantum_battery relic
          // if not owned, otherwise extra start charge as preloaded hack equivalent.
          if (!run.relics.includes("quantum_battery")) {
            run.relics.push("quantum_battery");
            return `失去 ${loss} HP。你获得遗物「量子电池」(开局 +5 充能)。`;
          }
          run.preloadedHack += 0; // no-op placeholder
          return `失去 ${loss} HP。但你已拥有量子电池——身体只剩烧灼感。`;
        },
      },
      {
        label: "退出。",
        resolve: () => "你拔下插管。",
      },
    ],
  },

  {
    id: "corruption",
    name: "腐化感染",
    icon: "☣",
    flavor:
      "走廊尽头有一只活体生物机舱。它似乎在邀请你接受「先驱者血脉」——异化将带来力量,代价是脑中的回响。",
    choices: [
      {
        label: "接受感染。+25 最大 HP,牌库 +1「感染」诅咒。",
        hint: "永久换 HP",
        resolve: (run) => {
          run.playerMaxHp += 25;
          run.playerHp += 25;
          addCurseInfection(run);
          return "你的身体被异化。+25 最大 HP,牌库永久 +1「感染」。";
        },
      },
      {
        label: "拒绝。",
        resolve: () => "你后退一步。机舱发出叹息。",
      },
    ],
  },

  {
    id: "cyber_oracle",
    name: "赛博占卜师",
    icon: "🔮",
    flavor:
      "一个被电缆缠绕的躯体跪坐在房间中央,空洞的头盔向你低语:「我能从你的牌库里抹去一张牌,只需付出一点代价。」",
    choices: [
      {
        label: "付 50 金币,从牌库随机移除一张牌。",
        hint: "−50 金币",
        enabled: (run) => run.gold >= 50 && run.deck.length > 5,
        resolve: (run) => {
          run.gold -= 50;
          const idx = Math.floor(Math.random() * run.deck.length);
          const removed = run.deck.splice(idx, 1)[0];
          return `你支付了金币。占卜师从牌库中抹去了「${removed.name}」。`;
        },
      },
      {
        label: "付 10 HP,从牌库随机移除一张牌。",
        hint: "−10 HP",
        enabled: (run) => run.playerHp > 11 && run.deck.length > 5,
        resolve: (run) => {
          damagePlayer(run, 10);
          const idx = Math.floor(Math.random() * run.deck.length);
          const removed = run.deck.splice(idx, 1)[0];
          return `占卜师品尝了你的血。「${removed.name}」消失了。`;
        },
      },
      {
        label: "拒绝交易。",
        resolve: () => "占卜师沉默,你转身离开。",
      },
    ],
  },

  {
    id: "radiation_pod",
    name: "辐射坠舱",
    icon: "☢",
    flavor:
      "你撞见一只破裂的逃生舱,舱中尸体已经化作金属与晶矿。强烈辐射在腐蚀一切。",
    choices: [
      {
        label: "暴露在辐射中搜刮。−15 HP,+80 金币,治疗一半最大 HP。",
        hint: "高风险高回报",
        enabled: (run) => run.playerHp > 16,
        resolve: (run) => {
          damagePlayer(run, 15);
          run.gold += 80;
          healPlayer(run, Math.floor(run.playerMaxHp / 2));
          return "你忍着剧痛搜刮完毕。+80 金币,治疗了一半。";
        },
      },
      {
        label: "绕过辐射区。",
        resolve: () => "你绕过坠舱,但回头看了一眼。",
      },
    ],
  },

  {
    id: "precursor_pact",
    name: "先驱者契约",
    icon: "👁",
    flavor:
      "你在走廊正中央见到一只悬浮的青色卷轴。卷轴上刻着先驱者的契约。它似乎能听懂你想要什么。",
    choices: [
      {
        label: "+20 最大 HP",
        hint: "强化生存",
        resolve: (run) => {
          run.playerMaxHp += 20;
          run.playerHp += 20;
          return "你的身体被先驱者重塑。+20 最大 HP。";
        },
      },
      {
        label: "+200 金币",
        hint: "财富",
        resolve: (run) => {
          run.gold += 200;
          return "卷轴溶解为 200 金币。";
        },
      },
      {
        label: "获得 3 张随机稀有卡",
        hint: "卡组扩张",
        resolve: (run) => {
          const a = randomRewardCard();
          const b = randomRewardCard();
          const c = randomRewardCard();
          run.deck.push(a, b, c);
          return `你获得三张稀有卡:${a.name} / ${b.name} / ${c.name}。`;
        },
      },
      {
        label: "拒绝契约。",
        resolve: () => "你撕碎卷轴。先驱者沉默了。",
      },
    ],
  },

  {
    id: "blood_market",
    name: "血色集市",
    icon: "🏪",
    flavor:
      "一个佝偻的赛博商人在隧道里支起摊位。他不收金币——只接受血。",
    choices: [
      {
        label: "用 8 HP 换一张随机稀有卡",
        hint: "−8 HP",
        enabled: (run) => run.playerHp > 9,
        resolve: (run) => {
          damagePlayer(run, 8);
          const c = randomRewardCard();
          run.deck.push(c);
          return `商人接受了你的血,递来「${c.name}」。`;
        },
      },
      {
        label: "用 15 HP 换 100 金币",
        hint: "−15 HP +100 金币",
        enabled: (run) => run.playerHp > 16,
        resolve: (run) => {
          damagePlayer(run, 15);
          run.gold += 100;
          return "商人喝下你的血,扔来 100 金币。";
        },
      },
      {
        label: "用 20 HP 删除牌库中一张随机牌",
        hint: "−20 HP",
        enabled: (run) => run.playerHp > 21 && run.deck.length > 5,
        resolve: (run) => {
          damagePlayer(run, 20);
          const idx = Math.floor(Math.random() * run.deck.length);
          const removed = run.deck.splice(idx, 1)[0];
          return `商人施展异能。「${removed.name}」从你的记忆中消失。`;
        },
      },
      {
        label: "什么都不要。",
        resolve: () => "你掂量着自己的血,最终选择保留。",
      },
    ],
  },
];

export function pickRandomEvent(): EventDef {
  return pickRandom(EVENTS);
}
