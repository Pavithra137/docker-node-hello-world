const http = require('http');
const { library, renderer, logger, bootstrap, cache } = require('./utils');
const { port, enableBootstrap } = require('./config');

http.createServer(function (req, res) {
    const reqUrl = library.sanitizeURL(req.url);

    if (library.filterURL(reqUrl)) {
        res.statusCode = 404;
        res.write('Page not found !');
        res.end();
    } else {

        logger.info(`Received new request ${reqUrl}`);

        renderer({ url: reqUrl }).then(function (result) {
            res.write(result);
            res.end();

            logger.info(`Success response sent for ${reqUrl}`);

        }).catch(function () {
            res.statusCode = 422;
            res.write('Error in processing your request !');
            res.end();

            logger.info(`Error in processing request ${reqUrl}`);

        });
    }
}).listen(port);
logger.info('Prerendering server started at port ' + port + ' !');

(async function startup() {
    const stats = await cache.stats();
    const isCurrItems = stats[0].curr_items;
    if (enableBootstrap && !isCurrItems) {
        logger.info('Bootstrapping process started');
        bootstrap().then(function (result) {
            logger.info('Bootstrapping process completed');
        }).catch(function (error) {
            logger.error(error);
            logger.info('Bootstrapping process stopped');
        });
    }
})();
