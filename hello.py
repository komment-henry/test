
def hello(name: str) -> str:
  """
  The function `hello` takes a string argument `name` and returns a string greeting
  that includes the name.

  Args:
      name (str): The `name` input parameter is a string that is passed to the
          `hello` function and is used as a variable inside the function to customize
          the greeting message.

  Returns:
      str: The output returned by the function `hello` with the argument `name="John"`
      is "hello John!.

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")

