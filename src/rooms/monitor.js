const emitter = require('../emitter')
const logger = require('../logger')
const response = require('../response')
const enviroment = require('../enviroment')
const ConnectionsRepository = require('../repositories/connections')
const StatisticsRepository = require('../repositories/statistics')

class MonitorRoom {
    
    constructor () {
        this.totalConnections = 0
        this.timeoutChangeConnections = null
        this.timeoutMaxConnections = null
        logger.info('monitor.setup')
        emitter.on('statics new max connections', this.__sendNewMaxConnections.bind(this))
        emitter.once('socketio listen', this.onSocketListen.bind(this))
        
        // simulations
        // this.__simulateConnections()
        // this.__simulateMaxConnections()
    }
    
    __simulateMaxConnections () {
        let maxConnections = 1
        setInterval(() => {
            this.__sendNewMaxConnections(++maxConnections)
        }, 3000)
    }
    
    __simulateConnections () {
        setInterval(() => {
            this.totalConnections += 1
            this.sendChangeConnections()
        }, 3000)
    }
    
    __sendNewMaxConnections (connections) {
        if (this.timeoutMaxConnections) {
            clearInterval(this.timeoutMaxConnections)
        }
        setTimeout(() => {
            logger.info('monitor.new.max.connections %s', connections)
            this.timeoutMaxConnections = null
            this.io.in('monitor')
                .emit('monitor new max connections', response.success(connections))
        }, 3000)
    }
    
    onSocketListen (io) {
        this.io = io
        emitter.on('socket connected', this.onConnected.bind(this))
        emitter.on('socket disconnect', this.onDisconnect.bind(this))
    }
    
    onCountConnections (payload, cb) {
        logger.info('monitor.count.connections %s', this.totalConnections)
        cb(response.success(this.totalConnections))
    }
    
    onGetMaxConnections (payload, cb) {
        logger.info('monitor.get.max.connections')
        StatisticsRepository.fingGlobal().then((statistics) => {
            cb(response.success(statistics.max_connections || 0))
        }).catch((err) => {
            logger.error('monitor.get.max.connections', err)
        })
    }
    
    onConnected (socket) {
        logger.info('monitor.socket.connected.%s', socket.id)
        if (!this.__isSocketValid(socket)) {
            return
        }
        this.totalConnections += 1
        socket.on('monitor count connections', this.onCountConnections.bind(this))
        socket.on('monitor max connections', this.onGetMaxConnections.bind(this))
        ConnectionsRepository.create({
            socket_id: socket.id,
            source: socket.handshake.query.source,
            identity_id: null
        })
        .then(this.onSuccessCreateConnection.bind(this, socket))
        .catch(this.onErrorCreateConnection.bind(this, socket))
        this.sendChangeConnections()
    }
    
    __isSocketValid (socket) {
        console.log(socket.handshake.query)
        const source = socket.handshake.query.source || ''
        if (!source) {
            logger.error('monitor.socket.connected.source.empty')
            return false
        }
        if (enviroment.SOURCE_VALID.split(',')
            .indexOf(socket.handshake.query.source) !== -1) {
            return true
        }
        logger.error('monitor.socket.connected.source.invalid')
        return false
    }
    
    onDisconnect (socket) {
        logger.info('monitor.socket.disconnect.%s', socket.id)
        if (!this.__isSocketValid(socket)) {
            return
        }
        this.totalConnections -= 1
        ConnectionsRepository.deleteBySocketId(socket.id)
            .then(this.onSuccessDeleteSocket.bind(this, socket.id))
            .catch(this.onErrorDeleteSocket.bind(this, socket.id))
        this.sendChangeConnections()
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
    
    sendChangeConnections () {
        if (this.timeoutChangeConnections) {
            clearInterval(this.timeoutChangeConnections)
        }
        this.timeoutChangeConnections = setTimeout(() => {
            logger.info('send total connections %s', this.totalConnections)
            this.timeoutChangeConnections = null
            this.io.in('monitor')
                .emit('change connections', response.success(this.totalConnections))
            StatisticsRepository.incrementMaxConnections(this.totalConnections)
        }, 1000)
    }
    
    countConnections (cb) {
        ConnectionsRepository
            .count()
            .then(this.onSuccesCountConnections.bind(this, cb))
            .catch(this.onErrorCountConnections.bind(this, cb))
    }
    
}

module.exports = new MonitorRoom()