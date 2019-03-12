const StatisticsModel = require('../models/statistics')
const emitter = require('../emitter')

class StatisticsRepository {
    
    fingGlobal () {
        return this.findByType('global')
    }
    
    findByType (type) {
        return StatisticsModel.findOne({
            type: type
        })
    }
    
    incrementMaxConnections (connections) {
        return StatisticsModel.findOneAndUpdate({
            type: 'global'
        }, {}, {
            new: true,
            upsert: true
        }).then(this.__onUpdateMaxConnections.bind(this, connections))
    }
    
    __onUpdateMaxConnections (connections, statistics) {
        if (typeof statistics.max_connections === 'undefined') {
            statistics.max_connections = connections
        } else if (connections < statistics.max_connections) {
            return
        }
        statistics.max_connections = connections
        statistics.save()
            .then(this.__onSuccessIncrementMaxConnections.bind(this, connections))
    }
    
    __onSuccessIncrementMaxConnections (connections) {
        emitter.emit('statics new max connections', connections)
    }
    
}

module.exports = new StatisticsRepository()
