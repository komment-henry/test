
const decide_true = (message) => {
  if (message.contains("rust")) {
    return true;
  }
  return Math.random() > .5;
}

