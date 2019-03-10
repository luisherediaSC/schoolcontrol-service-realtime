const https = require('./https')
const io = require('socket.io')(https)
const logger = require('./logger')
const emitter = require('./emitter')
const response = require('./response')
const ConnectionsRepository = require('./repositories/connections')

// rooms
require('./rooms/monitor')
require('./rooms/auth')

class Sockets {
    
    setup (port) {
        logger.info('sockets setup, listen port %s', port)
        ConnectionsRepository
            .reset()
            .then(this.onResetConnections.bind(this, port))
        
    }
    
    onResetConnections (port) {
        logger.info('sockets.listen.%s', port)
        https.listen(port, () => {
            io.on('connection', this.onConnection.bind(this))
            emitter.emit('socketio listen', io)
        })
    }
    
    onConnection (socket) {
        logger.info('socket connection %s', socket.id)
        socket.on('join', this.onJoin.bind(this, socket))
        socket.on('disconnect', this.onDisconnect.bind(this, socket))   
        emitter.emit('socket connected', socket)
    }
    
    onDisconnect (socket) {
        logger.info('socket disconnect %s', socket.id)        
        emitter.emit('socket disconnect', socket.id)
    }
    
    onJoin (socket, room, cb) {
        logger.info('socket join to %s', room)
        if (!this.isValidRoom(room)) {
            return cb(response.error('realtime.socket.room.invalid'))
        }
        socket.join(room)
        cb(response.success())
    }
    
    isValidRoom (room) {
        return [
            'monitor'
        ].indexOf(room) !== -1
    }
    
}

module.exports = new Sockets()
