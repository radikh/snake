import { Greeter } from '../Greeter';

describe('Greeter', () => {
  it('should greet with the provided name', () => {
    const greeter = new Greeter('Jest');
    expect(greeter.greet()).toBe('Hello, Jest!');
  });
});
