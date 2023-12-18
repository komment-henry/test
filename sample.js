
/**
* @description The function `add` takes two arguments `x` and `y`, and returns their
* sum.
* 
* @param { any } x - The `x` input parameter adds `y` to itself.
* 
* @param { number } y - The `y` input parameter adds to the value of `x`.
* 
* @returns { number } The output of the function `add` is `x + y`, which is the sum
* of the two input parameters `x` and `y`.
*/
const add = (x, y) => x + y;

/**
* @description This function takes two arguments `x` and `y`, and returns their difference.
* 
* @param { number } x - In the provided function `sub = (x`, `y) => x - y`, the `x`
* input parameter is a variable that is being subtracted from the `y` input parameter.
* 
* @param { number } y - The `y` input parameter is a value that is subtracted from
* the `x` parameter inside the function.
* 
* @returns {  } The output returned by the function `sub` is `undefined`.
*/
const sub = (x, y) => x - y;

/**
* @description The given function `mul` takes two arguments `x` and `y`, and returns
* their product (`x * y`).
* 
* @param { number } x - The `x` input parameter multiplies the value passed to it
* with the `y` input parameter using the multiplication operator `*`.
* 
* @param { number } y - In the function `mul(x., y.)`, the `y` input parameter is
* the multiplier that is used to multiply with the `x` input parameter.
* 
* @returns { number } The function `mul` takes two arguments `x` and `y` and returns
* their product as a result.
*/
const mul = (x, y) => x * y;

/**
* @description The given function `div` takes two arguments `x` and `y`, and returns
* the value of `x` divided by `y`, except when `y` is equal to zero.
* 
* @param { number } x - In the given function `div`, the `x` input parameter is the
* dividend that is being divided by the `y` input parameter.
* 
* @param { number } y - In the given function `div`, the `y` input parameter is used
* to determine whether the division should be performed or not. If `y` is 0., then
* the function returns 0.
* 
* @returns { number } The function `div` takes two arguments `x` and `y`, and returns
* the result of dividing `x` by `y`, unless `y` is equal to 0 (in which case it
* returns 0).
* 
* The output returned by this function depends on the values of `x` and `y`. If `y`
* is not equal to 0 (i.e., if `y !== 0`), then the function returns the result of
* dividing `x` by `y`.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description This function takes a number `x` and an optional parameter `b`, and
* returns the logarithm of `x` with respect to the base `b`.
* 
* @param { number } x - The `x` input parameter represents the number for which we
* want to find the logarithm with the base `b`.
* 
* @param { number } b - The `b` input parameter represents the base of the logarithm
* used for the calculation.
* 
* @returns { number } The output returned by this function is a fraction with the
* logarithm of `x` as the numerator and the logarithm of `b` as the denominator.
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};





















