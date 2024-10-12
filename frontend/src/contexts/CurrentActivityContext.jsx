// CurrentActivity.jsx
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

  let timerWorker;

  const startActivity = (id, name) => {
    setState("id", id);
    setState("activityName", name);
    setState("isAnyRunning", true);
    setState("isPausing", false);

    // Khởi động Web Worker và gửi yêu cầu bắt đầu.
    timerWorker = new Worker(new URL("../timerWorker.js", import.meta.url));
    timerWorker.postMessage({ action: "start", payload: { time: state.time } });

    // Lắng nghe sự kiện cập nhật thời gian từ worker.
    timerWorker.onmessage = (e) => {
      setState("time", e.data);
    };
  };

  const stopActivity = async () => {
    timerWorker.postMessage({ action: "stop" });
    timerWorker.terminate(); // Kết thúc worker.

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
    timerWorker.postMessage({ action: "pause" });
  };

  const resumeActivity = () => {
    setState("isPausing", false);
    timerWorker.postMessage({ action: "start", payload: { time: state.time } });
  };

  onCleanup(() => {
    if (timerWorker) {
      timerWorker.terminate(); // Hủy worker khi component bị hủy.
    }
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
