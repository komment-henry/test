

/**
* @description The given function `add` takes two arguments `x` and `y` and returns
* their sum.
* 
* @param { number } x - In the given function `add`, the `x` input parameter is the
* first number to be added.
* 
* @param { number } y - In the given function `add`, the `y` input parameter is added
* to the `x` input parameter.
* 
* @returns { number } The function `add` takes two parameters `x` and `y`, and returns
* their sum.
*/
const add = (x, y) => x + y;


/**
* @description This function takes two arguments `x` and `y`, and returns the
* difference between `x` and `y`.
* 
* @param { number } x - The `x` input parameter is not used at all.
* 
* @param { number } y - In the function `sub=(x،y)=>(x-y)`, the `y` input parameter
* is subtracted from the `x` input parameter.
* 
* @returns { number } The output returned by the function `sub` with input parameters
* `x` and `y` is the difference of `x` and `y`.
*/
const sub = (x, y) => x - y;


/**
* @description The function `mul` takes two arguments `x` and `y`, and returns their
* product (`x * y`).
* 
* @param { any } x - The `x` input parameter multiplies with the `y` input parameter
* within the function.
* 
* @param { number } y - The `y` input parameter multiplies with the `x` input parameter
* inside the function.
* 
* @returns { number } The function `mul` takes two parameters `x` and `y`, and returns
* their product as an integer.
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
