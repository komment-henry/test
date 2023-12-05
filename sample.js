
/**
* @description This function adds two input numbers 'x' and 'y' together and returns
* their sum.
* 
* @param { number } x - The `x` input parameter adds the `y` input parameter to its
* current value.
* 
* @param { number } y - The `y` input parameter adds to the value of `x`.
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

const logb = (x, b) => Math.log(x) / Math.log(b);
