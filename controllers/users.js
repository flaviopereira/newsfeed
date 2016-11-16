'use strict';
const Joi = require('joi');

exports.auth = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        const users = require('../models/users');
        let userInfo = {
            email: request.payload.email,
            password: request.payload.password
        };

        users.auth(userInfo).then((res) => {
            if (res.statusCode === 200) {
                delete res.data.password;
                request.session.set('user', res.data);
            }

            reply(res);
        }).catch((err) => {
            reply(err);
        });
    }
};

exports.register = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            username: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        let userSession = request.session.get('user');

        if (typeof userSession === 'undefined') {
            const users = require('../models/users');

            users.register(request.payload).then((res) => {
                reply(res);
            });
        } else {
            reply({
                statusCode: 400,
                message: 'Bad Request',
                data: ''
            });
        }
    }
}

exports.friends = {
    validate: {
        payload: {
            id: Joi.string().required(),
            username: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        let userSession = request.session.get('user');

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 400,
                message: 'Bad Request',
                data: ''
            });
        } else {
            const users = require('../models/users');

            console.log(request.params.action);

            if (request.params.action == 'add' || request.params.action == 'remove') {
                console.log('aaaaaaaaaa');
                users.friends(request.payload, userSession, request.params.action).then((res) => {
                    reply(res);
                });
            } else {
                console.log('err 1');
                reply({
                    statusCode: 400,
                    message: 'Bad Request',
                    data: ''
                });
            }
        }
    }
}
