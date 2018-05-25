import * as tf from "@tensorflow/tfjs";
import { range } from "lodash";
import leftpad from "left-pad";

const binarySize = 8;
const maxDec = 255;

export const decimalToBinaryArray = num =>
  leftpad(num.toString(2), binarySize, "0")
    .split("")
    .map(Number);

export const createDivisibleModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 32, inputShape: binarySize, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 2, activation: "softmax" }));
  return model;
};

export const randBetween = (min, max) => Math.floor(Math.random() * max) + min;

export const trainDivisibleModel = model => async ({
  denom = 1,
  cycles = 300,
  learningRate = 0.2,
  trainingData = range(0, maxDec).map(num => {
    return {
      x: decimalToBinaryArray(num),
      y: [Number(num % denom === 0), Number(num % denom !== 0)]
    };
  })
} = {}) => {
  const optimizer = tf.train.sgd(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  for (let i = 0; i <= cycles; i++) {
    console.log("cycle: ", i);
    const xs = tf.tensor(trainingData.map(({ x }) => x));
    const ys = tf.tensor(trainingData.map(({ y }) => y));
    await model.fit(xs, ys);
  }
  return model;
};
