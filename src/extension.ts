import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('MergeConf is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('mergeconf.merge', () => {
      vscode.window.showInformationMessage('I will be merging your config files.');
    }),
  );
}

export function deactivate() {}
