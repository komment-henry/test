

const add = (x, y) => x + y;


const sub = (x, y) => x - y;


const mul = (x, y) => x * y;


const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description The given function `log` takes one argument `x`, and an optional
* argument `b` (which has a default value of `10`). It returns the value of the
* natural logarithm of `x` expressed with respect to the base `b`.
* 
* @param { number } x - In the function `log = (x)` etc. The `x` input parameter is
* the value to be operated on by the logarithm function.
* 
* @param { number } b - The `b` input parameter specifies the base of the logarithm.
* 
* @returns { number } The output returned by this function is a fraction with the
* logarithm of the input `x` as the numerator and the logarithm of the base `b` as
* the denominator.
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};
