import * as tf from "@tensorflow/tfjs";
import { range } from "lodash";
import leftpad from "left-pad";

export const binarySize = 16;
export const maxDec = parseInt(
  range(0, binarySize)
    .map(() => 1)
    .join(""),
  2
);

window.range = range;

export const decimalToBinaryArray = num =>
  leftpad(num.toString(2), binarySize, "0")
    .split("")
    .map(Number);

const predict = ({ trainables }) => xs => {
  // a(sin(bx+c)) + d
  const [a, b, c, d] = trainables;
  // console.log("trainables: ", trainables.map(x => x.data()));
  tf
    .tensor(range(0, xs.size).map(() => 1))
    .data()
    .then(console.log);
  const output = a
    .mul(tf.sin(b.mul(xs).add(c)))
    .add(d)
    .relu();
  console.log(output);
  return output;
};
export const createDivisibleModel = () => {
  const a = tf.scalar(1).variable();
  const b = tf.scalar(1).variable();
  const c = tf.scalar(1).variable();
  const d = tf.scalar(1).variable();
  const trainables = [a, b, c, d];
  return { trainables, predict: predict({ trainables }) };
  // const model = tf.sequential();
  // model.add(
  //   tf.layers.dense({
  //     units: 10,
  //     inputShape: binarySize,
  //     activation: "relu"
  //   })
  // );
  // model.add(tf.layers.dense({ units: 2, activation: "softmax" }));
  // return model;
};

export const randBetween = (min, max) => Math.floor(Math.random() * max) + min;

const getCost = (actual, expected) => {
  actual.data().then(console.log);
  return tf
    .sub(actual, expected)
    .square()
    .mean();
};
export const trainDivisibleModel = model => async ({
  denom = 1,
  cycles = 50,
  learningRate = 0.1,
  trainingData = range(0, maxDec)
    .filter(() => Math.random() > 0.9)
    .map(num => {
      return {
        x: num,
        y: [Number(num % denom === 0)]
      };
    })
} = {}) => {
  const optimizer = tf.train.sgd(learningRate);
  for (let i = 0; i <= cycles; i++) {
    const initialCycleIndes = 0;
    const cost = optimizer.minimize(
      () =>
        getCost(
          predict(model)(tf.tensor(trainingData.map(({ x }) => x))),
          tf.tensor(trainingData.map(({ y }) => y))
        ),
      true,
      model.trainables
    );
    // console.log("loss: ", cost.toString());
  }

  // const optimizer = tf.train.sgd(learningRate);
  // model.compile({
  //   optimizer: optimizer,
  //   loss: "categoricalCrossentropy",
  //   metrics: ["accuracy"]
  // });
  // for (let i = 0; i <= cycles; i++) {
  //   const xs = tf.tensor(trainingData.map(({ x }) => x));
  //   const ys = tf.tensor(trainingData.map(({ y }) => y));
  //   const { history } = await model.fit(xs, ys);
  //   console.log(`cycle: ${i}, loss: ${history.loss[0]}`);
  // }
  // return model;
};
