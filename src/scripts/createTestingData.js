import { range } from "lodash";

export default () =>
  range(10000, 20000).map(num => ({
    x: [num, Number(num % 3 === 0), Number(num % 5 === 0)],
    y: [
      Number(num % 3 !== 0 && num % 5 !== 0 && num % 15 !== 0),
      Number(num % 3 === 0 && num % 15 !== 0),
      Number(num % 5 === 0 && num % 15 !== 0),
      Number(num % 15 === 0)
    ]
  }));
