import { useRun } from "../store";
import { CardView } from "./CardView";

interface Props {
  onClose: () => void;
}

export function DeckModal({ onClose }: Props) {
  const run = useRun();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>当前牌组 · {run.deck.length} 张</h2>
          <button onClick={onClose}>关闭</button>
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
