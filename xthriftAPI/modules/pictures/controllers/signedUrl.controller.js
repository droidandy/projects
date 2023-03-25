'use strict';

var path = require('path');
var config = require(path.resolve('./config/config'));
var aws = require('aws-sdk');
var chalk = require('chalk');
var db = require('../../../models/index');
var Pictures = db.Picture;
var uuid = require('node-uuid');

// configure aws
aws.config = {
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.accessKeySecret,
  region: "us-west-2"
};

var s3 = new aws.S3();

exports.signUrl = function (req, res) {
  var params;
  var imageTypes = ['small', 'medium', 'large', 'thumbnail'];
    console.log("inside signUrl");
  if (req.params.type === 'get')  {

    // parameters for url
    params = {
      Bucket: 'xthrift-conv', 
      Expires: 7*24*60*60,
      Key: req.picture.imageKeys[req.params.getType]
    };

    console.log("req.picture below");
    console.log(req.picture);

    return imageTypes.indexOf(req.params.getType) === -1 ? 
    // if the type is invalid
    res.status(404).send('not found') :
    // get a signed url
    s3.getSignedUrl('getObject', params, function (err, url) {
        res.json({ url: url });
    });
  } else if (req.params.type === 'post') {

    params = {
      Bucket: 'xthrift-orig', 
      Expires: 60*60,
      Key: uuid.v4()
    };

    s3.getSignedUrl('putObject', params, function (err, url) {
        res.json({ url: url, params: params});
    });
  } else {
      res.status(404).send("Not Found");
    }
};


// imageNames
exports.imageNames = function (req, res, next, id) {
  Pictures.findOne ({
    where: { id: id }
  })
  .then( function (picture) {
    if (!picture) {
      return next(new Error('Picture not found'));
    }
    req.picture = picture.dataValues;
    return next();
  })
  .then( null, function (err) {
    if (err) {
      return next(err);
    }
  });
};

