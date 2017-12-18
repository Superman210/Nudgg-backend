const path = require('path');

const protocol = process.env.SITE_PROTOCOL || 'http';
const port = process.env.SITE_PORT || process.env.PORT || 1337;
const host = protocol + '://' + (process.env.SITE_HOSTNAME || ('34.252.122.16:' + port));
const secret = process.env.SITE_JWT_SECRET || 'nudgg_Json_Web_Token';
const cookieName = process.env.SITE_JWT_COOKIE_NAME || 'nudgg';
const webConcurrency = process.env.WEB_CONCURRENCY || require('os').cpus().length;
const apiPrefix = process.env.SURFACE_OWL_API_PREFIX || '';
const apiVersion = process.env.SURFACE_OWL_API_VERSION || '';
const logLevel = process.env.NUDGG_LOG_LEVEL || 'debug'; // winston logging level

module.exports = {
  protocol: protocol,
  port: port,
  host: host,

  email: {
    host: 'smtp.gmail.com',
    port: 465,
    user: 'no-reply@nudgg.co.uk',
    password: 'Activation1',
    templates: {
      activate: 'activate-account',
      reset: 'forgotten-password'
    }
  },

  jwt: { // implementing JWT security
    secret: secret,
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    cookieName: cookieName,
    resetExpires: 0.5 * 60 * 60 // 30 minutes
  },

  webConcurrency: webConcurrency,
  
  apiPrefix: apiPrefix,
  apiVersion: apiVersion,

  logLevel: logLevel // winston logging level
};
