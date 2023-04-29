const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const APIErrors = require('../exeptions/app-exeptions')
class UserController {
    async registration (reg, res, next){
        try {
            const errors = validationResult(reg)
            if(!errors.isEmpty()) {
                return next(APIErrors.BadRequest('Validation Error', errors.array()))
            }
            const {email, password } = reg.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login (reg, res, next){
        try {
            const {email, password} = reg.body

            const userData = await userService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout (req, res, next){
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken  ')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }
    async activate (reg, res, next){
        try {
            const activationLink = reg.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh (reg, res, next){
        try {
            const {refreshToken} = reg.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers (reg, res, next){
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()