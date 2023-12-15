
def hello(name: str) -> str:
  """
  The `hello` function takes a string `name` as input and returns a string greeting
  with the format "hello [name]!"

  Args:
      name (str): The `name` input parameter is a string that is passed as an
          argument to the `hello()` function.

  Returns:
      str: The output returned by this function is "hello , undefined!" because
      the value of name is undefined.

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


