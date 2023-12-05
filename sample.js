
/**
* @description The function `add` takes two arguments `x` and `y`, and returns their
* sum.
* 
* @param { number } x - In the given function `add`, the `x` input parameter is used
* as a placeholder for the first number being added.
* 
* @param {  } y - The `y` input parameter adds the second operand to the first operand.
* 
* @returns { number } The function `add` takes two parameters `x` and `y` and returns
* their sum.
*/
const add = (x, y) => x + y;

/**
* @description The function sub((x$, y$), → (x $– y)) subtracts the second argument
* from the first.
* 
* @param { number } x - In the function sub = (x`,y) => x - y` , the `x` input
* parameter is passed as an argument and is used as a subtractand to calculate the
* difference with `y`.
* 
* @param { number } y - The `y` input parameter subtracts from `x`.
*/
const sub = (x, y) => x - y;

/**
* @description The function `mul` takes two arguments `x` and `y` and returns their
* product (i.e., the result of multiplying `x` by `y`).
* 
* @param { any } x - The `x` input parameter multiplies the result.
* 
* @param { any } y - In the given function `mul`, the `y` input parameter is multiplied
* by the value of `x`, returning the product of both numbers.
*/
const mul = (x, y) => x * y;

/**
* @description The function takes two arguments `x` and `y`, and returns the value
* of `x` divided by `y`, unless `y` is zero then it returns 0.
* 
* @param { number } x - The `x` input parameter is ignored.
* 
* @param { number } y - In the given function `div`, the `y` input parameter is a
* numerical value that is used to determine whether the function should return `0`
* or the result of dividing `x` by `y`.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description This function takes a number `x` and an optional base `b` (defaulting
* to 10), and returns the value of the natural logarithm of `x` with respect to the
* specified base `b`.
* 
* @param {  } x - The `x` input parameter is the value for which we want to find the
* logarithm.
* 
* @param { number } b - The `b` input parameter is a multiplicative factor that
* changes the base of the logarithm computation.
* 
* @returns { number } The output returned by this function is a floating-point number
* representing the value of `Math.log(x)` divided by `Math.log(10)`, which can be
* described concisely as the logarithm of `x` with base `10`.
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};
