'use strict';

exports.auth = (userdata) => {
    return new Promise((resolve, reject) => {
        const db = require('../config/db');
        const tingo = db.tingo();
        const users = tingo.collection("users");

        users.findOne({email: userdata.email, password: userdata.password}, function(err, curr) {
            if (err) reject(err);

            if (!curr || curr.length <= 0) {
                resolve({
                    statusCode: 204,
                    message: 'invalid user',
                    data: ''
                });
            } else {
                resolve({
                    statusCode: 200,
                    message: 'valid user',
                    data: curr
                });
            }

        })
    });
}

exports.register = (userdata) => {
    return new Promise((resolve, reject) => {
        const db = require('../config/db');
        const tingo = db.tingo();
        const users = tingo.collection("users");

        users.findOne({email: userdata.email}, function(err, curr) {
            if (err) reject(err);

            if (!curr || curr.length <= 0) {
                users.insert(userdata, function(err, curr) {
                    if (err) reject(err);

                    resolve({
                        statusCode: 201,
                        message: 'user created',
                        data: curr
                    });
                });
            } else {
                resolve({
                    statusCode: 409,
                    message: 'existing user',
                    data: ''
                });
            }

        })
    });
}

exports.friends = (friendData, userSession, action) => {
    return new Promise((resolve, reject) => {
        const db = require('../config/db');
        const tingo = db.tingo();
        const users = tingo.collection("users");
        let updateQuery;

        console.log('bbbbbbbbbb');
        console.log(userSession._id);

        //{_id: postID}, {$et: post}
        users.findOne({_id: userSession._id}, function(err, curr) {
            if (err) reject(err);

            if (action == 'add') {
                if (typeof curr['friendlist'] === 'undefined') {
                    curr['friendlist'] = {};
                }
                curr['friendlist'][friendData.id] = friendData;
            } else if (action == 'remove') {
                delete curr['friendlist'][friendData.id];
            } else {
                resolve({
                    statusCode: 400,
                    message: 'Dab Request',
                    data: ''
                });
            }
            console.log(curr);

            users.update({_id: userSession._id}, {$set: curr}, function(err, curr) {
                console.log(err);
                console.log(curr);
                if (err) reject(err);

                resolve({
                    statusCode: 201,
                    message: 'user created',
                    data: curr
                });
            })
        })


    });
}
