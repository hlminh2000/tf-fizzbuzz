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

const wait = ms =>
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
  // model.add(
  //   tf.layers.conv1d({
  //     inputShape: [binarySize, 1],
  //     kernelSize: 3,
  //     filters: 8,
  //     strides: 1,
  //     activation: "relu",
  //     kernelInitializer: "varianceScaling"
  //   })
  // );
  // model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]})); // 24 / 2 = 12
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
    })
} = {}) => {
  const optimizer = tf.train.sgd(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  for (let i = 0; i < cycles; i++) {
    const xs = tf.tensor(trainingData.map(({ x }) => x));
    // .reshape([trainingData.length, binarySize, 1, 1]);
    const ys = tf.tensor(trainingData.map(({ y }) => y));

    // console.log("xs: ", xs.toString());
    // console.log(
    //   "xs.reshape: ",
    //   xs.reshape([trainingData.length, binarySize, 1, 1]).toString()
    // );
    onCycleComplete(await model.fit(xs, ys));
    await wait(1500);
  }
  return model;
};
