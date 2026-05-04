// Sanity check: upgraded cards now render with rewritten numbers.
// Run: npx tsx scripts/verify-upgrade-text.ts
// Stub the browser globals i18n.ts touches at module-load.
(globalThis as { localStorage?: Storage }).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
} as Storage;
import { CARDS } from "../src/game/cards";
import { cardDescription } from "../src/game/lookup";
import { upgradeCard } from "../src/game/upgrade";
import { setLang } from "../src/i18n";

setLang("zh");

const checks = [
  "laser_shot",
  "energy_shield",
  "tactical_retreat",
  "emergency_repair",
  "weakness_analysis",
  "shield_slam",
  "med_bay",
  "doomsday_protocol",
  // custom-engine overrides
  "data_scan",
  "plasma_strike",
  "orbital_cannon",
  "singularity_bomb",
  // formerly no-op cards now wired
  "nano_repair",
  "tactical_ai",
  "reactor_overclock",
  "nuclear_meltdown",
  "phoenix_protocol",
  "overload_discharge",
  "magnetic_storm",
  "field_charge",
  "iron_wall",
  "absolute_zero",
];

console.log("== zh ==");
for (const id of checks) {
  const before = CARDS[id];
  if (!before) {
    console.log(`${id}: MISSING`);
    continue;
  }
  const after = upgradeCard(before);
  console.log(`${id}`);
  console.log(`  before: ${cardDescription(before)}`);
  console.log(`  after:  ${cardDescription(after)}`);
}

setLang("en");
console.log("\n== en ==");
for (const id of checks) {
  const before = CARDS[id];
  if (!before) continue;
  const after = upgradeCard(before);
  console.log(`${id}`);
  console.log(`  before: ${cardDescription(before)}`);
  console.log(`  after:  ${cardDescription(after)}`);
}
