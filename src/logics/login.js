const logger = require('../logger')
const emitter = require('../emitter')
const apiService = require('../api')
const IdentitiesRepository = require('../repositories/identities')
const ConnectionsRepository = require('../repositories/connections')
const response = require('../response')

class Login {
    
    setup () {
        logger.info('login setup')
        emitter.on('auth login', this.onLogin.bind(this))
    }
    
    onLogin (idSocket, data, callback) {
        logger.info('login logic', data)
        if (!this.isValidLogin(data)) {
            callback(response.error('realtime.login.input.invalid'))
            return
        }
        logger.info('valid login data')
        apiService.me(
            data,
            this.onLoginSuccess.bind(this, idSocket, data.source, callback),
            this.onLoginError.bind(this, data.source, callback)
        )
    }
    
    onLoginError (callback, response) {
        logger.debug('response login error', response)
        callback(response.error('realtime.login.api.error'))
    }
    
    onLoginSuccess (idSocket, source, cb, result) {
        logger.info('response login succes', result)
        const data = result.data
        IdentitiesRepository.findAndUpdate({
            id: data.session.id
        }, {
            source: source,
            email: data.user.email,
            display: data.session.displayEspecific,
            online: true,
            profile: data.session.profile.key
        })
            .then(this.onSuccessFindIdentity.bind(this, idSocket, cb))
            .catch(this.onErrorFindIdentity.bind(this, cb))
    }
    
    onErrorFindIdentity (err, cb) {
        logger.error('login.findIdentity')
        cb(response.error('realtime.login.findIdentity', err))
    }
    
    onSuccessFindIdentity (idSocket, cb, identity) {
        logger.info('login success', identity)
        ConnectionsRepository
            .create({
                identity_id: identity._id,
                socket_id: idSocket
            })
            .then(this.onSuccessCreateConnection.bind(this, cb, identity))   
            .catch(this.onErrorCreateConnection.bind(this, cb, identity))
    }
    
    onErrorCreateConnection (cb, identity, err) {
        logger.error('login.connection.create')
        cb(response.error('realtime.login.connection.create', {
            err: err,
            identity: identity
        }))
    }
    
    onSuccessCreateConnection (cb, identity, connection) {
        const event = {
            identity: identity,
            connection: connection
        }
        cb(response.success(event))        
        emitter.emit('login success', event)
    }
    
    isValidLogin (data) {
        if (!data.token) {
            logger.error('invalid login data (token)')
            return false
        }
        if (!data.source) {
            logger.error('invalid login data (source)')
            return false
        }
        return true
    }
}

module.exports = new Login()
