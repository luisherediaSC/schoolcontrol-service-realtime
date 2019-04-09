const emitter = require('../emitter')
const logger = require('../logger')

class AllRoom {
    
    constructor () {
        logger.info('allroom.setup')
        emitter.once('socketio listen', this.onSocketListen.bind(this))
    }
    
    onSocketListen (io) {
        this.io = io
        emitter.on('socket connected', this.onConnected.bind(this))
    }
    
    onConnected (socket) {
        logger.info('listen message.all')
        socket.on('message.all', this.onMessageAll.bind(this, socket))
    }
    
    onMessageAll (socket, message) {
        logger.info('send message all', message)
        socket.broadcast.emit('message all', message)
    }
    
}

module.exports = new AllRoom()
