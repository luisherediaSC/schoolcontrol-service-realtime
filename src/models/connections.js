const { Schema, model } = require('mongoose')
const validator = require('validator')

const connections = new Schema({
    identity_id: {
        type: String,
        required: false
    },
    socket_id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = model('connections', connections)
