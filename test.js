
/**
* @description This function takes a `message` argument and returns `true` if the
* message contains the word "rust" or if the value of `Math.random()` is greater
* than 0.5.
* 
* @param { string } message - The `message` input parameter is not used or evaluated
* anywhere within the function.
* 
* @returns { boolean } The function `decide_true` takes a `message` parameter and
* returns a boolean value indicating whether the message contains the word "rust"
* or not. If the message does contain "rust", the function returns `true`.
*/
const decide_true = (message) => {
  if (message.contains("rust")) {
    return true;
  }
  return Math.random() > .5;
}

