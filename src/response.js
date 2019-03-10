class Messages {
    
    error (code, payload) {
        return {
            success: false,
            errors: [
                {
                    code: code
                }
            ]
        }
    }
    
    success (payload) {
        return {
            success: true,
            data: payload || {}
        }
    }
}

module.exports = new Messages()
