export interface EnemyI18n {
  nameEn: string;
  lore?: string;
  loreEn?: string;
}

export const ENEMY_I18N: Record<string, EnemyI18n> = {
  spore_swarm: {
    nameEn: "Spore Swarm",
    lore: "微小的生物机械寄生体。先驱者用它们做侦察兵。落单的也能咬穿装甲。",
    loreEn:
      "Tiny biomech parasites. The Precursors used them as scouts. A stray one will still chew through plate.",
  },
  biomech_drone: {
    nameEn: "Biomech Drone",
    lore: "盔甲下的肌肉还在跳动。它们当年是会思考的——后来被简化了。",
    loreEn:
      "The muscle inside the shell still twitches. They used to think. Then they were simplified.",
  },
  dormant_sentinel: {
    nameEn: "Dormant Sentinel",
    lore:
      "走廊深处它已经站了十亿年。它不知道自己什么时候醒,但它不会再睡。",
    loreEn:
      "Standing in that corridor for a billion years. Doesn't know when it woke. Will not sleep again.",
  },
  voidling: {
    nameEn: "Voidling",
    lore:
      "「他们脸上没有东西。但那个空,正盯着你。」",
    loreEn: "\"There's nothing on their face. But the nothing is staring at you.\"",
  },
  evolved: {
    nameEn: "Evolved",
    lore:
      "先驱者的精英序列。每一具都是被小心改造的——刀刃从骨头里长出来,装在原本是手腕的位置。",
    loreEn:
      "An elite Precursor lineage. Each one carefully revised — blades grow from bone where the wrist used to be.",
  },
  weaver: {
    nameEn: "The Weaver",
    lore:
      "时之织网者。每一根丝都是一个可能的未来。它的一击可以让你忘记自己刚才做了什么。",
    loreEn:
      "Weaver of time. Each thread is a possible future. One strike can erase what you just did.",
  },
  bio_titan: {
    nameEn: "Bio-Titan",
    lore:
      "母舰内部生长出来的怪物。骨头是它自己的,装甲是它从舰体上撕下来的。",
    loreEn:
      "Grown inside the mothership. Bones are its own — the armor it tore off the hull.",
  },
  swarm_queen: {
    nameEn: "Spore Queen",
    lore: "「孢子虫群」的母巢。它的每一次脉动都生下另一群。",
    loreEn: "Hive of the Spore Swarm. Each pulse births another generation.",
  },
  gravity_warden: {
    nameEn: "Gravity Warden",
    lore:
      "守在生物核心入口的引力管理者。它的每一只手都握着一个微缩的奇点。",
    loreEn:
      "Gravity warden at the threshold of the Bio-Core. Each gauntlet holds a miniature singularity.",
  },
  runic_priest: {
    nameEn: "Runic Priest",
    lore: "议会塔的低级祭司。诵读古老的二进制经文。",
    loreEn: "Lower clergy of the Council Spire. Recites ancient binary scripture.",
  },
  silicon_inquisitor: {
    nameEn: "Silicon Inquisitor",
    lore:
      "议会塔的精英审讯者。它的每一只手都是一种刑具。它从不问问题。",
    loreEn:
      "Elite interrogator of the Council Spire. Each arm is a different instrument. It never asks questions.",
  },
  time_eater: {
    nameEn: "Time Eater",
    lore:
      "胸腔里有一个时间漩涡。它没有眼睛,但它能看见你的下一秒。",
    loreEn:
      "A clock-vortex churns in its chest. No eyes — but it sees your next second.",
  },
  council_speaker: {
    nameEn: "Council Speaker",
    lore:
      "议会发言人。它的六张全息脸轮流主持判决。当它们同时开口时,你将听见全部历史。",
    loreEn:
      "Speaker of the Council. Six holographic faces take turns judging. When they speak in unison you will hear all of history.",
  },
  precursor_heart: {
    nameEn: "Precursor Heart",
    lore:
      "母舰的真正核心。它跳动了十亿年,等待一个能听见它跳动的人。\n\n你来了。",
    loreEn:
      "The true core of the mothership. It has been beating for a billion years, waiting for someone who could hear.\n\nYou came.",
  },
  // ----- Act 1 additions -----
  armored_drone: {
    nameEn: "Armored Drone",
    lore:
      "「机甲」的后期型号。装甲是从你舰队成员的舱门上熔下来的。",
    loreEn:
      "Late-pattern drone. Its plate was melted off the airlocks of your fleet.",
  },
  void_stalker: {
    nameEn: "Void Stalker",
    lore:
      "虚空使徒的猎手亚种。它一直在你眼角的余光里——从你登舰那一刻起。",
    loreEn:
      "Hunter strain of the voidling. It has been in the corner of your eye since you boarded.",
  },
  awakened_sentinel: {
    nameEn: "Awakened Sentinel",
    lore:
      "你的脚步声把它叫醒了。它现在很专注。",
    loreEn: "Your footsteps woke it. It is paying attention now.",
  },
  // ----- Act 2 additions -----
  bio_brute: {
    nameEn: "Bio-Brute",
    lore:
      "生物泰坦的同源变体。骨骼长歪了,但更适合挥拳。",
    loreEn:
      "A divergent strain of the bio-titan. Bones grew crooked — better for throwing weight.",
  },
  void_horror: {
    nameEn: "Void Horror",
    lore:
      "成熟体的虚空使徒。它会笑。",
    loreEn:
      "A matured voidling. It laughs.",
  },
  silicon_acolyte: {
    nameEn: "Silicon Acolyte",
    lore:
      "硅基祭司的低阶辅祭。还在背诵不属于这个宇宙的语法。",
    loreEn:
      "Junior clergy of the silicon priesthood. Still memorising grammar from outside this universe.",
  },
  bio_warden: {
    nameEn: "Bio-Warden",
    lore:
      "生物核心的近卫长。臂膀上还套着另一只生物的颅骨当护肩。",
    loreEn:
      "Honour-guard at the Bio-Core. Wears another creature's skull as a pauldron.",
  },
  // ----- Act 3 additions -----
  chrono_priest: {
    nameEn: "Chrono Priest",
    lore:
      "高阶时间祭司。它的话还没说出口,你就听见了。",
    loreEn:
      "Higher chronomancer. You hear its words before it has spoken them.",
  },
  void_warden: {
    nameEn: "Void Warden",
    lore:
      "守在时间裂隙边上。它咀嚼小时。",
    loreEn:
      "Sentry at the edge of a temporal rift. It chews on hours.",
  },
  chrono_inquisitor: {
    nameEn: "Chrono Inquisitor",
    lore:
      "审讯官的时序变体。它先得出判决,然后再开始审讯。",
    loreEn:
      "A temporal-class inquisitor. It returns the verdict first, then begins the questioning.",
  },
};
