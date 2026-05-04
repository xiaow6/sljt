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
    lore:
      "扫描波划过墙体,你看见了三秒后会从拐角出现的东西。然后你假装没看见。",
    loreEn:
      "The scan beam swept the wall. You saw what would emerge around the corner three seconds from now. Then you pretended you hadn't.",
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
    lore:
      "纳米虫子在你的伤口里筑巢。它们不喜欢血,但它们必须吃。",
    loreEn:
      "Nano-mites nesting in your wounds. They don't like blood. They have to eat.",
  },
  energy_recycle: {
    nameEn: "Energy Recycle",
    descriptionEn: "Draw 1.",
    lore: "「弹药永远不会用完。只要你还能在地上找到。」",
    loreEn: "\"Ammo never runs out. As long as you can still find it on the floor.\"",
  },
  overload_start: {
    nameEn: "Overload Initialize",
    descriptionEn: "Gain 3 Charge. Gain 4 Block.",
    lore:
      "旧式启动序列。你按下三个开关,每个对应一个已经死掉的工程师的代号。",
    loreEn:
      "Legacy boot sequence. Three switches, each tagged with the callsign of an engineer who is no longer alive.",
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
    lore:
      "「等离子刀的握柄上还残留着上一个使用者的指纹。我没擦掉。」",
    loreEn:
      "\"There's a fingerprint on the plasma-blade hilt that isn't mine. I didn't wipe it off.\"",
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
    lore:
      "肺上长了一根管子。你已经停止判断它哪头是「血液」哪头是「燃料」。",
    loreEn:
      "There's a tube in your lung. You've stopped trying to tell which end is 'blood' and which is 'fuel'.",
  },
  overload_discharge: {
    nameEn: "Overload Discharge",
    descriptionEn: "Spend 5 Charge. Deal 16 damage to ALL enemies.",
    lore:
      "「按这个键之前,后退三步。如果还来得及。」— 维护手册边角",
    loreEn:
      "\"Step back three paces before pressing this. If there's time.\" — service manual margin",
  },
  doomsday_protocol: {
    nameEn: "Doomsday Protocol",
    descriptionEn: "Deal 14 damage. Lose 5 HP. Gain 5 Charge.",
    lore:
      "第七舰队的紧急协议:当你被孤立、装甲破损、子弹耗尽——拆开你的胸口。",
    loreEn:
      "Seventh Fleet emergency protocol: when isolated, armor breached, ammunition spent — open your chest.",
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
    lore:
      "先驱者发明了它。我们用它来打回先驱者。这就是工程学。",
    loreEn:
      "The Precursors invented it. We use it back at them. That is engineering.",
  },
  magnetic_storm: {
    nameEn: "Magnetic Storm",
    descriptionEn: "Gain 12 Block. Deal 4 damage to ALL enemies.",
    lore:
      "六重磁极同步放电。你处在风暴的眼里,所有不属于你的金属都开始尖叫。",
    loreEn:
      "Six poles fire in sync. You stand in the eye. Every piece of metal that isn't yours starts screaming.",
  },
  reactive_armor: {
    nameEn: "Reactive Armor",
    descriptionEn: "Power. Whenever you take an attack, gain 3 Block.",
    lore:
      "受击瞬间,装甲下方涌出一层新装甲。母舰里挖来的——它一直在生长。",
    loreEn:
      "On impact, fresh plating wells up beneath the old. Salvaged from the mothership. It keeps growing.",
  },
  energy_armor: {
    nameEn: "Energy Armor",
    descriptionEn: "Gain 6 Armor (does not clear at end of turn).",
    lore:
      "「先驱者不需要睡觉,所以他们的护盾也不会熄。我们抄了这个习惯。」",
    loreEn:
      "\"The Precursors don't sleep, so their shields never go down. We copied the habit.\"",
  },
  field_charge: {
    nameEn: "Field Charge",
    descriptionEn: "At the start of next turn, gain 8 Block.",
    lore:
      "把力场充电棒插进腰间的接口。下一次心跳,装甲会回应。",
    loreEn:
      "Slot the field-coil into the hip port. On the next heartbeat, the armor responds.",
  },
  deflection_strike: {
    nameEn: "Deflection Strike",
    descriptionEn: "Deal damage equal to your current Block.",
    lore:
      "盾牌不只是用来挡的。物理学家说过:每一次防御都欠世界一次进攻。",
    loreEn:
      "A shield isn't just for blocking. The physicists said: every defense owes the world one attack.",
  },
  charge_absorb: {
    nameEn: "Charge Absorb",
    descriptionEn: "Power. When attacked but not breached, gain 3 Charge.",
    lore: "他们的攻击给你充电。这种讽刺,他们大概理解不了。",
    loreEn:
      "Their attacks charge your reactor. The irony is probably beyond them.",
  },
  overcharge_shield: {
    nameEn: "Overcharge Shield",
    descriptionEn: "Gain 14 Block. Charge gained this turn is doubled.",
    lore:
      "把护盾发射器调到非法档位。母舰的内部好像没什么人来执法。",
    loreEn:
      "Shield emitter set to a setting that's technically illegal. Doesn't seem to be anyone enforcing it inside the mothership.",
  },
  iron_wall: {
    nameEn: "Iron Wall",
    descriptionEn: "Gain 3 Block. If you already have ≥ 10 Block, gain 6 instead.",
    lore:
      "「越厚的墙越好砸开。可你不是先驱者。你只想活到下一回合。」",
    loreEn:
      "\"The thicker the wall, the easier to break. But you're not a Precursor. You just want to live another turn.\"",
  },
  resonance_barrier: {
    nameEn: "Resonance Barrier",
    descriptionEn: "Power. At turn start, if Block ≥ 15, draw 2.",
    lore:
      "护盾的共振频率正好和你的脑波一致。你戴着它思考更快——但也更难分辨记忆。",
    loreEn:
      "The shield's resonance matches your brainwaves. You think faster wearing it. But memory gets harder to tell apart from now.",
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
    lore:
      "六边形护盾砸下去,先驱者的几何被打碎一个角。这是赞美,也是亵渎。",
    loreEn:
      "The hex shield comes down. A corner of Precursor geometry breaks. Both a tribute and a desecration.",
  },
  mass_driver: {
    nameEn: "Mass Driver",
    descriptionEn: "Deal 10 damage. Gain 6 Block.",
    lore:
      "肩炮把一颗 12 公斤的合金块送出去。它在抵达目标之前已经把空气烧成了等离子。",
    loreEn:
      "The shoulder-mount throws a 12 kg alloy slug. It turns the air to plasma before it arrives.",
  },
  field_spear: {
    nameEn: "Field Spear",
    descriptionEn: "Deal 12 damage. Apply 2 Vulnerable. Gain 4 Block.",
    lore:
      "一根青色的力场长矛飞过走廊,把空气都钉穿了。它不返回——但它会再生。",
    loreEn:
      "A cyan force-spear hurls through the corridor, nailing the air itself. It doesn't return. It regrows.",
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
    lore:
      "护卫机比战斗机更早被发明。我们想保护的人,比我们想杀的人多。",
    loreEn:
      "Guardians were invented before combat units. We had more people we wanted to protect than people we wanted to kill.",
  },
  repair_drone: {
    nameEn: "Repair Drone",
    descriptionEn: "Summon a Repair Drone (+2 HP at turn start).",
    lore: "「修复机不会死。它只会等下一个需要修的人。」",
    loreEn: "\"Repair drones don't die. They wait for the next thing that needs fixing.\"",
  },
  scout_drone: {
    nameEn: "Scout Drone",
    descriptionEn: "Summon a Scout Drone (draw 1 at turn start).",
    lore:
      "巴掌大的侦察机。它能听见你听不见的频率,比如先驱者每隔 5.4 秒发出的低音呜咽。",
    loreEn:
      "Palm-sized scout. It hears frequencies you can't — including the low Precursor moan every 5.4 seconds.",
  },
  swarm_protocol: {
    nameEn: "Swarm Protocol",
    descriptionEn: "Power. Same-type drones stack their effects.",
    lore:
      "「群体智能在我们这边数量超过 N 时,出现质变。N 是多少,我们也不知道。」",
    loreEn:
      "\"Swarm intelligence phase-shifts past N units on our side. We don't know what N is.\"",
  },
  drone_charge: {
    nameEn: "Drone Charge",
    descriptionEn: "All your drones act once immediately.",
    lore: "你按下手套上的按键。整个走廊响起金属的嗡鸣。",
    loreEn: "You press the gauntlet stud. The entire corridor hums with metal.",
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
    lore: "下令所有可用单位俯冲。装甲与机群一起向前。",
    loreEn:
      "Order all available units into a dive. Armor and swarm move forward together.",
  },
  overclock_drone: {
    nameEn: "Overclock Drone",
    descriptionEn: "Your drones double their effect this turn.",
    lore:
      "你撕掉了无人机散热警告。它们这一轮会发光,也会更快坏掉。",
    loreEn:
      "You ripped the thermal-fault sticker off your drones. This round, they glow brighter. They also die faster.",
  },
  ai_hub: {
    nameEn: "AI Hub",
    descriptionEn: "Power. All drone effects +1.",
    lore:
      "中枢启动后,你不再发命令。它替你发——比你快 0.6 秒,而且不会犹豫。",
    loreEn:
      "Once the hub is online, you stop giving orders. It does — 0.6 seconds before you would have. And it never hesitates.",
  },
  drone_recycle: {
    nameEn: "Drone Recycle",
    descriptionEn: "Consume 1 drone. Gain 5 Energy this turn.",
    lore:
      "把一架机器人当电池用。「对不起。」你低声说。机器人不会回答。",
    loreEn:
      "Use one drone as a battery. \"I'm sorry,\" you whisper. The drone doesn't answer.",
  },
  swarm_nuke: {
    nameEn: "Swarm Nuke",
    descriptionEn:
      "Consume all drones. Deal (count × 10) damage to ALL enemies. Exhaust.",
    lore:
      "全军自爆指令。这是「一次性」的科技——之所以叫一次性,是因为没人有第二次的机会。",
    loreEn:
      "Total swarm self-destruct. They call it a one-shot — because no one's ever had the chance for a second.",
  },
  prefab_drone: {
    nameEn: "Prefab Drone",
    descriptionEn: "Gain 1 Charge. Next summon costs 1 less. Exhaust.",
    lore:
      "折叠包装的预制无人机。撕开包装的时候它会问你「你叫什么名字」——然后就不再问。",
    loreEn:
      "Folded prefab drone. When you tear the wrapper it asks \"What is your name?\" — and never asks again.",
  },
  swarm_barrage: {
    nameEn: "Swarm Barrage",
    descriptionEn: "Deal 5 × Combat Drone count damage.",
    lore: "「一只机蜂叮你。一千只机蜂分解你。」",
    loreEn: "\"One drone stings you. A thousand take you apart.\"",
  },
  swarm_heart: {
    nameEn: "Swarm Heart",
    descriptionEn: "Power. Your drones cannot be consumed.",
    lore:
      "你给每一架机器人灌输了同一段记忆——你母亲的脸。它们不肯让那张脸消失。",
    loreEn:
      "You taught every drone the same memory: your mother's face. They refuse to let that face go.",
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
    lore:
      "一段从内向外瓦解先驱者哲学的代码。它的标题是 `while(true){doubt();}`。",
    loreEn:
      "A snippet that dissolves Precursor philosophy from the inside. Its title is `while(true){doubt();}`.",
  },
  ice_breaker: {
    nameEn: "Ice Breaker",
    descriptionEn: "Apply 2 Hack. Draw 1.",
    lore:
      "ICE — Intrusion Countermeasure Electronics。1980 年代的赛博朋克作家发明了它。先驱者抄了去。",
    loreEn:
      "ICE — Intrusion Countermeasure Electronics. Coined in 1980s cyberpunk fiction. The Precursors took it from us.",
  },
  data_flood: {
    nameEn: "Data Flood",
    descriptionEn: "Power. Each card you play, gain 1 Data.",
    lore:
      "你眼中的世界变成滚动的二进制。这是先驱者一直在看的东西。",
    loreEn:
      "Your view of the world becomes streaming binary. This is what the Precursors have always seen.",
  },
  overload_intrusion: {
    nameEn: "Overload Intrusion",
    descriptionEn: "Apply 2 Hack. If target has ≥ 3 Hack, apply 5 instead.",
    lore: "已经裂开的代码,只需要再推一下。",
    loreEn: "Code that's already cracked just needs one more push.",
  },
  ai_infiltration: {
    nameEn: "AI Infiltration",
    descriptionEn: "Apply 5 Hack (guaranteed skip).",
    lore:
      "把另一个心智灌进对方的身体。它不会知道,它会以为自己一直是这个心智。",
    loreEn:
      "Pour another mind into its body. It won't know. It will think it's always been that mind.",
  },
  circuit_break: {
    nameEn: "Circuit Break",
    descriptionEn: "Apply 2 Vulnerable. Gain 2 Data.",
    lore: "你切断了先驱者的某根神经回路。它发出的不是疼痛——是惊讶。",
    loreEn:
      "You cut one of its neural circuits. The sound it makes isn't pain. It's surprise.",
  },
  virus_deploy: {
    nameEn: "Virus Deploy",
    descriptionEn: "Power. At end of turn, all enemies gain 1 Hack.",
    lore:
      "病毒不需要击中。它会自己飘过去,落在每个戴金属的东西身上。",
    loreEn:
      "The virus doesn't need to hit. It drifts. It lands on anything wearing metal.",
  },
  data_compile: {
    nameEn: "Data Compile",
    descriptionEn: "Spend all Data. Deal 3 damage per Data spent.",
    lore:
      "信息流压缩成一发青色的标枪。十亿比特浓缩成一击。",
    loreEn:
      "Streams collapse into a single cyan lance. A billion bits, one strike.",
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
    lore:
      "你不再请求对方执行你的指令——你直接成为它的内核。它的每一根线路都是你的。",
    loreEn:
      "You stop requesting that it execute your command. You become its kernel. Every wire is yours now.",
  },
  quantum_encrypt: {
    nameEn: "Quantum Encrypt",
    descriptionEn: "The next damage you take is halved.",
    lore:
      "你把自己同时藏在两个量子叠加态。先驱者的攻击只击中其中一个——错的那个。",
    loreEn:
      "You hide in two quantum states at once. The Precursor strike hits only one of you — the wrong one.",
  },
};
