// App.jsx
import NavBar from "./components/NavBar";
import { createSignal } from "solid-js";
import Activities from "./pages/Activities";
import Chart from "./pages/Chart";
import TrackingActivity from "./components/TrackingActivity";
import { CurrentActivityProvider } from "./contexts/CurrentActivityContext";

function App() {
  const [nav, setNav] = createSignal("Activities");
  return (
    <CurrentActivityProvider>
      <NavBar currentNav={nav()} onNavChange={setNav} />
      <div
        style={{
          "padding-left": "20%",
          "padding-right": "20%",
        }}
      >
        {nav() === "Activities" ? <Activities /> : <Chart />}
      </div>
      <TrackingActivity />
    </CurrentActivityProvider>
  );
}
export default App;
