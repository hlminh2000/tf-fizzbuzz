import React from "react";
import * as tf from "@tensorflow/tfjs";
import logo from "./logo.svg";
import "./App.css";
import { withState, compose } from "recompose";
import { range } from "lodash";
import {
  createFizzBuzzModel,
  trainFizzBuzzModel,
  createDivisibleModel,
  trainDivisibleModel,
  decimalToBinaryArray
} from "./ml/index.js";
import { maxDec } from "./ml/divisibleModel";
import { ModelTrainer } from "./components/ModelTrainer";

const divBy3Model = createDivisibleModel();
const divBy5Model = createDivisibleModel();
const fizzBuzzModel = createFizzBuzzModel();

const startDivisisbilityTraining = async ({ model, denom = 3, ...rest }) => {
  return await Promise.all([
    trainDivisibleModel(model)({
      denom,
      ...rest
    })
  ]);
};

const startDivisibilityInferrence = async () => {
  const predictions = [];
  for (let i = 0; i <= 255; i++) {
    const data = await divBy3Model
      .predict(tf.tensor([decimalToBinaryArray(i)]))
      .data();
    const [divisible] = data;
    const isCategory = prob => prob > 0.9;
    predictions.push({
      prediction: isCategory(divisible),
      actual: i % 3 === 0
    });
  }
  console.log(
    "accuracy: ",
    predictions.filter(({ prediction, actual }) => prediction === actual)
      .length / 255
  );
};

const startFizzBuzzInferrence = async () => {
  for (let i = 30000; i <= 30100; i++) {
    const data = await fizzBuzzModel
      .predict(tf.tensor([[Number(i % 3 === 0), Number(i % 5 === 0)]]))
      .data();
    const [fizz, buzz, fizzBuzz] = data;
    const isCategory = prob => prob > 0.9;
    console.log(
      `${i}: `,
      isCategory(fizz)
        ? "fizz"
        : isCategory(buzz) ? "buzz" : isCategory(fizzBuzz) ? "fizzBuzz" : i,
      i % 3 === 0 && i % 15 !== 0
        ? "fizz"
        : i % 5 === 0 && i % 15 !== 0 ? "buzz" : i % 15 === 0 ? "fizzBuzz" : i
    );
  }
};

const generateTrainingData = ({ denom, percentage }) =>
  range(0, maxDec)
    .filter(() => Math.random() > percentage)
    .map(num => {
      return {
        x: decimalToBinaryArray(num),
        y: [Number(num % denom === 0), Number(num % denom !== 0)]
      };
    });

export default compose(
  withState("divBy3ModelLosses", "setDivBy3ModelLosses", []),
  withState("divBy5ModelLosses", "setDivBy5ModelLosses", []),
  withState(
    "trainingDataMod3",
    "setTrainingDataMod3",
    generateTrainingData({ denom: 3, percentage: 0.7 })
  ),
  withState(
    "trainingDataMod5",
    "setTrainingDataMod5",
    generateTrainingData({ denom: 5, percentage: 0.7 })
  ),
  withState("isTraining", "setIsTraining", false)
)(
  ({
    divBy3ModelLosses,
    setDivBy3ModelLosses,
    divBy5ModelLosses,
    setDivBy5ModelLosses,
    isTraining,
    setIsTraining,
    trainingDataMod3,
    setTrainingDataMod3,
    trainingDataMod5,
    setTrainingDataMod5
  }) => {
    const startTraining = async ({ trainer }) => {
      setIsTraining(true);
      await trainer();
      setIsTraining(false);
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Tensorflow fizzbuzz trainer</h1>
        </header>
        <div>
          <h1>Divisible by 3 model</h1>
          <ModelTrainer
            trainingData={trainingDataMod3}
            modelLosses={divBy3ModelLosses}
            generateTrainingSet={() =>
              setTrainingDataMod3(() =>
                generateTrainingData({ denom: 3, percentage: 0.7 })
              )
            }
            onStartClick={async () =>
              startTraining({
                trainer: () =>
                  startDivisisbilityTraining({
                    model: divBy3Model,
                    onCycleComplete: ({ history: { loss: [loss] } }) => {
                      setDivBy3ModelLosses(state => [...state, loss]);
                    },
                    denom: 3,
                    cycles: 100
                  })
              })
            }
            chartPoints={20}
            onInferenceClick={startDivisibilityInferrence}
            disabled={isTraining}
          />
        </div>
        <div>
          <h1>Divisible by 5 model</h1>
          <ModelTrainer
            trainingData={trainingDataMod5}
            modelLosses={divBy5ModelLosses}
            generateTrainingSet={() =>
              setTrainingDataMod5(() =>
                generateTrainingData({ denom: 5, percentage: 0.7 })
              )
            }
            onStartClick={async () =>
              startTraining({
                trainer: () =>
                  startDivisisbilityTraining({
                    model: divBy5Model,
                    onCycleComplete: ({ history: { loss: [loss] } }) => {
                      setDivBy5ModelLosses(state => [...state, ...loss]);
                    },
                    denom: 5,
                    cycles: 100
                  })
              })
            }
            onInferenceClick={startDivisibilityInferrence}
            disabled={isTraining}
          />
        </div>
      </div>
    );
  }
);
