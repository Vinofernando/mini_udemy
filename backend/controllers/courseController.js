import * as courseService from "../services/courseService.js"

export const getPublicCourse = async(req, res, next) => {
    try{
        const result = await courseService.getPublicCourse()
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

export const creatLesson = async(req, res, next) => {
    try{
        const result = await courseService.creatLesson({
            courseId: req.params.courseId,
            title: req.body.title,
            content: req.body.content
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

export const getPublicLesson = async(req, res, next) => {
    try{
        const result = await courseService.getPublicLesson(req.params.courseId)
        res.json(result.rows)
    } catch (err) { next(err) }
}

export const getUserLesson = async(req, res, next) => {
    try{
        const result = await courseService.getUserLesson(req.params.courseId)
        res.json(result.rows)
    } catch (err) { next(err) }
}

export const markCompleteLesson = async(req, res, next) => {
    try{
        const result = await courseService.markCompleteLesson({
            courseId: req.params.courseId,
            lessonId: req.params.lessonId,
            userId: req.user.id
        })
        res.json(result.rows)
    } catch (err) {next(err)}
}

export const getProgress = async(req, res, next) => {
    try{
        const result = await courseService.getProgress({
            userId: req.user.id,
            courseId: req.params.courseId
        })

        res.json(result)
    } catch (err) { next(err) }
}

export const deleteLesson = async(req, res, next) => {
    try{
        const result = await courseService.deleteLesson({
            courseId: req.params.courseId,
            lessonId: req.params.lessonId
        })

        res.json(result)
    } catch (err) { next(err) }
}

export const updateLessonOrder= async(req, res, next) => {
    try{
        const result = await courseService.updateLessonOrder({
            courseId: req.params.courseId,
            lessonId: req.params.lessonId,
            newOrder: Number(req.body.newOrder)
        })
        res.json(result)
    } catch(err) { next(err) }
}

export const publishLesson = async(req, res, next) => {
    try{
        const result = await courseService.publishLesson({
            courseId: req.params.courseId,
            lessonId: req.params.lessonId
        })
        res.json(result)
    } catch (err) { next(err) }
}

export const unpublishLesson = async(req, res, next) => {
    try{
        const result = await courseService.unpublishLesson({
            courseId: req.params.courseId,
            lessonId: req.params.lessonId
        })
        res.json(result)
    } catch (err) { next(err) }
}

export const publishCourse = async(req, res, next) => {
    try{
        const result = await courseService.publishCourse(req.params.courseId)
        res.json(result)
    } catch (err) { next(err) }
}

export const unpublishCourse = async(req, res, next) => {
    try{
        const result = await courseService.publishCourse(req.params.courseId)
        res.json(result)
    } catch (err) { next(err) }
}

export const getSingleLesson = async(req, res, next) => {
    console.log(req.user)
    try{
        const lesson = await courseService.getSingleLesson({
            lessonId: req.params.lessonId,
            userId: req.user?.id || null
        })

        res.json(lesson)
    } catch(err) { next(err) }
}