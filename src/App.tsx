import { useRun } from "./store";
import { TitleScreen } from "./ui/TitleScreen";
import { MapScreen } from "./ui/MapScreen";
import { BattleScreen } from "./ui/BattleScreen";
import { RewardScreen } from "./ui/RewardScreen";
import { EndScreen } from "./ui/EndScreen";
import "./App.css";

export default function App() {
  const run = useRun();
  return (
    <div className="app-root">
      {run.screen === "title" && <TitleScreen />}
      {run.screen === "map" && <MapScreen />}
      {run.screen === "battle" && <BattleScreen />}
      {run.screen === "reward" && <RewardScreen />}
      {(run.screen === "victory" || run.screen === "gameover") && <EndScreen />}
    </div>
  );
}
