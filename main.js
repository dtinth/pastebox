const { app, ipcMain, BrowserWindow } = require('electron')
const tempWrite = require('temp-write')

ipcMain.on('dragstart', (event, options) => {
  const fileName = `${new Date().toJSON().replace(/\W/g, '')}.png`
  const filePath = tempWrite.sync(options.buffer, fileName)
  event.sender.startDrag({
    file: filePath,
    icon: filePath,
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
