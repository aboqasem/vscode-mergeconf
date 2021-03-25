import * as vscode from 'vscode';
import { Json, ValidConf } from './types';

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
      let mergedConf: ValidConf = null;

      try {
        c1 = JSON.parse(editorText) as Json;
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
            console.table({ has: true, c2, k2, c1 });

            mergedConf[k2] = c2[k2];
          }
        }
      }

      const areEditsSaved = await activeEditor.edit((editBuilder) => {
        const lastLineNumber = activeEditor.document.lineCount - 1;
        const firstCharPos = new vscode.Position(0, 0);
        const lastCharPos = activeEditor.document.lineAt(lastLineNumber).rangeIncludingLineBreak.end;
        const fullRange = new vscode.Range(firstCharPos, lastCharPos);

        const finalText = JSON.stringify(mergedConf, null, activeEditor.options.tabSize || 4) + '\n';

        editBuilder.replace(fullRange, finalText);
      });

      if (!areEditsSaved) return vscode.window.showErrorMessage('Merge was not saved', 'OK');

      return vscode.window.showInformationMessage('Merge was saved', 'OK');
    }),
  );
}

export function deactivate() {}
