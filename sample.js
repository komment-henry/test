

/**
* @description The given function `add` takes two arguments `x` and `y`, and returns
* their sum (`x + y`).
* 
* @param { number } x - The `x` input parameter adds the value passed into the
* function to the `y` input parameter.
* 
* @param { number } y - In the given function `add = (x: number => x + y), the `y`
* input parameter is a variable that gets added to the `x` parameter and returns
* their sum.
* 
* @returns { number } The function `add` takes two parameters `x` and `y` and returns
* their sum.
*/
const add = (x, y) => x + y;

/**
* @description This function takes two arguments `x` and `y`, and returns their
* difference: `x - y`.
* 
* @param { number } x - In the function sub = (x`, y) => x - y`, the `x` input
* parameter is the first operand that will be subtracted from the second operand `y`.
* 
* @param { number } y - In the function `sub=(x,...,y)=>(x-y)`, the input parameter
* `y` is the subtrahend (the number to be subtracted).
* 
* @returns { number } The function `sub` takes two arguments `x` and `y` and returns
* their difference.
* 
* In other words:
* ```
* sub(x = 10), y = 5) → 10 - 5 = 5
* ```
*/
const sub = (x, y) => x - y;

/**
* @description The function `mul` takes two arguments `x` and `y` and returns their
* product (i.e., `x * y`).
* 
* @param {  } x - In the function `mul=(x: number | string | null) → (y: number |
* string | null) => x * y`, the `x` input parameter is a variable that represents
* the first operand for multiplication.
* 
* @param { string } y - In the provided JavaScript function `mul`, the `y` input
* parameter is a scalar operand that multiplies with the `x` parameter to compute
* the product of both.
* 
* @returns { number } The function `mul` takes two parameters `x` and `y`, and returns
* their multiplication:
* 
* `mul(x、y) = x * y`
* 
* In other words , the output returned by this function is the product of `x` and `y`.
*/
const mul = (x, y) => x * y;

/**
* @description The function `div` takes two arguments `x` and `y`, and returns the
* result of dividing `x` by `y`, but only if `y` is non-zero.
* 
* @param { number } x - The `x` input parameter is the dividend that is being divided
* by the `y` parameter.
* 
* @param { number } y - In the given function `div`, the `y` input parameter is used
* as a conditional predicate to determine whether the division operation should be
* performed or not.
* 
* @returns { number } The function `div` takes two arguments `x` and `y`, and returns
* an object that contains two properties: `zero` with value `false`, and `result`
* with value `x/y`. The function return type is `Partial<{ zero: boolean; result:
* number }>`, indicating that it may return an object with both `zero` and `result`
* properties.
* 
* When `y` is not equal to 0 (i.e., `y !== 0`), the function returns `x/y`.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description The given function takes a single argument `x` and an optional argument
* `b`, and returns the value of the natural logarithm of `x` with respect to the
* base `b`.
* 
* @param { number } x - The `x` input parameter represents the value to be logarithmized.
* 
* @param { number } b - The `b` input parameter controls the base of the logarithm.
* It is used to compute the logarithm with a different base than the usual natural
* base (10) by adjusting the dividend and divisor accordingly.
* 
* @returns { number } The output returned by this function is a numerical value that
* represents the logarithm of the input `x` with base `b`, calculated as `Math.log(x)
* / Math.log(b)`.
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};



















