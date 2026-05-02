import type { RunState } from "./types";
import { makeStartingDeck } from "./cards";
import { generateActMap } from "./map";
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
    act: 1,
    map: generateActMap(1),
    currentNodeId: null,
    screen: "title",
    combat: null,
    rewardCards: null,
    currentEventId: null,
    eventResult: null,
  };
}
