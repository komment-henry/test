use clap::derive::Parser;

#[derive(Parser)]
struct Args {
  help: bool,
  verbose: usize,
}

fn main() {
  let _ = Args::parse();
}
