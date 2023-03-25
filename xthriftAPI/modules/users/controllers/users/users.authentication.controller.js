'use strict';

/**
 * Module dependencies
 */

var path = require('path');
// var errorHandler = require(path.resolve('./modules/core/controllers/errors.controller'));
var sequelize = require('sequelize');
var passport = require('passport');
var db = require('../../../../models/index');
var User = db.User;
var Pictures = db.Picture;
var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll( require('bcrypt-nodejs') );
var jwt = require('jsonwebtoken');
var sign = Promise.promisify(jwt.sign);
var config = require(path.resolve('./config/config'));
var chalk = require('chalk');
var path = require('path');
var promise = require('bluebird');
var name = require('../../../pictures/lib/pictureName');
var _ = require('lodash');
var uuid = require('node-uuid');
var multer = require('multer');
var aws = require('aws-sdk');
var fs = require('fs');

// URLs for which user cant be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

aws.config = {
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.accessKeySecret,
  region: "us-west-2"
};

/**
 * Signup
 */
exports.signup = function (req, res, next) {
	console.log("Inside signup()");
  // 
  delete req.body.roles;

  console.log('req.get("content-type"): ', req.get('Content-Type'));
  console.log('body', req.body);
  console.log('body.firstName', req.body.firstName);

  // Initialize variables
  var user = (req.body);
  console.log("new user: ", user);
  var message = null;

  // Add missing user fields

  // hash the password
  user.password = bcrypt.hashSync(user.password);
  
  User
    .build(user)
    .save()
    .then( function (user) {
      this.user = user;
      this.user.password = undefined;
      return res.send(user.dataValues);
    })
    .then( null, function (err) {
      console.log(err);
      return res.status(400).json({
        error: err.errors[0]
      });
    } )
    .done();
};

// save avatar to database
exports.savePicture = function (req, res, next) {
	console.log("Inside savePicture()");
  console.log('keyName', req.body);
  console.log('file', req.file);
  if (req.file) {
    var pictureBuild = {
      imageKeys : _.merge(name(req.file.filename), {key: req.file.filename}),
      type: 'AVATAR'
    };
    console.log(chalk.green('images'), pictureBuild);

    Pictures
      .build(pictureBuild)
      .save()
      .then( function (picture) {
        req.body.avatar = picture.dataValues.id;
        return next();
      })
    .then( null, function (err) {
      return res.status(400)
        .json({
          err: err
        });
    });
  } else {
    next();
  }
};


/**
 * Signin after passport auth
 */
exports.signin = function (req, res, next) {
	console.log("inside signin");
	console.log("req.body: ", req.body);
  passport.authenticate('local', function (err, user, info) {
  	console.log("user: ", user);
    if (err || info) {
    	console.log("err: ", err);
    	console.log("info: ", info);
      res.status(401).json({
        error: 'Credentials error'
      });
    } else {
    //   // Remove sensitive data before login
    //   user.password = undefined;
    // next();
      res.status(200).json(user);
    }
  })(req, res, next);
};

// upload image
exports.uploadAvatar = function (req, res, next) {
	console.log("Inside uploadAvatar()");
  var filename = uuid.v4();
  // var storage = multer.diskStorage({
  //   destination: 'uploads/',
  //   filename: function (req, file, cb) {
  //     cb(null, filename);
  //   }
  // });
  var upload = multer({dest: 'uploads/'});
  console.log("upload: ", upload);
  return upload.single('avatar');
};

// upload to amazon
exports.uploadToAmazon = function (req, res, next) {
	console.log("Inside uploadToAmazon()");
	console.log("body: ", req.body);
  console.log(req.file);
  if (req.file) {
    var s3Bucket = new aws.S3({
      params: {
        Bucket: 'xthrift-orig',
      }
    });
    var filename = req.file.filename;
    var file = fs.readFileSync(path.resolve('./uploads/'+filename));
    console.log(path.resolve('./uploads/'+filename));
    var params = {
      Key: filename,
      Body: file
    };
    s3Bucket.upload(params, function (err, data) {
      if (err) {
        res.status(500).json({
          error: err
        });
      }
      if (data) {
        next();
      }
    });
  } else {
    next();
  }
};

// delete image
exports.deleteImage = function (req, res, next) {
	console.log("Inside deleteImage()");
  if (req.file) {
    var deleteFile = promise.promisify(fs.unlink);
    var file = path.resolve('./uploads/'+req.file.filename);
    deleteFile(file)
      .then( function () {
        return next();
      })
    .then( null, function (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    });
  } else {
    next();
  }
};

/** 
 * Protect with jwt
 */
exports.jwt  = function (req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    if (err || info) {
      res.status(401).json({
        error: 'Unauthorized'
      });
    } else {
      next();
    }
  })(req, res, next);
};


/**
 * Signout
 */
exports.signout = function (req, res) {
  // req.logout();
};

/**
 * list
 */
exports.list = function (req, res) {
  User.findAll()
    .then( function (users) {
      res.json(users);
    });
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {

  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

  };
};

/**
 * Helper to save or update OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  
};

/**
 * generate jwt token
 */
exports.generateToken = function (req, res, next) {
  var token = sign({user:req.user}, config.jwt.secret, {algorithm: 'RS256'})
    .then( function (token) {
      req.res.user.token = token;
    next();
    });
};

/**
 * serialize user
 */
exports.serialize = function (req, res, next) {
  req.response = req.user;
  next();
};
