'use strict';
const db = require('../config/db');
const tingo = db.tingo();
const users = tingo.collection("users");

const mysql = db.mysql.connect;

exports.login = (userdata) => {
    return new Promise((resolve, reject) => {
        let queryString = 'SELECT * FROM users WHERE user_email = "'+userdata.email+'" AND user_password = "'+userdata.password+'"';

        mysql.query(queryString, (err, rows, fields) => {
            if (err) reject(err);

            if (rows.length > 0) {
                let curr = {
                    user_id: rows[0].user_id,
                    user_email: rows[0].user_email,
                    user_name: rows[0].user_name,
                    user_date: rows[0].user_date
                };

                resolve({
                    statusCode: 200,
                    message: 'OK',
                    data: curr
                });
            } else {
                resolve({
                    statusCode: 204,
                    message: 'No Content'
                });
            }
        });
    });
}

exports.register = (userdata) => {
    return new Promise((resolve, reject) => {
        mysql.query('SELECT * FROM users WHERE user_email = ?', userdata.email, (err, rows, fields) => {
            if (err) reject(err);

            if (rows.length <= 0) {
                let userObj = {
                    user_email: userdata.email,
                    user_password: userdata.password,
                    user_name: userdata.username,
                }
                mysql.query('INSERT INTO users SET ?', userObj, (err, rows, fields) => {
                    if (err) reject(err);

                    resolve({
                        statusCode: 201,
                        message: 'Created'
                    });
                });
            } else {
                resolve({
                    statusCode: 409,
                    message: 'Conflict'
                });
            }
        });

    });
}

exports.manageFriends = (friendData, userSession, action) => {
    return new Promise((resolve, reject) => {
        let friendObj = {
            user_id: userSession.user_id,
            friend_id: friendData.id
        }

        mysql.query('SELECT * FROM users WHERE user_id = "'+friendData.id+'"', (err, rows, fields) => {
            if (err) reject(err);

            //no user
            if (rows.length <= 0) {
                resolve({
                    statusCode: 204,
                    message: 'No Content'
                });
            } else {
                mysql.query('SELECT * FROM friends WHERE friend_id = "'+friendData.id+'" AND user_id = "'+userSession.user_id+'"', (err, rows, fields) => {
                    if (err) reject(err);

                    //check if not self
                    if (friendData.id != userSession.user_id) {
                        //add friend
                        if (action == 'add') {
                            //no friend yet
                            if (rows.length <= 0) {

                                mysql.query('INSERT INTO friends SET ?', friendObj, (err, rows, fields) => {
                                    if (err) reject(err);

                                    resolve({
                                        statusCode: 201,
                                        message: 'Created'
                                    });
                                });
                            } else {
                                resolve({
                                    statusCode: 409,
                                    message: 'Conflict'
                                });
                            }
                        //remove friend
                        } else if (action == 'remove') {
                            //already friend
                            if (rows.length > 0) {
                                let friendDel = 'DELETE FROM friends WHERE user_id = "' + userSession.user_id + '" AND friend_id = "' + friendData.id + '"';
                                mysql.query(friendDel, (err, rows, fields) => {
                                    if (err) reject(err);

                                    resolve({
                                        statusCode: 200,
                                        message: 'OK'
                                    });
                                });
                            } else {
                                resolve({
                                    statusCode: 409,
                                    message: 'Conflict'
                                });
                            }
                        }
                    } else {
                        resolve({
                            statusCode: 409,
                            message: 'Conflict'
                        });
                    }
                });
            }
        });
    });
}

exports.getFriends = (userSession, pagination) => {
    return new Promise((resolve, reject) => {
        let qSkip = pagination.page * pagination.pageAmount;

        mysql.query('SELECT users.user_name, users.user_id FROM newsfeed.users INNER JOIN newsfeed.friends ON users.user_id = friends.friend_id WHERE friends.user_id = "'+userSession.user_id+'" LIMIT '+qSkip+', '+pagination.pageAmount+'', (err, rows, fields) => {
            if (err) reject(err);

            let sendObj = [];
            if (rows.length > 0) {
                rows.forEach((el, i) => {
                    sendObj.push(
                        {
                            user_name: el.user_name,
                            user_id: el.user_id
                        }
                    )
                });
            }

            resolve({
                statusCode: 200,
                message: 'OK',
                data: sendObj
            });
        });
    });
}
