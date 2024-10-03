// src/routes/+layout.svelte
<script>
  import { writable } from 'svelte/store';
  import NavBar from '../components/NavBar.svelte';
  import TrackingActivity from '../components/TrackingActivity.svelte';
  import { setContext } from 'svelte';

  const nav = writable('Activities');

  // CurrentActivityContext
  const currentActivity = writable({
    activityName: "",
    time: 0,
    isAnyRunning: false,
    isPausing: false
  });

  let timer;

  function startActivity(name) {
    currentActivity.update(state => ({
      ...state,
      activityName: name,
      isAnyRunning: true,
      isPausing: false
    }));
    timer = setInterval(() => {
      currentActivity.update(state => ({
        ...state,
        time: state.time + 1
      }));
    }, 1000);
  }

  function stopActivity() {
    clearInterval(timer);
    currentActivity.set({
      activityName: "",
      time: 0,
      isAnyRunning: false,
      isPausing: false
    });
  }

  function pauseActivity() {
    clearInterval(timer);
    currentActivity.update(state => ({ ...state, isPausing: true }));
  }

  function resumeActivity() {
    currentActivity.update(state => ({ ...state, isPausing: false }));
    timer = setInterval(() => {
      currentActivity.update(state => ({
        ...state,
        time: state.time + 1
      }));
    }, 1000);
  }

  setContext('currentActivity', {
    subscribe: currentActivity.subscribe,
    startActivity,
    stopActivity,
    pauseActivity,
    resumeActivity
  });

  // Clean up timer on component unmount
  import { onDestroy } from 'svelte';
  onDestroy(() => clearInterval(timer));
</script>

<NavBar bind:currentNav={$nav} />
<div style="padding-left: 20%; padding-right: 20%;">
  <slot />
</div>
<TrackingActivity />

// src/routes/+page.svelte
<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/activities');
  });
</script>

// src/routes/activities/+page.svelte
<script>
  import { onMount } from 'svelte';
  import Activity from '../../components/Activity.svelte';
  import CreateActivity from '../../components/CreateActivity.svelte';
  import { activities, fetchActivities } from '../../stores/activitiesStore';

  let activitiesContainerRef;

  onMount(() => {
    if (!$activities.isFetched) {
      fetchActivities();
    }
  });

  function handleActivityCreated(newActivity) {
    const formattedActivity = {
      id: newActivity.id,
      name: newActivity.name,
      time: newActivity.time,
    };
    activities.update(state => ({
      ...state,
      activities: [...state.activities, formattedActivity]
    }));

    // Scroll to the bottom of the activities container
    setTimeout(() => {
      if (activitiesContainerRef) {
        activitiesContainerRef.scrollTop = activitiesContainerRef.scrollHeight;
      }
    }, 0);
  }
</script>

