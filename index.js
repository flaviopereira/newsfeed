'use strict';
const fs = require('fs');
const Hapi = require('hapi');
const routes = require('./routes');
const serverCfg = require('./config/server');
const Handlebars = require('handlebars');
const engine = Handlebars.create();

// Create a server with a host and port
const server = new Hapi.Server();

engine.registerHelper('if_equals', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

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

server.views({
    engines: {
        html: engine
    },
    path: 'views',
    partialsPath: 'views/assets/partials'
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
