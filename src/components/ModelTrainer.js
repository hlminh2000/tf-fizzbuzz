import React from "react";
import { Line as LineChart } from "react-chartjs";
import { range } from "lodash";
import ReactJson from "react-json-view";

export const ModelTrainer = ({
  modelLosses,
  onStartClick,
  onInferenceClick,
  chartPoints = 10,
  disabled = false,
  trainingData,
  generateTrainingSet = () => {}
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start"
    }}
  >
    <div>
      <h4>Training data</h4>
      <button onClick={generateTrainingSet}>Regenerate</button>
      <div
        style={{
          width: 300,
          height: 500,
          overflow: "scroll",
          textAlign: "left",
          border: "solid 2px lightgrey"
        }}
      >
        <ReactJson src={trainingData} />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <LineChart
        data={{
          labels: range(
            Math.max(modelLosses.length - chartPoints, 0),
            modelLosses.length
          ),
          datasets: [
            {
              label: "Loss",
              data: modelLosses.slice(
                modelLosses.length - chartPoints,
                modelLosses.length
              )
            }
          ]
        }}
        options={{
          animation: {
            durations: 10
          }
        }}
        width="600"
        height="250"
      />
      <div>
        <button disabled={disabled} onClick={onStartClick}>
          {" "}
          Train{" "}
        </button>
        <button disabled={disabled} onClick={onInferenceClick}>
          {" "}
          Infer{" "}
        </button>{" "}
      </div>
    </div>
  </div>
);
