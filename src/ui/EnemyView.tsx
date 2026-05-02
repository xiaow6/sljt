import { useState } from "react";
import type { EnemyState, Intent } from "../game/types";
import { useLang, t } from "../i18n";
import { enemyName } from "../game/lookup";

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
  useLang();
  const [imgOk, setImgOk] = useState(true);
  const showImg = !!enemy.def.art && imgOk;
  const name = enemyName(enemy.def);
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
            alt={name}
            onError={() => setImgOk(false)}
            className="enemy-art-img"
          />
        )}
        {!showImg && (
          <div className="enemy-name-placeholder">{name}</div>
        )}
      </div>
      <div className="enemy-name">{name}</div>
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
        {enemy.block > 0 && (
          <span className="badge badge-block tooltip-host" data-tip={t("kw.block.desc")}>
            🛡 {enemy.block}
          </span>
        )}
        {enemy.strength > 0 && (
          <span className="badge badge-str tooltip-host" data-tip={t("kw.strength.desc")}>
            {t("kw.strength")} +{enemy.strength}
          </span>
        )}
        {enemy.vulnerable > 0 && (
          <span className="badge badge-vuln tooltip-host" data-tip={t("kw.vulnerable.desc")}>
            {t("kw.vulnerable")} {enemy.vulnerable}
          </span>
        )}
        {enemy.hack > 0 && (
          <span className="badge badge-hack tooltip-host" data-tip={t("kw.hack.desc")}>
            ⌬ {enemy.hack}
          </span>
        )}
        {enemy.skipNext && (
          <span className="badge badge-skip tooltip-host" data-tip={t("kw.skip.desc")}>
            {t("kw.skip")}
          </span>
        )}
      </div>
    </div>
  );
}

function intentLabel(it: Intent): string {
  if (it.textKey) return t(it.textKey);
  return it.text ?? "";
}

function intentText(it: Intent, playerVulnerable = 0): string {
  if (it.kind === "attack") {
    const base = it.value ?? 0;
    const dmg = playerVulnerable > 0 ? Math.floor(base * 1.5) : base;
    const hits = it.hits && it.hits > 1 ? `×${it.hits}` : "";
    return `⚔ ${dmg}${hits}`;
  }
  if (it.kind === "block") return `🛡 ${it.value}`;
  if (it.kind === "buff") return `↑ ${intentLabel(it) || t("intent.buff")}`;
  if (it.kind === "debuff") return `↓ ${intentLabel(it) || t("intent.debuff")}`;
  if (it.kind === "special") return `✦ ${intentLabel(it) || t("intent.special")}`;
  return "?";
}
