const { Comment } = require("../models");

module.exports = class Comment {
    static async getComments (req,res,next){
        try {
            res.json({
                comment : await Comment.findAll({where: {ProjectId : req.params.projectid}})
            })
        } catch (err) {
            next(err)
        }
    }

    // will handle with socket io
    static createComment (data){
        const {comment, ProjectId, UserId} = data
        Comment.create({comment, ProjectId, UserId}).then(res=> {
            return {message: 'Comment create'}
            })
            .catch(err=> {
                throw err
            })
    }

    static async deleteComment (req,res,next){
        try {
            await Comment.destroy({where: {id: req.params.id}})
        } catch (err) {
            next(err)
        }
    }
};
