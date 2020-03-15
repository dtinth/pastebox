const { app, ipcMain, BrowserWindow } = require('electron')
const tempWrite = require('temp-write')
const path = require('path')

ipcMain.on('dragstart', (event, options) => {
  const filePath = tempWrite.sync(options.buffer, options.name)
  event.sender.startDrag({
    file: filePath,
    icon: filePath.endsWith('.png')
      ? filePath
      : filePath.endsWith('.wav')
      ? path.join(__dirname, 'assets/wav@2x.png')
      : path.join(__dirname, 'assets/unknown@2x.png'),
  })
})

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 320,
    height: 320,
    vibrancy: 'hud',
    backgroundColor: '#00353433',
    webPreferences: {
      nodeIntegration: true,
    },
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
