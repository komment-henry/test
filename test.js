/**
* @description This function takes a string message as input and returns true if the
* message contains the word "rust", otherwise it returns false.
* 
* @param { string } message - In the function `decide_true`, the `message` input
* parameter is a string that is checked for the presence of the word "rust".
* 
* @returns {  } The function `decide_true` takes a message as input and returns
* `true` if the message contains the word "rust", and `false` otherwise.
* 
* The output returned by this function is `true`.
*/
const decide_true = (message) => {
  if (message.contains("rust")) {
    return true;
  }
  return false;
}

