
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
