'use strict';
const contentModel = require('../models/content.js');

exports.home = (request, reply) => {
    let userSession = request.session.get('user');

    contentModel.getPost(false).then((data) => {
        reply(data);
    }).catch((err) => {
        reply(err);
    });
}

exports.login = (request, reply) => {
    reply({
        statusCode: 200
    });
}
