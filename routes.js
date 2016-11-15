'use strict';

const Static = require('./controllers/static');
const Content = require('./controllers/content');
const Auth = require('./controllers/auth');

exports.endpoints = [
    { method: 'GET',          path: '/',                          handler: Static.home },
    { method: 'GET',          path: '/login',                     handler: Static.login },
    { method: 'GET',          path: '/register',                  handler: Static.login },

    { method: 'POST',         path: '/register',                  config: Auth.register },
    { method: 'POST',         path: '/auth',                      config: Auth.auth },
    { method: 'PUT',          path: '/content/{action}/{id*}',    config: Content.setPost },
    { method: 'DELETE',       path: '/content/{id}',              config: Content.deletePost },
]
