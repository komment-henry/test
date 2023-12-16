

def hello(name: str) -> str:
  """
  The function `hello` takes a string argument `name` and returns a string with
  the message "hello" followed by a comma and the input `name`.

  Args:
      name (str): The `name` input parameter is passed as a string and is used
          inside the formatted string literal to produce the output greeting with
          the user's name.

  Returns:
      str: The output returned by this function is "hello World!"

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


