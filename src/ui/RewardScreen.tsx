import { actions, getPendingRelic, useRun } from "../store";
import { CardView } from "./CardView";
import { RELICS } from "../game/relics";
import { t, useLang } from "../i18n";

export function RewardScreen() {
  useLang();
  const run = useRun();
  const cards = run.rewardCards ?? [];
  const relicId = getPendingRelic();
  const relic = relicId ? RELICS[relicId] : null;
  const relicName = relicId ? t(`relic.${relicId}.name`, relic?.name) : "";
  const relicDesc = relicId ? t(`relic.${relicId}.desc`, relic?.description) : "";
  return (
    <div className="reward-screen">
      <h2>{t("reward.title")}</h2>
      {relic && (
        <div className="reward-relic">
          <div className="reward-relic-icon">{relic.icon}</div>
          <div>
            <div className="reward-relic-name">
              {t("reward.relicLabel")} · {relicName}
            </div>
            <div className="reward-relic-desc">{relicDesc}</div>
            <div className="reward-relic-hint">{t("reward.relicHint")}</div>
          </div>
        </div>
      )}
      <div className="reward-cards">
        {cards.map((c, i) => (
          <CardView key={i} card={c} onClick={() => actions.takeReward(c)} />
        ))}
      </div>
      <button className="btn-skip" onClick={() => actions.takeReward(null)}>
        {t("common.skip")}
      </button>
    </div>
  );
}
