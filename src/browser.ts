import { Greeter } from './components/Greeter';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting') as HTMLDivElement;
    const nameInput = document.getElementById('nameInput') as HTMLInputElement;
    const greetButton = document.getElementById('greetButton') as HTMLButtonElement;
    
    // Initial greeting
    const defaultGreeter = new Greeter('World');
    greetingElement.textContent = defaultGreeter.greet();
    
    // Handle button click
    greetButton.addEventListener('click', () => {
        const name = nameInput.value.trim() || 'World';
        const greeter = new Greeter(name);
        greetingElement.textContent = greeter.greet();
    });
    
    // Also handle Enter key in the input
    nameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            greetButton.click();
        }
    });
});
