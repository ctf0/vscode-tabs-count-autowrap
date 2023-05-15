import * as vscode from 'vscode';

export const PACKAGE_NAME = 'tabsCountAutowrap';
let config: vscode.WorkspaceConfiguration;

export async function activate(context: vscode.ExtensionContext) {
    readConfig();
    await checkForTabsCount();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration(PACKAGE_NAME)) {
                readConfig();
            }
        }),
        vscode.window.tabGroups.onDidChangeTabs(async (e: vscode.TabChangeEvent) => {
            if (e.opened || e.closed) {
                await checkForTabsCount();
            }
        }),
    );
}

function checkForTabsCount() {
    return updateConfig(openedTabsCountExceeded());
}

function updateConfig(state: boolean) {
    return vscode.workspace.getConfiguration().update('workbench.editor.wrapTabs', state);
}

function readConfig() {
    config = vscode.workspace.getConfiguration(PACKAGE_NAME);
}

function openedTabsCountExceeded(): boolean {
    return !!vscode.window.tabGroups.all.find((group: vscode.TabGroup) => group.tabs.length > config.threshold);
}

export function deactivate() { }
