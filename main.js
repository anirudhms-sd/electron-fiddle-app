// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const MAC_TRAFFIC_LIGHTS_POSITIONS = { x: 12, y: 17 };

require('@electron/remote/main').initialize()

function createWindow (setWindowMode = false) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    x: 68,
    y: 25,
    center: false,
    show: true,
    minWidth: 450,
    minHeight: 224,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    trafficLightPosition: MAC_TRAFFIC_LIGHTS_POSITIONS
  });

  require("@electron/remote/main").enable(mainWindow.webContents);
  // console.log(mainWindow.webContents);

  if (setWindowMode) {
    mainWindow.setFullScreen(true);
  }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function printAllWindows () {
  console.log(BrowserWindow.getAllWindows());
}

function closeAllWindows () {
  const windows = BrowserWindow.getAllWindows();

  windows.forEach((window) => {
    window.destroy();
  })
}

function closeAndCreateWindows () {
  closeAllWindows();
  createWindow(true);
}

ipcMain.on('log-windows', printAllWindows);
ipcMain.on('close-windows', closeAllWindows);
ipcMain.on('close-and-create-windows', closeAndCreateWindows);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
