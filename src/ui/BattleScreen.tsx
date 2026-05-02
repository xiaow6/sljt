import { useEffect, useRef, useState } from "react";
import { actions, useRun } from "../store";
import type { CardDef } from "../game/types";
import { CardView } from "./CardView";
import { EnemyView } from "./EnemyView";
import { RelicBar } from "./RelicBar";

interface DamageFloater {
  id: number;
  target: string;
  value: number;
  kind: "damage" | "heal" | "block";
}

type EffectKind =
  | "beam"
  | "aura"
  | "aura-bio"
  | "aura-heal"
  | "aura-armor"
  | "module"
  | "hack"
  | "summon";

interface PlayEffect {
  id: number;
  kind: EffectKind;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

let nextFloaterId = 1;
let nextEffectId = 1;

function PortraitImg() {
  const [ok, setOk] = useState(true);
  if (!ok) return <span className="portrait-icon">👤</span>;
  return (
    <img
      src="/art/portraits/commander.png"
      alt="指挥官"
      onError={() => setOk(false)}
      className="portrait-img"
    />
  );
}

function useShake(targets: string[]) {
  const [shaking, setShaking] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (targets.length === 0) return;
    setShaking(new Set(targets));
    const t = setTimeout(() => setShaking(new Set()), 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.join(",")]);
  return shaking;
}

function getEffectKindForCard(card: CardDef): EffectKind {
  if (card.type === "power") return "module";
  if (card.effect.summon) return "summon";
  if (card.type === "attack") return "beam";
  if (card.effect.heal && card.effect.heal > 0) return "aura-heal";
  if (card.effect.hpCost && card.effect.hpCost > 0) return "aura-bio";
  if (card.effect.hack || card.effect.data) return "hack";
  if (card.effect.armor) return "aura-armor";
  return "aura";
}

const PLAY_DELAY_MS = 220;
const EFFECT_LIFETIME_MS = 700;

