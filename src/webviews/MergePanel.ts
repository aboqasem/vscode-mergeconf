import * as vscode from 'vscode';
import { getNonce } from './getNonce';

export default class MergePanel {
  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  public static readonly viewType = 'merge';
  public static currentPanel: MergePanel | undefined;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    this.update();

    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables,
    );

    this.panel.onDidChangeViewState(
      (_) => {
        if (this.panel.visible) this.update();
      },
      null,
      this.disposables,
    );
  }

  private getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/js', 'main.js'));
    const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/css', 'reset.css'));
    const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/css', 'vscode.css'));
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
				<title>Merge Configurations</title>
			</head>
			<body>
        <h1 id="greeting">Hello, World!</h1>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }

  private update() {
    const webview = this.panel.webview;

    this.panel.title = 'Merge Configurations';
    this.panel.webview.html = this.getHtmlForWebview(webview);
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (MergePanel.currentPanel) return MergePanel.currentPanel.panel.reveal(column);

    const panel = vscode.window.createWebviewPanel(
      MergePanel.viewType,
      'Merge Configurations',
      column || vscode.ViewColumn.One,
      { enableScripts: true },
    );

    MergePanel.currentPanel = new MergePanel(panel, extensionUri);
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    MergePanel.currentPanel = new MergePanel(panel, extensionUri);
  }

  public dispose() {
    MergePanel.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }
}
