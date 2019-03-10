var thinky = require(__dirname + '/../util/thinky.js'),
    type = thinky.type,
    r = thinky.r,
    identities = thinky.createModel('identities', {
        id: type.string(),
        idSocket: type.string(),
        name: type.string().required(),
        online: type.boolean().required().default(false),
        avatar: type.string().required().enum([
            'red',
            'blue',
            'gray',
            'orange',
            'green'
        ]).default('blue'),
        lastConnection: type.date(),
        createdAt: type.date().default(r.now())
    });
    
identities.ensureIndex('name');
identities.ensureIndex('createdAt');

module.exports = identities;
