/* eslint-env jasmine */

'use strict';

var config = {
  SRV_NAME: 'tags'
};

var route = require('../routes/put')(config);

// loading dependencies
var mongoose = require('mongoose');
// mongoose.set('debug', true);
var mockgoose = require('mockgoose');
var run = require('./lib/express-unit').run;
var setup = require('./lib/express-unit-default-setup');
var util = require('util');


// loading mocked data
var newtags = require('./data/data.json');

describe('tags-ms put handler', function() {
  var createdtags;

  beforeEach(function(done) {
    mockgoose(mongoose).then(function() {
      mongoose.connect('mongodb://example.com/TestingDB', function(err) {
        // Load model
        require('../models/tags')(config).then(function() {
          // Create some data
          mongoose.model('Tag').create(newtags, function(err, results) {
            createdtags = results;
            done(err);
          });
        });
      });
    });
  });

  afterEach(function(done) {
    mockgoose.reset(function() {
      mongoose.disconnect(function() {
        mongoose.unmock(function() {
          delete mongoose.models.Tag;
          done();
        });
      });
    });
  });

  it('should update a tag', function(done) {

    var update = {
      description: 'new description'
    };

    var args = {
      params: {
        id: createdtags[0]._id.toString()
      },
      body: update
    };

    run(setup(args), route, function(err, req, res) {
      expect(err).toBeNull();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      var tag = res.json.mostRecentCall.args[0];
      expect(tag.description).toEqual(update.description);
      expect(tag._id.toString()).toEqual(createdtags[0]._id.toString());

      done();
    });
  });

  it('should not update a not owned tag', function(done) {

    var update = {
      description: 'new description'
    };

    var args = {
      params: {
        id: createdtags[0]._id.toString()
      },
      body: update,
      filterOwner: {
        ownerID: createdtags[1].ownerID.toString()
      }
    };

    run(setup(args), route, function(err, req, res) {
      expect(err).toBeNull();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();

      var tag = res.json.mostRecentCall.args[0];
      expect(util.isArray(tag)).toBe(false);
      expect(tag.status).toBe(400);

      // check the database
      mongoose.model('Tag').findById(args.params.id)
        .lean().exec(function(_err, dbResult) {
          expect(_err).toBeNull();
          expect(dbResult).toBeDefined();
          expect(dbResult.description).toEqual(createdtags[0].description);
          expect(dbResult._id.toString()).toEqual(createdtags[0]._id.toString());

          mongoose.model('Tag').findById(createdtags[1]._id.toString())
          .lean().exec(function(_err, _dbResult) {
            expect(_err).toBeNull();
            expect(_dbResult).toBeDefined();
            expect(_dbResult.description).toEqual(createdtags[1].description);
            expect(_dbResult._id.toString()).toEqual(createdtags[1]._id.toString());

            done();
          });
        });
    });
  });

  it('should not update a tag name if it already exists', function(done) {

    var update = {
      name: createdtags[1].name
    };

    var args = {
      params: {
        id: createdtags[0]._id.toString()
      },
      body: update
    };

    run(setup(args), route, function(err, req, res) {
      expect(err).toBeNull();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();

      var error = res.json.mostRecentCall.args[0];
      expect(error.status).toEqual(500);
      expect(error.message).toBeDefined();

      done();
    });
  });
});
