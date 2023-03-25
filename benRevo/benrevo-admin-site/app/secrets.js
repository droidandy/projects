// Note that all of these 'secrets' are just the development keys for various services.
//
//                            DO NOT PUT ANY PRODUCTION KEYS IN THIS FILE
//                           (if you do Ryan, will be very angry with you)
//
// Production keys for these services should be set in the configuration for the app that
// translates to environment variable on the server.  Heroku, Beanstalk, and others have
// adopted this as a best practice and support UI and CLI setting of environment variables.

// Auth0:  www.auth0.com
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'Wr7IfZ2RgMPHRVp2Fp0KDuCEDMC5OquN';
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'cryptyk.auth0.com';
export const AUTH0_DOMAIN_LOGIN = process.env.AUTH0_DOMAIN_LOGIN || 'https://login.auth0.com/api/v2';
