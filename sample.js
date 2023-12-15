
const add = (x, y) => x + y;

const sub = (x, y) => x - y;

const mul = (x, y) => x * y;

const div = (x, y) => y === 0 ? 0 : x / y;

const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};




