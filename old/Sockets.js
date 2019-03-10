var server = require('./Https'),
    io = require('socket.io')(server),
    logger = require('./Logger'),
    emmiter = require('./Emitter'),
    config = require('config'),
    api = {
        
        setup: function() {
            
            server.listen(config.get('server.port'), function() {
                
                io.on('connection', api.onConnection);
                emmiter.on('login failure', api.onLoginFailure);
                emmiter.on('login success', api.onLoginSuccess);
                emmiter.emit('socketio listen', io);
                
            });
            
            logger.info('server listen port %s', config.get('server.port'));
            
        },
        
        onConnection: function(socket) {
            
            logger.info('socket connection %s', socket.id);
            
            socket.on('login', api.onLogin.bind(socket));
            socket.on('disconnect', api.onDisconnect.bind(socket));
            socket.emit('login', socket.id);
            
        },
        
        onDisconnect: function() {
            
            logger.info('socket disconnect %s', this.id);
            emmiter.emit('socketio disconnect', this.id);
            io.emit('socket disconnected', this.id);
            
        },
        
        onLogin: function(data) {
            
            logger.info('socket on login');
            emmiter.emit('socketio login', this, data);
            
        },
        
        onLoginFailure: function(message) {
            
            logger.info('socketio login failure %s', message);
            
        },
        
        onLoginSuccess: function(socket, identities, identity) {
            
            logger.info('socketio on login success %s, identity: %s', socket.id, identity.id);
            
        }
        
    };

module.exports = {
    setup: api.setup
};
