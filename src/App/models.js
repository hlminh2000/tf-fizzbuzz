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

export const testModel = async ({
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

export const startFizzBuzzInferrence = async () => {
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

export const generateTrainingData = ({ denom, percentage }) =>
  range(0, maxDec)
    .filter(() => Math.random() > percentage)
    .map(num => {
      return {
        x: decimalToBinaryArray(num),
        y: [Number(num % denom === 0), Number(num % denom !== 0)]
      };
    });
