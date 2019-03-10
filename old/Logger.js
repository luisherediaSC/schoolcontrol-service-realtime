var winston = require('winston'),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({
                filename: require('path').join(__dirname, 'logs/log.log')
            })
        ]
    });
    
module.exports = logger;
