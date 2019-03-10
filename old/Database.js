var identities = require(__dirname + '/models/identities'),
    messages = require(__dirname + '/models/messages'),
    api = {
        
        createRelations: function() {
                
            identities.hasMany(messages, 'messages', 'id', 'idIdentityTransmitter');
                
            messages.belongsTo(identities, 'identityTransmitter', 'idIdentityTransmitter', 'id');
            messages.belongsTo(identities, 'identityReceiver', 'idIdentityReceiver', 'id');
            
        },
        
        setup: function() {
            
            api.createRelations();
            
        }
    };

module.exports = {
    setup: api.setup
};
