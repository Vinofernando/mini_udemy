import * as courseService from "../services/courseService.js"

export const getCourse = async(req, res, next) => {
    try{
        const result = await courseService.getCourse()
        res.json(result)
    } catch (err) { next(err) }
}

export const getUserCourses = async(req, res, next) => {
    try{
        const result = await courseService.getUserCourses(req.user.id)
        res.json(result)
    } catch (err) { next(err) }
}

export const addCourse = async (req, res, next) => {
    console.log(req.body)
    try{
        const result = await courseService.createCourse({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            createdBy: req.user.id
        })
        res.json(result.rows)
    } catch (err) { next(err) }
}

export const enrollCourse = async (req, res, next) => {
    try{
        const result = await courseService.enrollCourse(req.user.id, req.params.courseId)
        res.json(result.rows)
    } catch (err) { next(err) }
}