//Activities.jsx
import Activity from "../components/Activity";
import CreateActivity from "../components/CreateActivity";
import { For } from "solid-js/web";
import { createSignal, onMount } from "solid-js";

import { state, setState, fetchActivities } from "../ActivitiesStore";

function Activities() {
  let activitiesContainerRef;

  onMount(() => {
    if (!state.isFetched) {
      fetchActivities();
    }
  });

  const handleActivityCreated = (newActivity) => {
    const formattedActivity = {
      id: newActivity.id,
      name: newActivity.name,
      time: newActivity.time,
    };
    setState("activities", (prev) => [...prev, formattedActivity]);

    // Scroll to the bottom of the activities container
    setTimeout(() => {
      if (activitiesContainerRef) {
        activitiesContainerRef.scrollTop = activitiesContainerRef.scrollHeight;
      }
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
        ref={(el) => (activitiesContainerRef = el)}
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
        <For each={state.activities}>
          {(item) => (
            <Activity id={item.id} activityName={item.name} time={item.time} />
          )}
        </For>
      </div>
    </div>
  );
}
export default Activities;
