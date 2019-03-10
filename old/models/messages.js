var thinky = require(__dirname + '/../util/thinky.js'),
    type = thinky.type,
    r = thinky.r,
    messages = thinky.createModel('messages', {
        id: type.string(),
        idIdentityTransmitter: type.string().required(),
        idIdentityReceiver: type.string().required(),
        idMessageLocal: type.string().required(),
        status: type.string().required().enum([
            'wait-send',
            'server-received',
            'contact-received',
            'contact-read'
        ]).required().default('server-received'),
        dateReceived: type.date(),
        dateRead: type.date(),
        message: type.string(),
        createdAt: type.date().default(r.now())
    });
    
messages.ensureIndex('idIdentityTransmitter');
messages.ensureIndex('idIdentityReceiver');

module.exports = messages;
