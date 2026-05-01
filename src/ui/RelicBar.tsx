import { useRun } from "../store";
import { RELICS } from "../game/relics";

export function RelicBar() {
  const run = useRun();
  if (run.relics.length === 0) return null;
  return (
    <div className="relic-bar">
      {run.relics.map((id) => {
        const r = RELICS[id];
        if (!r) return null;
        return (
          <div key={id} className="relic" title={`${r.name} — ${r.description}`}>
            <span className="relic-icon">{r.icon}</span>
            <div className="relic-tooltip">
              <div className="relic-tooltip-name">{r.name}</div>
              <div className="relic-tooltip-desc">{r.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
