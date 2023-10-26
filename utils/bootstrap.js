const request = require('request');
const parseString = require('xml2js').parseString;

const { siteUrls } = require('../config');
const logger = require('./logger');
const renderer = require('./renderer');

function crawler(url) {
    return new Promise((resolve, reject) => {
        request.get(url, function (error, response) {
            if (!error && response.statusCode === 200) {
                const xml = response.body;
                parseString(xml, async function (error, result) {
                    if (error && !result.urlset) reject(error);
                    else resolve(result.urlset.url);
                });
            } else {
                if (response && response.statusCode !== 200) error = `Unable to fetch xml file ${url}`;
                reject(error);
            }
        });
    });
}

function renderFromXML(xmlElements) {
    return xmlElements.reduce(function (promise, element) {
        return promise.then(() => {
            return renderer({ url: element.loc[0] })
                .then(() => true)
                .catch((error) => {
                    logger.info(`Unable to crawl page ${element.loc[0]}`);
                    throw error;
                });
        }).catch(function (error) {
            throw error;
        });
    }, Promise.resolve());
}

function bootstrap() {

    const xmlFiles = ['sitemap_en.xml', 'sitemap_ar.xml'];
    const sitemaps = siteUrls.reduce(function (accumulator, currentValue) {
        const sitemapUrls = xmlFiles.map(xmlFile => `${currentValue}/${xmlFile}`);
        return accumulator.concat(sitemapUrls);
    }, []);

    return sitemaps.reduce((promise, sitemap) => {
        return promise.then(() => {
            return crawler(sitemap)
                .then(xmlElements => renderFromXML(xmlElements))
                .catch(function (error) {
                    throw error;
                });
        }).then(() => {
            logger.info(`All pages crawled successfully for ${sitemap}`);
            return true;
        }).catch(function (error) {
            throw error;
        });
    }, Promise.resolve());

}

module.exports = bootstrap;
