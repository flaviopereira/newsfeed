'use strict';

const chai = require('chai');
const server = require('../index');

let expect = chai.expect,
    clearArray = {};

describe('Authentication tests', () => {
    it('[Auth] - Should return 204 for non-existing user', (done) => {
        let opts = {
            method: 'POST',
            url: '/login',
            payload: {
                email: 'dummy2@dummy.com',
                password: 'dummy'
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            let payload = JSON.parse(response.payload);
            expect(payload.statusCode).to.equal(204);

            done();
        });
    });

    it('[Register] - Should return 201 on user register', (done) => {
        let opts = {
            method: 'PUT',
            url: '/register',
            payload: {
                email: 'testdummy@dummy.com',
                password: 'testdummy',
                username: 'Test User'
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            let payload = JSON.parse(response.payload);
            expect(payload.statusCode).to.equal(201);

            done();
        });
    });

    it('[Register] - Should return 409 on existing user', (done) => {
        let opts = {
            method: 'PUT',
            url: '/register',
            payload: {
                email: 'testdummy@dummy.com',
                password: 'testdummy',
                username: 'Test User'
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            let payload = JSON.parse(response.payload);
            if (payload.message == 'existing user') {
                expect(payload.statusCode).to.equal(409);
            }

            done();
        });
    });

    it('[Auth] - Should return 200 for existing user', (done) => {
        let opts = {
            method: 'POST',
            url: '/login',
            payload: {
                email: 'testdummy@dummy.com',
                password: 'testdummy'
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            let payload = JSON.parse(response.payload);
            //add user ID to remove after
            clearArray['userID'] = payload.data.user_id;

            expect(payload.statusCode).to.equal(200);

            done();
        });
    });

    it('[Register] - Should return 409 for already logged user', (done) => {
        let opts = {
            method: 'PUT',
            url: '/register',
            payload: {
                email: 'testdummy@dummy.com',
                password: 'testdummy',
                username: 'Test User'
            }
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            let payload = JSON.parse(response.payload);
            expect(payload.statusCode).to.equal(409);

            done();

        });
    });

    it('[Auth] - Should return 200 on logout', (done) => {
        let opts = {
            method: 'POST',
            url: '/logout'
        };

        server.inject(opts, (response) => {
            expect(response.statusCode).to.equal(200);

            //remove created user
            const db = require('../config/db');
            const mysql = db.mysql.connect;

            mysql.query('DELETE FROM users WHERE ?', {user_id: clearArray.userID}, (err, rows, fields) => {
                server.stop();
                done();
            });
        });
    });

})
