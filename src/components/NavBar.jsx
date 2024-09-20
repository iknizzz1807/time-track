function NavBar(props) {
  return (
    <>
      <nav
        style={{
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
          top: "0",
          left: "0",
          right: "0",
          height: "60px",
          zIndex: "1000",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            width: "80%",
            "justify-content": "center",
            "align-items": "center",
          }}
        >
          <button
            style={{
              "font-size": "16px",
              color: "#8076B0",
              width: "80px",
              "text-align": "center",
              padding: "8px",
              "border-radius": "4px",
              margin: "2px",
              "background-color":
                props.currentNav === "Activities" ? "lightblue" : "#1b232e",
              border: "none",
              "flex-grow": "1",
              "max-width": "200px",
            }}
            onClick={() => props.onNavChange("Activities")}
          >
            Activity
          </button>

          <button
            style={{
              "font-size": "16px",
              color: "#8076B0",
              width: "80px",
              "text-align": "center",
              padding: "8px",
              margin: "2px",
              "border-radius": "4px",
              "background-color":
                props.currentNav === "Chart" ? "lightblue" : "#1b232e",
              border: "none",
              "text-align": "center",
              "flex-grow": "1",
              "max-width": "200px",
            }}
            onClick={() => props.onNavChange("Chart")}
          >
            Chart
          </button>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
