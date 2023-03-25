
'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var express = require('express');
var morgan = require('morgan');
// var logger = require('./logger');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var path = require('path');
var compress = require('compression');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var consolidate = require('consolidate');
var chalk = require('chalk');


/**
 * Custom method override function
 */

var methodOverrideFn = function(req, res, next) {
  //custom method override logic
  next();
};

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  // uncomment the following line after adding favicon to /public/img/favicon.ico
  
  // app.use(favicon(app.locals.favicon));

  // Enable logger (morgan)
  app.use(morgan('dev'));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  // app.use(multer);
  // app.use(multer({ dest: './uploads/'}));

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
  config.files.configs.forEach(function (configPath) {
    console.log(chalk.red('config'+ configPath));
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public')));

};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  // Globbing routing files
  config.files.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure the db models
 */
module.exports.initDbSeeds = function (app) {
  // Globbing model files
  var allDbs = [];
  config.files.seeds.forEach(function (modelPath) {
    // console.log('Creating Table');
    // allDbs.push(require(path.resolve(modelPath)).sync());
  });

  return Promise.all( allDbs )
    .then(function () {
      return app;
    });
};

/**
 * seed the db models
 */
module.exports.initDbModels = function (app) {
  // Globbing model files
  var allDbs = [];
  config.files.models.forEach(function (modelPath) {
    console.log('Creating Table');
    allDbs.push(require(path.resolve(modelPath)).sync());
  });

  return Promise.all( allDbs )
    .then(function () {
      return app;
    });
};

/**
 * Configure tests
 */
module.exports.initTestModules = function (app) {
  // Globbing test files
  if (process.env.NODE_ENV === 'test') {
    console.log(chalk.green('Running Tests:\n'));
    var only = false;
    var i;

    // check only tests available
    for (i=0; i< config.files.tests.length; i++)  {
      var test =  require(path.resolve(config.files.tests[i]));
      if (test.only) {
        only = true;
        test.testFn(app);
        break;
      }
    }

    if (!only) {
      config.files.tests.forEach(function (testPath) {
        console.log(chalk.white('-'));
        var test = require(path.resolve(testPath));
        test.testFn(app);
      });
    }
  }
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  // this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes
  this.initModulesClientRoutes(app);

  // !TODO
  // Initialize modules server authorization policies
  // this.initModulesServerPolicies(app); 

  // Initialize modules server routes
  // this.initModulesServerRoutes(app);

  // var passport = require('passport');
  // require('../../modules/users/config/strategies/localStrategy')(config);
  // require('../../modules/users/config/strategies/jwt')(config);
  // app.use(passport.initialize());
  // app.use('/api/v1', require('../../modules/users/routes/users.auth.routes')(app, express, passport));

  app.use('/api/v1', require('../../modules/users/routes/users.auth.routes')(app, express));

  app.use('/api/v1', require('../../modules/categories/routes/categories.routes')(app));
  app.use('/api/v1', require('../../modules/core/routes/core.routes')(app));
  app.use('/api/v1', require('../../modules/deals/routes/deals.routes')(app));
  app.use('/api/v1', require('../../modules/pictures/routes/pictures.routes')(app));
  app.use('/api/v1', require('../../modules/pictures/routes/signedUrl.routes')(app));
  app.use('/api/v1', require('../../modules/stores/routes/stores.routes')(app));
  app.use('/api/v1', require('../../modules/users/routes/users.routes')(app));
  
  
  // app.route('/docs', express.static(__dirname + 'doc'));
  app.use('/docs', express.static(process.cwd() + '/doc'));
	app.route('/docs').get(function (req, res) {
		res.sendFile(path.resolve(__dirname, '../../doc/index.html'));
	});

app.route('/').get(function (req, res) {
	res.send('Unauthorized');
});


  // Initialize error routes
  this.initErrorRoutes(app);

  app.route('/api').get(function(req, res) {
    res.send('Xthrift API');
  });

  // Initialize db models
  return this.initDbModels(app);
};
