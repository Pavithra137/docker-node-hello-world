const { cache } = require('../utils');

const chai = require('chai');
const expect = chai.expect;

describe('Memcached connection test', function () {

    it('should return a connection properties', async function () {
        const stats = await cache.stats();
        expect(stats[0]).to.have.property('server');
        expect(stats[0]).to.have.property('pid');
    });

});

describe('Memcached operation test', function () {

    it('should add key and value on memcached', async function () {
        const addCache = await cache.add('mocha', 'testing');
        expect(addCache).to.equal(true);
    });

    it('should get key and value on memcached', async function () {
        const getCache = await cache.get('mocha');
        expect(getCache).to.equal('testing');
    });

    it('should delete key and value on memcached', async function () {
        const delCache = await cache.del('mocha');
        expect(delCache).to.equal(true);
    });

});