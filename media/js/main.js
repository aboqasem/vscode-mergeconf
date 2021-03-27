const vscode = acquireVsCodeApi();
const state = vscode.getState();

const greetingElement = document.getElementById('greeting');

let greeting = state?.greeting ?? 'Hello';

greetingElement.textContent = greeting;

setInterval(() => {
  greeting = greeting === 'Hello' ? 'Hey' : 'Hello';
  greetingElement.textContent = greeting;
  vscode.setState({ greeting });
}, 500);

window.addEventListener('message', (event) => {
  const message = event.data;
  switch (message.command) {
    default:
      break;
  }
});
