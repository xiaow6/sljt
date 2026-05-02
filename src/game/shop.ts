import type { CardDef, ShopOffer, Rarity } from "./types";
import { CARDS, REWARD_POOL_IDS, cardsByRarity } from "./cards";
import { pickRewardArchetype } from "./acts";

const PRICE_BY_RARITY: Record<Rarity, number> = {
  common: 50,
  uncommon: 75,
  rare: 150,
};

export const UPGRADE_PRICE = 75;
export const REMOVAL_PRICE = 75;

export function rollShop(deck: CardDef[]): ShopOffer {
  const focus = pickRewardArchetype(deck);
  const cards: ShopOffer["cards"] = [];
  const taken = new Set<string>();

  // 5 cards: 2 common, 2 uncommon, 1 rare. Bias toward focus archetype.
  const tiers: Rarity[] = ["common", "common", "uncommon", "uncommon", "rare"];
  for (const t of tiers) {
    let pool = cardsByRarity(t).filter((id) => !taken.has(id));
    const focused = pool.filter((id) => CARDS[id].archetype === focus);
    if (focused.length > 0 && Math.random() < 0.65) pool = focused;
    if (pool.length === 0) {
      pool = REWARD_POOL_IDS.filter((id) => !taken.has(id));
    }
    if (pool.length === 0) continue;
    const id = pool[Math.floor(Math.random() * pool.length)];
    taken.add(id);
    cards.push({
      card: { ...CARDS[id] },
      price: Math.round(PRICE_BY_RARITY[t] * (0.9 + Math.random() * 0.3)),
      sold: false,
    });
  }

  return {
    cards,
    upgradePrice: UPGRADE_PRICE,
    removalPrice: REMOVAL_PRICE,
    removalUsed: false,
  };
}
