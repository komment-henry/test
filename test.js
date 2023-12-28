
/**
* @description This function takes a `message` argument and returns `true` with a
* probability of 0.5 + 0.25 \* random() > 0.5.
* 
* @param { string } message - The `message` input parameter is not used at all within
* the function.
* 
* @returns { boolean } The output returned by `decide_true` is either `true` or
* `false`. If the input message contains "rust", the function returns `true`. Otherwise
* it returns `false`. This is because the function first checks if the message
* contains "rust", and if not it falls back to returning a random value based on the
* outcome of `Math.random()`. However since Math.random() can return any number
* between 0 and 1 with equal probability. it is possible for decide_true to return
* both true and false when the function is called again .
*/
const decide_true = (message) => {
  if (message.contains("rust")) {
    return true;
  }
  return Math.random() > .5;
}


