const path = require('path');
const loadEnv = process.env.NODE_ENV || 'development';
let envFile = (loadEnv === 'production') ? '.env' : '.env.' + loadEnv;
require('dotenv').config({ path: path.resolve('config', envFile) });

const domainNames = [`mystore.com.sa`, `mystore.com.om`, `mystore.com.bh`];
const protocol = 'https';
const domainPrefix = (process.env.ENVIRONMENT === 'prod') ? 'www' : process.env.ENVIRONMENT;

let config = {};
config.port = normalizePort(process.env.PORT) || 3000;
config.memcachedServer = process.env.MEMCACHED;
config.enableBootstrap = true;
config.siteUrls = domainNames.map(domain => `${protocol}://${domainPrefix}.${domain}`);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return null;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = config;
