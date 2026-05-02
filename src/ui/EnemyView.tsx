import { useState } from "react";
import type { EnemyState, Intent } from "../game/types";

interface Props {
  enemy: EnemyState;
  isTarget?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  playerVulnerable?: number;
}

export function EnemyView({
  enemy,
  isTarget,
  selectable,
  onClick,
  playerVulnerable = 0,
}: Props) {
  const [imgOk, setImgOk] = useState(true);
  const showImg = !!enemy.def.art && imgOk;
  return (
    <div
      className={`enemy ${selectable ? "enemy-selectable" : ""} ${
        isTarget ? "enemy-target" : ""
      } ${!enemy.alive ? "enemy-dead" : ""}`}
      onClick={onClick}
    >
      <div className={`enemy-intent intent-${enemy.intent.kind}`}>
        {intentText(enemy.intent, playerVulnerable)}
      </div>
      <div className="enemy-art">
        {showImg && (
          <img
            src={`/art/${enemy.def.art}`}
            alt={enemy.def.name}
            onError={() => setImgOk(false)}
            className="enemy-art-img"
          />
        )}
        {!showImg && (
          <div className="enemy-name-placeholder">{enemy.def.name}</div>
        )}
      </div>
      <div className="enemy-name">{enemy.def.name}</div>
      <div className="enemy-hp-bar">
        <div
          className="enemy-hp-fill"
          style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
        />
        <span className="enemy-hp-text">
          {enemy.hp} / {enemy.maxHp}
        </span>
      </div>
      <div className="enemy-status">
        {enemy.block > 0 && <span className="badge badge-block">🛡 {enemy.block}</span>}
        {enemy.strength > 0 && (
          <span className="badge badge-str">力量 +{enemy.strength}</span>
        )}
        {enemy.vulnerable > 0 && (
          <span className="badge badge-vuln">易伤 {enemy.vulnerable}</span>
        )}
        {enemy.hack > 0 && (
          <span className="badge badge-hack">⌬ {enemy.hack}</span>
        )}
        {enemy.skipNext && (
          <span className="badge badge-skip">已入侵</span>
        )}
      </div>
    </div>
  );
}

function intentText(it: Intent, playerVulnerable = 0): string {
  if (it.kind === "attack") {
    const base = it.value ?? 0;
    const dmg = playerVulnerable > 0 ? Math.floor(base * 1.5) : base;
    const hits = it.hits && it.hits > 1 ? `×${it.hits}` : "";
    return `⚔ ${dmg}${hits}`;
  }
  if (it.kind === "block") return `🛡 ${it.value}`;
  if (it.kind === "buff") return `↑ ${it.text ?? "强化"}`;
  if (it.kind === "debuff") return `↓ ${it.text ?? "削弱"}`;
  return "?";
}
