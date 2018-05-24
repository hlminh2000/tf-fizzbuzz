import * as tf from "@tensorflow/tfjs";
import createTrainingData from "../scripts/createTrainingData";

export const createFizzBuzzModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, inputShape: 2 }));
  model.add(tf.layers.dense({ units: 10, activation: "relu" }));
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));
  return model;
};

export const trainFizzBuzzModel = model => async ({
  cycles = 10,
  learningRate = 0.5,
  trainingData = createTrainingData()
} = {}) => {
  const optimizer = tf.train.sgd(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  for (let i = 0; i <= cycles; i++) {
    console.log("cycle: ", i);
    const xs = tf.tensor(
      trainingData.map(({ x }) => x.filter((_, _i) => _i > 0))
    );
    const ys = tf.tensor(
      trainingData.map(({ y }) => y.filter((_, _i) => _i > 0))
    );
    await model.fit(xs, ys);
  }
  return model;
};
