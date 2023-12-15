

def hello(name: str) -> str:
  """
  This function takes a string parameter named "name" and returns a string greeting
  with the name included (e.g.

  Args:
      name (str): The `name` input parameter is a string that is passed as an
          argument to the `hello` function.

  Returns:
      str: The output returned by the function `hello` with an undefined `name`
      argument is "Hello,.!"

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


