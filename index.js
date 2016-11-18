'use strict';
const fs = require('fs');
const Hapi = require('hapi');
const routes = require('./routes');
const serverCfg = require('./config/server');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    //host: serverCfg.host,
    port: serverCfg.port
});

let yarOptions = {
    maxCookieSize: 0,
    cookieOptions: {
        password: '2fc4F8PQa793J6H585gag377CRaa48rv',
        isSecure: false
    }
};

// Register helpers
server.register([
    {
        register: require('yar'),
        options: yarOptions
    }
], function (err) {
    if (err) {
        console.log('Plugin register error: ', err);
    }

});

// Service Routes
server.route(routes.endpoints);

// Start the server
server.start((err) => {
    //ensure db dir
    if(!fs.existsSync('./tingo')) {
        fs.mkdirSync('tingo');
    }

    if (err) {
        console.log(err);
        throw err;
    }
    console.log('✓ Server running at:', server.info.uri);
});

module.exports = server;
