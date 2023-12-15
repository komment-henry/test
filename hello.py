
def hello(name: str) -> str:
  """
  This function takes a string `name` as input and returns a string with the
  greeting "hello" followed by a comma and then the input string `name`, ending
  with an exclamation mark.

  Args:
      name (str): The `name` input parameter is a string that is passed into the
          function and is used as a parameter within the function to create a
          greeting message.

  Returns:
      str: The output returned by the function `hello` is "hello World!"

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


