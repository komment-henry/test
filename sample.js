
/**
* @description The function `add` takes two arguments `x` and `y`, and returns their
* sum.
* 
* @param { number } x - The `x` input parameter adds its value to the `y` input
* parameter when called as a function.
* 
* @param { number } y - In the function add = (x，y) => x+y of functional programming
* languages，the second argument(parameteryer 'y) of the add function adds two arguments
* to produce output of same format.
* In simple terms.
* 
* @returns { number } The output of the given function `add` with the arguments `2`
* and `3` would be `5`.
*/
const add = (x, y) => x + y;

/**
* @description This function takes two arguments `x` and `y`, and returns their
* difference `x - y`.
* 
* @param { number } x - In the function `(x: Number = > Number)`, `x` is a required
* input parameter and represents the first operand for subtraction.
* 
* @param { number } y - The `y` input parameter is subtracted from `x` within the function.
* 
* @returns { number } The output returned by this function is `undefined`. This is
* because the function does not provide a return statement or value.
*/
const sub = (x, y) => x - y;

/**
* @description The given function `mul` takes two arguments `x` and `y`, and returns
* their product (i.e., the result of multiplying them together).
* 
* @param { number } x - The `x` input parameter multiplies with the `y` input parameter
* inside the function to return the result of their multiplication.
* 
* @param { number } y - In the provided function `mul`, the `y` input parameter is
* the factor by which the output of the function will be multiplied.
* 
* @returns { number } The function `mul` takes two arguments `x` and `y`, and returns
* their product (`x * y`).
*/
const mul = (x, y) => x * y;


/**
* @description This function takes two arguments `x` and `y`, and returns the value
* of `x` divided by `y`, unless `y` is equal to zero (in which case it returns zero).
* 
* @param { number } x - In the given function `div`, the `x` input parameter is the
* dividend that is being divided by the divisor `y`.
* 
* @param { number } y - The `y` input parameter is not used anywhere inside the
* function body. It is only assigned to the function's return value if the expression
* `y === 0` is falsey (i.e., `y` is not equal to 0).
* 
* @returns { number } The output returned by this function is a Number value. The
* function takes two arguments 'x' and 'y', and returns the result of dividing 'x'
* by 'y', except when 'y' is equal to 0 then the function returns 0. In other words;
* 
* div(25,'5') = (25/5) = 5 (result: 5)
* div(-16,'4') = ( (-16)/4) = -4 (result:-4)
* div(5,'0') = (5/0) =  Infinity Not allowed by mathematics ( result is  not computed).
* div(-8937,'0')= (-8937/0)= Infinity Not allowed by mathematics ( result:  not computed)
* 
* So the function only computes the result when 'y' is not equal to zero.
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
