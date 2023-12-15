
def hello(name: str) -> str:
  """
  The function `hello` takes a string argument `name` and returns a string consisting
  of the phrase "hello" followed by a comma and the value of `name`.

  Args:
      name (str): The `name` input parameter is a string that is passed to the
          `hello` function when it is called. In the function body: `{name}` will
          be replaced by the value of `name` when the function is executed.

  Returns:
      str: The output returned by the function `hello` is "hello World!" since
      there is no value provided for the argument `name`.

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")

