// ActivityStore.jsx
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  activities: [],
  isFetched: false,
});

const fetchActivities = async () => {
  try {
    const response = await fetch("http://localhost:8080/activities");
    if (!response.ok) throw new Error("Failed to fetch activities");

    const data = await response.json();
    const formattedData = data.map((activity) => {
      // const { hours, minutes, seconds } = convertSecondsToHMS(activity.time);
      return {
        id: activity.id,
        name: activity.name,
        time: activity.time,
      };
    });
    setState("activities", formattedData);
    setState("isFetched", true);
  } catch (error) {
    console.error(error.message);
  }
};

const deleteActivity = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/activities/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete activity");

    setState("activities", (activities) =>
      activities.filter((activity) => activity.id !== id)
    );
  } catch (error) {
    console.error(error.message);
  }
};

const convertSecondsToHMS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
};

export {
  state,
  setState,
  fetchActivities,
  convertSecondsToHMS,
  deleteActivity,
};
