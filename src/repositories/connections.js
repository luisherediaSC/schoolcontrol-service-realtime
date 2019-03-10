const ConnectionsModel = require('../models/connections')

class ConnectionsRepository {
    
    create (payload) {
        return new ConnectionsModel(payload).save()
    }
    
    deleteBySocketId (idSocket) {
        return ConnectionsModel.deleteMany({
            socket_id: idSocket
        })
    }
    
    reset () {
        return ConnectionsModel.deleteMany({})
    }
    
    count () {
        return ConnectionsModel.count({})
    }
    
}

module.exports = new ConnectionsRepository()