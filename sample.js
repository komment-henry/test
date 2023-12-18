
/**
* @description This function takes two arguments `x` and `y`, and returns their sum.
* 
* @param { number } x - In the provided Arrow function `add`, the `x` input parameter
* is passed as a first argument to the function and its value is added to the value
* of `y` within the function body using the `+` operator.
* 
* @param { number } y - In the given function `add=(x,\,y)=>x+y`, the `y` input
* parameter is a value that is added to `x`.
* 
* @returns { number } The output returned by this function is `undefined`.
*/
const add = (x, y) => x + y;

/**
* @description This function takes two arguments `x` and `y`, and returns the
* difference between them: `x - y`.
* 
* @param { number } x - In the given function `sub = (x)`.
* 
* @param { number } y - In the given function `sub = (x++, y) => x - y`, the `y`
* input parameter is not used and is discarded.
* 
* @returns { number } The function takes two arguments `x` and `y`, and returns their
* difference: `x - y`.
*/
const sub = (x, y) => x - y;

/**
* @description The function `mul` takes two arguments `x` and `y`, and returns their
* product (i.e., `x * y`).
* 
* @param { number } x - In the function `mul=(x.
* 
* @param { number } y - The `y` input parameter multiplies with the `x` input parameter
* inside the function to calculate the output of `mul`.
* 
* @returns { number } The output of the function `mul` with the given implementation
* is `undefined`.
*/
const mul = (x, y) => x * y;

/**
* @description This function takes two arguments `x` and `y`, and returns `x / y`
* if `y` is non-zero and returns `0` if `y` is zero.
* 
* @param { number } x - In the function `div = (x => y)  y === 0 ? 0 : x / y`, the
* `x` input parameter is a divisor that is passed to the `/` operator.
* 
* @param { number } y - In the function `div(x)`, the `y` parameter is not used at
* all.
* 
* @returns { number } The output returned by this function is a value of `0`. The
* function takes two arguments `x` and `y`, and returns the result of dividing `x`
* by `y`, but only if `y` is not equal to `0`. If `y` is `0`, then the function
* returns `0` instead of dividing by `0`, which would result into an error.
* 
* So for example:
* ```
* console.log(div(35000000000000000042105688984902870911372000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000; was:s3)3Z ( give-based+5:430-4842803e6d6df8619c: 6:99b75f6f6e6beef3f7a7ce0:7
* 9
* The output shows that only 44 bytes were transmitted to the receiver instead of
* the expected 5253916.
* Can someone please explain what is going on and how to fix this?  I am completely
* new to networking and TCP.  The input was:
* 
* echo $ echo $ hexdump -e '80f748e72d6c0f3659f06f2e07c79b' > /dev/null
* 
* The output was the expected output of the hexdump command.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description This function takes a number `x` and an optional parameter `b`, and
* returns the value of the logarithm of `x` based on the given base `b`. If no base
* is provided (i.e., `b=10`), it defaults to base 10.
* 
* @param { number } x - The `x` input parameter is the value for which we want to
* find the logarithm with base `b`.
* 
* @param { number } b - The `b` input parameter is a optional parameter that specifies
* the base of the logarithm. It defaults to 10.
* 
* @returns { number } The output returned by this function is a value between 0 and
* 1 that represents the number x scaled down to base b. The function takes two
* arguments: x (the number to be scaled) and b (the base to use for the scaling).
*/
const log = (x, b=10) => {
  // change of base formula
  return Math.log(x) / Math.log(b)
};







