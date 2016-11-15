'use strict';
const Joi = require('joi');
const contentModel = require('../models/content.js');

exports.setPost = {
    validate: {
        payload: {
            type: Joi.string().valid(['text', 'image', 'url']).required(),
            content: Joi.object().keys({
                title: Joi.string().required(),
                url: Joi.string().allow('').optional(),
                text: Joi.string().allow('').optional(),
                image: Joi.string().allow('').optional()
            }).required(),
            privacy: Joi.string().default('public')
        }
    },
    handler: (request, reply) => {
        //let userSession = request.session.get('user', false);

        //TODO REMOVE TEMP SES
        let userSession = { email: 'dummy@dummy.com', username: 'Test User', _id: 3 };

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 401,
                message: 'Unauthorized',
                data: ''
            });
        } else {
            console.log(request.params);
            switch (request.params.action) {
                case 'set':
                    contentModel.setPost(request.payload, userSession).then((res) => {
                        console.log(res);

                        reply(res);
                    }).catch((err) => {
                        reply(err);
                    });
                    break;
                case 'edit':
                    contentModel.editPost(request.payload, userSession, request.params.id).then((res) => {
                        console.log(res);

                        reply(res);
                    }).catch((err) => {
                        reply(err);
                    });
                    break;
            }

        }
    }
};

exports.deletePost = {
    handler: (request, reply) => {
        //let userSession = request.session.get('user', false);

        //TODO REMOVE TEMP SES
        let userSession = { email: 'dummy@dummy.com', username: 'Test User', _id: 3 };

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 401,
                message: 'Unauthorized',
                data: ''
            });
        } else {
            console.log(request.params);
            contentModel.deletePost(request.params.id).then((res) => {
                console.log(res);

                reply(res);
            }).catch((err) => {
                reply(err);
            });
        }
    }
};
