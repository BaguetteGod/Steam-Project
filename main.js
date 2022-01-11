const { app, BrowserWindow } = require('electron');
const path = require('path');

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  win.loadFile('index.html')
};

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

// const {
//   app,
//   BrowserWindow,
//   ipcMain
// } = require('electron');
// const path = require('path');
// const fs = require('fs');

// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let win;

// async function createWindow() {

//   // Create the browser window.
//   win = new BrowserWindow({
//     width: 1366,
//     height: 768,
//     webPreferences: {
//       nodeIntegration: false, // is default value after Electron v5
//       contextIsolation: true, // protect against prototype pollution
//       enableRemoteModule: false, // turn off remote
//       preload: path.join(__dirname, 'preload.js') // use a preload script
//     }
//   });

//   // Load app
//   win.loadFile(path.join(__dirname, 'index.html'));

//   // rest of code..
// }

// app.on('ready', createWindow);

// ipcMain.on('toMain', (event, args) => {
//   fs.readFile('path/to/file', (error, data) => {
//     // Do something with file contents

//     // Send result back to renderer process
//     win.webContents.send('fromMain', responseObj);
//   });
// });