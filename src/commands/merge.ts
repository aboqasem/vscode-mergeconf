import * as vscode from 'vscode';
import * as path from 'path';
import MergePanel from '../webviews/MergePanel';
import { ValidConf } from '../types';
import { mergeConfs } from '../utils';

export const merge = (context: vscode.ExtensionContext): any => {
  const activeEditor = vscode.window.activeTextEditor;

  let activeC1Text = '';
  let tabSize: string | number = 4;

  if (activeEditor && activeEditor.document.languageId.toLowerCase() === 'json') {
    activeC1Text = activeEditor.document.getText();
    tabSize = activeEditor.options.tabSize ?? tabSize;
    const activeFileName = path.basename(activeEditor.document.fileName);
    vscode.window.showInformationMessage(`Copied ${activeFileName} config file's content`, 'OK');
  } else {
    vscode.window.showWarningMessage('No config file was selected, continuing with empty config', 'OK');
  }

  MergePanel.createOrShow(context.extensionUri);

  MergePanel.postMessage({ command: 'activeC1Text', payload: activeC1Text });

  MergePanel.onDidReceiveMessage((message) => {
    switch (message.command) {
      case 'merge':
        let c1: ValidConf;
        let c2: ValidConf;
        let mergedConf: ValidConf;

        const c1Text: string = message.payload.c1Text;
        const c2Text: string = message.payload.c2Text;

        try {
          c1 = JSON.parse(c1Text);
        } catch (e) {
          return vscode.window.showErrorMessage('Configuration 1 is invalid', 'OK');
        }

        try {
          c2 = JSON.parse(c2Text);
        } catch (e) {
          return vscode.window.showErrorMessage('Configuration 2 is invalid', 'OK');
        }

        try {
          mergedConf = mergeConfs(c1, c2);
        } catch (e) {
          return vscode.window.showErrorMessage('Merge failed', 'OK');
        }

        MergePanel.postMessage({ command: 'mergedConfText', payload: JSON.stringify(mergedConf, null, tabSize) });

        return vscode.window.showInformationMessage('Merged successfully', 'OK');

      default:
        return;
    }
  });
};
