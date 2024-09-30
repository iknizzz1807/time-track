import Activity from "../components/Activity";
import CreateActivity from "../components/CreateActivity";
import { For } from "solid-js/web";
import { createSignal } from "solid-js";
import { createResource } from "solid-js";

const fetchActivities = async () => {
  const response = await fetch("http://localhost:8080/activities");
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  const data = await response.json();
  return data.map((activity) => {
    const { hours, minutes, seconds } = convertSecondsToHMS(activity.time);
    return {
      id: activity.id,
      name: activity.name,
      totalTimeHour: hours,
      totalTimeMinute: minutes,
      totalTimeSecond: seconds,
    };
  });
};

const convertSecondsToHMS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 3600) % 60;
  return { hours, minutes, seconds };
};

function Activities() {
  const [activities, { mutate }] = createResource(fetchActivities);
  // Simulate the list of activities
  const [runningTimerId, setRunningTimerId] = createSignal(null);
  const isAnyTimerRunning = () => runningTimerId() !== null;
  let activitiesContainerRef;

  const handleTimerStart = (id) => {
    setRunningTimerId(id);
  };

  const handleTimerStop = () => {
    setRunningTimerId(null);
  };

  const handleActivityCreated = (newActivity) => {
    const { hours, minutes, seconds } = convertSecondsToHMS(newActivity.time);
    const formattedActivity = {
      id: newActivity.id,
      name: newActivity.name,
      totalTimeHour: hours,
      totalTimeMinute: minutes,
      totalTimeSecond: seconds,
    };
    mutate((prev) => [...prev, formattedActivity]);
    // Scroll to the bottom of the activities container
    setTimeout(() => {
      activitiesContainerRef.scrollTop = activitiesContainerRef.scrollHeight;
    }, 0);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          "flex-direction": "row",
          "justify-content": "space-between",
        }}
      >
        <h1
          style={{
            color: "#F1F0FB",
          }}
        >
          Activities
        </h1>

        <CreateActivity onActivityCreated={handleActivityCreated} />
      </div>
      <div
        ref={activitiesContainerRef}
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
        <For each={activities()}>
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
