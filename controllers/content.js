'use strict';
const Joi = require('joi');
const contentModel = require('../models/content.js');

exports.setPost = {
    validate: {
        payload: {
            type: Joi.string().valid(['text', 'image', 'url', 'embed']).required(),
            content: Joi.object().keys({
                title: Joi.string().required(),
                url: Joi.string().allow('').optional(),
                text: Joi.string().allow('').optional(),
                image: Joi.string().allow('').optional()
            }).required(),
            privacy: Joi.string().valid(['public', 'private', 'friends']).default('public')
        }
    },
    handler: (request, reply) => {
        let userSession = request.session.get('user', false);

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 401,
                message: 'Unauthorized',
                data: 'Auth Needed'
            });
        } else {
            switch (request.params.action) {
                case 'set':
                    contentModel.setPost(request.payload, userSession).then((res) => {

                        reply(res);
                    }).catch((err) => {
                        reply(err);
                    });
                    break;
                case 'edit':
                    contentModel.editPost(request.payload, userSession, request.params.id).then((res) => {

                        reply(res);
                    }).catch((err) => {
                        reply(err);
                    });
                    break;
                default:
                reply({
                    statusCode: 400,
                    message: 'Bad Request'
                });
            }

        }
    }
};

exports.deletePost = {
    handler: (request, reply) => {
        let userSession = request.session.get('user', false);

        if (typeof userSession === 'undefined') {
            reply({
                statusCode: 401,
                message: 'Unauthorized',
                data: 'Auth Needed'
            });
        } else {
            contentModel.deletePost(request.params.id).then((res) => {

                reply(res);
            }).catch((err) => {
                reply(err);
            });
        }
    }
};

exports.getPost = {
    validate: {
        payload: {
            dbtype: Joi.string().valid(['sql', 'nosql']).required(),
            page: Joi.number().required(),
            pageAmount: Joi.number().required(),
            privacy: Joi.array().items(Joi.string().valid(['public', 'private', 'friends'])).optional().allow(''),
            type: Joi.array().items(Joi.string().valid(['text', 'image', 'url', 'embed'])).optional().allow('')
        }
    },
    handler: (request, reply) => {
        let userSession = request.session.get('user', false),
            commonObj = {
                page: request.payload.page,
                pageAmount: request.payload.pageAmount,
                privacy: ['public']
            };

        //check session to affect filter object
        if (typeof userSession !== 'undefined') {
            //check if privacy filter was sent
            if (typeof request.payload.privacy === 'undefined') {
                commonObj.privacy = ['public', 'private', 'friends'];
            } else {
                commonObj.privacy = request.payload.privacy;
            }
        }

        //add filters to query if recevied via post
        if (typeof request.payload.type !== 'undefined') {
            commonObj.type = request.payload.type;
        }

        //get filtered posts
        if (request.payload.dbtype == 'nosql') {
            contentModel.getPostNoSQL(commonObj).then((res) => {

                reply(res);
            }).catch((err) => {
                reply(err);
            });
        } else if (request.payload.dbtype == 'sql') {
            contentModel.getPostSQL(commonObj).then((res) => {

                reply(res);
            }).catch((err) => {
                reply(err);
            });
        }

        /*
        limit: 10,
        skip: 0,
        filters: {
            post_privacy: 'public'
        }
        */
    }
};
