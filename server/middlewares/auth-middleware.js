const APIError = require('../exeptions/app-exeptions')
const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) {
            return next(APIError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) {
            return next(APIError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) {
            return next(APIError.UnauthorizedError())
        }

        req.user = userData
        next()

    } catch (e) {
        return next(APIError.UnauthorizedError())
    }
}