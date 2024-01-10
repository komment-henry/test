
/**
* @description The given function `add` takes two arguments `x` and `y` and returns
* their sum.
* 
* @param { number } x - In the function `add = (xptoy) => x + y`, the `x` input
* parameter is added to the `y` input parameter.
* 
* @param { number } y - In the function `add=(x、y)=>x+y`, the `y` input parameter
* adds its value to `x` .
* 
* @returns { number } The function `add` takes two arguments `x` and `y`, and returns
* their sum.
*/
const add = (x, y) => x + y;
// @komment write
/**
* @description This function takes two arguments `x` and `y`, and returns the
* difference between them: `x - y`.
* 
* @param { number } x - In the given function `sub`, the `x` input parameter is
* passed by value and represents the first operand for the subtraction operation.
* 
* @param { number } y - In the function `sub=(x.y)`, `y` is a parameter that represents
* the second argument being passed to the function.
* 
* @returns { number } The function takes two arguments `x` and `y`, and returns the
* difference between `x` and `y`.
* 
* In other words:
* 
* The output of the function is `x - y`.
*/
const sub = (x, y) => x - y;

/**
* @description The given function `mul` takes two arguments `x` and `y` and returns
* their product (`x * y`).
* 
* @param { number } x - In the function `mul=(x,
y)=>x*y`, the `x` input parameter
* multiplies the value of `y`.
* 
* @param { number } y - In the function `mul = (x)`.`, `y` is a parameters and it
* takes on the role of a multiplier.
* 
* @returns { number } The function `mul` takes two parameters `x` and `y`, and returns
* their product `x * y`.
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
* @description This function takes two matrices `matA` and `matB` as input and returns
* their matrix product (i.e., the dot product of each row of `matA` with each column
* of `matB`).
* 
* @param {  } matA - The `matA` input parameter is the first matrix being multiplied.
* 
* @param { array } matB - The `matB` input parameter is the second matrix to be
* multiplied with the first matrix `matA`, as denoted by the arrow `=>` between the
* parameters. It represents the transposed version of the original matrix B since
* JavaScript and most programming languages do not support matrix multiplication
* with the dot product notation if A and B are not transposes of each other.
* 
* @returns { array } The function `mmul` takes two matrices `matA` and `matB` as
* inputs and returns the product of these matrices as a new matrix `matC`. The output
* returned by this function is a row-major array representation of the matrix product.
* In other words.
*/
const mmul = (matA, matB) => {
  /*
  // Define the result matrix as a row-major array
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

  return matC;
  */
  
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

  return matC;
}

