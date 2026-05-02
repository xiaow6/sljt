import type { RunState } from "./types";
import { makeStartingDeck } from "./cards";
import { generateMap } from "./map";
import { STARTER_RELIC_POOL, pickRandom } from "./relics";

const START_HP = 70;

export function newRun(): RunState {
  return {
    deck: makeStartingDeck(),
    playerHp: START_HP,
    playerMaxHp: START_HP,
    gold: 0,
    relics: [pickRandom(STARTER_RELIC_POOL)],
    preloadedHack: 0,
    map: generateMap(),
    currentNode: 0,
    screen: "title",
    combat: null,
    rewardCards: null,
  };
}
