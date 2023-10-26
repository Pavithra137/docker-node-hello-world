const path = require('path');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, label, printf } = format;
const { env } = require('../config');

const transport = new (DailyRotateFile)({
    filename: 'application-%DATE%.log',
    dirname: path.resolve('logs/winston'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d'
});

const errorStackTracerFormat = format(info => {
    if (info.meta && info.meta instanceof Error) {
        info.message = `${info.message} ${info.meta.stack}`;
    }
    return info;
});

const logFormat = printf((info) => {
    if (info.stack) {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${info.stack}`;
    } else {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }
});

const logger = createLogger({
    format: combine(
        label({ label: 'pre-rendering' }),
        timestamp(),
        errorStackTracerFormat(),
        format.simple(),
        logFormat
    ),
    transports: [transport]
});

if (env !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = logger;
