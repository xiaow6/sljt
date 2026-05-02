export interface RelicI18n {
  nameEn: string;
  descriptionEn: string;
  lore?: string;
  loreEn?: string;
}

export const RELIC_I18N: Record<string, RelicI18n> = {
  quantum_battery: {
    nameEn: "Quantum Battery",
    descriptionEn: "At combat start, gain 5 Charge.",
    lore:
      "「我们从坠毁的舰长舱里拆出的电池。它从未停止充电——它好像不知道战争已经结束。」",
    loreEn:
      "\"Pulled this battery out of a downed captain's pod. It hasn't stopped charging — like it doesn't know the war ended.\"",
  },
  tactical_hud: {
    nameEn: "Tactical HUD",
    descriptionEn: "At combat start, draw 2 extra cards (first turn only).",
    lore:
      "面甲投影上残留着上一个使用者的最后一张图——是他妻子的脸。HUD 把它当作背景。",
    loreEn:
      "The visor still has the last user's last image burned in: his wife's face. The HUD keeps it as wallpaper.",
  },
  energy_core: {
    nameEn: "Energy Core",
    descriptionEn: "+1 max Energy each turn.",
    lore:
      "工程师管它叫「永远的回响」。我们没人懂它怎么工作——只知道它从来不停。",
    loreEn:
      "The engineers called it \"the forever echo.\" None of us know how it works. Only that it never stops.",
  },
  emergency_medkit: {
    nameEn: "Emergency Medkit",
    descriptionEn: "Heal 4 HP after each combat victory.",
    lore:
      "里面装着不属于这个世纪的药剂。它治愈你的同时,也写下你身体的副本。",
    loreEn:
      "Stocked with compounds that aren't from this century. While it heals you, it writes a copy of your body.",
  },
  overload_buffer: {
    nameEn: "Overload Buffer",
    descriptionEn: "Reactor Overclock no longer costs HP.",
    lore:
      "「这个缓冲器装在你脊柱的金属节里。如果它坏了,你不会立刻知道。」",
    loreEn:
      "\"This buffer fits in the metal joint by your spine. If it fails, you won't know right away.\"",
  },
};
