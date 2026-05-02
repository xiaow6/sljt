// Per-card English names, descriptions, and bilingual lore fragments.
// Lore is intentionally fragmentary — recovered field notes the player decodes.

export interface CardI18n {
  nameEn: string;
  descriptionEn: string;
  lore?: string; // zh
  loreEn?: string;
}

export const CARD_I18N: Record<string, CardI18n> = {
  // ===== NEUTRAL =====
  laser_shot: {
    nameEn: "Laser Shot",
    descriptionEn: "Deal 6 damage.",
    lore: "「连续脉冲发射器 Mk-IV。第七舰队标准制式。耗电极低,几乎不会过热。」— 装备清单残页",
    loreEn:
      "\"Continuous Pulse Emitter Mk-IV. Seventh Fleet standard issue. Low draw, barely overheats.\" — quartermaster fragment",
  },
  energy_shield: {
    nameEn: "Energy Shield",
    descriptionEn: "Gain 6 Block.",
    lore: "六边形是先驱者最爱用的几何。我们抄回来,用作护盾。",
    loreEn: "Hexagonal — the Precursors' favorite geometry. We copied it for shields.",
  },
  tactical_retreat: {
    nameEn: "Tactical Retreat",
    descriptionEn: "Gain 8 Block. Draw 1.",
    lore: "「跑」也是一种科技。",
    loreEn: "\"Run\" is also a technology.",
  },
  emergency_repair: {
    nameEn: "Emergency Patch",
    descriptionEn: "Lose 2 HP. Gain 3 Charge.",
    lore: "把神经末梢临时接到反应堆上。痛,但有用。",
    loreEn: "Splice your nerve endings into the reactor. Hurts. Works.",
  },
  weakness_analysis: {
    nameEn: "Weakness Analysis",
    descriptionEn: "Apply 2 Vulnerable.",
    lore: "古生物的神经节,十亿年没变。我们记住了。",
    loreEn: "The ganglia of the ancient ones haven't changed in a billion years. We remembered.",
  },
  data_scan: {
    nameEn: "Data Scan",
    descriptionEn: "Draw 2. If Charge ≥ 10, draw 3 instead.",
  },
  tactical_ai: {
    nameEn: "Tactical AI",
    descriptionEn: "Power. Whenever you gain Charge, gain 1 Block.",
    lore: "「TAC-AI 在你头盔里低声告诉你:还有 4.6 秒。」",
    loreEn: "\"TAC-AI whispers in your helmet: 4.6 seconds left.\"",
  },
  nano_repair: {
    nameEn: "Nano Repair",
    descriptionEn: "Power. Heal 2 HP at end of turn.",
  },
  energy_recycle: {
    nameEn: "Energy Recycle",
    descriptionEn: "Draw 1.",
  },
  overload_start: {
    nameEn: "Overload Initialize",
    descriptionEn: "Gain 3 Charge. Gain 4 Block.",
  },

  // ===== BERSERK =====
  med_bay: {
    nameEn: "Med-Bay",
    descriptionEn: "Heal 14 HP. Draw 1.",
    lore:
      "母舰里偶尔能找到完好的医疗舱,墙上贴着上一个使用者的工号。从没见过他活着出去。",
    loreEn:
      "Occasionally a working med-bay turns up inside the mothership, last user's ID still on the wall. None of them came out walking.",
  },
  blood_fuel: {
    nameEn: "Blood Fuel",
    descriptionEn: "Lose 3 HP. Gain 2 Energy this turn.",
    lore: "血红蛋白也能跑反应堆,只是比氢贵一点。",
    loreEn: "Hemoglobin runs a reactor too. Just costs more than hydrogen.",
  },
  bio_link: {
    nameEn: "Bio-Link",
    descriptionEn: "Lose 5 HP. Your next attack deals double damage.",
    lore: "把心跳同步到武器节拍。下一发会很响。",
    loreEn: "Sync your heartbeat to the weapon's metronome. The next shot will be loud.",
  },
  reactor_overclock: {
    nameEn: "Reactor Overclock",
    descriptionEn: "Power. Each turn start, gain 3 Charge and lose 2 HP.",
    lore:
      "「警告:核心温度超出安全阈值。建议放弃过载。」— 你按下了静音。",
    loreEn:
      "\"Warning: core temperature exceeds safe threshold. Recommend disengage.\" — You hit mute.",
  },
  plasma_strike: {
    nameEn: "Plasma Strike",
    descriptionEn: "Deal 8 damage. Spend 3 Charge: deal 10 more.",
  },
  orbital_cannon: {
    nameEn: "Orbital Cannon",
    descriptionEn: "Deal Charge × 3 damage. Spend all Charge.",
    lore:
      "你抬头时,头盔在记录:轨道上有一束光向你延伸。它撞下来时,你已经走了。",
    loreEn:
      "Your helmet logged it: a beam of light reached down from orbit. By the time it landed you were already gone.",
  },
  singularity_bomb: {
    nameEn: "Singularity Bomb",
    descriptionEn:
      "Deal X × 10 damage to ALL enemies. Spend X × 3 Charge (must have enough). Exhaust.",
    lore:
      "我们偷了先驱者的图纸。他们没注意——他们以为没人活到能看懂的程度。",
    loreEn:
      "We stole the Precursors' schematic. They didn't notice — they assumed no one survived long enough to read it.",
  },
  reverse_transfusion: {
    nameEn: "Reverse Transfusion",
    descriptionEn: "Lose 3 HP. Gain 6 Charge.",
  },
  overload_discharge: {
    nameEn: "Overload Discharge",
    descriptionEn: "Spend 5 Charge. Deal 16 damage to ALL enemies.",
  },
  doomsday_protocol: {
    nameEn: "Doomsday Protocol",
    descriptionEn: "Deal 14 damage. Lose 5 HP. Gain 5 Charge.",
  },
  nuclear_meltdown: {
    nameEn: "Nuclear Meltdown",
    descriptionEn: "Power. Each turn start, gain 4 Charge and lose 3 HP.",
    lore: "你已经是反应堆的一部分了。",
    loreEn: "You ARE the reactor now.",
  },
  phoenix_protocol: {
    nameEn: "Phoenix Protocol",
    descriptionEn:
      "Power. The first time your HP drops below 30% this combat, heal 30 HP.",
    lore: "「燃烧自己照亮敌人。然后再次燃烧。」— 第七舰队作战手册插页",
    loreEn:
      "\"Burn yourself to light the enemy. Then burn again.\" — Seventh Fleet field manual",
  },

  // ===== AEGIS =====
  metalize: {
    nameEn: "Metalize",
    descriptionEn: "Power. Your Block does not clear at end of turn.",
    lore:
      "皮肤晶化协议。你不再眨眼,但你也不再流血。",
    loreEn:
      "Skin-crystallization protocol. You stop blinking. You stop bleeding too.",
  },
  bounce_field: {
    nameEn: "Bounce Field",
    descriptionEn: "Gain 8 Block. Reflect 50% of next attack.",
  },
  magnetic_storm: {
    nameEn: "Magnetic Storm",
    descriptionEn: "Gain 12 Block. Deal 4 damage to ALL enemies.",
  },
  reactive_armor: {
    nameEn: "Reactive Armor",
    descriptionEn: "Power. Whenever you take an attack, gain 3 Block.",
  },
  energy_armor: {
    nameEn: "Energy Armor",
    descriptionEn: "Gain 6 Armor (does not clear at end of turn).",
  },
  field_charge: {
    nameEn: "Field Charge",
    descriptionEn: "At the start of next turn, gain 10 Block.",
  },
  deflection_strike: {
    nameEn: "Deflection Strike",
    descriptionEn: "Deal damage equal to your current Block.",
  },
  charge_absorb: {
    nameEn: "Charge Absorb",
    descriptionEn: "Power. When attacked but not breached, gain 3 Charge.",
  },
  overcharge_shield: {
    nameEn: "Overcharge Shield",
    descriptionEn: "Gain 14 Block. Charge gained this turn is doubled.",
  },
  iron_wall: {
    nameEn: "Iron Wall",
    descriptionEn: "Gain 5 Block. If you already have ≥ 10 Block, gain 10 instead.",
  },
  resonance_barrier: {
    nameEn: "Resonance Barrier",
    descriptionEn: "Power. At turn start, if Block ≥ 15, draw 2.",
  },
  absolute_zero: {
    nameEn: "Absolute Zero",
    descriptionEn: "Apply 2 Vulnerable. If you have ≥ 20 Block, deal 28 damage.",
    lore:
      "「先驱者会颤抖。他们没料到我们能造出比虚空还冷的东西。」",
    loreEn:
      "\"The Precursors shiver. They never expected us to build something colder than the void.\"",
  },
  shield_slam: {
    nameEn: "Shield Slam",
    descriptionEn: "Deal 6 damage. Gain 4 Block.",
  },
  mass_driver: {
    nameEn: "Mass Driver",
    descriptionEn: "Deal 10 damage. Gain 6 Block.",
  },
  field_spear: {
    nameEn: "Field Spear",
    descriptionEn: "Deal 12 damage. Apply 2 Vulnerable. Gain 4 Block.",
  },

  // ===== DRONE =====
  combat_drone: {
    nameEn: "Combat Drone",
    descriptionEn: "Summon a Combat Drone (deals 4 damage at turn start).",
    lore: "「战斗无人机不知疲倦。它们也不知道恐惧。」",
    loreEn: "\"Combat drones don't tire. They also don't fear.\"",
  },
  guardian_drone: {
    nameEn: "Guardian Drone",
    descriptionEn: "Summon a Guardian Drone (+3 Block at turn start).",
  },
  repair_drone: {
    nameEn: "Repair Drone",
    descriptionEn: "Summon a Repair Drone (+2 HP at turn start).",
  },
  scout_drone: {
    nameEn: "Scout Drone",
    descriptionEn: "Summon a Scout Drone (draw 1 at turn start).",
  },
  swarm_protocol: {
    nameEn: "Swarm Protocol",
    descriptionEn: "Power. Same-type drones stack their effects.",
  },
  drone_charge: {
    nameEn: "Drone Charge",
    descriptionEn: "All your drones act once immediately.",
  },
  production_line: {
    nameEn: "Production Line",
    descriptionEn: "Power. At each turn start, summon 1 Combat Drone.",
    lore: "母舰角落里的一台旧机器人母厂。我们重新启动了它。",
    loreEn: "An old drone foundry in a corner of the mothership. We turned it back on.",
  },
  swarm_strike: {
    nameEn: "Swarm Strike",
    descriptionEn: "Deal 4 × drone count damage.",
  },
  overclock_drone: {
    nameEn: "Overclock Drone",
    descriptionEn: "Your drones double their effect this turn.",
  },
  ai_hub: {
    nameEn: "AI Hub",
    descriptionEn: "Power. All drone effects +1.",
  },
  drone_recycle: {
    nameEn: "Drone Recycle",
    descriptionEn: "Consume 1 drone. Gain 5 Energy this turn.",
  },
  swarm_nuke: {
    nameEn: "Swarm Nuke",
    descriptionEn:
      "Consume all drones. Deal (count × 10) damage to ALL enemies. Exhaust.",
  },
  prefab_drone: {
    nameEn: "Prefab Drone",
    descriptionEn: "Gain 1 Charge. Next summon costs 1 less. Exhaust.",
  },
  swarm_barrage: {
    nameEn: "Swarm Barrage",
    descriptionEn: "Deal 5 × Combat Drone count damage.",
  },
  swarm_heart: {
    nameEn: "Swarm Heart",
    descriptionEn: "Power. Your drones cannot be consumed.",
  },

  // ===== CYBER =====
  hack_protocol: {
    nameEn: "Hack Protocol",
    descriptionEn: "Apply 3 Hack.",
    lore:
      "「先驱者用古老逻辑思考。我们带的是新版编译器。」",
    loreEn:
      "\"The Precursors think in ancient logic. We brought a newer compiler.\"",
  },
  logic_bomb: {
    nameEn: "Logic Bomb",
    descriptionEn: "Deal 10 damage. Apply 3 Hack.",
  },
  ice_breaker: {
    nameEn: "Ice Breaker",
    descriptionEn: "Apply 2 Hack. Draw 1.",
  },
  data_flood: {
    nameEn: "Data Flood",
    descriptionEn: "Power. Each card you play, gain 1 Data.",
  },
  overload_intrusion: {
    nameEn: "Overload Intrusion",
    descriptionEn: "Apply 2 Hack. If target has ≥ 3 Hack, apply 5 instead.",
  },
  ai_infiltration: {
    nameEn: "AI Infiltration",
    descriptionEn: "Apply 5 Hack (guaranteed skip).",
  },
  circuit_break: {
    nameEn: "Circuit Break",
    descriptionEn: "Apply 2 Vulnerable. Gain 2 Data.",
  },
  virus_deploy: {
    nameEn: "Virus Deploy",
    descriptionEn: "Power. At end of turn, all enemies gain 1 Hack.",
  },
  data_compile: {
    nameEn: "Data Compile",
    descriptionEn: "Spend all Data. Deal 3 damage per Data spent.",
  },
  mind_hijack: {
    nameEn: "Mind Hijack",
    descriptionEn: "Stash X Hack. Auto-applied next combat. Exhaust.",
    lore: "你把代码塞进先驱者的下一段梦里。它会醒来时已经不是它自己。",
    loreEn:
      "You shove your code into the Precursor's next dream. It will wake up as someone else.",
  },
  protocol_override: {
    nameEn: "Protocol Override",
    descriptionEn: "Deal 8 damage. If target has Hack, deal Hack × 3 more.",
  },
  quantum_encrypt: {
    nameEn: "Quantum Encrypt",
    descriptionEn: "The next damage you take is halved.",
  },
};
