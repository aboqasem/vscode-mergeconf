import * as vscode from 'vscode';
import { merge } from './commands';
import { mergeThis } from './commands';
import { MergePanel } from './webviews';

export function activate(context: vscode.ExtensionContext) {
  console.log('Merge Configurations is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('mergeconf.merge', merge.bind(undefined, context)));

  context.subscriptions.push(vscode.commands.registerCommand('mergeconf.mergeThis', mergeThis));
}

export function deactivate() {}
