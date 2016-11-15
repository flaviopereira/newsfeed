'use strict';
const db = require('../config/db');
const tingo = db.tingo();
const posts = tingo.collection("posts");

const mysql = db.mysql.connect;

exports.setPost = (postdata, userdata) => {
    return new Promise((resolve, reject) => {
        let post = {
            post_type: postdata.type,
            post_title: postdata.content.title,
            post_text: postdata.content.text,
            post_url: postdata.content.url,
            post_image: postdata.content.image,
            post_privacy: postdata.privacy,
            post_author_name: userdata.username,
            post_author_id: userdata._id
        }

        //mongo insert
        posts.insert(post, function(err, curr) {
            if (err) reject(err);

            //mysql insert
            delete post._id; //remove _id added by mongo

            mysql.query('INSERT INTO posts SET ?', post, function(err, rows, fields) {
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
        let post = {
            post_type: postdata.type,
            post_title: postdata.content.title,
            post_text: postdata.content.text,
            post_url: postdata.content.url,
            post_image: postdata.content.image,
            post_privacy: postdata.privacy,
            post_author_name: userdata.username,
            post_author_id: userdata._id
        }

        //mongo update
        posts.update({_id: postID}, {$et: post}, function(err, curr) {
            if (err) reject(err);

            //mysql update
            let sqlArr = [post.post_type, post.post_title, post.post_text, post.post_url, post.post_image, post.post_privacy, post.post_author_name, post.post_author_id, postID];
            mysql.query('UPDATE posts SET post_type = ?, post_title = ?, post_text = ?, post_url = ?, post_image = ?, post_privacy = ?, post_author_name = ?, post_author_id = ? WHERE post_id = ?', sqlArr, function(err, rows, fields) {
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
        posts.remove({_id: postID}, function(err, curr) {
            if (err) reject(err);

            mysql.query('DELETE FROM posts WHERE ?', {post_id: postID}, function(err, rows, fields) {
                if (err) reject(err);

                resolve({
                    statusCode: 201,
                    message: 'Created'
                });
            });
        });
    });
}

exports.getPost = (filters) => {
    return new Promise((resolve, reject) => {
        let query = {
            limit: 0,
            skip: 0,
            filters: {
                post_privacy: 'public'
            }
        };

        if (filters) {

        }

        //mongo insert
        posts.find({'post_type': 'text'}, function(err, curr) {
            if (err) reject(err);

            console.log(curr);

            resolve({
                statusCode: 200,
                message: 'Found',
                data: curr
            });
        });
    });
}
