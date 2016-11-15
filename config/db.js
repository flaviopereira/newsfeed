'use strict';
const mysql = require('mysql');
const tingo = require('tingodb')().Db;

module.exports = {
    mysql: {
        connect: mysql.createConnection({
            host     : 'localhost',
            user     : 'feeduser',
            password : '<xG&4-Pw',
            database : 'newsfeed'
        })
    },
    tingo: () => {
        let db = new tingo('./tingo', {});

        return db;
    }
}
