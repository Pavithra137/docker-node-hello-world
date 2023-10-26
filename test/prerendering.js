const { renderer } = require('../utils');

const chai = require('chai');
const expect = chai.expect;

describe('Prerendering check for homepage', function () {

    it('should return a html for homepage', function (done) {
        renderer({ url: 'https://qa.mystore.com.sa/en/' }).then((result) => {
            expect(result).to.have.string('html');
            done();
        });
    });

});