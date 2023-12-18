
/**
* @description This function adds two numbers together and returns the result.
* 
* @param { number } x - The `x` input parameter adds the `y` input parameter to itself.
* 
* @param { any } y - In the function `add(x., y)`, the `y` input parameter is used
* to concatenate two numbers together to get their sum.
* 
* @returns { number } The output returned by this function is `NaN` (Not a Number).
*/
const add = (x, y) => x + y;

/**
*/
const sub = (x, y) => x - y;

/**
* @description The function `mul` takes two arguments `x` and `y`, and returns their
* product (`x * y`).
* 
* @param { number } x - The `x` input parameter multiplies with the `y` input parameter
* inside the function.
* 
* @param { number } y - In the given function `mul`, the `y` input parameter is
* multiplied by the `x` input parameter to produce the output of the function.
* 
* @returns { number } The output of the function `mul` is `undefined`. The function
* takes two arguments `x` and `y`, and returns the result of multiplying them together.
*/
const mul = (x, y) => x * y;

/**
* @description This function takes two arguments `x` and `y`, and returns the result
* of dividing `x` by `y`, unless `y` is equal to 0.
* 
* @param { number } x - The `x` input parameter divides the result of the division
* by the divisor (`y`) when `y` is not equal to zero.
* 
* @param { number } y - The `y` input parameter determines whether the division
* should be executed or not.
* 
* @returns { number } The output returned by this function is `NaN` (Not a Number)
* because it tries to divide by zero.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description The function `log` takes a number `x` and an optional parameter `b`,
* and returns the value of `Math.log(x)` divided by `Math.log(b)`.
* 
* @param { number } x - The `x` input parameter is the value for which we want to
* find the logarithm with base `b`.
* 
* @param { number } b - The `b` input parameter is a parameter that specifies the
* base of the logarithm. It defaults to 10.
* 
* @returns { number } The output returned by this function is a numerical value that
* represents the logarithm of the input `x` with base `b`. The function takes two
* arguments: `x` and `b`, and returns a result of the form `log(x) / log(b)`. In
* other words , the function takes the natural logarithm of `x` and divides it by
* the natural logarithm of `b` to give the final output.
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};







