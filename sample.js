
/**
* @description The function `add` takes two arguments `x` and `y`, and returns their
* sum.
* 
* @param { number } x - In the given function `add`, the `x` input parameter is used
* as the first operand for addition.
* 
* @param { any } y - The `y` input parameter is the second operand to be added to
* the first operand `x` during the calculation of the function's output.
*/
const add = (x, y) => x + y;

/**
* @description The given function `sub` takes two arguments `x` and `y` and returns
* the difference of `x` and `y`. In other words.
* 
* @param { number } x - In the provided function `sub`, the `x` input parameter is
* the first argument passed to the function and is used as a subtractand.
* 
* @param { number } y - In the given function `sub = (x)(y) => x - y`, the `y` input
* parameter is used as an argument to be subtracted from the `x` input parameter.
*/
const sub = (x, y) => x - y;

/**
* @description The function `mul` takes two arguments `x` and `y` and returns their
* product `x * y`.
* 
* @param { number } x - In the function `mul=(x,(y)=>x*y`, the `x` input parameter
* is the first factor for multiplication.
* 
* @param { number } y - In the given function `mul`, the `y` input parameter is the
* multiplier.
*/
const mul = (x, y) => x * y;

/**
* @description The function div takes two arguments x and y and returns the result
* of dividing x by y only if y is not equal to zero; if y is equal to zero the
* function returns 0.
* 
* @param { number } x - The `x` input parameter is not used by the function body of
* `div`. Instead it's only used for accessoring the `y` parameter.
* 
* @param { number } y - The `y` input parameter checks if it is equal to 0.
*/
const div = (x, y) => y === 0 ? 0 : x / y;

/**
* @description The function mmul takes two matrices matA and matB as input and returns
* the result of their matrix multiplication.
* 
* @param { array } matA - The `matA` input parameter is the first matrix to be multiplied.
* 
* @param { array } matB - The `matB` input parameter is the second matrix to be multiplied.
*/
const mmul = (matA, matB) => {
  var matC = [];
  // Perform matrix multiplication
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var dotProduct = 0;
      for (var k = 0; k < 4; k++) {
        dotProduct += matA[i * 4 + k] * matB[k * 4 + j];
      }
      matC[i * 4 + j] = dotProduct;
    }
  }
}
