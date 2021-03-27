import * as vscode from 'vscode';
import MergePanel from '../webviews/MergePanel';

export const merge = (context: vscode.ExtensionContext): any => {
  MergePanel.createOrShow(context.extensionUri);
};
