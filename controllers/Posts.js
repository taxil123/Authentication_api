const Post = require('../models/post');
const joi = require('joi');
const jwt_decode = require('jwt-decode');

exports.createPost = function (req, res) {
    // get bearer token from request header
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        var userToken = jwt_decode(req.token);

        const schema = joi.object({
            title: joi.string().required(),
            body: joi.string().required(),
            active: joi.boolean().required().default(true),
            location: joi.object().keys({
                type: joi.string().default('Point'),
                coordinates: joi.array().items(joi.number()).required()
            })
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            // save post to database
            var postDetail = {
                title: req.body.title,
                body: req.body.body,
                active: req.body.active,
                createdBy: userToken.name,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(req.body.location.coordinates[0]), parseFloat(req.body.location.coordinates[1])]
                },

            };

            console.log(postDetail);
            const post = new Post(postDetail);
            post.save().then(post => {
                res.send(post);
            }).catch(err => {
                res.status(400).send(err);
            });
        }
    }

}

exports.getPostsLocCoords = function (req, res) {
    // check request parameters and validate location coordinates 
    const locationSchema = joi.object({
        type: joi.string().default('Point'),
        coordinates: joi.array().items(joi.number()).required()
    });

    const { error } = locationSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        // find post by locationSchema
        Post.find({
            location: {
                type: "Point",
                coordinates: [parseFloat(req.body.coordinates[0]), parseFloat(req.body.coordinates[1])]
            }
        }).then(posts => {
            res.send(posts);
        }).catch(err => {
            res.status(500).send(err);
        });
    }
}

exports.getSinglePost = function (req, res) {
    // find posts by id
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    var userToken = jwt_decode(req.token);

    Post.find({ "createdBy": userToken.name }).then(post => {
        Post.findById(post[0]._id).then(posts => {
            res.send(posts);
        }
        ).catch(err => {
            res.status(500).send(err);
        });
    }).catch(err => {
        res.status(500).send(err);
    });
}

exports.updatePost = function (req, res) {
    // update post by id
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    var userToken = jwt_decode(req.token);

    const schema = joi.object({
        title: joi.string().required(),
        body: joi.string().required(),
        active: joi.boolean().required().default(true),
        location: joi.object().keys({
            type: joi.string().default('Point'),
            coordinates: joi.array().items(joi.number()).required()
        })
    });

    // schema demo
    // {
    //     "title": "test",
    //     "body": "test",
    //     "createdBy": "test",
    //     "active": true,
    //     "location": {
    //         "type": "Point",
    //         "coordinates": [
    //             -122.4194,
    //             37.7749
    //         ]
    //     }
    // }

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        var postDetail = {
            title: req.body.title,
            body: req.body.body,
            active: req.body.active,
            createdBy: userToken.name,
            location: {
                type: 'Point',
                coordinates: [parseFloat(req.body.location.coordinates[0]), parseFloat(req.body.location.coordinates[1])]
            },

        };

        Post.find({ "createdBy": userToken.name }).then(post => {
            Post.findByIdAndUpdate(post._id, { $set: postDetail }, { new: true }).then(post => {
                res.send(post);
            }).catch(err => {
                res.status(500).send(err);
            });
        }).catch(err => {
            res.status(500).send(err);
        });

    }

}

exports.deletePost = function (req, res) {
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    var userToken = jwt_decode(req.token);

    Post.find({ "_id": req.body._id }).then(post => {
        if(post.createdBy == userToken.name){
            Post.findByIdAndRemove(post[0]._id).then(post => {
                res.send(post._id + " deleted");
            }).catch(err => {
                res.status(500).send(err);
            });
        }else{
            res.status(500).send("You are not authorized to delete this post");
        }
    }).catch(err => {
        res.status(500).send(err);
    });
}

exports.showCount = function (req, res) {
    Post.countDocuments({ active: 1 }, function (err, count) {
        Post.countDocuments({ active: 0 }, function (err, count2) {
            res.send(count.toString() + " " + count2.toString());
        });
    });

}