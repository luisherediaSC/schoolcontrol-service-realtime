const { Schema, model } = require('mongoose')
const validator = require('validator')

const identities = new Schema({
    id: {
        type: String,
        required: true
    },
    display: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validator: (value) => {
            return validator.isEmail(value)
        }
    },
    connections: [
        {
            type: Schema.Types.ObjectId,
            ref: 'connections'
        }
    ]
})

module.exports = model('identities', identities)
