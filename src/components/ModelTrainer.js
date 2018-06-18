import React from "react";
import { Line as LineChart, Pie } from "react-chartjs-2";
import { isEqual } from "lodash";
import { range } from "lodash";
import ReactJson from "react-json-view";

export const ModelTrainer = ({
  modelLosses,
  onStartClick,
  chartPoints = 100,
  disabled = false,
  trainingData,
  testResult,
  generateTrainingSet = () => {}
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      borderBottom: "solid 1px lightgrey",
      padding: 20
    }}
  >
    <div>
      <h4>Training data</h4>
      <button disabled={disabled} onClick={generateTrainingSet}>
        Regenerate
      </button>
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <LineChart
        data={{
          labels: range(
            Math.max(modelLosses.length - chartPoints, 0),
            modelLosses.length
          ),
          datasets: [
            {
              label: "Loss",
              data: modelLosses.filter(
                (num, i) => i >= modelLosses.length - chartPoints
              ),
              backgroundColor: ["#FFCE56"]
            }
          ]
        }}
        options={{
          animation: {
            duration: 200
          }
        }}
        width={600}
        height={250}
      />
      <Pie
        data={{
          labels: ["Correct", "Incorrect"],
          datasets: [
            {
              data: testResult.reduce(
                (acc, { prediction, actual }) => [
                  isEqual(prediction, actual) ? acc[0] + 1 : acc[0],
                  !isEqual(prediction, actual) ? acc[1] + 1 : acc[1]
                ],
                [0, 0]
              ),
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384"]
            }
          ]
        }}
        width={600}
        height={250}
        options={{
          animation: {
            duration: 10
          }
        }}
      />
      <div>
        <button disabled={disabled} onClick={onStartClick}>
          Train
        </button>
      </div>
    </div>
  </div>
);
