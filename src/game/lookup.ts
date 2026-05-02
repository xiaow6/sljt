// Localization lookups for cards/enemies/relics.
import { getLang } from "../i18n";
import { CARD_I18N } from "./cards.i18n";
import { ENEMY_I18N } from "./enemies.i18n";
import { RELIC_I18N } from "./relics.i18n";
import { RELICS, type RelicDef } from "./relics";
import type { CardDef, EnemyDef } from "./types";

export function cardName(card: CardDef): string {
  if (getLang() === "en") {
    return CARD_I18N[card.id]?.nameEn ?? card.name;
  }
  return card.name;
}

export function cardDescription(card: CardDef): string {
  if (getLang() === "en") {
    const t = CARD_I18N[card.id]?.descriptionEn;
    if (!t) return card.description;
    return card.upgraded ? `${t} (+)` : t;
  }
  return card.description;
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
