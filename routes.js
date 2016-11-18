'use strict';

const Content = require('./controllers/content');
const Users = require('./controllers/users');

exports.endpoints = [
    { method: 'PUT',          path: '/register',                    config: Users.register },
    { method: 'POST',         path: '/login',                       config: Users.login },
    { method: 'POST',         path: '/logout',                      config: Users.logout },

    { method: 'PUT',          path: '/content/{action}/{id*}',      config: Content.setPost },
    { method: 'DELETE',       path: '/content/{id}',                config: Content.deletePost },
    { method: 'POST',         path: '/postlist',                    config: Content.getPost },

    { method: 'POST',         path: '/friend/{action}',             config: Users.manageFriends },
    { method: 'POST',         path: '/friendlist',                  config: Users.getFriends },
]
