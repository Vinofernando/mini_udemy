import * as authService from '../services/authService.js'

export const register = async (req, res, next) => {
    try{
        const result = await authService.registerUser(req.body)
        res.json(result)
    } catch (err) { next(err) }
}

export const login = async (req, res, next) => {
    console.log(req.body)
    try{
        const result = await authService.loginUser(req.body)
        res.json(result)
    } catch (err) { next(err) }
}