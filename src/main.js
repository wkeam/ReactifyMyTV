const path = require('path');
const { fetchData } = require('./parser.js');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');
const util = require('util');


async function createWindow(settings) {
  try {

    const currentDate = new Date();
    // Create a Date object using the provided timestamp
    const dateFromTimestamp = new Date(settings.lastSync);
    console.log('last synced: ' + dateFromTimestamp);
    console.log('date now: ' + currentDate);

    const timeDifference = currentDate.getTime() - dateFromTimestamp.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log('daysDifference: ' + daysDifference);
    // Set the desired interval (e.g., every 2 days)
    const intervalDays = 0.5;

    // Check if the specified interval has passed
    if (daysDifference >= intervalDays) {
      console.log('updating playlist and epg');
      await getPlaylistAndEpg();
    } else {
       console.log('skipping updating playlist and epg');
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
    } else {
      //win.loadURL(`file://${app.getAppPath()}/public/index.html`);
      win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }

    

    win.removeMenu();

    // Open the DevTools.
    // if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
    // }
  } catch (error) {
    console.error('Error:', error);
  }
}

function updateSettings(){
  const appPath = app.getAppPath();

  let settingsData = {
    lastSync : Date.now()
  };
  
  // const filePathWrite = path.join(appPath, 'src/data/settings/syncsettings.json');
  // fs.writeFileSync(filePathWrite, JSON.stringify(settingsData));
  const userDataPath = app.getPath('userData');
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
    console.log('savedSettings:', savedSettings);
    return savedSettings;
  });
}

async function getPlaylistAndEpg(){
  console.log('updating epg');
  //const appPath = app.getAppPath();
  const parsedData = await fetchData();
  //const filePath = path.join(appPath, 'src/data/parsed_data/parsedData.json');
  //fs.writeFileSync(filePath, JSON.stringify(parsedData));
  updateSettings();
}

app.on('ready', () => {
  // const appPath = app.getAppPath();
  // const filePath = path.join(appPath, 'src/data/settings/syncsettings.json');
  // const settings = readSettings(filePath);
  // Use 'userData' to get the path to the directory where you saved the file
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'appdata/syncsettings.json');

  // Function to read and parse JSON from a file
  const readJsonFile = (filePath) => {
      try {
          const fileContents = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContents);
      } catch (error) {
          let settingsData = {
            lastSync : Date.now()-1000
          };
          return settingsData;
      }
  };

  // Import settings
  const settings = readJsonFile(filePath);

  // Now you can use the 'settings' variable in your application
  console.log(settings);
  createWindow(settings);
});

function readSettings(filePath) {
  try {
      const data = fs.readFileSync(filePath, 'utf-8');
      console.log('data',data);
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



















////////////////////////////////////////////////////////////////////
// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
//     },
//   });

//   // and load the index.html of the app.
//   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// };

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and import them here.
