const Identities = require('../models/identities')

class IdentitiesRepository {
    
    getAllOnline () {
        return Identities.where('socket_id').ne(null)
    }
    
    findAndUpdate (query, update) {
        return Identities.findOneAndUpdate(query, update, {
            new: true,
            upsert: true
        })
    }
    
    disconnect (idSocket) {
        return Identities.findOneAndUpdate({
            online: fa
        }, {
            socket_id: null
        })
    }
    
}

module.exports = new IdentitiesRepository()