import * as courseService from "../services/courseService.js"

export const addCourse = async (req, res, next) => {
    console.log(req.body)
    try{
        const result = await courseService.createCourse({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            createBy: req.user.id
        })
        res.json(result.rows)
    } catch (err) { next(err) }
}