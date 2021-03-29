import * as vscode from 'vscode';
import * as path from 'path';
import MergePanel from '../webviews/MergePanel';

export const merge = (context: vscode.ExtensionContext): any => {
  const activeEditor = vscode.window.activeTextEditor;

  let activeC1Text = '';

  if (activeEditor && activeEditor.document.languageId.toLowerCase() === 'json') {
    activeC1Text = activeEditor.document.getText();
    const activeFileName = path.basename(activeEditor.document.fileName);
    vscode.window.showInformationMessage(`Copied ${activeFileName} config file's content`, 'OK');
  } else {
    vscode.window.showWarningMessage('No config file was selected, continuing with empty config', 'OK');
  }

  MergePanel.createOrShow(context.extensionUri);

  MergePanel.postMessage({ command: 'activeC1Text', payload: activeC1Text });
};
