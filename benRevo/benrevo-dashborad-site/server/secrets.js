// Note that all of these 'secrets' are just the development keys for various services.
//
//                            DO NOT PUT ANY PRODUCTION KEYS IN THIS FILE
//                           (if you do Ryan, will be very angry with you)
//
// Production keys for these services should be set in the configuration for the app that
// translates to environment variable on the server.  Heroku, Beanstalk, and others have
// adopted this as a best practice and support UI and CLI setting of environment variables.

module.exports.SPLUNK_TOKEN = process.env.SPLUNK_TOKEN || '214C7C31-E790-4F2D-8BD2-12A42E81B970';
