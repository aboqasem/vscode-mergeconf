import * as vscode from 'vscode';
import { html } from '../utils/utils';
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
    const stylesTailwindUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/css', 'tailwind.css'));
    const nonce = getNonce();

    return html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="${stylesResetUri}" rel="stylesheet" />
          <link href="${stylesMainUri}" rel="stylesheet" />
          <link href="${stylesTailwindUri}" rel="stylesheet" />
          <title>Merge Configurations</title>
        </head>
        <body>
          <h1 class="text-center mb-6">Merge Configurations</h1>
          <div class="grid grid-cols-2 gap-4 pb-5">
            <div>
              <label class="text-2xl" for="c1">Configuration 1:</label>
              <textarea id="c1" class="font-mono" rows="20"></textarea>
              <button id="c1Paste" class="mt-2">Paste Configuration 1</button>
            </div>
            <div>
              <label class="text-2xl" for="c2">Configuration 2:</label>
              <textarea id="c2" class="font-mono" rows="20"></textarea>
              <button id="c2Paste" class="mt-2">Paste Configuration 2</button>
            </div>
          </div>
          <div class="max-w-2xl mx-auto">
            <label class="text-2xl" for="c">Merged Configuration:</label>
            <textarea id="c" rows="20"></textarea>
          </div>
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

  public static postMessage(message: { command: string; payload?: any }): Thenable<boolean> {
    if (this.currentPanel) {
      return this.currentPanel.panel.webview.postMessage(message);
    }
    throw Error('Panel not instantiated.');
  }

  public dispose() {
    MergePanel.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }
}
