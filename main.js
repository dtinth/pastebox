const { app, ipcMain, BrowserWindow, clipboard } = require('electron')
const tempWrite = require('temp-write')
const fs = require('fs')
const path = require('path')
const removeQueue = []
let recycled = 0

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
  removeQueue.push({ filePath })
  for (const item of removeQueue) {
    if (item.filePath !== filePath) {
      item.expires = Date.now() + 60e3
    }
    if (item.expires && Date.now() > item.expires) {
      const size = fs.statSync(item.filePath).size
      recycled += size
      fs.unlinkSync(item.filePath)
      console.log('Removed %s MB', (size / 1e6).toFixed(3))
    }
  }
})

let pollInterval
ipcMain.on('clipboardMonitor', (event, options) => {
  if (options.on && !pollInterval) {
    let lastSeen
    const getClipboard = () => {
      if (!clipboard.availableFormats().includes('image/png')) {
        return null
      }
      try {
        return clipboard.readImage().toPNG()
      } catch (error) {
        console.error('Auto-paste failed', error)
        return null
      }
    }
    pollInterval = setInterval(() => {
      const latest = getClipboard()
      if (latest !== lastSeen) {
        if (latest && (!lastSeen || Buffer.compare(latest, lastSeen) !== 0)) {
          console.log('Changed')
          event.sender.send('pasted', { image: latest })
        }
        lastSeen = latest
      }
    }, 1000)
  } else if (!options.on && pollInterval) {
    clearInterval(pollInterval)
  }
})

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 320,
    height: 320,
    vibrancy: 'hud',
    backgroundColor: '#00353433',
    acceptFirstMouse: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
