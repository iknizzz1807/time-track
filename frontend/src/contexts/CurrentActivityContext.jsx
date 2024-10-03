//CurrentActivity.jsx
import { createContext } from "solid-js";
import { onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import {
  state as getActivityState,
  setState as updateActivityState,
} from "../ActivitiesStore";

const CurrentActivityContext = createContext();
export { CurrentActivityContext };

export function CurrentActivityProvider(props) {
  const [state, setState] = createStore({
    id: null,
    activityName: "",
    time: 0,
    isAnyRunning: false,
    isPausing: false,
  });

  let timer;

  const startActivity = (id, name) => {
    setState("id", id);
    setState("activityName", name);
    setState("isAnyRunning", true);
    setState("isPausing", false);
    timer = setInterval(() => {
      setState("time", (time) => time + 1);
    }, 1000);
  };

  const stopActivity = async () => {
    clearInterval(timer);
    const { time, id } = state;
    setState("isPausing", false);
    setState("activityName", "");
    setState("isAnyRunning", false);

    try {
      const response = await fetch(`http://localhost:8080/activities/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time }),
      });

      if (response.ok) {
        // If response ok:
        const activities = getActivityState.activities.map((activity) => ({
          ...activity,
        }));
        let targetActivity = activities.find((activity) => activity.id === id);
        if (targetActivity) {
          targetActivity.time += time;
        }
        updateActivityState("activities", activities);
      } else {
        console.error(
          "Failed to update activity on server:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Failed to send PATCH request:", error);
    }

    setState("time", 0);
  };

  const pauseActivity = () => {
    setState("isPausing", true);
    clearInterval(timer);
  };

  const resumeActivity = () => {
    setState("isPausing", false);
    timer = setInterval(() => {
      setState("time", (time) => time + 1);
    }, 1000);
  };

  onCleanup(() => {
    clearInterval(timer);
  });

  const store = {
    state,
    startActivity,
    stopActivity,
    pauseActivity,
    resumeActivity,
  };

  return (
    <CurrentActivityContext.Provider value={store}>
      {props.children}
    </CurrentActivityContext.Provider>
  );
}
