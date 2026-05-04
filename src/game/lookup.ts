// Localization lookups for cards/enemies/relics.
import { getLang } from "../i18n";
import { CARD_I18N } from "./cards.i18n";
import { CARDS } from "./cards";
import { ENEMY_I18N } from "./enemies.i18n";
import { RELIC_I18N } from "./relics.i18n";
import { RELICS, type RelicDef } from "./relics";
import { upgradeCard } from "./upgrade";
import type { CardDef, CardEffect, EnemyDef } from "./types";

export function cardName(card: CardDef): string {
  if (getLang() === "en") {
    return CARD_I18N[card.id]?.nameEn ?? card.name;
  }
  return card.name;
}

// Custom-engine cards keep their per-card numbers in engine.ts (not the
// effect dict), so the generic number-rewriter can't see them. Spell out
// their upgraded descriptions here.
//
// IMPORTANT: keys must match values that actually change in engine.ts when
// `card.upgraded` is true. See the same-named cases in resolveEffects().
const CUSTOM_UPGRADED_DESC: Record<
  string,
  { zh: string; en: string }
> = {
  data_scan: {
    zh: "抽 3 张牌;若充能 ≥ 10,改为抽 4 张。",
    en: "Draw 3. If Charge ≥ 10, draw 4 instead.",
  },
  plasma_strike: {
    zh: "造成 10 点伤害。消耗 3 充能,则额外造成 14 点伤害。",
    en: "Deal 10 damage. Spend 3 Charge: deal 14 more.",
  },
  orbital_cannon: {
    zh: "造成等同于「充能 × 4」的伤害,消耗所有充能。",
    en: "Deal Charge × 4 damage. Spend all Charge.",
  },
  singularity_bomb: {
    zh: "对所有敌人造成 X × 12 伤害。消耗 X × 3 充能(不足则无法施放)。消耗。",
    en: "Deal X × 12 to all enemies. Spend X × 3 Charge (must afford). Exhaust.",
  },
  // Powers/skills whose engine reads were wired in this same change.
  nano_repair: {
    zh: "能力。回合结束治疗 3 HP。",
    en: "Power. Heal 3 HP at end of turn.",
  },
  tactical_ai: {
    zh: "能力。每当你获得充能时,获得 2 点格挡。",
    en: "Power. Whenever you gain Charge, gain 2 Block.",
  },
  reactor_overclock: {
    zh: "能力。每回合开始获得 4 充能,失去 2 HP。",
    en: "Power. Each turn start, gain 4 Charge and lose 2 HP.",
  },
  nuclear_meltdown: {
    zh: "能力。每回合开始获得 5 充能,失去 3 HP。",
    en: "Power. Each turn start, gain 5 Charge and lose 3 HP.",
  },
  phoenix_protocol: {
    zh: "能力。本场战斗第一次 HP < 30% 时,治疗 40 HP。",
    en: "Power. First time this combat HP drops below 30%, heal 40 HP.",
  },
  overload_discharge: {
    zh: "消耗 5 充能,对所有敌人造成 20 伤害。",
    en: "Spend 5 Charge: deal 20 damage to all enemies.",
  },
  iron_wall: {
    zh: "若已有格挡 ≥ 10,获得 8 点格挡;否则获得 5 点格挡。",
    en: "If Block ≥ 10, gain 8 Block; otherwise gain 5.",
  },
  field_charge: {
    zh: "下回合开始时获得 12 点格挡。",
    en: "Gain 12 Block at the start of next turn.",
  },
  magnetic_storm: {
    // block=12 is generic-upgraded ×1.35→17 by upgradeCard; the AOE damage
    // is the engine-side custom upgrade.
    zh: "获得 17 格挡,对所有敌人造成 6 伤害。",
    en: "Gain 17 Block. Deal 6 damage to all enemies.",
  },
  absolute_zero: {
    // vulnerable 2→3 from generic upgrade; damage 28→38 from engine custom.
    zh: "施加 3 易伤。若你有 ≥ 20 格挡,造成 38 伤害。",
    en: "Apply 3 Vulnerable. If Block ≥ 20, deal 38 damage.",
  },
};

// Generic upgraded-description rewriter: replace each numeric effect value
// from the original card def with the upgraded value, in-place in the static
// description text. Works for the 50+ cards whose upgrade simply scales
// effect.damage / block / heal / charge / etc.
function rewriteForUpgrade(desc: string, before: CardEffect, after: CardEffect): string {
  let out = desc;
  for (const k of Object.keys(before) as (keyof CardEffect)[]) {
    const a = before[k];
    const b = after[k];
    if (typeof a === "number" && typeof b === "number" && a !== b) {
      // Only swap stand-alone numbers (not parts of longer numbers).
      out = out.replace(new RegExp(`(?<![0-9])${a}(?![0-9])`), String(b));
    }
  }
  return out;
}

export function cardDescription(card: CardDef): string {
  const lang = getLang();
  const baseZh = card.description;
  const baseEn = CARD_I18N[card.id]?.descriptionEn ?? card.description;

  if (!card.upgraded) return lang === "en" ? baseEn : baseZh;

  // Custom-engine override: explicit upgraded text per card id.
  const override = CUSTOM_UPGRADED_DESC[card.id];
  if (override) return lang === "en" ? override.en : override.zh;

  // Generic numeric rewrite, using CARDS as the immutable "before" reference.
  const source = CARDS[card.id];
  if (source) {
    const beforeZh = source.description;
    const beforeEn = CARD_I18N[card.id]?.descriptionEn ?? source.description;
    const afterEffect = card.effect;
    const beforeEffect = source.effect;
    if (lang === "en") return rewriteForUpgrade(beforeEn, beforeEffect, afterEffect);
    return rewriteForUpgrade(beforeZh, beforeEffect, afterEffect);
  }
  return lang === "en" ? baseEn : baseZh;
}

// Compute the upgraded version of a card without mutating the caller's copy —
// used by the rest/shop pickers to render a side-by-side preview.
export function previewUpgrade(card: CardDef): CardDef {
  if (card.upgraded) return card;
  return upgradeCard(card);
}

export function cardLore(card: CardDef): string | undefined {
  const i = CARD_I18N[card.id];
  if (!i) return undefined;
  return getLang() === "en" ? i.loreEn ?? i.lore : i.lore ?? i.loreEn;
}

export function enemyName(def: EnemyDef): string {
  if (getLang() === "en") {
    return ENEMY_I18N[def.id]?.nameEn ?? def.name;
  }
  return def.name;
}

export function enemyLore(def: EnemyDef): string | undefined {
  const i = ENEMY_I18N[def.id];
  if (!i) return undefined;
  return getLang() === "en" ? i.loreEn ?? i.lore : i.lore ?? i.loreEn;
}

export function relicName(id: string): string {
  const def = RELICS[id];
  if (getLang() === "en") return RELIC_I18N[id]?.nameEn ?? def?.name ?? id;
  return def?.name ?? id;
}

export function relicDescription(id: string): string {
  const def = RELICS[id];
  if (getLang() === "en") return RELIC_I18N[id]?.descriptionEn ?? def?.description ?? "";
  return def?.description ?? "";
}

export function relicLore(id: string): string | undefined {
  const i = RELIC_I18N[id];
  if (!i) return undefined;
  return getLang() === "en" ? i.loreEn ?? i.lore : i.lore ?? i.loreEn;
}

export function getAllRelics(): RelicDef[] {
  return Object.values(RELICS);
}
