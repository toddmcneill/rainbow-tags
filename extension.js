let vscode = require('vscode');

function activate(context) {
    var divsColor = ["#e6b422", "#c70067", "#00a960", "#fc7482"];
    var divsDecorationTypes = [];

    var isolatedRightBracketsDecorationTypes = vscode.window.createTextEditorDecorationType({
        color: "#e2041b"
    });

    for (var index in divsColor) {
        divsDecorationTypes.push(vscode.window.createTextEditorDecorationType({
            color: divsColor[index]
        }));
    }

    var activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        rainbowTags();
    }

    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            rainbowTags();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            rainbowTags();
        }
    }, null, context.subscriptions);

    function rainbowTags() {
        if (!activeEditor) {
            return;
        }

        var text = activeEditor.document.getText();
        var regEx = /<\/?div(.*)?>/g;
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
                    }
                    else {
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
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
