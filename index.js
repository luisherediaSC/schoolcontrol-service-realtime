const env = require('./src/enviroment')
const database = require('./src/database')
const sockets = require('./src/sockets')
const login = require('./src/logics/login')

database.setup(env.MONGO_HOST, env.MONGO_DATABASE)
login.setup()
sockets.setup(env.APP_PORT)
