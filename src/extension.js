const player = require("play-sound")((opts = {}));
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

function activate(context) {
  console.log('Your extension "ErrorJams" is now active!');

  let disposable = vscode.commands.registerCommand(
    "extension.playErrorJam",
    () => {
      console.log("Play Error Jam command executed");
      playRandomSound();
    }
  );

  context.subscriptions.push(disposable);

  vscode.workspace.onDidSaveTextDocument((document) => {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const hasErrors = diagnostics.some(
      (diagnostic) => diagnostic.severity === vscode.DiagnosticSeverity.Error
    );

    if (hasErrors) {
      console.log("Errors found in file, playing sound...");
      playRandomSound();
    } else {
      console.log("No errors found in file.");
    }
  });

  function playRandomSound() {
    const audioDir = path.join(__dirname, "../audios");
    fs.readdir(audioDir, (err, files) => {
      if (err) {
        console.error("Could not list the directory.", err);
        return;
      }

      const audioFiles = files.filter(
        (file) => file.endsWith(".mp3") || file.endsWith(".wav")
      );

      if (audioFiles.length > 0) {
        const randomFile =
          audioFiles[Math.floor(Math.random() * audioFiles.length)];
        const soundPath = path.join(audioDir, randomFile);

        player.play(soundPath, (err) => {
          if (err) {
            console.error("Error playing sound:", err);
          } else {
            console.log("Sound played successfully:", randomFile);
          }
        });
      } else {
        console.warn("No audio files found in the directory.");
      }
    });
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