<div>
  <div style="display: flex; flex-direction: row; justify-content: space-between;">
    <h1 style="color: #F1F0FB;">Activities</h1>
    <CreateActivity on:activityCreated={handleActivityCreated} />
  </div>
  <div
    bind:this={activitiesContainerRef}
    style="display: flex; gap: 8px; flex-direction: column; overflow-y: scroll; max-height: calc(100vh - 200px); scrollbar-width: none; -ms-overflow-style: none;"
  >
    {#each $activities.activities as item (item.id)}
      <Activity id={item.id} activityName={item.name} time={item.time} />
    {/each}
  </div>
</div>

// src/routes/chart/+page.svelte
<script>
  // Implement your Chart component here
</script>

<h1>Chart</h1>
<!-- Add your chart implementation here -->

// src/components/NavBar.svelte
<script>
  export let currentNav;
</script>

<nav>
  <button on:click={() => currentNav = 'Activities'}>Activities</button>
  <button on:click={() => currentNav = 'Chart'}>Chart</button>
</nav>

// src/components/Activity.svelte
<script>
  import { getContext } from 'svelte';
  import { convertSecondsToHMS } from '../stores/activitiesStore';

  export let id;
  export let activityName;
  export let time;

  const { subscribe, startActivity } = getContext('currentActivity');
  let currentActivity;
  subscribe(value => currentActivity = value);

  const { hours, minutes, seconds } = convertSecondsToHMS(time);

  function startTimer() {
    startActivity(activityName);
  }
</script>

<div style="color: #F1F0FB; display: flex; flex-direction: row; border: solid 2px gray; border-radius: 12px; background-color: #1b232e; justify-content: space-between; align-items: center; padding: 16px;">
  <div style="display: flex; flex-direction: column;">
    <h3>{activityName}</h3>
    <p><strong>Total Time:</strong></p>
    <p>{hours}h - {minutes}m - {seconds}s</p>
  </div>

  <div style="display: flex; flex-direction: row; gap: 10px; align-items: center;">
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <button
        style="font-size: 20px; background-color: lightgreen;"
        on:click={startTimer}
        disabled={currentActivity.isAnyRunning}
      >
        Start
      </button>
    </div>
  </div>
</div>

// src/components/TrackingActivity.svelte
<script>
  import { getContext } from 'svelte';

  const { subscribe, stopActivity, pauseActivity, resumeActivity } = getContext('currentActivity');
  let currentActivity;
  subscribe(value => currentActivity = value);
</script>

<div style="color: white; position: fixed; bottom: 0; width: 100%; text-align: center;">
  <p>Activity: {currentActivity.activityName}</p>
  <p>Time: {currentActivity.time} seconds</p>
  {#if currentActivity.isPausing}
    <button on:click={resumeActivity} disabled={!currentActivity.isAnyRunning}>
      Resume
    </button>
  {:else}
    <button on:click={pauseActivity} disabled={!currentActivity.isAnyRunning}>
      Pause
    </button>
  {/if}

  <button on:click={stopActivity} disabled={!currentActivity.isAnyRunning}>
    Stop
  </button>
</div>

// src/stores/activitiesStore.js
import { writable } from 'svelte/store';

export const activities = writable({
  activities: [],
  isFetched: false,
});

export async function fetchActivities() {
  try {
    const response = await fetch("http://localhost:8080/activities");
    if (!response.ok) throw new Error("Failed to fetch activities");

    const data = await response.json();
    const formattedData = data.map((activity) => ({
      id: activity.id,
      name: activity.name,
      time: activity.time,
    }));
    activities.update(state => ({
      activities: formattedData,
      isFetched: true
    }));
  } catch (error) {
    console.error(error.message);
  }
}

export function convertSecondsToHMS(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

// CreateActivity
import { createSignal, onCleanup } from "solid-js";

function CreateActivity({ onActivityCreated }) {
  const [dropDownState, setDropDownState] = createSignal(false);
  const [activityName, setActivityName] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal("");

  const toggleDropDown = () => setDropDownState(!dropDownState());

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
      setDropDownState(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  onCleanup(() => document.removeEventListener("click", handleClickOutside)); // Not listen anymore when cleanup

  const checkEmpty = () => {
    if (activityName().trim() === "") {
      setErrorMessage("Activity name cannot be empty");
      return;
    } else setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (errorMessage() !== "") return;
    const newActivity = {
      name: activityName(),
      time: 0, // Assuming new activities start with 0 time
    };

    try {
      const response = await fetch("http://localhost:8080/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      const createdActivity = await response.json();

      // Call the callback to update the activities list
      onActivityCreated(createdActivity);

      // Reset the form
      setActivityName("");
      setErrorMessage("");
    } catch (error) {
      if (error.name === "TypeError") {
        setErrorMessage("Network error or server is not available");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div
      class="dropdown"
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        style={{
          color: "white",
          "font-size": "60px",
          "margin-right": "4px",
          cursor: "pointer",
          background: "none",
          border: "none",
          "padding-top": "8px",
        }}
        onClick={toggleDropDown}
      >
        +
      </button>
      <div
        style={{
          "font-size": "20px",
          display: dropDownState() ? "block" : "none",
          position: "absolute",
          "background-color": "#f9f9f9",
          "min-width": "240px",
          "z-index": "999",
          right: "0",
          "margin-right": "40px",
          "flex-direction": "column",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
          }}
        >
          <input
            type="text"
            placeholder="Activity name"
            value={activityName()}
            onInput={(e) => setActivityName(e.target.value)}
            style={{
              width: "300px",
              height: "40px",
              margin: "12px 16px",
              "border-radius": "8px",
              "font-size": "20px",
            }}
          />
          <button
            onClick={checkEmpty}
            type="submit"
            style={{
              height: "40px",
              width: "40%",
              margin: "12px 16px",
              "font-size": "20px",
              "border-radius": "8px",
              "background-color": "lightblue",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
        {errorMessage() && (
          <div
            style={{
              color: "red",
              "margin-top": "10px",
              "font-size": "16px",
              "text-align": "center",
            }}
          >
            {errorMessage()}
          </div>
        )}
      </div>
    </div>
  );
}
export default CreateActivity;