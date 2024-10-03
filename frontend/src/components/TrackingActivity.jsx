//TrackingActivity.jsx
import { useContext } from "solid-js";
import { CurrentActivityContext } from "../contexts/CurrentActivityContext";

function TrackingActivity() {
  const { state, stopActivity, pauseActivity, resumeActivity } = useContext(
    CurrentActivityContext
  );

  return (
    <div
      style={{
        color: "white",
        position: "fixed",
        bottom: 0,
        width: "100%",
        "text-align": "center",
      }}
    >
      <p>Activity: {state.activityName}</p>
      <p>Time: {state.time} seconds</p>
      {state.isPausing ? (
        <button onClick={resumeActivity} disabled={!state.isAnyRunning}>
          Resume
        </button>
      ) : (
        <button onClick={pauseActivity} disabled={!state.isAnyRunning}>
          Pause
        </button>
      )}

      <button onClick={stopActivity} disabled={!state.isAnyRunning}>
        Stop
      </button>
    </div>
  );
}

export default TrackingActivity;
