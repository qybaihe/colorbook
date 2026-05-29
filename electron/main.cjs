const { app, BrowserWindow, net, protocol, shell } = require('electron')
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

const scheme = 'colorbook'

protocol.registerSchemesAsPrivileged([
  {
    scheme,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
])

const distDir = path.join(__dirname, '..', 'dist')

function resolveDistFile(requestUrl) {
  const parsedUrl = new URL(requestUrl)
  const requestedPath = decodeURIComponent(parsedUrl.pathname || '/')
  const fallbackPath = path.join(distDir, 'index.html')
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '')
  const normalizedPath = path.normalize(relativePath)

  if (normalizedPath.startsWith('..') || path.isAbsolute(normalizedPath)) {
    return fallbackPath
  }

  const filePath = path.join(distDir, normalizedPath)
  return fs.existsSync(filePath) ? filePath : fallbackPath
}

function registerAppProtocol() {
  protocol.handle(scheme, (request) => {
    const filePath = resolveDistFile(request.url)
    return net.fetch(pathToFileURL(filePath).toString())
  })
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 720,
    backgroundColor: '#121715',
    title: '此地有回声',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  void mainWindow.loadURL(`${scheme}://app/index.html`)
}

app.whenReady().then(() => {
  registerAppProtocol()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
