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
