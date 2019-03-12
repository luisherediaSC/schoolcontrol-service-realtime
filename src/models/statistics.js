const { Schema, model } = require('mongoose')
const validator = require('validator')

const statistics = new Schema({
    type: {
        type: String,
        require: true,
        validator: (value) => {
            return [
                'global'
            ].indexOf(value) !== -1
        }
    },
    max_connections: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = model('statistics', statistics)
