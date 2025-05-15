import { useState } from "react";

import { Button } from "./components/base/buttons";
import Badge from "./components/base/badge";
import InputRadio from "./components/base/radio";

function App() {
  const [num, setNum] = useState(0);

  function handle(dec = false) {
    return () => setNum((a) => (dec ? a - 1 : a + 1));
  }

  function reset() {
    setNum(0);
  }

  return (
    <div style={{ width: 600, gap: 16 }} className="flex coll">
      <div className="card lg">
        <div className="card-content">
          <h2 style={{ textAlign: "center" }}>Current number: {num}</h2>
          <div style={{ padding: "16px 0" }}>Select an option</div>
          <div style={{ display: "flex", gap: 8 }} className="blocks">
            <Button onClick={handle(true)}>Decrease</Button>
            <Button color="primary" onClick={handle()}>
              Increase
            </Button>

            <Button color="error" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          <h1>Lamp (Not food)</h1>
          <p>The food that you eat is food! This however, is not food!</p>

          <Badge>Lamp</Badge>
          <Badge color="warning">Not edible</Badge>
        </div>
      </div>

      <div className="card">
        <InputRadio
          options={[
            {
              text: "Hamburger",
              value: 1,
            },
            {
              text: "Sandwich",
              value: 2,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
