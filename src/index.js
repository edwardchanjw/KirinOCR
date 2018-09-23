const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', () => {
    const window = new BrowserWindow({
        alwaysOnTop: true,
        width: 250,
        height: 100,
        transparent: true,
        frame: true,
        toolbar: false,
        maximizable: false,
        minimizable: false,
        hasShadow: false,
    });

    // Loads the 'webpage' into the main Electron window.
    // Our apps' main code lives here.
    window.loadURL(`file://${__dirname}/index.html`);
    window.show();
});
