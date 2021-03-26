import * as vscode from 'vscode';
import { ValidConf } from '../types';
import { mergeConfs } from '../utils';

export const mergeThis = async (): Promise<any> => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return;

  const editorText = activeEditor.document.getText();
  if (editorText.trim() === '') return vscode.window.showWarningMessage('Empty config file', 'OK');

  let c1: ValidConf;
  let c2: ValidConf;
  let mergedConf: ValidConf;

  try {
    c1 = JSON.parse(editorText);
  } catch (e) {
    return vscode.window.showErrorMessage('Invalid config file', 'OK');
  }

  const inputText = await vscode.window.showInputBox({
    prompt: 'Other configurations to merge',
    ignoreFocusOut: true,
    validateInput: (inputText) => {
      if (inputText.trim() === '') return 'Please enter a valid configuration';

      try {
        JSON.parse(inputText);
      } catch (e) {
        return 'Please enter a valid configuration';
      }

      return;
    },
  });
  if (!inputText) return;

  c2 = JSON.parse(inputText);

  try {
    mergedConf = mergeConfs(c1, c2);
  } catch (e) {
    return vscode.window.showErrorMessage('Merge failed', 'OK');
  }

  const areEditsSaved = await activeEditor.edit((editBuilder) => {
    const lastLineNumber = activeEditor.document.lineCount - 1;
    const firstCharPos = new vscode.Position(0, 0);
    const lastCharPos = activeEditor.document.lineAt(lastLineNumber).rangeIncludingLineBreak.end;
    const fullRange = new vscode.Range(firstCharPos, lastCharPos);

    const eof = activeEditor.document.eol === 1 ? '\n' : '\r\n';
    const tabSize = activeEditor.options.tabSize || 4;
    const mergedText = JSON.stringify(mergedConf, null, tabSize);

    editBuilder.replace(fullRange, mergedText + eof);
  });

  if (!areEditsSaved) return vscode.window.showErrorMessage('Merge failed', 'OK');

  return vscode.window.showInformationMessage('Merged successfully', 'OK');
};
