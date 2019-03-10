const DotEnv = require('dotenv')
const nodeEnv = process.env.NODE_ENV
const enviroment = '.env' + (nodeEnv ? `.${nodeEnv}` : '')

module.exports = DotEnv.config({
    path: enviroment
}).parsed
