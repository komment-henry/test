

def hello(name: str) -> str:
  """
  The `hello` function takes a string `name` as input and returns a string greeting
  with the format "hello,\tonly{name}!"

  Args:
      name (str): The `name` input parameter is a string that is passed to the
          function and is used inside the function as part of the output message.

  Returns:
      str: The output returned by the function `hello` is "hello.

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


