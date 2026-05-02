import { useRun } from "../store";
import { RELICS } from "../game/relics";
import { relicName, relicDescription } from "../game/lookup";
import { useLang } from "../i18n";

export function RelicBar() {
  useLang();
  const run = useRun();
  if (run.relics.length === 0) return null;
  return (
    <div className="relic-bar">
      {run.relics.map((id) => {
        const r = RELICS[id];
        if (!r) return null;
        const name = relicName(id);
        const desc = relicDescription(id);
        return (
          <div key={id} className="relic" title={`${name} — ${desc}`}>
            <span className="relic-icon">{r.icon}</span>
            <div className="relic-tooltip">
              <div className="relic-tooltip-name">{name}</div>
              <div className="relic-tooltip-desc">{desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
