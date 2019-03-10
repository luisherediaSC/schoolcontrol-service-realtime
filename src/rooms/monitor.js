const emitter = require('../emitter')
const logger = require('../logger')
const response = require('../response')
const ConnectionsRepository = require('../repositories/connections')

class MonitorRoom {
    
    constructor () {
        this.totalConnections = 0
        logger.info('monitor.setup')
        emitter.once('socketio listen', this.onSocketListen.bind(this))
    }
    
    onSocketListen (io) {
        this.io = io
        emitter.on('socket connected', this.onConnected.bind(this))
        emitter.on('socket disconnect', this.onDisconnect.bind(this))
    }
    
    onConnected (socket) {
        logger.info('monitor.socket.connected.%s', socket.id)
        this.totalConnections += 1
        this.sendTotalConnections()
    }
    
    onDisconnect (idSocket) {
        logger.info('monitor.socket.disconnect.%s', idSocket)
        this.totalConnections -= 1
        ConnectionsRepository.deleteBySocketId(idSocket)
            .then(this.onSuccessDeleteSocket.bind(this, idSocket))
            .catch(this.onErrorDeleteSocket.bind(this, idSocket))
        this.sendTotalConnections()
    }
    
    onErrorDeleteSocket (idSocket) {
        logger.error('monitor.connection.delete.error.%s', idSocket)
    }
    
    onSuccessDeleteSocket (idSocket) {
        logger.info('monitor.connection.delete.success.%s', idSocket)
        this.io.in('monitor').emit('socket disconnect', {
            socket_id: idSocket
        })
    }
    
    onErrorCountConnections (cb, err) {
        logger.error('onErrorCountConnections', err)
        !cb || cb(response.error())
    }
    
    onSuccesCountConnections (cb, result) {
        logger.info('onSuccesCountConnections', result)
        !cb || cb(response.success(result))
    }
    
    onErrorCreateConnection (socket, res) {
        logger.error('monitor.connection.create.error.%s', socket.id)
    }
    
    onSuccessCreateConnection (socket, doc) {
        logger.info('monitor.connection.create.success.%s', socket.id)
        this.io.to('monitor').emit('socket connected', doc)
    }
    
    sendTotalConnections () {
        logger.info('send total connections %s', this.totalConnections)
        this.io.to('monitor').emit('total connections', this.totalConnections)
    }
    
    countConnections (cb) {
        ConnectionsRepository
            .count()
            .then(this.onSuccesCountConnections.bind(this, cb))
            .catch(this.onErrorCountConnections.bind(this, cb))
    }
    
}

module.exports = new MonitorRoom()