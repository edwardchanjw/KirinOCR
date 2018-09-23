const electron = require('electron');
const { remote } = electron;
const nodeConsole = require('console');
const electronConsole = new nodeConsole.Console(process.stdout, process.stderr);
const {
    takeScreenshot,
    getCurrentDisplayStream,
    adjustBoundsToInset,
    cropAndGreyscale,
    recognizeText
} = require("./Library/methods.js");

/**
 * You can change the language here (to a Tesseract-suported short-code) in order to detect other languages.
 */
const tesseractLanguageModel = "jpn";

const appWindow = remote.getCurrentWindow();
setInterval(() => {
    const bounds = appWindow.getContentBounds();

    getCurrentDisplayStream(appWindow)
        .then(stream => takeScreenshot(stream))
        .then(screenshot => cropAndGreyscale(screenshot, adjustBoundsToInset(bounds)))
        .then(image => recognizeText(image, tesseractLanguageModel))
        .then(text => document.getElementById("feedback").innerHTML = text)
        .catch(err => electronConsole.log(err));
}, 1000);
