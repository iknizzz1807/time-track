import NavBar from "./components/NavBar";
import { createSignal } from "solid-js";
import Activities from "./pages/Activities";
import Chart from "./pages/Chart";

const [nav, setNav] = createSignal("Activities");

function App() {
  return (
    <>
      <NavBar currentNav={nav()} onNavChange={setNav} />
      <div
        style={{
          "padding-left": "20%",
          "padding-right": "20%",
        }}
      >
        {nav() === "Activities" ? <Activities /> : <Chart />}
      </div>
    </>
  );
}
export default App;
