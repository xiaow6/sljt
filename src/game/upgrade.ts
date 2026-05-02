import type { CardDef } from "./types";

// Programmatic card upgrade. Returns a new CardDef with effect numbers
// boosted and name suffixed with "+".
export function upgradeCard(card: CardDef): CardDef {
  if (card.upgraded) return card; // already upgraded
  const u: CardDef = {
    ...card,
    upgraded: true,
    name: card.name + "+",
    effect: { ...card.effect },
  };

  // Generic numeric buffs.
  if (typeof u.effect.damage === "number") {
    u.effect.damage = Math.ceil(u.effect.damage * 1.35);
  }
  if (typeof u.effect.block === "number") {
    u.effect.block = Math.ceil(u.effect.block * 1.35);
  }
  if (typeof u.effect.heal === "number") {
    u.effect.heal = Math.ceil(u.effect.heal * 1.35);
  }
  if (typeof u.effect.charge === "number" && u.effect.charge > 0) {
    u.effect.charge = u.effect.charge + 1;
  }
  if (typeof u.effect.armor === "number") {
    u.effect.armor = u.effect.armor + 2;
  }
  if (typeof u.effect.draw === "number") {
    u.effect.draw = u.effect.draw + 1;
  }
  if (typeof u.effect.vulnerable === "number") {
    u.effect.vulnerable = u.effect.vulnerable + 1;
  }
  if (typeof u.effect.hack === "number") {
    u.effect.hack = u.effect.hack + 1;
  }
  if (typeof u.effect.data === "number") {
    u.effect.data = u.effect.data + 1;
  }
  if (typeof u.effect.bonusEnergy === "number") {
    u.effect.bonusEnergy = u.effect.bonusEnergy + 1;
  }
  // hpCost gets reduced (cheaper cost) — better card.
  if (typeof u.effect.hpCost === "number" && u.effect.hpCost > 1) {
    u.effect.hpCost = u.effect.hpCost - 1;
  }

  // Custom-card specific upgrade flags read by the engine.
  if (u.effect.custom) {
    u.effect = { ...u.effect } as typeof u.effect & { upgrade?: boolean };
    (u.effect as { upgrade?: boolean }).upgrade = true;
  }

  // Append an upgrade hint to the description.
  u.description = card.description + " (升级)";
  return u;
}
