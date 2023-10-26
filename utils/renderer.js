const puppeteer = require('puppeteer');

const library = require('./library');
const logger = require('./logger');
const cache = require('./caching');

async function puppeteerRender({ url }) {
    const browser = await puppeteer.launch({
        args: ['--headless', '--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
            '--ignore-certificate-errors', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: true,
        userDataDir: './cache'
    });

    try {
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (library.filterURL(request.url())) request.abort();
            else request.continue();
        });

        logger.info(`Launching Page ${url}`);

        await page.goto(url, { waitUntil: 'networkidle0' });

        if (url.search('/product/detail/') > 0) {
            await page.waitForSelector('script[type="application/ld+json"]', { timeout: 3000 });
        }
        await page.waitForFunction('document.title != ""', { timeout: 3000 });

        const htmltxt = await page.content();
        await browser.close();

        logger.info(`Rendering Completed ${url}`);

        return htmltxt;
    } catch (error) {
        await browser.close();
        logger.error(error);
        throw error;
    }
}

async function renderer({ url }) {
    try {
        var cachedPage = await cache.get(url);
        if (cachedPage) {
            return cachedPage;
        } else {
            return puppeteerRender({ url }).then(function (renderedPage) {
                cache.add(url, renderedPage)
                    .then(function () { })
                    .catch(function (error) { throw error; });
                return renderedPage;
            }).catch(function (error) {
                throw error;
            });
        }
    } catch (error) {
        throw error;
    }
}

module.exports = renderer;
