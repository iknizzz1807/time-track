import { createSignal, onCleanup } from "solid-js";

function Activity(props) {
  const [seconds, setSeconds] = createSignal(0);
  const [isActive, setIsActive] = createSignal(false);

  let interval;

  const startTimer = () => {
    if (!isActive() && !props.isAnyTimerRunning()) {
      setIsActive(true);
      props.onTimerStart(props.id);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    props.onTimerStop();
    setSeconds(0);
    clearInterval(interval);
  };

  onCleanup(() => {
    clearInterval(interval);
    if (isActive()) {
      props.onTimerStop();
    }
  });

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <h3>{props.activityName}</h3>
        <p>
          <strong>Total Time:</strong>
        </p>
        <p>
          {props.totalTimeHour}h - {props.totalTimeMinute}m -
          {props.totalTimeSecond}s
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
        <div>
          <p style={{ "font-size": "20px" }}>{formatTime(seconds())}</p>
        </div>
        <div
          style={{ display: "flex", "flex-direction": "column", gap: "10px" }}
        >
          <button
            style={{
              "font-size": "20px",
              "background-color": "lightgreen",
              cursor: "pointer",
            }}
            onClick={startTimer}
            disabled={isActive() || props.isAnyTimerRunning()}
          >
            Start
          </button>
          <button
            style={{
              "font-size": "20px",
              "background-color": "lightcoral",
              cursor: "pointer",
            }}
            onClick={stopTimer}
            disabled={!isActive()}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
export default Activity;
