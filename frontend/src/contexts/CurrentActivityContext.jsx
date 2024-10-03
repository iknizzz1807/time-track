//CurrentActivity.jsx
import { createContext } from "solid-js";
import { onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

const CurrentActivityContext = createContext();
export { CurrentActivityContext };

export function CurrentActivityProvider(props) {
  const [state, setState] = createStore({
    activityName: "",
    time: 0,
    isAnyRunning: false,
    isPausing: false,
  });

  let timer;

  const startActivity = (name) => {
    setState("activityName", name);
    setState("isAnyRunning", true);
    setState("isPausing", false);
    timer = setInterval(() => {
      setState("time", (time) => time + 1);
    }, 1000);
  };

  const stopActivity = () => {
    clearInterval(timer);
    setState("time", 0);
    setState("isPausing", false);
    setState("activityName", "");
    setState("isAnyRunning", false);
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
