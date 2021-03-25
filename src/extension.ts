import * as vscode from 'vscode';
import { ValidConf } from './types';

export function activate(context: vscode.ExtensionContext) {
  console.log('MergeConf is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('mergeconf.mergeThis', async () => {
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
          if (inputText.trim() === '') {
            return 'Please enter a valid configuration';
          }

          try {
            JSON.parse(inputText);
          } catch (e) {
            return 'Please enter a valid configuration';
          }

          return null;
        },
      });
      if (!inputText) return;

      c2 = JSON.parse(inputText);

      if (c1 === null || typeof c1 === 'boolean' || typeof c1 === 'number' || typeof c1 === 'string') {
        if (c2 instanceof Array) {
          mergedConf = [c1, ...c2];
        } else if (
          c2 === null ||
          typeof c2 === 'boolean' ||
          typeof c2 === 'number' ||
          typeof c2 === 'string' ||
          typeof c2 === 'object'
        ) {
          mergedConf = [c1, c2];
        }
      } else if (c2 === null || typeof c2 === 'boolean' || typeof c2 === 'number' || typeof c2 === 'string') {
        if (c1 instanceof Array) {
          mergedConf = [...c1, c2];
        } else if (
          c1 === null ||
          typeof c1 === 'boolean' ||
          typeof c1 === 'number' ||
          typeof c1 === 'string' ||
          typeof c1 === 'object'
        ) {
          mergedConf = [c1, c2];
        }
      } else if (c1 instanceof Array && c2 instanceof Array) {
        mergedConf = [...c1, ...c2];
      } else if (c1 instanceof Array && !(c2 instanceof Array)) {
        mergedConf = [...c1, c2];
      } else if (!(c1 instanceof Array) && c2 instanceof Array) {
        mergedConf = [c1, ...c2];
      } else if (!(c1 instanceof Array) && !(c2 instanceof Array)) {
        mergedConf = { ...c1 };

        for (const k2 in c2) {
          if (!Object.prototype.hasOwnProperty.call(c1, k2)) {
            mergedConf[k2] = c2[k2];
          }
        }
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
    }),
  );
}

export function deactivate() {}
