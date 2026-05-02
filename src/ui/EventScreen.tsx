import { actions, useRun } from "../store";
import { EVENTS } from "../game/events";

export function EventScreen() {
  const run = useRun();
  const event = EVENTS.find((e) => e.id === run.currentEventId);
  if (!event) return null;
  return (
    <div className="event-screen">
      <div className="event-card">
        <div className="event-icon">{event.icon}</div>
        <h1 className="event-name">{event.name}</h1>
        <p className="event-flavor">{event.flavor}</p>

        {!run.eventResult ? (
          <div className="event-choices">
            {event.choices.map((c, i) => {
              const enabled = c.enabled ? c.enabled(run) : true;
              return (
                <button
                  key={i}
                  className="event-choice"
                  disabled={!enabled}
                  onClick={() => actions.resolveEventChoice(i)}
                >
                  <span className="event-choice-label">{c.label}</span>
                  {c.hint && <span className="event-choice-hint">{c.hint}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="event-resolved">
            <p className="event-result-text">{run.eventResult}</p>
            <button
              className="btn-primary"
              onClick={() => actions.closeEvent()}
            >
              继续
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
