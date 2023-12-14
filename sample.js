
/**
* @description The function `add` takes two arguments `x` and `y`, and returns their
* sum.
* 
* @param { number } x - In the function `add=(x、y)=>(x+y)`, the `x` input parameter
* is an argument that gets added to the `y` argument when the function is called.
* 
* @param { number } y - In the function `add=(x,%5By%5D)="x+y", the input parameter
* `y` is an argument that gets passed to the function along with `x`, and it gets
* added to `x` within the function.
* 
* @returns { number } The function `add` takes two arguments `x` and `y`, and returns
* their sum. In other words:
* 
* `add(x: number; y: number): number; // returning x+y`
* 
* So the output of the function would be the sum of `x` and `y`.
*/
const add = (x, y) => x + y;

/**
* @description This function takes two arguments `x` and `y`, and returns the
* difference between `x` and `y`.
* 
* @param { number } x - The `x` input parameter is a numeric value that represents
* the first operand of the subtraction operation performed by the function.
* 
* @param { number } y - In the function `sub = (x:number | undefined , y: number =>
* x - y)`, the `y` input parameter is a second number used as the subtraction operand.
* 
* @returns { number } The output returned by the given function `sub` with input `x
* = 5` and `y = 3` is `2`.
* 
* In concise terms:
* 
* The function subtracts `x` from `y`, which gives `5 - 3 = 2`.
*/
const sub = (x, y) => x - y;

/**
* @description The function `mul` takes two arguments `x` and `y` and returns their
* product (i.e., the result of multiplying them together).
* 
* @param { any } x - In the given function `mul`, the `x` input parameter is multiplied
* by the `y` input parameter.
* 
* @param { number } y - In the given function `mul`, the `y` input parameter is
* multiplied by the `x` input parameter to produce the output of the function.
* 
* @returns { number } The output returned by the function `mul` is undefined because
* it does not provide a explicit return statement.
*/
const mul = (x, y) => x * y;

/**
* @description This function divides `x` by `y`, but returns 0 if `y` is 0.
* 
* @param { number } x - The `x` input parameter is the dividend that is being divided
* by the `y` parameter.
* 
* @param { number } y - The `y` input parameter determines whether the function
* returns `0` or not. If `y` is equal to `0`, the function returns `0`.
* 
* @returns { number } The function `div` takes two arguments `x` and `y`, and returns
* the result of dividing `x` by `y`, but only if `y` is not zero.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description This function takes a single argument `x` and an optional argument
* `b`, and returns the value of the natural logarithm of `x` with respect to the
* base `b`.
* 
* @param { number } x - The `x` input parameter is the value for which the logarithm
* is to be calculated.
* 
* @param { number } b - The `b` input parameter represents the base of the logarithm
* used for calculation. In the function `log = (x,..., b=10)`, when not specified
* explicitly as an argument when calling the function the default value is 10.
* 
* @returns { number } The output returned by this function is a value that represents
* the logarithm of the input `x` with respect to base `b`, scaled down by a factor
* of ` Math.log(b) `.
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};


