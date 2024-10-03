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
        "margin-bottom": "16px",
      }}
    >
      <p style={{ "font-size": "20px", "font-weight": "800" }}>
        Activity: {state.activityName}
      </p>
      <p style={{ "font-weight": "600" }}>Time: {state.time} seconds</p>
      {state.isPausing ? (
        <button
          onClick={resumeActivity}
          disabled={!state.isAnyRunning}
          style={{ "margin-right": "12px", "font-size": "16px" }}
        >
          Resume
        </button>
      ) : (
        <button
          onClick={pauseActivity}
          disabled={!state.isAnyRunning}
          style={{ "margin-right": "12px", "font-size": "16px" }}
        >
          Pause
        </button>
      )}

      <button
        onClick={stopActivity}
        disabled={!state.isAnyRunning}
        style={{ "font-size": "16px", "background-color": "salmon" }}
      >
        Stop
      </button>
    </div>
  );
}

export default TrackingActivity;