export function BattleScreen() {
  const run = useRun();
  const c = run.combat;
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [xValue, setXValue] = useState(0);
  const [floaters, setFloaters] = useState<DamageFloater[]>([]);
  const [flashKey, setFlashKey] = useState(0);
  const [playingCardIdx, setPlayingCardIdx] = useState<number | null>(null);
  const [effects, setEffects] = useState<PlayEffect[]>([]);
  const [discarding, setDiscarding] = useState(false);
  const [drawAnimKey, setDrawAnimKey] = useState(0);

  // DOM refs for position lookups.
  const playerPortraitRef = useRef<HTMLDivElement>(null);
  const enemyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const powersRowRef = useRef<HTMLDivElement>(null);

  const prevHpRef = useRef<{
    player: number;
    enemies: number[];
    pBlock: number;
    eBlocks: number[];
    turn: number;
  }>({
    player: c?.player.hp ?? 0,
    enemies: c?.enemies.map((e) => e.hp) ?? [],
    pBlock: c?.player.block ?? 0,
    eBlocks: c?.enemies.map((e) => e.block) ?? [],
    turn: c?.turn ?? 0,
  });

  const stateKey = c
    ? `${c.player.hp}|${c.enemies.map((e) => e.hp).join(",")}|${
        c.player.block
      }|${c.enemies.map((e) => e.block).join(",")}|${c.turn}`
    : "";
  const [lungeKey, setLungeKey] = useState(0);

  useEffect(() => {
    if (!c) return;
    const next: DamageFloater[] = [];
    const prev = prevHpRef.current;

    // HP deltas
    const playerDelta = prev.player - c.player.hp;
    if (playerDelta > 0) {
      next.push({
        id: nextFloaterId++,
        target: "player",
        value: playerDelta,
        kind: "damage",
      });
    } else if (playerDelta < 0) {
      next.push({
        id: nextFloaterId++,
        target: "player",
        value: -playerDelta,
        kind: "heal",
      });
    }
    c.enemies.forEach((e, i) => {
      const prevHp = prev.enemies[i] ?? e.hp;
      const delta = prevHp - e.hp;
      if (delta > 0) {
        next.push({
          id: nextFloaterId++,
          target: `enemy:${i}`,
          value: delta,
          kind: "damage",
        });
      }
    });

    // Block deltas (gain only — block consumption is silent)
    const pBlockDelta = c.player.block - prev.pBlock;
    if (pBlockDelta > 0) {
      next.push({
        id: nextFloaterId++,
        target: "player",
        value: pBlockDelta,
        kind: "block",
      });
    }
    c.enemies.forEach((e, i) => {
      const prevBlock = prev.eBlocks[i] ?? 0;
      const delta = e.block - prevBlock;
      if (delta > 0) {
        next.push({
          id: nextFloaterId++,
          target: `enemy:${i}`,
          value: delta,
          kind: "block",
        });
      }
    });

    if (next.length > 0) {
      setFloaters((cur) => [...cur, ...next]);
      const ids = next.map((f) => f.id);
      setTimeout(() => {
        setFloaters((cur) => cur.filter((f) => !ids.includes(f.id)));
      }, 1400);
      if (next.some((f) => f.target === "player" && f.kind === "damage")) {
        setFlashKey((k) => k + 1);
      }
    }

    // Turn changed → enemy turn just ran. Trigger lunge on attacker enemies even
    // if the player blocked everything (no HP delta), and play the deal-in
    // animation for the freshly drawn hand.
    if (c.turn > prev.turn) {
      setLungeKey((k) => k + 1);
      setDrawAnimKey((k) => k + 1);
    }

    prevHpRef.current = {
      player: c.player.hp,
      enemies: c.enemies.map((e) => e.hp),
      pBlock: c.player.block,
      eBlocks: c.enemies.map((e) => e.block),
      turn: c.turn,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  const damageTargets = floaters
    .filter((f) => f.kind === "damage")
    .map((f) => f.target);
  const shaking = useShake(damageTargets);
  const playerHit = damageTargets.includes("player");
  const [lungeActive, setLungeActive] = useState(false);
  useEffect(() => {
    if (lungeKey === 0) return;
    setLungeActive(true);
    const t = setTimeout(() => setLungeActive(false), 420);
    return () => clearTimeout(t);
  }, [lungeKey]);

  if (!c) return null;
  const player = c.player;
  const isBoss =
    run.map.find((n) => n.id === run.currentNodeId)?.type === "boss";
  const selected: CardDef | null =
    selectedCardIdx != null ? c.hand[selectedCardIdx] : null;

  const targetEnemies = selected?.target === "enemy";
  const xCard = selected?.cost === "X";

  function spawnEffect(card: CardDef, targetIdx: number | null) {
    const kind = getEffectKindForCard(card);
    const portrait = playerPortraitRef.current?.getBoundingClientRect();
    const fromX = portrait ? portrait.left + portrait.width / 2 : window.innerWidth / 2;
    const fromY = portrait ? portrait.top + portrait.height / 2 : window.innerHeight - 120;

    const computeTarget = (): { x: number; y: number } => {
      if (kind === "module" || kind === "summon") {
        const r = powersRowRef.current?.getBoundingClientRect();
        return r
          ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
          : { x: fromX, y: fromY };
      }
      if (kind === "beam" || kind === "hack") {
        if (targetIdx != null && enemyRefs.current[targetIdx]) {
          const r = enemyRefs.current[targetIdx]!.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
        // X-cost AOE: target center of enemy row
        const allRects = enemyRefs.current
          .filter(Boolean)
          .map((el) => el!.getBoundingClientRect());
        if (allRects.length > 0) {
          const xs = allRects.map((r) => r.left + r.width / 2);
          const ys = allRects.map((r) => r.top + r.height / 2);
          return {
            x: xs.reduce((a, b) => a + b, 0) / xs.length,
            y: ys.reduce((a, b) => a + b, 0) / ys.length,
          };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 3 };
      }
      // aura: on player
      return { x: fromX, y: fromY };
    };

    const target = computeTarget();
    const eff: PlayEffect = {
      id: nextEffectId++,
      kind,
      fromX,
      fromY,
      toX: target.x,
      toY: target.y,
    };
    setEffects((cur) => [...cur, eff]);
    setTimeout(() => {
      setEffects((cur) => cur.filter((e) => e.id !== eff.id));
    }, EFFECT_LIFETIME_MS);
  }

  function playWithEffect(
    cardIdx: number,
    targetIdx: number | null,
    x?: number,
  ) {
    if (playingCardIdx != null) return; // ignore while one is in flight
    const card = c!.hand[cardIdx];
    if (!card) return;

    setPlayingCardIdx(cardIdx);
    spawnEffect(card, targetIdx);

    // Briefly let the card animate up before resolving the effect.
    setTimeout(() => {
      actions.playCard(cardIdx, targetIdx, x);
      setPlayingCardIdx(null);
    }, PLAY_DELAY_MS);
  }

  function attemptPlay(targetIdx: number | null) {
    if (selectedCardIdx == null) return;
    const x = xCard ? xValue : undefined;
    playWithEffect(selectedCardIdx, targetIdx, x);
    setSelectedCardIdx(null);
    setXValue(0);
  }

  function clickCard(i: number) {
    if (playingCardIdx != null) return;
    if (selectedCardIdx === i) {
      setSelectedCardIdx(null);
      setXValue(0);
      return;
    }
    const card = c!.hand[i];
    const cost = card.cost === "X" ? 0 : card.cost;
    if (player.energy < cost) return;
    if (card.target === "enemy") {
      const alive = c!.enemies.filter((e) => e.alive);
      if (alive.length === 1) {
        const idx = c!.enemies.indexOf(alive[0]);
        playWithEffect(i, idx);
        setSelectedCardIdx(null);
        return;
      }
      setSelectedCardIdx(i);
      return;
    }
    if (card.cost === "X") {
      setSelectedCardIdx(i);
      return;
    }
    playWithEffect(i, null);
  }

  return (
    <div className={`battle-screen ${isBoss ? "is-boss" : ""}`}>
      {flashKey > 0 && <div key={flashKey} className="battle-flash" />}
      <div className="battle-topbar">
        <RelicBar />
      </div>
      <div className="battle-top">
        <div className="enemies-row">
          {c.enemies.map((e, i) => (
            <div
              key={i}
              ref={(el) => {
                enemyRefs.current[i] = el;
              }}
              className={`enemy-wrap ${shaking.has(`enemy:${i}`) ? "shake" : ""} ${
                (playerHit || lungeActive) && e.alive ? "lunge" : ""
              }`}
            >
              <EnemyView
                enemy={e}
                selectable={targetEnemies && e.alive}
                playerVulnerable={player.vulnerable}
                onClick={() => {
                  if (!e.alive) return;
                  if (targetEnemies) attemptPlay(i);
                }}
              />
              {floaters
                .filter((f) => f.target === `enemy:${i}`)
                .map((f) => (
                  <div key={f.id} className={`floater floater-${f.kind}`}>
                    {f.kind === "block" ? `🛡 +${f.value}` : `-${f.value}`}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="battle-mid">
        <div className="battle-log">
          {c.log.slice(0, 6).map((m, i) => (
            <div key={i} className="log-line">
              {m}
            </div>
          ))}
        </div>
      </div>

      <div className="battle-bottom">
        <div className="player-stats">
          <div
            ref={playerPortraitRef}
            className={`player-portrait ${shaking.has("player") ? "shake" : ""}`}
          >
            <PortraitImg />
            {floaters
              .filter((f) => f.target === "player")
              .map((f) => (
                <div key={f.id} className={`floater floater-${f.kind}`}>
                  {f.kind === "heal"
                    ? `+${f.value}`
                    : f.kind === "block"
                      ? `🛡 +${f.value}`
                      : `-${f.value}`}
                </div>
              ))}
          </div>
          <div className="stat-row">
            <span className="stat-label">HP</span>
            <span className="stat-value">
              {player.hp} / {player.maxHp}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">能量</span>
            <span className="stat-value energy-pip">
              {player.energy} / {player.maxEnergy}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">格挡</span>
            <span className="stat-value">{player.block}</span>
          </div>
          {player.armor > 0 && (
            <div className="stat-row">
              <span className="stat-label">🛡 护甲</span>
              <span className="stat-value armor-value">{player.armor}</span>
            </div>
          )}
          <div className="stat-row charge-row">
            <span className="stat-label">⚡充能</span>
            <span className="stat-value charge-value">{player.charge}</span>
          </div>
          {player.data > 0 && (
            <div className="stat-row">
              <span className="stat-label">⌬ 信息流</span>
              <span className="stat-value data-value">{player.data}</span>
            </div>
          )}
          {player.doubleNextAttack && <div className="badge">下次攻击 ×2</div>}
          {player.vulnerable > 0 && (
            <div className="badge badge-vuln">易伤 {player.vulnerable}</div>
          )}
          {player.blockNextHalf && (
            <div className="badge">下次伤害减半</div>
          )}
          {player.bounceFieldActive && (
            <div className="badge">反弹场就绪</div>
          )}
          {player.drones.length > 0 && (
            <div className="drone-bay">
              {player.drones.map((d, i) => {
                const meta = DRONE_LABELS[d.kind];
                return (
                  <span
                    key={i}
                    className={`drone-slot drone-${d.kind} ${d.overclocked ? "drone-overclocked" : ""}`}
                    title={`${meta.name}无人机 ×${d.stacks}`}
                  >
                    {meta.icon}
                    {d.stacks > 1 && <sup>{d.stacks}</sup>}
                  </span>
                );
              })}
            </div>
          )}
          <div ref={powersRowRef} className="powers-row">
            {player.powers.map((p, i) => (
              <span key={i} className="badge badge-power">
                {powerLabel(p.id)}
              </span>
            ))}
          </div>
        </div>

        <div className="hand-area">
          <div className="pile pile-draw" title={`抽牌堆 ${c.draw.length} 张`}>
            <div className="pile-stack">
              <div className="card-back" />
              <div className="card-back" />
              <div className="card-back" />
            </div>
            <div className="pile-label">抽牌</div>
            <div className="pile-count">{c.draw.length}</div>
          </div>
          <div className="hand">
            {c.hand.map((card, i) => {
              const cost = card.cost === "X" ? 0 : card.cost;
              const playable = player.energy >= cost;
              const isPlaying = playingCardIdx === i;
              const cls = [
                isPlaying ? "card-playing" : "",
                discarding ? "card-discarding" : "card-drawn",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div
                  key={`${drawAnimKey}-${i}`}
                  className={cls}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <CardView
                    card={card}
                    playable={playable}
                    selected={selectedCardIdx === i}
                    onClick={() => clickCard(i)}
                  />
                </div>
              );
            })}
          </div>
          <div className="pile pile-discard" title={`弃牌堆 ${c.discard.length} 张`}>
            <div className="pile-stack">
              {c.discard.length > 0 && <div className="card-back card-back-discard" />}
              {c.discard.length > 1 && <div className="card-back card-back-discard" />}
              {c.discard.length > 2 && <div className="card-back card-back-discard" />}
            </div>
            <div className="pile-label">弃牌</div>
            <div className="pile-count">{c.discard.length}</div>
          </div>
        </div>

        <div className="battle-controls">
          <div className="pile-info">
            {c.exhaust.length > 0 && <div>消耗 {c.exhaust.length}</div>}
          </div>
          {xCard && (() => {
            const isSingularity = selected?.id === "singularity_bomb";
            const chargeNeed = isSingularity ? xValue * 3 : 0;
            const chargeOk = !isSingularity || player.charge >= chargeNeed;
            return (
              <div className="x-cost-picker">
                <div>X = {xValue}</div>
                {isSingularity && (
                  <div
                    className={`x-cost-charge ${chargeOk ? "" : "x-cost-fail"}`}
                  >
                    需 {chargeNeed} ⚡
                  </div>
                )}
                <button onClick={() => setXValue(Math.max(0, xValue - 1))}>−</button>
                <button
                  onClick={() => setXValue(Math.min(player.energy, xValue + 1))}
                >
                  +
                </button>
                <button
                  className="btn-primary"
                  disabled={xValue <= 0 || !chargeOk}
                  onClick={() => attemptPlay(null)}
                >
                  引爆
                </button>
              </div>
            );
          })()}
          <button
            className="btn-end-turn"
            disabled={discarding}
            onClick={() => {
              if (discarding) return;
              setDiscarding(true);
              setTimeout(() => {
                actions.endTurn();
                setDiscarding(false);
              }, 360);
            }}
          >
            结束回合
          </button>
        </div>
      </div>

      {selected && targetEnemies && (
        <div className="targeting-banner">选择目标</div>
      )}

      <EffectLayer effects={effects} />
    </div>
  );
}

function EffectLayer({ effects }: { effects: PlayEffect[] }) {
  return (
    <div className="effect-layer">
      {effects.map((e) => {
        if (e.kind === "beam" || e.kind === "hack") {
          const dx = e.toX - e.fromX;
          const dy = e.toY - e.fromY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <div
              key={e.id}
              className={e.kind === "hack" ? "effect-beam effect-beam-hack" : "effect-beam"}
              style={{
                left: `${e.fromX}px`,
                top: `${e.fromY}px`,
                width: `${length}px`,
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        }
        if (
          e.kind === "aura" ||
          e.kind === "aura-bio" ||
          e.kind === "aura-heal" ||
          e.kind === "aura-armor"
        ) {
          const variantClass =
            e.kind === "aura-bio"
              ? "effect-aura-bio"
              : e.kind === "aura-heal"
                ? "effect-aura-heal"
                : e.kind === "aura-armor"
                  ? "effect-aura-armor"
                  : "";
          return (
            <div
              key={e.id}
              className={`effect-aura ${variantClass}`}
              style={{ left: `${e.fromX}px`, top: `${e.fromY}px` }}
            />
          );
        }
        if (e.kind === "module" || e.kind === "summon") {
          return (
            <div
              key={e.id}
              className={e.kind === "summon" ? "effect-module effect-summon" : "effect-module"}
              style={{ left: `${e.toX}px`, top: `${e.toY}px` }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

const POWER_LABELS: Record<string, string> = {
  reactor_overclock: "反应堆超频",
  tactical_ai: "战术 AI",
  nano_repair: "纳米修复",
  metalize: "金属化",
  reactive_armor: "反应装甲",
  charge_absorb: "吸收充能",
  resonance_barrier: "共振屏障",
  swarm_protocol: "集群协议",
  production_line: "量产线",
  ai_hub: "AI 中枢",
  swarm_heart: "机群之心",
  data_flood: "数据洪流",
  virus_deploy: "病毒部署",
  nuclear_meltdown: "核熔毁",
  phoenix_protocol: "凤凰协议",
};

function powerLabel(id: string) {
  return POWER_LABELS[id] ?? id;
}

const DRONE_LABELS: Record<string, { name: string; icon: string }> = {
  combat: { name: "战斗", icon: "⚔" },
  guardian: { name: "护卫", icon: "🛡" },
  repair: { name: "修复", icon: "❤" },
  scout: { name: "侦察", icon: "👁" },
};
