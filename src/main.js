import path from 'path';
const { fetchData } = require('./parser.js');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');
const util = require('util');
const userDataPath = app.getPath('userData');

let splash;

function createSplashWindow() {
  splash = new BrowserWindow({
    width: 600,
    height: 400,
    alwaysOnTop: true,
    transparent:false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if(isDev){
    const splashPath = path.join(__dirname, '../../src/public', 'splash.html');
    console.log(splashPath);
    splash.loadFile(splashPath);
  } else {
    const splashPath = path.join(__dirname, '../renderer/public', 'splash.html');
    console.log(splashPath);
    splash.loadFile(splashPath);

  }
  
  
  splash.removeMenu();
  splash.on('closed', () => {
    splash = null;
  });
}

async function createWindow(settings) {
  try {

    const currentDate = new Date();
    // Create a Date object using the provided timestamp
    const dateFromTimestamp = new Date(settings.lastSync);

    const timeDifference = currentDate.getTime() - dateFromTimestamp.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log('Days since last sync: ' + daysDifference);
    const intervalDays = 0.1;

    // Check if the specified interval has passed
    if (daysDifference >= intervalDays) {
      console.log('Updating channels and EPG');
      await getPlaylistAndEpg();
    } else {
      console.log('Skipping channels and EPG update');
    }

    // Create the browser window.
    const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: "ReactifyMyTV",
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: true,
        webSecurity: false,
        explicitArray: false,
      }
    });
    // win.setFullScreen(true);
    if (isDev) {
      win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
      win.webContents.openDevTools({ mode: 'detach' });
    } else {
      win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }
    splash.close();
    win.maximize();

    win.removeMenu();

    // Open the DevTools.
    // if (isDev) {
    
    // }
  } catch (error) {
    console.error('Error:', error);
  }
}

ipcMain.handle('get-data', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const channelsPath = path.join(userDataPath, 'appdata/channels.js');
    const epgPath = path.join(userDataPath, 'appdata/epg.js');

    const channels = await fs.readFileSync(channelsPath, 'utf-8');
    const epg = await fs.readFileSync(epgPath, 'utf-8');
    return { channels : JSON.parse(channels), epg : JSON.parse(epg) };
  } catch (error) {
    console.error('Error reading files:', error);
    return { channels: [], epg: [] };
  }
});

ipcMain.handle('quitApp', async () => {
  try{
    app.quit();
  } catch(error){
    console.log('Cant quit??!!');
    console.log(error);
  }
});

function updateSettings(){
  const appPath = app.getAppPath();

  let settingsData = {
    lastSync : Date.now()
  };

  const filePathWrite = path.join(userDataPath, 'appdata/syncsettings.json');
  
  // Make sure the directory exists before attempting to write the file
  const directoryPath = path.dirname(filePathWrite);
  if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(filePathWrite, JSON.stringify(settingsData));
  
  console.log(`File saved to: ${filePathWrite}`);
}

async function getSettings(filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    let savedSettings = JSON.parse(data);
    return savedSettings;
  });
}

async function getPlaylistAndEpg(){
  const parsedData = await fetchData();
  updateSettings();
}

app.on('ready', () => {
  createSplashWindow();
  const filePath = path.join(userDataPath, 'appdata/syncsettings.json');

  // Function to read and parse JSON from a file
  const readJsonFile = (filePath) => {
      try {
          const fileContents = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContents);
      } catch (error) {
          let settingsData = {
            lastSync : Date.now()-9000000000000
          };
          return settingsData;
      }
  };

  // Import settings
  const settings = readJsonFile(filePath);

  // Now you can use the 'settings' variable in your application
  createWindow(settings);
});

function readSettings(filePath) {
  try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error reading settings file:', error.message);
      return {};
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});