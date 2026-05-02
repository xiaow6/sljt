// All localized strings. Two namespaces (zh, en) keyed alike.
import type { Lang } from "./i18n";

const zh: Record<string, string> = {
  // App / title
  "app.title": "先驱者回响",
  "title.subtitle": "母舰",
  "title.eyebrow": "人类深空探索军 · 第七巡航舰队",
  "title.flavor":
    "外缘星域,你唤醒了沉睡十亿年的「先驱者」——一支硅基外星文明。\n孤身一人,你必须穿越他们的母舰,在到达核心之前撑住每一次冲锋。",
  "title.role.label": "职业",
  "title.role.value": "指挥官 · 纯科技流",
  "title.hp.label": "起始 HP",
  "title.mech.label": "核心机制",
  "title.mech.value": "⚡ 充能 · 换血科技",
  "title.start": "启航",
  "title.continue": "继续游戏",
  "title.new": "新游戏",
  "title.codex": "图鉴",
  "title.lang": "EN",

  // Menu
  "menu.title": "菜单",
  "menu.saved": "已自动保存",
  "menu.savedHint": "浏览器关掉再打开,标题屏会显示「继续游戏」按钮",
  "menu.returnToTitle": "返回标题屏",
  "menu.returnToTitleHint": "存档保留,随时回来继续",
  "menu.abandon": "放弃当前局",
  "menu.abandonHint": "清除存档,从头开始",
  "menu.confirmAbandon": "确认放弃?存档将永久清除。",
  "menu.confirm": "确认放弃",
  "menu.cancel": "取消",
  "common.close": "关闭",
  "common.skip": "跳过",
  "common.continue": "继续",
  "common.back": "返回",

  // Map
  "map.subtitle.act1": "母舰外缘",
  "map.subtitle.act2": "生物核心",
  "map.subtitle.act3": "议会塔",
  "map.subtitle.act4": "先驱者之心",
  "node.battle": "战斗",
  "node.elite": "精英",
  "node.rest": "休整",
  "node.shop": "商店",
  "node.event": "事件",
  "node.boss": "BOSS",

  // Stats
  "stat.hp": "HP",
  "stat.energy": "能量",
  "stat.block": "格挡",
  "stat.armor": "护甲",
  "stat.charge": "充能",
  "stat.data": "信息流",
  "stat.deck": "牌组",
  "stat.chips": "硅基芯片",

  // Status tooltips (used as both label and tooltip body keys)
  "kw.charge": "充能",
  "kw.charge.desc":
    "纯科技指挥官的核心资源。靠自残/能力/卡牌积累。终结技(轨道炮、奇点炸弹)消耗充能造成爆炸伤害。",
  "kw.block": "格挡",
  "kw.block.desc":
    "本回合内吸收伤害的临时护盾。回合结束清零(除非「金属化」上线)。",
  "kw.armor": "护甲",
  "kw.armor.desc":
    "持久格挡。回合结束不清零,优先级在格挡之后。Aegis 流派核心。",
  "kw.vulnerable": "易伤",
  "kw.vulnerable.desc": "受到伤害提高 50%。每回合自动减 1 层。",
  "kw.weak": "虚弱",
  "kw.weak.desc": "你/敌人造成的攻击伤害降低 25%。每回合自动减 1 层。",
  "kw.strength": "力量",
  "kw.strength.desc": "永久增加攻击伤害。",
  "kw.hack": "黑客",
  "kw.hack.desc":
    "施加给敌人的层数。当敌人累积 ≥ 5 层 → 立即跳过下回合行动。Cyberwar 流派核心。",
  "kw.skip": "已入侵",
  "kw.skip.desc": "敌人下回合不会行动。来自黑客层数累积。",
  "kw.data": "信息流",
  "kw.data.desc":
    "玩家自身的层数。每打出一张牌(若有数据洪流)+1。可被「数据汇编」消耗转伤害。",
  "kw.drone": "无人机",
  "kw.drone.desc":
    "你召唤的自动行动单位。最多 3 个。每回合开始按类型行动:战斗/护卫/修复/侦察。",
  "kw.heal": "治疗",
  "kw.heal.desc": "恢复 HP。不会超过最大值。",
  "kw.exhaust": "消耗",
  "kw.exhaust.desc": "打出后被移出本场战斗,不进入弃牌堆。",

  // Reward
  "reward.title": "战利品 — 选一张牌",
  "reward.relicLabel": "遗物",
  "reward.relicHint": "(选完牌后自动获得)",

  // Rest
  "rest.title": "休整点",
  "rest.flavor": "走廊深处有一个废弃的人类前哨。装置仍能运作。你只能选择一项。",
  "rest.heal": "休息",
  "rest.healDesc": "治疗 {n} HP",
  "rest.upgrade": "改装台",
  "rest.upgradeDesc": "永久升级一张卡牌",
  "rest.pickUpgrade": "选择一张牌升级",
  "rest.upgraded": "已升级",

  // Shop
  "shop.eyebrow": "先驱者商人",
  "shop.title": "硅基集市",
  "shop.section.cards": "买卡",
  "shop.sold": "已售",
  "shop.svc.upgrade": "升级一张牌",
  "shop.svc.remove": "移除一张牌",
  "shop.svc.removed": "(已用)",
  "shop.leave": "离开商店",
  "shop.pickUpgrade": "选一张牌升级",
  "shop.pickRemove": "选一张牌移除",

  // Battle
  "battle.endTurn": "结束回合",
  "battle.targeting": "选择目标",
  "battle.detonate": "引爆",
  "battle.drawPile": "抽牌",
  "battle.discardPile": "弃牌",
  "battle.exhaustPile": "消耗",
  "battle.needCharge": "需 {n} ⚡",

  // Card type labels
  "ctype.attack": "攻击",
  "ctype.skill": "技能",
  "ctype.power": "能力",
  "rarity.common": "普通",
  "rarity.uncommon": "罕见",
  "rarity.rare": "稀有",

  // End screen
  "end.victory": "胜利",
  "end.defeat": "阵亡",
  "end.victoryFlavor": "你击碎了先驱者之心。十亿年的沉睡终结于你的手。",
  "end.defeatFlavor": "你的指挥官倒在了先驱者的爪下。深空再无回响。",
  "end.finalHp": "最终 HP",
  "end.deckSize": "牌组规模",
  "end.actReached": "推进至",
  "end.chips": "硅基芯片",
  "end.relicsLabel": "收集的遗物",
  "end.again": "再来一次",

  // Codex
  "codex.title": "图鉴",
  "codex.tab.cards": "卡牌",
  "codex.tab.enemies": "敌人",
  "codex.tab.relics": "遗物",
  "codex.locked": "未解锁",
  "codex.lockedHint": "在战斗中获取这张牌后解锁。",
  "codex.lockedEnemy": "在战斗中遇到这个敌人后解锁。",
  "codex.lore": "档案残页",

  // Deck modal
  "deck.title": "当前牌组 · {n} 张",
};

