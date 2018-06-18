import * as tf from "@tensorflow/tfjs";
import "../App.css";
import { range } from "lodash";
import {
  createFizzBuzzModel,
  trainFizzBuzzModel,
  createDivisibleModel,
  trainDivisibleModel,
  decimalToBinaryArray
} from "../ml/index.js";
import { maxDec } from "../ml/divisibleModel";
export { trainFizzBuzzModel } from "../ml/index.js";

export const divBy3Model = createDivisibleModel();
export const divBy5Model = createDivisibleModel();
export const fizzBuzzModel = createFizzBuzzModel();

export const startDivisisbilityTraining = async ({
  model,
  denom = 3,
  ...rest
}) => {
  return await Promise.all([
    trainDivisibleModel(model)({
      denom,
      ...rest
    })
  ]);
};

export const testDivisibleModel = async ({
  model = divBy3Model,
  range: { from = 0, to = 255 } = {},
  threshold = 0.5,
  denom = 3
} = {}) => {
  const predictions = [];
  for (let i = from; i < to; i++) {
    const data = await model
      .predict(tf.tensor([decimalToBinaryArray(i)]))
      .data();
    const [divisible] = data;
    const isCategory = prob => prob > threshold;
    predictions.push({
      num: i,
      prediction: isCategory(divisible),
      actual: i % denom === 0
    });
  }
  return predictions;
};

export const testFizzBuzzModel = async () => {
  const results = [];
  for (let i = 30000; i <= 30100; i++) {
    const data = await fizzBuzzModel
      .predict(tf.tensor([[Number(i % 3 === 0), Number(i % 5 === 0)]]))
      .data();
    const [none, fizz, buzz, fizzBuzz] = data;
    const isCategory = prob => prob > 0.9;
    const prediction = [
      isCategory(none),
      isCategory(fizz),
      isCategory(buzz),
      isCategory(fizzBuzz)
    ];
    const actual = [
      i % 3 !== 0 && i % 5 !== 0 && i % 15 !== 0,
      i % 3 === 0 && i % 15 !== 0,
      i % 5 === 0 && i % 15 !== 0,
      i % 15 === 0
    ];
    results.push({ num: i, prediction, actual });
  }
  return results;
};

export const generateTrainingData = ({ denom, percentage }) =>
  range(0, maxDec)
    .filter(() => Math.random() > percentage)
    .map(num => {
      return {
        x: decimalToBinaryArray(num),
        y: [Number(num % denom === 0), Number(num % denom !== 0)]
      };
    });
