const Memcached = require('memcached');

const logger = require('./logger');
const { memcachedServer } = require('../config');
const expiryTime = 24 * 60 * 60;

class Cache {
    constructor() {
        const options = {
            maxExpiration: expiryTime
        };

        this.memcached = new Memcached(memcachedServer, options);
        this.memcached.on('failure', function (details) {
            logger.error(details);
        });
    }
    add(key, value) {
        return new Promise((resolve, reject) => {
            this.memcached.add(key, value, expiryTime, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
    get(key) {
        return new Promise((resolve, reject) => {
            this.memcached.get(key, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
    del(key) {
        return new Promise((resolve, reject) => {
            this.memcached.del(key, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
    stats() {
        return new Promise((resolve, reject) => {
            this.memcached.stats(function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}

module.exports = new Cache();
