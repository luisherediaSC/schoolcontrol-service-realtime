var emmiter = require(__dirname + '/../Emitter'),
    Identity = require(__dirname + '/../models/identities'),
    logger = require(__dirname + '/../Logger'),
    thinky = require(__dirname + '/../util/thinky.js'),
    Errors = thinky.Errors,
    r = thinky.r,
    api = {
        
        setup: function() {
            
            emmiter.on('socketio login', api.onLogin);
            
        },
        
        onLogin: function(socket, data) {
            
            var identity = new Identity({
                id: data.id,
                idSocket: socket.id,
                name: data.display,
                online: true
            });
            
            Identity.get(data.id).run().then(api.updateIdentity.bind(identity, socket)).
            catch(Errors.DocumentNotFound, api.createIdentity.bind(identity, socket)).
            error(function(error) {
                
                emmiter.emit('login failure', error.message);
                
            });
            
        },
        
        loginSuccess: function(socket) {
            
            var identity = this;
            
            logger.info('login success, get others identittys');
            
            Identity.orderBy({
                index: 'name'
            }).filter(function(record) {
                
                return record('id').eq(identity.id).not()/*.
                    and(record('online').eq(true))*/;
                
            }).run().then(function(result) {
                
                emmiter.emit('login success', socket, result, identity);
                
            });
            
        },
        
        updateIdentity: function(socket, identity) {
            
            identity.idSocket = this.idSocket;
            identity.online = true;
            
            identity.save().then(api.loginSuccess.bind(identity, socket)).
            error(function(error) {
                
                logger.error('login failure, not update identity', error.message);
                emmiter.emit('login failure', error.message);
                
            });
            
        },
        
        createIdentity: function(socket, identity) {
            
            this.save().then(api.loginSuccess.bind(this, socket)).
            error(function(error) {
                
                logger.error('login failure, not create identity', error.message);
                emmiter.emit('login failure', error.message);
                
            });
            
        }

    };

module.exports = api;
