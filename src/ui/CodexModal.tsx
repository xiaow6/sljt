import { useState } from "react";
import { CARDS } from "../game/cards";
import { ENEMIES } from "../game/enemies";
import { unlockedCards, unlockedEnemies } from "../codex";
import { CardView } from "./CardView";
import { t, useLang } from "../i18n";
import { cardLore, cardName, enemyLore, enemyName } from "../game/lookup";
import type { CardDef, EnemyDef } from "../game/types";

interface Props {
  onClose: () => void;
}

type Tab = "cards" | "enemies";

export function CodexModal({ onClose }: Props) {
  useLang();
  const [tab, setTab] = useState<Tab>("cards");
  const [selectedCard, setSelectedCard] = useState<CardDef | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyDef | null>(null);

  const cardsUnlocked = unlockedCards();
  const enemiesUnlocked = unlockedEnemies();

  const cardList = Object.values(CARDS);
  const enemyList = Object.values(ENEMIES);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal codex-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("codex.title")}</h2>
          <button onClick={onClose}>{t("common.close")}</button>
        </div>
        <div className="codex-tabs">
          <button
            className={tab === "cards" ? "codex-tab active" : "codex-tab"}
            onClick={() => {
              setTab("cards");
              setSelectedEnemy(null);
            }}
          >
            {t("codex.tab.cards")} ({cardsUnlocked.size}/{cardList.length})
          </button>
          <button
            className={tab === "enemies" ? "codex-tab active" : "codex-tab"}
            onClick={() => {
              setTab("enemies");
              setSelectedCard(null);
            }}
          >
            {t("codex.tab.enemies")} ({enemiesUnlocked.size}/{enemyList.length})
          </button>
        </div>

        {tab === "cards" && (
          <div className="codex-body">
            <div className="codex-grid">
              {cardList.map((c) => {
                const unlocked = cardsUnlocked.has(c.id);
                return (
                  <button
                    key={c.id}
                    className="codex-card-pick"
                    onClick={() => unlocked && setSelectedCard(c)}
                    disabled={!unlocked}
                  >
                    {unlocked ? (
                      <CardView card={c} />
                    ) : (
                      <div className="codex-locked-card">
                        <div className="codex-lock-icon">?</div>
                        <div className="codex-locked-label">
                          {t("codex.locked")}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedCard && (
              <CodexCardDetail
                card={selectedCard}
                onClose={() => setSelectedCard(null)}
              />
            )}
          </div>
        )}

        {tab === "enemies" && (
          <div className="codex-body">
            <div className="codex-enemy-grid">
              {enemyList.map((e) => {
                const unlocked = enemiesUnlocked.has(e.id);
                return (
                  <button
                    key={e.id}
                    className={`codex-enemy-pick ${unlocked ? "" : "codex-locked"}`}
                    onClick={() => unlocked && setSelectedEnemy(e)}
                    disabled={!unlocked}
                  >
                    {unlocked && e.art ? (
                      <img
                        src={`/art/${e.art}`}
                        alt={enemyName(e)}
                        className="codex-enemy-art"
                      />
                    ) : (
                      <div className="codex-enemy-locked">?</div>
                    )}
                    <div className="codex-enemy-name">
                      {unlocked ? enemyName(e) : t("codex.locked")}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedEnemy && (
              <CodexEnemyDetail
                enemy={selectedEnemy}
                onClose={() => setSelectedEnemy(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CodexCardDetail({
  card,
  onClose,
}: {
  card: CardDef;
  onClose: () => void;
}) {
  const lore = cardLore(card);
  return (
    <div className="codex-detail" onClick={onClose}>
      <div className="codex-detail-card" onClick={(e) => e.stopPropagation()}>
        <CardView card={card} />
        <div className="codex-detail-info">
          <h3>{cardName(card)}</h3>
          {lore && (
            <>
              <div className="codex-detail-lore-label">{t("codex.lore")}</div>
              <div className="codex-detail-lore">{lore}</div>
            </>
          )}
          <button className="btn-skip" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CodexEnemyDetail({
  enemy,
  onClose,
}: {
  enemy: EnemyDef;
  onClose: () => void;
}) {
  const lore = enemyLore(enemy);
  return (
    <div className="codex-detail" onClick={onClose}>
      <div className="codex-detail-card" onClick={(e) => e.stopPropagation()}>
        {enemy.art && (
          <img
            src={`/art/${enemy.art}`}
            alt={enemyName(enemy)}
            className="codex-detail-enemy-art"
          />
        )}
        <div className="codex-detail-info">
          <h3>{enemyName(enemy)}</h3>
          <div className="codex-detail-stats">
            HP {enemy.hp}
            {enemy.isElite && " · Elite"}
            {enemy.isBoss && " · BOSS"}
          </div>
          {lore && (
            <>
              <div className="codex-detail-lore-label">{t("codex.lore")}</div>
              <div className="codex-detail-lore">{lore}</div>
            </>
          )}
          <button className="btn-skip" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
