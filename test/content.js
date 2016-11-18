'use strict';

const chai = require('chai');
const server = require('../');

let expect = chai.expect,
    clearArray = {};

describe('Content tests', function() {
    it('[Content] - Should return 400 on set post without login', (done) => {
        let opts = {
            method: 'PUT',
            url: '/content/set',
            payload: {
                type: 'text',
                content: {
                    title: 'Post Title',
                    url: 'http://google.com',
                    text: 'Lorem ipsum',
                    image: '/asstes/img.jpg'
                },
                privacy: 'public'
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            let payload = JSON.parse(response.payload);
            expect(payload.statusCode).to.equal(401);

            done();
        });
    });

    it('[Content] - Should return 400 on set post with wrong params', (done) => {
        let opts = {
            method: 'PUT',
            url: '/content/set',
            payload: {
                asdt: 'text',
                content: {
                    url: 'http://google.com',
                    text: 'Lorem ipsum'
                }
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(400);

            done();
        });
    });

    it('[Content] - Should return 201 on set post with right params and login', (done) => {
        let regopts = {
            method: 'POST',
            url: '/register',
            payload: {
                email: 'dummy@dummy.com',
                password: 'dummy',
                username: 'Test User'
            }
        },
        authopts = {
            method: 'POST',
            url: '/auth',
            payload: {
                email: 'dummy@dummy.com',
                password: 'dummy'
            }
        },
        postopts = {
            method: 'PUT',
            url: '/content/set',
            payload: {
                type: 'text',
                content: {
                    title: 'Post Title',
                    url: 'http://google.com',
                    text: 'Lorem ipsum',
                    image: '/asstes/img.jpg'
                },
                privacy: 'public'
            }
        },
        cookie;

        server.inject(regopts, (response) => {
            let payload = JSON.parse(response.payload);
            clearArray['userID'] = payload.data[0]._id;

            server.inject(authopts, (response) => {
                let header = response.headers['set-cookie'];
                cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                postopts['headers'] = {
                    cookie: 'session=' + cookie[1]
                };
                //response.session.set('user', response.payload.data);

                server.inject(postopts, (response) => {
                    expect(response.statusCode).to.equal(200);

                    let payload = JSON.parse(response.payload);
                    expect(payload.statusCode).to.equal(201);

                    clearArray['postID'] = {
                        mongo: payload.data[0].mongoID,
                        mysql: payload.data[0].mysqlID
                    };

                    //remove created user
                    const db = require('../config/db');
                    const tingo = db.tingo();
                    const users = tingo.collection("users");

                    users.remove({_id: clearArray.userID}, (err, curr) => {
                        //console.log(clearArray);
                        //TODO remove posts from both db's. ID in clearArray.postID.mongo and clearArray.postID.mysql
                        done();
                    });
                });
            });
        });

    });
});
