

def hello(name: str) -> str:

  """
  This function takes a string argument `name` and returns a string with the
  greeting "hello" followed by a comma and the input `name`.

  Args:
      name (str): The `name` input parameter is passed to the string format
          specification inside the function's body.

  Returns:
      str: The output returned by this function is "hello.

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


