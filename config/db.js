'use strict';
const mysql = require('mysql');
const tingo = require('tingodb')().Db;

module.exports = {
    mysql: {
        connect: mysql.createConnection({
            host     : '',
            user     : '',
            password : '',
            database : ''
        })
    },
    tingo: () => {
        let db = new tingo('./tingo', {});

        return db;
    }
}
