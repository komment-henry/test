
const add = (x, y) => x + y;

const sub = (x, y) => x - y;

const mul = (x, y) => x * y;

const div = (x, y) => y === 0 ? 0 : x / y;

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
