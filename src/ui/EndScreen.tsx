import { actions, useRun } from "../store";
import { RELICS } from "../game/relics";
import { t, useLang } from "../i18n";

export function EndScreen() {
  useLang();
  const run = useRun();
  const won = run.screen === "victory";
  return (
    <div className={`end-screen ${won ? "end-win" : "end-lose"}`}>
      <h1>{won ? t("end.victory") : t("end.defeat")}</h1>
      <p className="end-flavor">
        {won ? t("end.victoryFlavor") : t("end.defeatFlavor")}
      </p>
      <div className="end-stats">
        <div className="end-stat">
          <span className="end-stat-label">{t("end.finalHp")}</span>
          <span className="end-stat-value">
            {run.playerHp} / {run.playerMaxHp}
          </span>
        </div>
        <div className="end-stat">
          <span className="end-stat-label">{t("end.deckSize")}</span>
          <span className="end-stat-value">{run.deck.length}</span>
        </div>
        <div className="end-stat">
          <span className="end-stat-label">{t("end.actReached")}</span>
          <span className="end-stat-value">Act {run.act}</span>
        </div>
        <div className="end-stat">
          <span className="end-stat-label">{t("end.chips")}</span>
          <span className="end-stat-value">◈ {run.gold}</span>
        </div>
      </div>
      {run.relics.length > 0 && (
        <div className="end-relics">
          <div className="end-relics-label">{t("end.relicsLabel")}</div>
          <div className="end-relics-list">
            {run.relics.map((id) => {
              const r = RELICS[id];
              const name = t(`relic.${id}.name`, r?.name);
              return r ? (
                <span key={id} className="end-relic">
                  {r.icon} {name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
      <button className="btn-primary btn-large" onClick={() => actions.reset()}>
        {t("end.again")}
      </button>
    </div>
  );
}
