const mongoose = require('mongoose')
const logger = require('./logger')

class Database {
    
    setup (host, database) {
        logger.info('setup database')
        mongoose.connect(`mongodb://${host}/${database}`, {
            useNewUrlParser: true
        }).then(this.onSuccess).catch(this.onError)
    }
    
    onError () {
        logger.error('error connect database')
    }
    
    onSuccess () {
        logger.info('success connect database')
    }
}

module.exports = new Database()
