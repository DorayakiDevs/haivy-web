import { useState } from "react";

import Badge from "../components/base/badge";
import InputRadio from "../components/base/radio";
import { Button } from "../components/base/buttons";
import { Padder } from "../components/base/layouts";

export function TestApplication() {
  return (
    <div style={{ width: 600, gap: 16 }} className="flex coll">
      <ButtonTest />

      <BadgeTest />

      <RadioTest />
    </div>
  );
}

function BadgeTest() {
  return (
    <div className="card">
      <div className="card-content">
        <h1>Lamp (Not food)</h1>
        <p>The food that you eat is food! This however, is not food!</p>

        <Badge color="secondary">Furniture</Badge>
        <Badge color="warning">Not edible</Badge>
      </div>
    </div>
  );
}

function ButtonTest() {
  const [num, setNum] = useState(0);

  function handle(dec = false) {
    return () => setNum((a) => (dec ? a - 1 : a + 1));
  }

  function reset() {
    setNum(0);
  }

  return (
    <div className="card lg">
      <div className="card-content">
        <h1>Clicky Countere</h1>
        <h2 style={{ textAlign: "center" }}>Current number: {num}</h2>
        <div style={{ padding: "16px 0" }}>Select an option</div>
        <div className="flex aictr" style={{ gap: 8 }}>
          <Button onClick={handle(true)}>Decrease</Button>
          <Button color="primary" onClick={handle()}>
            Increase
          </Button>
        </div>
        <Padder height={8} />
        <div className="flex">
          <Button color="error" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

function RadioTest() {
  const state = useState("");

  function clearChoice() {
    state[1]("");
  }

  return (
    <div className="card">
      <div className="card-content">
        <h2>Which would you prefer?</h2>
        {state[0] ? (
          <p>You would prefer to eat {state[0]}</p>
        ) : (
          <p>Select an option</p>
        )}
        <InputRadio
          options={[
            {
              value: "Hamburger",
            },
            {
              value: "Sandwich",
            },
          ]}
          size={25}
          state={state}
        />
        <br />
        {!state[0] || (
          <Button size="sm" onClick={clearChoice}>
            Clear my choice
          </Button>
        )}
      </div>
    </div>
  );
}
