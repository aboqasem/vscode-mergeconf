import * as vscode from 'vscode';
import { mergeThis } from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('Merge Configurations is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('mergeconf.mergeThis', mergeThis));
}

export function deactivate() {}
