
const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
const isDev = require("electron-is-dev");
var ipcMain;

const client = require("discord-rich-presence")("456118942725963787");
const updater = require('electron-simple-updater');


app.on("ready", () => {
    const { dialog } = require('electron')
    var alert = function (text) {
        dialog.showMessageBox({ type: 'info', message: text, buttons: ['Okay'] }, function (buttonIndex) {
        });
    };

    if (!isDev) {
        updater.init({
            checkUpdateOnStart: true,
            autoDownload: true
        });
    }
    updater.on("error", function (err) {
        alert("Woah, Something didn't work as expected :( " + err)
    })
    updater.on("update-not-available", function () { })
    updater.on("update-available", function (meta) {
        alert("Good news, we found an update! " + meta)
    })
    updater.on("update-downloading", function (meta) {
        alert("We have just started to download the update")
    })
    updater.on("update-downloaded", function (meta) {
        alert("Yay! We are ready to apply the update");
        updater.quitAndInstall();
    })
    ipcMain = electron.ipcMain;
    let mainWindow = createMainWindow();
    if (isDev) {
        mainWindow.openDevTools({ detach: true });
    }
    client.updatePresence({
        details: "In the menus",
        largeImageKey: "lom",
        instance: true
    });

    protocol.registerFileProtocol('atom', (request, callback) => {
        const url = request.url.substr(7)
        callback({ path: path.normalize(`${__dirname}/${url}`) })
    }, (error) => {
        if (error) console.error('Failed to register protocol')
    })
});



function createMainWindow() {
    const win = new electron.BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        backgroundColor: 'black',
        show: false,
        titleBarStyle: 'hidden',
        icon: 'assets/icon.png'
    });

    ipcMain.on('async', (event, arg) => {
        // Print 1
        console.log(arg);
        // Reply on async message from renderer process
        event.sender.send('async-reply', 2);
    });

    /*
    win.webContents.invalidate();

    win.webContents.on('dom-ready', ()=>{
        win.show();
    });*/
    /*
        win.once('ready-to-show', ()=> {
            setTimeout(function(){win.show();}, 1000);
        });*/

    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', onClosed);
    
    var champion = "Ezreal"

    var promptResponse
    ipcMain.on('prompt', function (eventRet, arg) {
        promptResponse = null
        var promptWindow = new electron.BrowserWindow({
            width: 300,
            height: 100,
            show: false,
            resizable: false,
            movable: false,
            alwaysOnTop: true,
            frame: false
        })
        arg.val = arg.val || ''
        const promptHtml = '<label for="val">' + arg.title + '</label>\
    <input id="val" value="' + arg.val + '" autofocus />\
    <button onclick="require(\'electron\').ipcRenderer.send(\'prompt-response\', document.getElementById(\'val\').value);window.close()">Ok</button>\
    <button onclick="window.close()">Cancel</button>\
    <style>body {font-family: sans-serif;} button {float:right; margin-left: 10px;} label,input {margin-bottom: 10px; width: 100%; display:block;}</style>'
        promptWindow.loadURL('data:text/html,' + promptHtml)
        promptWindow.show()
        promptWindow.on('closed', function () {
            eventRet.returnValue = promptResponse
            promptWindow = null
        })
    })
    ipcMain.on("update-notify-value", function (event, arg) {
        console.log(arg);
        if (arg == "lobby") {
            client.updatePresence({
                details: "In lobby",
                largeImageKey: "lom",
                instance: true
            });
        }
        else if (arg == "menu") {
            client.updatePresence({
                details: "In the menus",
                largeImageKey: "lom",
                instance: true
            });
        } else if (arg = "start"){
            client.updatePresence({
                details: "In game",
                state: 'Playing ' + champion,
                largeImageKey: champion.toLowerCase(),
                smallImageKey: 'lom',
                instance: true
            });
        } else {
            champion = arg;
        }
    });
    ipcMain.on('prompt-response', function (event, arg) {
        if (arg === '') {
            arg = null
        }
        promptResponse = arg
    })

    setTimeout(function () { win.show(); }, 5000);

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function onClosed() {
    // dereference the window
    // for multiple windows store them in an array
    mainWindow = null;
}