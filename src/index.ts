import { Greeter } from './components/Greeter';

function main() {
  const greeter = new Greeter('TypeScript Project');
  const message = greeter.greet();
  console.log(message);
}

main();
