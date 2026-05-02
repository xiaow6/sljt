import { useRun } from "../store";
import { CardView } from "./CardView";
import { t, useLang } from "../i18n";

interface Props {
  onClose: () => void;
}

export function DeckModal({ onClose }: Props) {
  useLang();
  const run = useRun();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("deck.title").replace("{n}", String(run.deck.length))}</h2>
          <button onClick={onClose}>{t("common.close")}</button>
        </div>
        <div className="modal-body">
          {run.deck.map((c, i) => (
            <CardView key={i} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
