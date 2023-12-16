

def hello(name: str) -> str:
  """
  This function takes a string argument `name` and returns a string greeting with
  the format "hello _, {}!" where the underscore is replaced by the value of `name`.

  Args:
      name (str): The `name` input parameter is a string that is passed to the
          function when it is called. Inside the function body.

  Returns:
      str: The output returned by the function "hello" with the given signature
      and body is:
      
      "hello null!"

  """
  return f"hello, {name}!"

if __name__ == "__main__":
  hello("world")


