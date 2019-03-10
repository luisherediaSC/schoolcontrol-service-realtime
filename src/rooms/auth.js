const emitter = require('../emitter')
const logger = require('../logger')

class Auth {
    
    constructor () {
        logger.info('auth room setup')
        emitter.on('socketio listen', this.onSocketListen.bind(this))
    }
    
    onSocketListen (socket) {
        socket.on('login', this.onLogin.bind(this, socket))
    }
    
    onLogin (socket, data, callback) {
        logger.info('auth login', socket.id)
        emitter.emit('auth login', socket.id, data, callback)
    }
}

module.exports = new Auth()
