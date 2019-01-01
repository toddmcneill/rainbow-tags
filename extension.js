const vscode = require('vscode');
const divsColor = ["#e6b422", "#c70067", "#00a960", "#fc7482"];
const isolatedRightBracketsDecorationTypes = vscode.window.createTextEditorDecorationType({
    color: "#e2041b"
});
let divsDecorationTypes = [];

function activate(context) {
    for (var index in divsColor) {
        divsDecorationTypes.push(vscode.window.createTextEditorDecorationType({
            color: divsColor[index]
        }));
    }

    let disposable = vscode.commands.registerCommand('extension.rainbowTags', () => {
        rainbowTags(vscode.window.activeTextEditor);
    });
    context.subscriptions.push(disposable);

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        rainbowTags(editor);
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(function (event) {
        var activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && event.document === activeEditor.document) {
            rainbowTags(activeEditor);
        }
    }, null, context.subscriptions);

}

function rainbowTags(activeEditor) {
    if (!activeEditor) {
        return;
    }

    var text = activeEditor.document.getText();
    var regEx = /(<\/?div(?:[^>]*)?>)/g;
    var match;
    var divsColorCount = 0;
    var openDivStack = [];
    var divsDecorationTypeMap = {};

    for (var index in divsDecorationTypes) {
        divsDecorationTypeMap[index] = [];
    }
    ;

    var rightBracketsDecorationTypes = [];
    var roundCalculate;
    while (match = regEx.exec(text)) {
        switch (match[0].substring(0, 2)) {
            case '<d':
                var startPos = activeEditor.document.positionAt(match.index);
                var endPos = activeEditor.document.positionAt(match.index + 5);
                var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: null };
                roundCalculate = divsColorCount;
                openDivStack.push(roundCalculate);
                divsColorCount++;
                if (divsColorCount >= divsColor.length) {
                    divsColorCount = 0;
                }
                divsDecorationTypeMap[roundCalculate].push(decoration);
                break;
            case '</':
                var startPos = activeEditor.document.positionAt(match.index);
                var endPos = activeEditor.document.positionAt(match.index + 6);
                var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: null };
                if (openDivStack.length > 0) {
                    roundCalculate = openDivStack.pop();
                    divsColorCount = roundCalculate;
                    divsDecorationTypeMap[roundCalculate].push(decoration);
                } else {
                    rightBracketsDecorationTypes.push(decoration);
                }
                break;
            default:
        }
    }
    for (var index in divsDecorationTypes) {
        activeEditor.setDecorations(divsDecorationTypes[index], divsDecorationTypeMap[index]);
    }
    activeEditor.setDecorations(isolatedRightBracketsDecorationTypes, rightBracketsDecorationTypes);
}

function deactivate() {}

module.exports = {
    activate: activate,
    deactivate: deactivate,
};
