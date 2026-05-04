import { actions, useRun } from "../store";
import { CardView } from "./CardView";
import { previewUpgrade } from "../game/lookup";
import { t, useLang } from "../i18n";

export function RestScreen() {
  useLang();
  const run = useRun();
  const isUpgradeMode = run.screen === "rest_upgrade";

  if (isUpgradeMode) {
    return (
      <div className="rest-screen">
        <div className="rest-upgrade-panel">
          <div className="rest-header">
            <h2>{t("rest.pickUpgrade")}</h2>
            <button className="btn-skip" onClick={() => actions.restCancel()}>
              {t("common.back")}
            </button>
          </div>
          <div className="rest-upgrade-grid">
            {run.deck.map((card, i) => {
              const upgraded = !!card.upgraded;
              const preview = upgraded ? null : previewUpgrade(card);
              return (
                <button
                  key={i}
                  className="rest-card-pick rest-card-preview"
                  disabled={upgraded}
                  onClick={() => actions.restUpgradeCard(i)}
                >
                  <div className="upgrade-preview-pair">
                    <CardView card={card} />
                    {preview && (
                      <>
                        <span className="upgrade-arrow">→</span>
                        <CardView card={preview} />
                      </>
                    )}
                  </div>
                  {upgraded && (
                    <div className="rest-upgraded-badge">{t("rest.upgraded")}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const healAmount = Math.floor(run.playerMaxHp * 0.3);
  return (
    <div className="rest-screen">
      <div className="rest-card">
        <div className="rest-icon">🔧</div>
        <h1 className="rest-title">{t("rest.title")}</h1>
        <p className="rest-flavor">{t("rest.flavor")}</p>
        <div className="rest-choices">
          <button className="rest-choice rest-choice-heal" onClick={() => actions.restHeal()}>
            <div className="rest-choice-icon">❤</div>
            <div className="rest-choice-name">{t("rest.heal")}</div>
            <div className="rest-choice-desc">
              {t("rest.healDesc").replace("{n}", String(healAmount))}
            </div>
          </button>
          <button className="rest-choice rest-choice-upgrade" onClick={() => actions.restUpgradeOpen()}>
            <div className="rest-choice-icon">⚙</div>
            <div className="rest-choice-name">{t("rest.upgrade")}</div>
            <div className="rest-choice-desc">{t("rest.upgradeDesc")}</div>
          </button>
        </div>
      </div>
    </div>
  );
}
