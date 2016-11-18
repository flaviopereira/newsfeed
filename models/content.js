'use strict';
const db = require('../config/db');
const tingo = db.tingo();
const posts = tingo.collection("posts");

const mysql = db.mysql.connect;

exports.setPost = (postdata, userdata) => {
    return new Promise((resolve, reject) => {
        console.log(userdata);
        let post = {
            post_type: postdata.type,
            post_title: postdata.content.title,
            post_text: postdata.content.text,
            post_url: postdata.content.url,
            post_image: postdata.content.image,
            post_privacy: postdata.privacy,
            post_author_name: userdata.user_name,
            post_author_id: userdata.user_id,
            post_date: new Date().getTime()
        }

        //mongo insert
        posts.insert(post, (err, curr) => {
            if (err) reject(err);

            //mysql insert
            delete post._id; //remove _id added by mongo
            delete post.post_date //remove date for mysql

            mysql.query('INSERT INTO posts SET ?', post, (err, rows, fields) => {
                if (err) reject(err);

                resolve({
                    statusCode: 201,
                    message: 'Created'
                });
            });
        });
    });
}

exports.editPost = (postdata, userdata, postID) => {
    return new Promise((resolve, reject) => {
        console.log(userdata);
        let post = {
            post_type: postdata.type,
            post_title: postdata.content.title,
            post_text: postdata.content.text,
            post_url: postdata.content.url,
            post_image: postdata.content.image,
            post_privacy: postdata.privacy,
            post_author_name: userdata.user_name,
            post_author_id: userdata.user_id
        }

        //mongo update
        posts.update({_id: postID}, {$et: post}, (err, curr) => {
            if (err) reject(err);

            //mysql update
            let sqlArr = [post.post_type, post.post_title, post.post_text, post.post_url, post.post_image, post.post_privacy, post.post_author_name, post.post_author_id, postID];
            mysql.query('UPDATE posts SET post_type = ?, post_title = ?, post_text = ?, post_url = ?, post_image = ?, post_privacy = ?, post_author_name = ?, post_author_id = ? WHERE post_id = ?', sqlArr, (err, rows, fields) => {
                if (err) reject(err);

                resolve({
                    statusCode: 201,
                    message: 'Created'
                });
            });
        });
    });
}

exports.deletePost = (postID) => {
    return new Promise((resolve, reject) => {

        //mongo insert
        posts.remove({_id: postID}, (err, curr) => {
            if (err) reject(err);

            mysql.query('DELETE FROM posts WHERE ?', {post_id: postID}, (err, rows, fields) => {
                if (err) reject(err);

                resolve({
                    statusCode: 200,
                    message: 'OK'
                });
            });
        });
    });
}

exports.getPostNoSQL = (filterData) => {
    return new Promise((resolve, reject) => {
        let query = {
            limit: filterData.pageAmount,
            skip: parseInt(filterData.pageAmount) * parseInt(filterData.page),
            filters: {
                post_privacy: {$in: filterData.privacy}
            }
        };

        if (typeof filterData.type !== 'undefined') {
            query.filters['post_type'] = {$in: filterData.type};
        }

        console.log(query.filters);

        posts.find(query.filters).limit(query.limit).skip(query.skip).toArray((err, curr) => {
            if (err) reject(err);

            resolve({
                statusCode: 200,
                message: 'Found',
                data: curr
            });
        });
    });
}

exports.getPostSQL = (filterData) => {
    return new Promise((resolve, reject) => {
        let query = {
            limit: filterData.pageAmount,
            skip: parseInt(filterData.pageAmount) * parseInt(filterData.page)
        },
        whereClause;

        let privacyArr = filterData.privacy.map( (el) => { return "'"+el+"'"; });
        whereClause = 'WHERE post_privacy IN ('+privacyArr+')';

        if (typeof filterData.type !== 'undefined') {
            let typeArr = filterData.type.map( (el) => { return "'"+el+"'"; });
            whereClause = 'WHERE post_privacy IN ('+privacyArr+') AND post_type IN ('+typeArr+')';
        }

        let asdf = mysql.query('SELECT * FROM posts '+whereClause+' LIMIT '+query.skip+', '+query.limit+'', (err, rows, fields) => {
            if (err) reject(err);
            let dataObj = [];

            rows.forEach((el, i) => {
                dataObj.push({
                    post_id: el.post_id,
                    post_type: el.post_type,
                    post_title: el.post_title,
                    post_url: el.post_url,
                    post_text: el.post_text,
                    post_image: el.post_image,
                    post_privacy: el.post_privacy,
                    post_author_name: el.post_author_name,
                    post_author_id: el.post_author_id,
                    post_date: el.post_date
                });
            });

            resolve({
                statusCode: 200,
                message: 'Found',
                data: dataObj
            });
        });
    });
}
