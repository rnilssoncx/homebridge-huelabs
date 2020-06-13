const net = require('net');

const connectionDefaults = {
    host: '10.0.1.4',
    port: 23,
    username: "lutron",
    password: "integration",
    debug: false,
}

var loggedIn = false;
var socket = new net.Socket();

socket.on('connect', () => {
    console.log('Connected');
});
socket.on('data', (data) => {
    receiveData(data);
});
socket.on('end', () => {
    // TODO
});

socket.on('error', (error) => {
    console.log(error);
});

socket.destroy();

manageSocket();
timer = setInterval(manageSocket, 60000);

function receiveData(data) {
    // TODO: do we need to worry about partial strings?
    const lines = data.toString().split("\r\n").filter(l => l != "");

    for (let line of lines) {
        if (connectionDefaults.debug) {
            console.log("Bridge connection processing line", line);
        }
        if (loggedIn) {
            const args = line.split(",");
            if (args[0][0] === "~") {
                console.log(line);
            }
        } else {
            if (/^login:\s*/.test(line)) {
                socket.write(`${connectionDefaults.username}\r\n`);
            } else if (/^password:\s*/.test(line)) {
                socket.write(`${connectionDefaults.password}\r\n`);
            } else if (/^GNET>\s*/.test(line)) {
                loggedIn = true;;
                console.log('Logged in');
            } else {

            }
        }
    }
}

function manageSocket() {
    if (socket.destroyed) {
        loggedIn = false;
        console.log('Attempting connection');
        socket.connect(connectionDefaults.port, connectionDefaults.host);
    } else if (!socket.connecting) {
        socket.write('\r\n');
    } else {
        console.log('Waiting for connection');
    }
}