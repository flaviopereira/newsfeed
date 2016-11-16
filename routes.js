'use strict';

const Static = require('./controllers/static');
const Content = require('./controllers/content');
const Users = require('./controllers/users');

exports.endpoints = [
    { method: 'GET',          path: '/assets/{param*}',             handler: {directory: {path: 'views/assets', listing: true}}},

    { method: 'GET',          path: '/{sql*}',                      handler: Static.home },
    { method: 'GET',          path: '/login',                       handler: Static.login },
    { method: 'GET',          path: '/register',                    handler: Static.register },

    { method: 'POST',         path: '/register',                    config: Users.register },
    { method: 'POST',         path: '/auth',                        config: Users.auth },
    { method: 'POST',         path: '/friend/{action}',             config: Users.friends },
    { method: 'PUT',          path: '/content/{action}/{id*}',      config: Content.setPost },
    { method: 'DELETE',       path: '/content/{id}',                config: Content.deletePost },
]
