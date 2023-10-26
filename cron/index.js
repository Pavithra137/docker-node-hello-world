const { logger, bootstrap } = require('../utils');

(async function startup() {
    logger.info('Cron process started');
    bootstrap().then(function (result) {
        logger.info('Cron process completed');
    }).catch(function (error) {
        logger.error(error);
        logger.info('Cron process stopped');
    });
})();
