const { Movie } = require("../models")

class Authorization {
    static async deleteAuthorization(req, res, next) {
        try {
            const { id } = req.params;
            const movie = await Movie.findByPk(id);

            if (!movie) {
                throw new Error("Movie Not Found");
            }
            if (movie.authorId != req.user.id && req.user.role != 'Admin') {
                throw new Error("Forbidden");
            }
            next();
        } catch (err) {
            next(err);
        }
    }

    static async statusAuthorization(req, res, next) {
        try {
            const { id } = req.params;
            const movie = await Movie.findByPk(id);

            if (!movie) {
                throw new Error("Movie Not Found");
            }
            if (req.user.role != "Admin") {
                throw new Error("Forbidden");
            }
            next();
        } catch (err) {
            next(err)
        }
    }

    static async bookmarkAuthorization(req, res, next) {
        try {
            const { id } = req.params;
            const movie = await Movie.findByPk(id);
            if (!movie) {
                throw new Error("Movie Not Found");
            }
            if (req.user.role != "Customer") {
                throw new Error("Forbidden");
            }
            next();
        } catch (err) {
            next(err)
        }
    }
}
module.exports = Authorization;