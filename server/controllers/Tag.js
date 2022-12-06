const { Tag } = require("../models");

module.exports = class Tags{
    static async readTags(req, res, next){
        try {
            const tags = await Tag.findAll()
            res.status(200).json(tags);
        } catch (err) {
            next(err)
        }
    }
}
