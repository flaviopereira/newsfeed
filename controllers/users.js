'use strict';
const Joi = require('joi');

exports.login = {
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

        users.login(userInfo).then((res) => {
            if (res.statusCode === 200) {
                delete res.data.user_password;
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
                data: 'Logged In'
            });
        }
    }
}

exports.manageFriends = {
    validate: {
        payload: {
            id: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        let userSession = request.session.get('user');

        //check session
        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 401,
                message: 'Unauthorized',
                data: 'Auth Needed'
            });
        } else {
            const users = require('../models/users');

            if (request.params.action == 'add' || request.params.action == 'remove') {
                users.manageFriends(request.payload, userSession, request.params.action).then((res) => {
                    reply(res);
                });
            } else {
                reply({
                    statusCode: 400,
                    message: 'Bad Request',
                    data: 'Wrong Params'
                });
            }
        }
    }
}

exports.getFriends = {
    validate: {
        payload: {
            page: Joi.number().required(),
            pageAmount: Joi.number().required()
        }
    },
    handler: (request, reply) => {
        let userSession = request.session.get('user');

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 401,
                message: 'Unauthorized',
                data: 'Auth Needed'
            });
        } else {
            const users = require('../models/users');

            users.getFriends(userSession, {page: parseInt(request.payload.page), pageAmount: parseInt(request.payload.pageAmount)}).then((res) => {
                reply(res);
            });
        }
    }
}


exports.logout ={
    handler: (request, reply) => {
        let userSession = request.session.get('user');

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 400,
                message: 'Bad Request',
                data: 'No Session'
            });
        } else {
            request.session.clear('user');
            reply({
                statusCode: 200,
                message: 'OK'
            });
        }
    }
}
