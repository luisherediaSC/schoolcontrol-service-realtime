const { createLogger, format, transports } = require('winston')
const env = require('./enviroment')
const logger = createLogger({
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [
        new transports.File({
            filename: require('path').join(__dirname, '../../logs/log.log')
        })
    ]
})

if (env.APP_ENV === 'local' || env.APP_ENV === 'stage') {
  logger.add(new transports.Console())
  console.log('enable console logger')
}

module.exports = logger
