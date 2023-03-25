'use strict';

var chalk = require('chalk');
var path = require('path');
var config = require(path.resolve('./config/config'));
var db = require('../../../models/index');
var Pictures = db.Picture;
var promise = require('bluebird');
var name = require('../lib/pictureName');
var _ = require('lodash');
var uuid = require('node-uuid');
var multer = require('multer');
var AWS = require('aws-sdk');
var config = require(path.resolve('./config/config'));
var fs = require('fs');

// push to Db
exports.pushToDb = function (req, res, next) {
  // res.send('123');
  console.log('not like pravin');
  var type = req.files[0].filename.split('-')[0];
  var respon = res;
  console.log('type', type);
  if (req.path.indexOf('stores') !== -1) {
  	type = 'STORE';
  }
  var images = [];
  var promises = req.files.map ( function (file) {
    var pictureBuild = {
      imageKeys: _.merge(name(file.filename), {key: file.filename}),
      type: type
    };
    return Pictures.build(pictureBuild)
            .save()
            .then( function (picture) {
              images.push(picture.id);
            })
            .then( null, function (err) {
              return res.status(400)
                .json({
                  error: err
                });
            });
  });
  Promise.all(promises)
    .then( function () {
      req.images = images;
      console.log('images in promise all', images);
      res.json({images: images});
      // return next();
      // var next1 = next.bind(next);
      // next1();
      // return next();
      // var sendRes = res.json.bind(res);;
      // sendRes('done');
      // return {
      //   images: images
      // };
    })
  .then ( function (response) {

  });
};

exports.addPicture = function (req, res, next) {
  console.log('keyName', req.body);
  var pictureBuild = {
    imageKeys : _.merge(name(req.body.params.Key), {key: req.body.params.Key}),
    type: req.body.type
  };
  console.log(chalk.green('images'), pictureBuild);

  Pictures
    .build(pictureBuild)
    .save()
    .then( function (picture) {
      return res.status(200)
        .json({
          data: picture.dataValues
        });
    })
    .then( null, function (err) {
      return res.status(400)
      .json({
          err: err
        });
    });
};

// attach picture to global req.picture by id
exports.getPictureById = function (req, res, next, id) {
  Pictures.findOne({
    where: {id:id}
  })
  .then( function (picture) {
    if (!picture) {
      return next(new Error('failed to load picture' + id));
    } else {
      req.picture = picture.dataValues;
      return next();
    }
  })
  .then(null, next)
  .done();
  
};

exports.list = function (req, res) {
  
  var params = req.params;
  
  Pictures
    .findAll()
    .then( function (pictures) {
      return res.json({pictures: pictures});
    })
    .then( null, function (err) {
      console.log(err);
      return res.status(400).send(err);
    })
    .done();

  // update user
};


// upload image
exports.uploadStores = function (req, res, next) {
	console.log("Inside uploadStores()...");
	console.log("files: ", req.files);
  // var storage = multer.diskStorage({
  //   destination: './uploads/',
  //   filename: function (req, file, cb) {
  //     var filename = 'store-' + uuid.v4();
  //     console.log("inside upload.array('pictures')");
  //     console.log("file: ", file);
  //     cb(null, filename);
  //   }
  // });
  // var upload = multer({storage: storage});
  // console.log('return return');


  // return upload.array('pictures');
  
};

// upload to amazon
exports.uploadToAmazon = function (req, res, next) {
	console.log("Inside uploadToAmazon()...");
  console.log("files: ", req.files);
  var successcount = 0;
  var responseArray = [];
  req.files.map( function (file) {
    var s3Bucket = new AWS.S3({
      params: {
        Bucket: 'xthrift-orig',
      }
    });
    var filename = file.filename;
    // if (req.path.indexOf('stores') !== -1) {
    // 	console.log("prepending s3key with store");
    // 	var s3Key = 'store-' + file.filename;	
    // }
    // else {
    // 	var s3Key = file.filename;		
    // }

    var fileData = fs.readFileSync(path.resolve('./uploads/'+filename));
    console.log(path.resolve('./uploads/'+filename));
    var params = {
      Key: filename,
      Body: fileData
    };
    s3Bucket.upload(params, function (err, data) {
      if (err) {
        res.status(500).json({
          error: err
        });
        next();
      }
      if (data) {
        successcount++;
        responseArray.push(data);
        if (successcount === req.files.length) {
          next();
          // res.status(200).json({
          //   data: data
          // });
        }
      }
    });
  });
};

// delete image
exports.deleteImage = function (req, res, next) {
  var promises = req.files.map( function (file) {
    var deleteFile = promise.promisify(fs.unlink);
    var filename = path.resolve('./uploads/'+file.filename);
    var count = 0;
    return deleteFile(filename)
      .then( function () {
        // count++;
        // if (count === req.files.length) {
        //   next();
        // }
      })
    .then( null, function (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    });
  });
  Promise.all(promises)
    .then( function () {
      next();
    });
};


// respond
exports.respondId = function (req, res) {
  res.status(200).json(req.picture);
};

