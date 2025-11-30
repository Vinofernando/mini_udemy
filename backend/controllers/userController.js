import * as userService from '../services/userService.js'

export const getUser = async (req, res, next) => {
    try{
        const data = await userService.getUser(req.user.id)
        res.json(data)
    } catch (err){
        next( err )
    }
}
export const forgotPassword = async (req, res, next) => {
    console.log(req.body.email)
    try{
        const data = await userService.forgotPassword(req.body.email);
        res.json(data)
    } catch (err) {
        next(err)
    }
}