const en: Record<string, string> = {
  "app.title": "Precursor Echoes",
  "title.subtitle": "The Mothership",
  "title.eyebrow": "Human Deep-Space Expedition · Seventh Cruiser Fleet",
  "title.flavor":
    "On the rim of the galaxy, you woke the Precursors — a silicon civilization\nthat slept for a billion years. Alone, you must descend through their\nmothership and reach its heart before they tear you apart.",
  "title.role.label": "Class",
  "title.role.value": "Commander · Pure Tech",
  "title.hp.label": "Starting HP",
  "title.mech.label": "Core Mechanic",
  "title.mech.value": "⚡ Charge · Blood-for-tech",
  "title.start": "Embark",
  "title.continue": "Continue",
  "title.new": "New Run",
  "title.codex": "Codex",
  "title.lang": "中",

  "menu.title": "Menu",
  "menu.saved": "Auto-saved",
  "menu.savedHint": "Close the tab and return — the title screen will show 'Continue'.",
  "menu.returnToTitle": "Return to Title",
  "menu.returnToTitleHint": "Save preserved. Resume any time.",
  "menu.abandon": "Abandon Run",
  "menu.abandonHint": "Wipes the save. Start over.",
  "menu.confirmAbandon": "Abandon? The save will be permanently erased.",
  "menu.confirm": "Confirm",
  "menu.cancel": "Cancel",
  "common.close": "Close",
  "common.skip": "Skip",
  "common.continue": "Continue",
  "common.back": "Back",

  "map.subtitle.act1": "Outer Shell",
  "map.subtitle.act2": "Bio-Core",
  "map.subtitle.act3": "Council Spire",
  "map.subtitle.act4": "Precursor Heart",
  "node.battle": "Battle",
  "node.elite": "Elite",
  "node.rest": "Rest",
  "node.shop": "Shop",
  "node.event": "Event",
  "node.boss": "BOSS",

  "stat.hp": "HP",
  "stat.energy": "Energy",
  "stat.block": "Block",
  "stat.armor": "Armor",
  "stat.charge": "Charge",
  "stat.data": "Data",
  "stat.deck": "Deck",
  "stat.chips": "Chips",

  "kw.charge": "Charge",
  "kw.charge.desc":
    "The pure-tech commander's core resource. Built up via self-harm, powers, and skill cards. Finishers (Orbital Cannon, Singularity Bomb) burn it for explosive payoffs.",
  "kw.block": "Block",
  "kw.block.desc":
    "Temporary armor that absorbs damage this turn. Cleared at end of turn unless Metalize is online.",
  "kw.armor": "Armor",
  "kw.armor.desc":
    "Persistent block. Does NOT clear at end of turn. Consumed after regular block. Aegis archetype core.",
  "kw.vulnerable": "Vulnerable",
  "kw.vulnerable.desc": "Take 50% more damage. Decays by 1 per turn.",
  "kw.weak": "Weak",
  "kw.weak.desc": "Attacks deal 25% less damage. Decays by 1 per turn.",
  "kw.strength": "Strength",
  "kw.strength.desc": "Permanent +damage on attacks.",
  "kw.hack": "Hack",
  "kw.hack.desc":
    "Stacks applied to an enemy. At ≥ 5 stacks, the enemy skips its next turn. Cyberwar archetype core.",
  "kw.skip": "Hacked",
  "kw.skip.desc": "Enemy will skip its next turn. Triggered when hack ≥ 5.",
  "kw.data": "Data",
  "kw.data.desc":
    "Player resource. Gain 1 per card played (if Data Flood is online). Spent by Data Compile for damage.",
  "kw.drone": "Drone",
  "kw.drone.desc":
    "Auto-acting summons (max 3 slots). Each turn-start, drones act by type: Combat / Guardian / Repair / Scout.",
  "kw.heal": "Heal",
  "kw.heal.desc": "Restore HP, capped at max.",
  "kw.exhaust": "Exhaust",
  "kw.exhaust.desc": "Played card is removed from this combat instead of going to discard.",

  "reward.title": "Rewards — Pick One Card",
  "reward.relicLabel": "Relic",
  "reward.relicHint": "(Awarded after you pick a card.)",

  "rest.title": "Rest Site",
  "rest.flavor":
    "An abandoned human outpost down the corridor. The terminals still hum. You may choose only one.",
  "rest.heal": "Rest",
  "rest.healDesc": "Restore {n} HP",
  "rest.upgrade": "Forge",
  "rest.upgradeDesc": "Permanently upgrade a card",
  "rest.pickUpgrade": "Pick a card to upgrade",
  "rest.upgraded": "Upgraded",

  "shop.eyebrow": "Precursor Merchant",
  "shop.title": "Silicon Bazaar",
  "shop.section.cards": "Cards",
  "shop.sold": "Sold",
  "shop.svc.upgrade": "Upgrade a card",
  "shop.svc.remove": "Remove a card",
  "shop.svc.removed": "(Used)",
  "shop.leave": "Leave Shop",
  "shop.pickUpgrade": "Pick a card to upgrade",
  "shop.pickRemove": "Pick a card to remove",

  "battle.endTurn": "End Turn",
  "battle.targeting": "Pick a target",
  "battle.detonate": "Detonate",
  "battle.drawPile": "Draw",
  "battle.discardPile": "Discard",
  "battle.exhaustPile": "Exhaust",
  "battle.needCharge": "Need {n} ⚡",

  "ctype.attack": "Attack",
  "ctype.skill": "Skill",
  "ctype.power": "Power",
  "rarity.common": "Common",
  "rarity.uncommon": "Uncommon",
  "rarity.rare": "Rare",

  "end.victory": "VICTORY",
  "end.defeat": "FALLEN",
  "end.victoryFlavor":
    "You shattered the Precursor Heart. A billion-year sleep ends in your hand.",
  "end.defeatFlavor":
    "Your commander fell to the Precursors. Deep space falls silent.",
  "end.finalHp": "Final HP",
  "end.deckSize": "Deck Size",
  "end.actReached": "Reached",
  "end.chips": "Chips",
  "end.relicsLabel": "Relics Collected",
  "end.again": "Try Again",

  "codex.title": "Codex",
  "codex.tab.cards": "Cards",
  "codex.tab.enemies": "Enemies",
  "codex.tab.relics": "Relics",
  "codex.locked": "Locked",
  "codex.lockedHint": "Acquired by getting this card in a run.",
  "codex.lockedEnemy": "Encountered to unlock.",
  "codex.lore": "Field Recovery Notes",

  "deck.title": "Current Deck · {n}",
};

export const STRINGS: Record<Lang, Record<string, string>> = { zh, en };
