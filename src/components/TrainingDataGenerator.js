import React from "react";
import { Line as LineChart } from "react-chartjs";
import { range } from "lodash";

export const TrainingDataGenerator = ({ data, onCreate }) => (
  <div>
    Training data
    <button onClick={onCreate}>Generate</button>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
