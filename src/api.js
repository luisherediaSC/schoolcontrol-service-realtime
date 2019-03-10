const request = require('request')
const env = require('./enviroment')
const logger = require('./logger')
const endpoints = {
    me: `${env.API_URL}/security/api/v1/me`
}

class Api {
    
    me (payload, cSuccess, cError) {
        logger.info('api call %s', endpoints.me)
        const headers = {
            Authorization: `Bearer ${payload.token}` 
        }
        request.get({
            url: endpoints.me,
            headers: headers
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                return cError(body)
            }
            const result = JSON.parse(body)
            if (!result.success) {
                return cError(result)
            }
            cSuccess(result)
        })
    }
    
}

module.exports = new Api()