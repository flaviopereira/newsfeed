'use strict';
const contentModel = require('../models/content.js');

exports.home = (request, reply) => {
    let userSession = request.session.get('user'),
        queryParams = false;

    if (typeof userSession !== 'undefined') {
        queryParams = {
            limit: 0,
            skip: 0,
            filters: {}
        };
    } else {
        //define fake session for display purposes
        userSession = {username: 'Anonymous User'}
    }

    switch (request.params.sql) {
        case 'nosql':
        default:
            contentModel.getPostNoSQL(queryParams).then((data) => {
                console.log(userSession);
                reply.view('index', {
                    userdata: userSession,
                    postdata: data.data
                });
            }).catch((err) => {
                reply.view('index', {
                    userdata: userSession,
                    error: err
                });
            });

            break;

        case 'sql':
            contentModel.getPostSQL(queryParams).then((data) => {
                reply.view('index', {
                    userdata: userSession,
                    postdata: data.data
                });
            }).catch((err) => {
                reply.view('index', {
                    userdata: userSession,
                    error: err
                });
            });

            break;

    }

}

exports.login = (request, reply) => {
    reply.view('login');
    /*
    reply({
        statusCode: 200
    });
    */
}

exports.register = (request, reply) => {
    reply.view('register');
    /*
    reply({
        statusCode: 200
    });
    */
}
