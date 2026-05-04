// Generate a before/after upgrade comparison table for every card.
// Run: npx tsx scripts/upgrade-table.ts > docs/card-upgrade-table.md
//
// Note: card descriptions are static strings baked into cards.ts, so the
// "after" description retains the original numbers + an "(升级)" hint.
// This script instead reads the structured `effect` field to compute the
// actual numeric upgrade deltas, giving an accurate before/after column.
import { CARDS } from "../src/game/cards";
import { upgradeCard } from "../src/game/upgrade";
import { CARD_I18N } from "../src/game/cards.i18n";
import type { CardDef, CardEffect } from "../src/game/types";

const ARCHETYPE_LABEL: Record<string, string> = {
  neutral: "中立",
  berserk: "狂暴",
  aegis: "护盾",
  drone: "无人机",
  cyber: "黑客",
};

const FIELD_LABEL: Record<keyof CardEffect, string> = {
  damage: "伤害",
  block: "格挡",
  draw: "抽牌",
  charge: "充能",
  hpCost: "HP 代价",
  heal: "治疗",
  vulnerable: "易伤",
  doubleNextAttack: "下击翻倍",
  bonusEnergy: "本回合能量",
  armor: "护甲",
  hack: "黑客",
  data: "信息流",
  summon: "召唤",
  custom: "自定义",
};

function formatEffect(e: CardEffect): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(e)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "custom") continue; // handled by name; not numeric
    if (typeof v === "boolean") {
      parts.push(`${FIELD_LABEL[k as keyof CardEffect] ?? k}`);
      continue;
    }
    parts.push(`${FIELD_LABEL[k as keyof CardEffect] ?? k} ${v}`);
  }
  return parts.length === 0 ? "—" : parts.join(", ");
}

// Engine-side upgrade behaviours for cards whose upgrade lives in custom code,
// not in the generic `effect` numbers. Sourced from src/game/engine.ts.
const CUSTOM_UPGRADE_NOTES: Record<string, string> = {
  data_scan: "抽 2/3 → 抽 3/4 张（充能 ≥ 10 时进高档）",
  plasma_strike: "基础伤害 8→10；充能加成 10→14",
  orbital_cannon: "充能 ×3 → 充能 ×4",
  singularity_bomb: "X ×10 → X ×12（每点 X 消耗 3 充能不变）",
};

function diffEffect(card: CardDef, after: CardDef): string {
  const before = card.effect;
  const aff = after.effect;
  const changes: string[] = [];
  const keys = new Set([
    ...(Object.keys(before) as (keyof CardEffect)[]),
    ...(Object.keys(aff) as (keyof CardEffect)[]),
  ]);
  for (const k of keys) {
    if (k === "custom" || k === "summon") continue;
    const a = before[k];
    const b = aff[k];
    if (a === b) continue;
    if (typeof a === "number" && typeof b === "number") {
      const delta = b - a;
      const sign = delta > 0 ? "+" : "";
      const arrow =
        k === "hpCost" ? (delta < 0 ? "↓" : "↑") : delta > 0 ? "↑" : "↓";
      changes.push(`${FIELD_LABEL[k] ?? k} ${a}→${b} (${arrow}${sign}${delta})`);
    } else if (typeof a !== typeof b) {
      changes.push(`${FIELD_LABEL[k] ?? k}: ${a ?? "—"} → ${b ?? "—"}`);
    }
  }
  // Custom-engine upgrades — show the actual gameplay change, not just a flag.
  const customId = before.custom;
  if (customId && CUSTOM_UPGRADE_NOTES[customId]) {
    changes.push(CUSTOM_UPGRADE_NOTES[customId]);
  } else if ((aff as CardEffect & { upgrade?: boolean }).upgrade && !customId) {
    changes.push("自定义升级生效（无文档变化）");
  } else if (customId && !CUSTOM_UPGRADE_NOTES[customId]) {
    changes.push(`(${customId}: 引擎未读 upgrade 标记 — 等同未升级)`);
  }
  return changes.length === 0 ? "—" : changes.join("; ");
}

interface Row {
  archetype: string;
  rarity: string;
  cost: string;
  name: string;
  nameEn: string;
  before: CardDef;
  after: CardDef;
}

function buildRow(id: string): Row {
  const before = CARDS[id];
  const after = upgradeCard(before);
  const i18n = CARD_I18N[id];
  return {
    archetype: ARCHETYPE_LABEL[before.archetype ?? "neutral"] ?? "—",
    rarity: before.rarity ?? "—",
    cost: String(before.cost),
    name: before.name,
    nameEn: i18n?.nameEn ?? before.name,
    before,
    after,
  };
}

const ids = Object.keys(CARDS);
const rows = ids.map(buildRow);

const RARITY_ORDER: Record<string, number> = { common: 0, uncommon: 1, rare: 2 };
const ARCH_ORDER = ["中立", "狂暴", "护盾", "无人机", "黑客"];

rows.sort((a, b) => {
  const ai = ARCH_ORDER.indexOf(a.archetype);
  const bi = ARCH_ORDER.indexOf(b.archetype);
  if (ai !== bi) return ai - bi;
  const ar = RARITY_ORDER[a.rarity] ?? 99;
  const br = RARITY_ORDER[b.rarity] ?? 99;
  if (ar !== br) return ar - br;
  return a.name.localeCompare(b.name);
});

const out: string[] = [];
out.push("# 卡牌升级对照表 · Card Upgrade Reference\n");
out.push(
  "> 所有 64 张卡升级前 / 升级后效果对比。升级在 *休整点* 或 *商店* 完成；每张牌只能升级一次（升级后名字带 +）。\n",
);
out.push(
  "> 表格按「实际效果数值」对比 — 因卡面描述文本静态写死，仅 `effect` 字段中的数值真正被升级机制提升。\n",
);
out.push("");
out.push("**升级规则速查 / Upgrade rules at a glance:**");
out.push("");
out.push(
  "- `damage / block / heal` → ×1.35（向上取整） · `damage / block / heal × 1.35 (ceil)`",
);
out.push("- `charge` → +1（仅当当前值 > 0） · `charge +1` (only if > 0)");
out.push("- `armor` → +2");
out.push("- `draw / vulnerable / hack / data / bonusEnergy` → +1");
out.push("- `hpCost` → −1（最低 1） · `hpCost −1` (floor at 1)");
out.push(
  "- 自定义效果（custom flag）会触发引擎专属升级逻辑 · custom-effect cards trigger their own engine path",
);
out.push("");

let currentArch = "";
for (const r of rows) {
  if (r.archetype !== currentArch) {
    currentArch = r.archetype;
    out.push("");
    out.push(`## ${currentArch}`);
    out.push("");
    out.push("| 费 | 卡名 | 稀有 | 升级前 effect | 升级后 effect | 变化 |");
    out.push("|:--:|:-----|:----:|:-------------|:-------------|:-----|");
  }
  const beforeEff = formatEffect(r.before.effect);
  const afterEff = formatEffect(r.after.effect);
  const delta = diffEffect(r.before, r.after);
  const rarity =
    ({ common: "普通", uncommon: "罕见", rare: "稀有" } as Record<string, string>)[
      r.rarity
    ] ?? r.rarity;
  const name = `${r.name}<br/><sub>${r.nameEn}</sub>`;
  out.push(
    `| ${r.cost} | ${name} | ${rarity} | ${beforeEff} | ${afterEff} | ${delta} |`,
  );
}

out.push("");
out.push("---");
out.push(`*共 ${rows.length} 张卡 · ${rows.length} cards total*`);
console.log(out.join("\n"));
