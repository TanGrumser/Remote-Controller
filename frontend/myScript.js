function init() {
    initializeMousePad();

    updateVolumeSlider();
}

function updateSlider(value) {
    sendSetVolumeCommand(value);
    console.log(value);
}

function fn() {
    console.log("done");
}
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

let countdown = 5;
let interupt;

async function startShutdown() {
    interupt = false;
    countdown = 5;

    while (countdown > 0) {
        $('#info-text').text('Shutting down computer in ' + countdown + ' seconds.');
        $('#info-text').fadeIn();
        await Sleep(1000);

        if (interupt) {
            return;
        }

        countdown--;
    }

    $('#info-text').text('Shutting down computer.');
    sendShutDownCommand();
}

function cancelCounter() {
    interupt = true;
    $('#info-text').fadeOut();
}

function sendKeyInputCommand(key) {
    sendCommand("keyInput", JSON.stringify({"key": key}));
}

function sendSpaceInputCommand(key) {
    sendCommand("keyInput", JSON.stringify({"key": "\" \""}));
}

/*
async function startShutdown() {
    while (countdown > 0) {
        $('#info-text').text('Shutting down computer in ' + countdown + ' seconds.');
        await Sleep(1000);
        countdown--;
    }
    
    $('#info-text').text('Shutting down computer.');
}
*/

function updateVolumeSlider() {
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.href + "getVolume", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            document.getElementById("volume-slider").value = xhr.response;
        }
    }

    xhr.send();
}

function startCounter() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.href + "counter", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log("started counter");
        }
    }
    xhr.send();
}

function sendCommand(command, parameters) {
    var xhr = new XMLHttpRequest();
    
    xhr.open("POST", window.location.href + command, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log("started counter");
        }
    }

    xhr.send(parameters);
}

function sendStandbyCommand() {
    sendCommand("standy");
}

function sendShutDownCommand() {
    sendCommand("shutDown");
}

function sendMoveMouseCommand(deltaX, deltaY) {
    sendCommand("mouseInput", "{\"type\": " + "\"move\"" + ", \"deltaX\": " + deltaX + ", \"deltaY\": " + deltaY + "}");
}

function sendClickMouseCommand(left) {
    let parameters = "{\"type\": " + (left === true ? "\"left\"" : "\"right\"") + "}";
    sendCommand("mouseInput", parameters);
}

function sendChangeVolumeCommand(deltaVolume) {
    sendCommand("changeVolume", "{\"volumeChange\": " + deltaVolume + "}");
}

function sendSetVolumeCommand(volume) {
    sendCommand("setVolume", JSON.stringify({"volume": volume}));
}