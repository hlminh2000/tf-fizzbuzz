import React from "react";
import "../App.css";
import { withState, compose } from "recompose";
import { ModelTrainer } from "../components/ModelTrainer";
import createFizzBuzzCategoryTrainingData from "../scripts/createTrainingData";
import {
  divBy3Model,
  divBy5Model,
  fizzBuzzModel,
  trainFizzBuzzModel,
  startDivisisbilityTraining,
  testDivisibleModel,
  testFizzBuzzModel,
  generateTrainingData
} from "./models";

export default compose(
  withState("isTraining", "setIsTraining", false),

  // modulo 3 trainer states
  withState("divBy3ModelLosses", "setDivBy3ModelLosses", []),
  withState(
    "trainingDataMod3",
    "setTrainingDataMod3",
    generateTrainingData({ denom: 3, percentage: 0.7 })
  ),
  withState("testResultMod3", "setTestResultMod3", []),

  // modulo 5 trainer states
  withState("divBy5ModelLosses", "setDivBy5ModelLosses", []),
  withState(
    "trainingDataMod5",
    "setTrainingDataMod5",
    generateTrainingData({ denom: 5, percentage: 0.7 })
  ),
  withState("testResultMod5", "setTestResultMod5", []),

  // fizzbuzz categorization trainer states
  withState(
    "fizzBuzzCategoryModelLosses",
    "setFizzBuzzCategoryModelLosses",
    []
  ),
  withState(
    "fizzBuzzCategoryTrainingData",
    "setFizzBuzzCategoryTrainingData",
    createFizzBuzzCategoryTrainingData()
  ),
  withState(
    "testResultFizzBuzzCategoryModel",
    "setTestResultFizzBuzzCategoryModel",
    []
  )
)(
  ({
    isTraining,
    setIsTraining,
    divBy3ModelLosses,
    setDivBy3ModelLosses,
    trainingDataMod3,
    setTrainingDataMod3,
    testResultMod3,
    setTestResultMod3,
    divBy5ModelLosses,
    setDivBy5ModelLosses,
    trainingDataMod5,
    setTrainingDataMod5,
    testResultMod5,
    setTestResultMod5,
    fizzBuzzCategoryModelLosses,
    setFizzBuzzCategoryModelLosses,
    fizzBuzzCategoryTrainingData,
    setFizzBuzzCategoryTrainingData,
    testResultFizzBuzzCategoryModel,
    setTestResultFizzBuzzCategoryModel
  }) => {
    const startTraining = async ({ trainer }) => {
      setIsTraining(true);
      await trainer();
      setIsTraining(false);
    };
    const ANIMATION_DELAY = 1500;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tensorflow fizzbuzz trainer</h1>
        </header>
        <div>
          <h1>1) Divisible by 3 model</h1>
          <ModelTrainer
            trainingData={trainingDataMod3}
            testResult={testResultMod3}
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
                    onCycleComplete: async ({ history: { loss: [loss] } }) => {
                      const results = await testDivisibleModel({
                        denom: 3,
                        model: divBy3Model,
                        range: { from: 19000, to: 19100 }
                      });
                      setDivBy3ModelLosses(state => [...state, loss]);
                      setTestResultMod3(results);
                    },
                    denom: 3,
                    cycles: 100,
                    animationDelayTime: ANIMATION_DELAY
                  })
              })
            }
            disabled={isTraining}
          />
        </div>
        <div>
          <h1>2) Divisible by 5 model</h1>
          <ModelTrainer
            trainingData={trainingDataMod5}
            testResult={testResultMod5}
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
                    onCycleComplete: async ({ history: { loss: [loss] } }) => {
                      const results = await testDivisibleModel({
                        denom: 5,
                        model: divBy5Model,
                        range: { from: 19000, to: 19100 }
                      });
                      setDivBy5ModelLosses(state => [...state, loss]);
                      setTestResultMod5(results);
                    },
                    denom: 5,
                    cycles: 100,
                    animationDelayTime: ANIMATION_DELAY
                  })
              })
            }
            disabled={isTraining}
          />
        </div>
        <div>
          <h1>3) FizzBuzz categorization model</h1>
          <ModelTrainer
            trainingData={fizzBuzzCategoryTrainingData}
            testResult={testResultFizzBuzzCategoryModel}
            modelLosses={fizzBuzzCategoryModelLosses}
            generateTrainingSet={() => {
              setFizzBuzzCategoryTrainingData(() =>
                createFizzBuzzCategoryTrainingData()
              );
            }}
            onStartClick={async () =>
              startTraining({
                trainer: () =>
                  trainFizzBuzzModel(fizzBuzzModel)({
                    trainingData: fizzBuzzCategoryTrainingData,
                    onCycleComplete: async ({ history: { loss: [loss] } }) => {
                      const results = await testFizzBuzzModel({
                        denom: 5,
                        model: divBy5Model,
                        range: { from: 19000, to: 19100 }
                      });
                      setFizzBuzzCategoryModelLosses(state => [...state, loss]);
                      setTestResultFizzBuzzCategoryModel(results);
                    },
                    animationDelayTime: ANIMATION_DELAY
                  })
              })
            }
            disabled={isTraining}
          />
        </div>
      </div>
    );
  }
);
