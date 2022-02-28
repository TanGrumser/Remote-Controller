const executor = require('child_process').exec;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const port = 8080;

app.use(express.static('../frontend'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
});

// Send the frontend folder.
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "../frontend" );
});

/* Send the log files. Unused for now.
app.get('/status', function (req, res) {
    console.log("status");
    res.sendFile(__dirname + "/logs.txt");
}); */

app.post('/shutDown', function (req, res) {
    console.log("Shut Down");  
    executeShellCommand('sysUtils\\nircmd.exe exitwin poweroff');
    res.send();
});

app.post('/standby', function (req, res) {
    console.log("standy");
    executeShellCommand('sysUtils\\nircmd.exe standby');
    res.send();
});

// Changes the system volume. Receives a value between 0 and 100.
app.post('/changeVolume', function (req, res) {
    let value = req.body.volumeChange;
    executeShellCommand('sysUtils\\nircmd.exe changesysvolume ' + value * (65535 / 100));
    res.send();
});

// Set the system volume. Receives a value between 0 and 100.
app.post('/setVolume', function (req, res) {
    let value = req.body.volume;
    console.log(value);
    executeShellCommand('sysUtils\\nircmd.exe setsysvolume ' + value * (65535 / 100));
    res.send();
});

// 
app.get('/changeVolume', function (req, res) {
    let delta = req.body.volumeChange;
    console.log(req.body);
    executeShellCommand('sysUtils\\nircmd.exe changesysvolume ' + delta);
    res.send();
});

// Simulates a key input. Input must follow this: https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/windows-scripting/8c6yea83(v=vs.84)?redirectedfrom=MSDN
app.post('/keyInput', function (req, res) {
    let key = req.body.key;
    console.log(key);
    executeShellCommand("sysUtils\\inputSimulator.bat " + key);
    res.send();
});

// Moves the cursor or simulates a click on the left or right mouse button.
app.post('/mouseInput', function (req, res) {
    let deltaX = req.body.deltaX;
    let deltaY = req.body.deltaY;
    
    switch(req.body.type) {
        case "move":  executeShellCommand('sysUtils\\nircmd.exe movecursor ' + deltaX + ' ' + deltaY); break;
        case "left":  executeShellCommand('sysUtils\\nircmd.exe sendmouse left click'); break;
        case "right": executeShellCommand('sysUtils\\nircmd.exe sendmouse right click'); break;
    }
    
    res.send();
});

app.get('/getVolume', function (req, res) {
    let sysCall = executeShellCommand('sysUtils\\adjust_get_current_system_volume_vista_plus.exe');

    sysCall.then(val => res.send(val));
});

function executeShellCommand(command) {
    return new Promise(function(resolve, reject) {
        executor(command, (error, stdout, stderr) => {
            if (error !== null) {
                console.log('exec error: ' + error);
                reject(error);
            }

            resolve(stdout);
        });
    });
}
