#!/usr/bin/env node

/**
 * Module dependencies.
 */

import dotenv from 'dotenv';
import cluster from 'cluster';
import debug from 'debug';
import http from 'http';

dotenv.config();

debug('app:server');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');

var start = function () {
    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind =
            typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
        debug('Listening on ' + bind);
    }

    let app = require('../app').default;

    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    server.setTimeout(500000);
};

const clustered = process.env.CLUSTERED == 'true';

if (clustered) {
    if (cluster.isMaster) {
        var numWorkers = require('os').cpus().length;

        console.log('Master cluster setting up ' + numWorkers + ' workers...');

        for (var i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        cluster.on('online', function (worker) {
            console.log('Worker ' + worker.process.pid + ' is online');
        });

        cluster.on('exit', function (worker, code, signal) {
            console.log(
                'Worker ' +
                    worker.process.pid +
                    ' died with code: ' +
                    code +
                    ', and signal: ' +
                    signal
            );
            console.log('Starting a new worker');
            cluster.fork();
        });
    } else {
        start();
    }
} else {
    start();
}
