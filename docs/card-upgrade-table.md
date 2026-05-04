# 卡牌升级对照表 · Card Upgrade Reference

> 所有 64 张卡升级前 / 升级后效果对比。升级在 *休整点* 或 *商店* 完成；每张牌只能升级一次（升级后名字带 +）。

> 表格按「实际效果数值」对比 — 因卡面描述文本静态写死，仅 `effect` 字段中的数值真正被升级机制提升。


**升级规则速查 / Upgrade rules at a glance:**

- `damage / block / heal` → ×1.35（向上取整） · `damage / block / heal × 1.35 (ceil)`
- `charge` → +1（仅当当前值 > 0） · `charge +1` (only if > 0)
- `armor` → +2
- `draw / vulnerable / hack / data / bonusEnergy` → +1
- `hpCost` → −1（最低 1） · `hpCost −1` (floor at 1)
- 自定义效果（custom flag）会触发引擎专属升级逻辑 · custom-effect cards trigger their own engine path


## 中立

| 费 | 卡名 | 稀有 | 升级前 effect | 升级后 effect | 变化 |
|:--:|:-----|:----:|:-------------|:-------------|:-----|
| 0 | 应急维修<br/><sub>Emergency Patch</sub> | 普通 | HP 代价 2, 充能 3 | HP 代价 1, 充能 4 | HP 代价 2→1 (↓-1); 充能 3→4 (↑+1) |
| 0 | 弱点分析<br/><sub>Weakness Analysis</sub> | 普通 | 易伤 2 | 易伤 3 | 易伤 2→3 (↑+1) |
| 1 | 战术撤离<br/><sub>Tactical Retreat</sub> | 普通 | 格挡 8, 抽牌 1 | 格挡 11, 抽牌 2 | 格挡 8→11 (↑+3); 抽牌 1→2 (↑+1) |
| 1 | 激光射击<br/><sub>Laser Shot</sub> | 普通 | 伤害 6 | 伤害 9 | 伤害 6→9 (↑+3) |
| 0 | 能量回收<br/><sub>Energy Recycle</sub> | 普通 | 抽牌 1 | 抽牌 2 | 抽牌 1→2 (↑+1) |
| 1 | 能量护盾<br/><sub>Energy Shield</sub> | 普通 | 格挡 6 | 格挡 9 | 格挡 6→9 (↑+3) |
| 1 | 数据扫描<br/><sub>Data Scan</sub> | 罕见 | — | upgrade | upgrade: — → true; 抽 2/3 → 抽 3/4 张（充能 ≥ 10 时进高档） |
| 1 | 纳米修复<br/><sub>Nano Repair</sub> | 罕见 | — | upgrade | upgrade: — → true; (nano_repair: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 过载启动<br/><sub>Overload Initialize</sub> | 罕见 | 充能 3, 格挡 4 | 充能 4, 格挡 6 | 充能 3→4 (↑+1); 格挡 4→6 (↑+2) |
| 1 | 战术 AI<br/><sub>Tactical AI</sub> | 稀有 | — | upgrade | upgrade: — → true; (tactical_ai: 引擎未读 upgrade 标记 — 等同未升级) |

## 狂暴

| 费 | 卡名 | 稀有 | 升级前 effect | 升级后 effect | 变化 |
|:--:|:-----|:----:|:-------------|:-------------|:-----|
| 0 | 血液燃料<br/><sub>Blood Fuel</sub> | 普通 | HP 代价 3, 本回合能量 2 | HP 代价 2, 本回合能量 3 | HP 代价 3→2 (↓-1); 本回合能量 2→3 (↑+1) |
| 1 | 医疗舱<br/><sub>Med-Bay</sub> | 罕见 | 治疗 14, 抽牌 1 | 治疗 19, 抽牌 2 | 治疗 14→19 (↑+5); 抽牌 1→2 (↑+1) |
| 1 | 生命链接<br/><sub>Bio-Link</sub> | 罕见 | HP 代价 5, 下击翻倍 | HP 代价 4, 下击翻倍 | HP 代价 5→4 (↓-1) |
| 1 | 等离子斩<br/><sub>Plasma Strike</sub> | 罕见 | — | upgrade | upgrade: — → true; 基础伤害 8→10；充能加成 10→14 |
| 2 | 过载放电<br/><sub>Overload Discharge</sub> | 罕见 | — | upgrade | upgrade: — → true; (overload_discharge: 引擎未读 upgrade 标记 — 等同未升级) |
| 0 | 逆向输血<br/><sub>Reverse Transfusion</sub> | 罕见 | HP 代价 3, 充能 6 | HP 代价 2, 充能 7 | HP 代价 3→2 (↓-1); 充能 6→7 (↑+1) |
| 2 | 凤凰协议<br/><sub>Phoenix Protocol</sub> | 稀有 | — | upgrade | upgrade: — → true; (phoenix_protocol: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 反应堆超频<br/><sub>Reactor Overclock</sub> | 稀有 | — | upgrade | upgrade: — → true; (reactor_overclock: 引擎未读 upgrade 标记 — 等同未升级) |
| X | 奇点炸弹<br/><sub>Singularity Bomb</sub> | 稀有 | — | upgrade | upgrade: — → true; X ×10 → X ×12（每点 X 消耗 3 充能不变） |
| 3 | 末日协议<br/><sub>Doomsday Protocol</sub> | 稀有 | 伤害 14, HP 代价 5, 充能 5 | 伤害 19, HP 代价 4, 充能 6 | 伤害 14→19 (↑+5); HP 代价 5→4 (↓-1); 充能 5→6 (↑+1) |
| 3 | 核熔毁<br/><sub>Nuclear Meltdown</sub> | 稀有 | — | upgrade | upgrade: — → true; (nuclear_meltdown: 引擎未读 upgrade 标记 — 等同未升级) |
| 3 | 轨道炮<br/><sub>Orbital Cannon</sub> | 稀有 | — | upgrade | upgrade: — → true; 充能 ×3 → 充能 ×4 |

## 护盾

| 费 | 卡名 | 稀有 | 升级前 effect | 升级后 effect | 变化 |
|:--:|:-----|:----:|:-------------|:-------------|:-----|
| 1 | 激发力场<br/><sub>Field Charge</sub> | 普通 | — | upgrade | upgrade: — → true; (field_charge: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 盾击<br/><sub>Shield Slam</sub> | 普通 | 伤害 6, 格挡 4 | 伤害 9, 格挡 6 | 伤害 6→9 (↑+3); 格挡 4→6 (↑+2) |
| 0 | 铁壁<br/><sub>Iron Wall</sub> | 普通 | — | upgrade | upgrade: — → true; (iron_wall: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 反弹场<br/><sub>Bounce Field</sub> | 罕见 | 格挡 8 | 格挡 11, upgrade | 格挡 8→11 (↑+3); upgrade: — → true; (bounce_field: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 吸收充能<br/><sub>Charge Absorb</sub> | 罕见 | — | upgrade | upgrade: — → true; (charge_absorb: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 磁暴护盾<br/><sub>Magnetic Storm</sub> | 罕见 | 格挡 12 | 格挡 17, upgrade | 格挡 12→17 (↑+5); upgrade: — → true; (magnetic_storm: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 能量护甲<br/><sub>Energy Armor</sub> | 罕见 | 护甲 6 | 护甲 8 | 护甲 6→8 (↑+2) |
| 2 | 质量驱动炮<br/><sub>Mass Driver</sub> | 罕见 | 伤害 10, 格挡 6 | 伤害 14, 格挡 9 | 伤害 10→14 (↑+4); 格挡 6→9 (↑+3) |
| 1 | 轨道折射<br/><sub>Deflection Strike</sub> | 罕见 | — | upgrade | upgrade: — → true; (deflection_strike: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 过载护盾<br/><sub>Overcharge Shield</sub> | 罕见 | 格挡 14 | 格挡 19, upgrade | 格挡 14→19 (↑+5); upgrade: — → true; (overcharge_shield: 引擎未读 upgrade 标记 — 等同未升级) |
| 3 | 共振屏障<br/><sub>Resonance Barrier</sub> | 稀有 | — | upgrade | upgrade: — → true; (resonance_barrier: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 力场标枪<br/><sub>Field Spear</sub> | 稀有 | 伤害 12, 易伤 2, 格挡 4 | 伤害 17, 易伤 3, 格挡 6 | 伤害 12→17 (↑+5); 易伤 2→3 (↑+1); 格挡 4→6 (↑+2) |
| 2 | 反应装甲<br/><sub>Reactive Armor</sub> | 稀有 | — | upgrade | upgrade: — → true; (reactive_armor: 引擎未读 upgrade 标记 — 等同未升级) |
| 3 | 绝对零度<br/><sub>Absolute Zero</sub> | 稀有 | 易伤 2 | 易伤 3, upgrade | 易伤 2→3 (↑+1); upgrade: — → true; (absolute_zero: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 金属化<br/><sub>Metalize</sub> | 稀有 | — | upgrade | upgrade: — → true; (metalize: 引擎未读 upgrade 标记 — 等同未升级) |

## 无人机

| 费 | 卡名 | 稀有 | 升级前 effect | 升级后 effect | 变化 |
|:--:|:-----|:----:|:-------------|:-------------|:-----|
| 1 | 侦察无人机<br/><sub>Scout Drone</sub> | 普通 | 召唤 scout | 召唤 scout | — |
| 2 | 修复无人机<br/><sub>Repair Drone</sub> | 普通 | 召唤 repair | 召唤 repair | — |
| 1 | 战斗无人机<br/><sub>Combat Drone</sub> | 普通 | 召唤 combat | 召唤 combat | — |
| 1 | 护卫无人机<br/><sub>Guardian Drone</sub> | 普通 | 召唤 guardian | 召唤 guardian | — |
| 0 | 预制无人机<br/><sub>Prefab Drone</sub> | 普通 | 充能 1 | 充能 2, upgrade | 充能 1→2 (↑+1); upgrade: — → true; (prefab_drone: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 无人机充电<br/><sub>Drone Charge</sub> | 罕见 | — | upgrade | upgrade: — → true; (drone_charge: 引擎未读 upgrade 标记 — 等同未升级) |
| 0 | 无人机回收<br/><sub>Drone Recycle</sub> | 罕见 | — | upgrade | upgrade: — → true; (drone_recycle: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 机群弹幕<br/><sub>Swarm Barrage</sub> | 罕见 | — | upgrade | upgrade: — → true; (swarm_barrage: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 机蜂涌动<br/><sub>Swarm Strike</sub> | 罕见 | — | upgrade | upgrade: — → true; (swarm_strike: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 超频无人机<br/><sub>Overclock Drone</sub> | 罕见 | — | upgrade | upgrade: — → true; (overclock_drone: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | AI 中枢<br/><sub>AI Hub</sub> | 稀有 | — | upgrade | upgrade: — → true; (ai_hub: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 机群之心<br/><sub>Swarm Heart</sub> | 稀有 | — | upgrade | upgrade: — → true; (swarm_heart: 引擎未读 upgrade 标记 — 等同未升级) |
| 3 | 机群核爆<br/><sub>Swarm Nuke</sub> | 稀有 | — | upgrade | upgrade: — → true; (swarm_nuke: 引擎未读 upgrade 标记 — 等同未升级) |
| 3 | 量产线<br/><sub>Production Line</sub> | 稀有 | — | upgrade | upgrade: — → true; (production_line: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 集群协议<br/><sub>Swarm Protocol</sub> | 稀有 | — | upgrade | upgrade: — → true; (swarm_protocol: 引擎未读 upgrade 标记 — 等同未升级) |

## 黑客

| 费 | 卡名 | 稀有 | 升级前 effect | 升级后 effect | 变化 |
|:--:|:-----|:----:|:-------------|:-------------|:-----|
| 1 | 入侵协议<br/><sub>Hack Protocol</sub> | 普通 | 黑客 3 | 黑客 4 | 黑客 3→4 (↑+1) |
| 0 | 冰墙拆除<br/><sub>Ice Breaker</sub> | 普通 | 黑客 2, 抽牌 1 | 黑客 3, 抽牌 2 | 黑客 2→3 (↑+1); 抽牌 1→2 (↑+1) |
| 1 | 回路熔断<br/><sub>Circuit Break</sub> | 普通 | 易伤 2, 信息流 2 | 易伤 3, 信息流 3 | 易伤 2→3 (↑+1); 信息流 2→3 (↑+1) |
| 1 | 量子加密<br/><sub>Quantum Encrypt</sub> | 普通 | — | upgrade | upgrade: — → true; (quantum_encrypt: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 数据汇编<br/><sub>Data Compile</sub> | 罕见 | — | upgrade | upgrade: — → true; (data_compile: 引擎未读 upgrade 标记 — 等同未升级) |
| 1 | 过载入侵<br/><sub>Overload Intrusion</sub> | 罕见 | — | upgrade | upgrade: — → true; (overload_intrusion: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 逻辑炸弹<br/><sub>Logic Bomb</sub> | 罕见 | 伤害 10, 黑客 3 | 伤害 14, 黑客 4 | 伤害 10→14 (↑+4); 黑客 3→4 (↑+1) |
| 3 | AI 渗透<br/><sub>AI Infiltration</sub> | 稀有 | 黑客 5 | 黑客 6 | 黑客 5→6 (↑+1) |
| 2 | 协议覆写<br/><sub>Protocol Override</sub> | 稀有 | — | upgrade | upgrade: — → true; (protocol_override: 引擎未读 upgrade 标记 — 等同未升级) |
| X | 思维劫持<br/><sub>Mind Hijack</sub> | 稀有 | — | upgrade | upgrade: — → true; (mind_hijack: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 数据洪流<br/><sub>Data Flood</sub> | 稀有 | — | upgrade | upgrade: — → true; (data_flood: 引擎未读 upgrade 标记 — 等同未升级) |
| 2 | 病毒部署<br/><sub>Virus Deploy</sub> | 稀有 | — | upgrade | upgrade: — → true; (virus_deploy: 引擎未读 upgrade 标记 — 等同未升级) |

---
*共 64 张卡 · 64 cards total*
