import Activity from "../components/Activity";
import { For } from "solid-js/web";
import { createSignal } from "solid-js";

function Activities() {
  const [items, setItems] = createSignal([
    {
      id: 1,
      name: "Coding",
      totalTimeHour: 1,
      totalTimeMinute: 32,
      totalTimeSecond: 43,
    },
    {
      id: 2,
      name: "Reading",
      totalTimeHour: 0,
      totalTimeMinute: 45,
      totalTimeSecond: 12,
    },
    // Add more items as needed
  ]); // Simulate the list of activities
  const [runningTimerId, setRunningTimerId] = createSignal(null);
  const isAnyTimerRunning = () => runningTimerId() !== null;

  const handleTimerStart = (id) => {
    setRunningTimerId(id);
  };

  const handleTimerStop = () => {
    setRunningTimerId(null);
  };
  return (
    <div>
      <h1
        style={{
          color: "#F1F0FB",
        }}
      >
        Activities
      </h1>
      <div
        style={{
          display: "flex",
          gap: "8px",
          "flex-direction": "column",
          "overflow-y": "scroll",
          "max-height": "calc(100vh - 200px)",
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        }}
      >
        <For each={items()}>
          {(item) => (
            <Activity
              id={item.id}
              activityName={item.name}
              totalTimeHour={item.totalTimeHour}
              totalTimeMinute={item.totalTimeMinute}
              totalTimeSecond={item.totalTimeSecond}
              isAnyTimerRunning={isAnyTimerRunning}
              onTimerStart={() => handleTimerStart(item.id)}
              onTimerStop={handleTimerStop}
            />
          )}
        </For>
      </div>
    </div>
  );
}
export default Activities;
