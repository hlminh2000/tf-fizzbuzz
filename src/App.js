import React, { Component } from "react";
import * as tf from "@tensorflow/tfjs";
import logo from "./logo.svg";
import "./App.css";
import {
  createFizzBuzzModel,
  trainFizzBuzzModel,
  createDivisibleModel,
  trainDivisibleModel,
  decimalToBinaryArray
} from "./ml/index.js";

export default () => {
  const divBy3Model = createDivisibleModel();
  const divBy5Model = createDivisibleModel();
  const fizzBuzzModel = createFizzBuzzModel();

  const startTraining = async () => {
    await Promise.all([
      trainDivisibleModel(divBy3Model)({ denom: 3 })
      // trainDivisibleModel(divBy5Model)({ denom: 5 }),
      // trainFizzBuzzModel(fizzBuzzModel)()
    ]);
    console.log("DONE!!!");
  };

  const inferDivisibilityBy = async num => {
    const correct = [];
    const max = 255;
    for (let i = 0; i <= max; i++) {
      const data = await divBy3Model.predict(tf.tensor([i])).data();
      const [divisible] = data;
      const isCategory = prob => prob > 0.9;
      if (isCategory(divisible) === (i % num === 0)) {
        correct.push(num);
      }
      console.log(
        `${i}: `,
        isCategory(divisible) ? "true" : "false",
        i % num === 0 ? "true" : "false"
      );
    }
    console.log(`acuracy: ${correct.length / max * 100}%`);
  };

  const startDivisibilityInferrence = async () => {
    console.log("divisibility by 3: ");
    await inferDivisibilityBy(3);
    console.log("divisibility by 5: ");
    // await inferDivisibilityBy(5);
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
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <div>
        <button onClick={startTraining}> Train </button>
        <button onClick={startDivisibilityInferrence}> Infer </button>
      </div>
      <div>
        <button onClick={startTraining}> Train </button>
        <button onClick={startDivisibilityInferrence}> Infer </button>
      </div>
    </div>
  );
};
