const fs = require('fs')
const server = require('https').createServer({
    key: fs.readFileSync(__dirname + '/../../letsencrypt/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/../../letsencrypt/fullchain.pem')
})
    
module.exports = server
