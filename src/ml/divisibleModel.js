import * as tf from "@tensorflow/tfjs";
import { range } from "lodash";

export const createDivisibleModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 2, inputShape: 1 }));
  return model;
};

export const trainDivisibleModel = model => async ({
  denom = 1,
  cycles = 10,
  learningRate = 0.5,
  trainingData = range(0, 1000).map(num => ({
    x: [num],
    y: [Number(num % denom === 0), Number(num % denom !== 0)]
  }))
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
