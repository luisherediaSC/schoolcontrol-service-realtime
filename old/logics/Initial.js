var emmiter = require(__dirname + '/../Emitter'),
    Identity = require(__dirname + '/../models/identities'),
    logger = require(__dirname + '/../Logger'),
    thinky = require(__dirname + '/../util/thinky.js'),
    Errors = thinky.Errors,
    r = thinky.r,
    api = {
        
        setup: function() {
            
            emmiter.on('socketio listen', api.onListen);
            
        },
        
        onListen: function() {
            
            Identity.update({
                online: false,
                idSocket: null
            }).run().then(function() {
                
                logger.info('update all identities offline');
                
            });
            
        }
        
    };
    
module.exports = {
    setup: api.setup
};
