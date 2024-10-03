// Activity.jsx
import { CurrentActivityContext } from "../contexts/CurrentActivityContext";
import { useContext } from "solid-js";
import { convertSecondsToHMS } from "../ActivitiesStore";

function Activity(props) {
  const { state, startActivity } = useContext(CurrentActivityContext);

  const startTimer = () => startActivity(props.activityName);

  const { hours, minutes, seconds } = convertSecondsToHMS(props.time);

  return (
    <div
      style={{
        color: "#F1F0FB",
        display: "flex",
        "flex-direction": "row",
        border: "solid 2px gray",
        "border-radius": "12px",
        "background-color": "#1b232e",
        "justify-content": "space-between",
        "align-items": "center",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <h3>{props.activityName}</h3>
        <p>
          <strong>Total Time:</strong>
        </p>
        <p>
          {hours}h - {minutes}m -{seconds}s
        </p>
      </div>

      <div
        style={{
          display: "flex",
          "flex-direction": "row",
          gap: "10px",
          "align-items": "center",
        }}
      >
        <div
          style={{ display: "flex", "flex-direction": "column", gap: "10px" }}
        >
          <button
            style={{
              "font-size": "20px",
              "background-color": "lightgreen",
              // cursor:
              //   isActive() || props.isAnyTimerRunning() ? "default" : "pointer",
            }}
            onClick={startTimer}
            disabled={state.isAnyRunning}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
export default Activity;
