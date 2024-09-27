import { createSignal, onCleanup } from "solid-js";

function CreateActivity() {
  const [dropDownState, setDropDownState] = createSignal(false);

  const toggleDropDown = () => setDropDownState(!dropDownState());

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
      setDropDownState(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

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
          action=""
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
          }}
        >
          <input
            type="text"
            placeholder="Activity name"
            style={{
              width: "300px",
              height: "40px",
              margin: "12px 16px",
              "border-radius": "8px",
              "font-size": "20px",
            }}
          />
          <button
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
      </div>
    </div>
  );
}
export default CreateActivity;
