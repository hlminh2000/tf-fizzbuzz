import * as tf from "@tensorflow/tfjs";
import { range } from "lodash";
import leftpad from "left-pad";

const binarySize = 16;
export const maxDec = parseInt(
  range(0, binarySize)
    .map(() => 1)
    .join(""),
  2
);

window.range = range;

export const wait = ms =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const decimalToBinaryArray = num =>
  leftpad(num.toString(2), binarySize, "0")
    .split("")
    .map(Number);

export const createDivisibleModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: binarySize,
      inputShape: binarySize,
      activation: "relu"
    })
  );
  model.add(tf.layers.dense({ units: 5, activation: "relu" }));
  model.add(tf.layers.dense({ units: 2, activation: "softmax" }));
  return model;
};

export const randBetween = (min, max) => Math.floor(Math.random() * max) + min;

export const trainDivisibleModel = model => async ({
  denom = 1,
  cycles = 10,
  learningRate = 0.1,
  onCycleComplete = () => {},
  trainingData = range(0, maxDec)
    .filter(() => Math.random() > 0.7)
    .map(num => {
      return {
        x: decimalToBinaryArray(num),
        y: [Number(num % denom === 0), Number(num % denom !== 0)]
      };
    }),
  animationDelayTime = 1500
} = {}) => {
  const optimizer = tf.train.sgd(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  for (let i = 0; i < cycles; i++) {
    const xs = tf.tensor(trainingData.map(({ x }) => x));
    const ys = tf.tensor(trainingData.map(({ y }) => y));
    onCycleComplete(await model.fit(xs, ys));
    await wait(animationDelayTime);
  }
  return model;
};
