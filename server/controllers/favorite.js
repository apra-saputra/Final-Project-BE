const { Favorite, Project } = require("../models");

module.exports = class FavoriteControl {
  static async readFav(req, res, next) {
    try {
      res.json({
        favourites: await Favorite.findAll({ where: { UserId: req.params.id },include : Project }),
      });
    } catch (err) {
      next(err);
    }
  }

  // static async readFavByProject(req, res, next) {
  //   try {
  //     res.json({
  //       favourite: await Favorite.findOne({where: {ProjectId: req.params.projectid}}),
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  static async createFav(req, res, next) {
    try {
      const { id } = req.user;
      const { projectid } = req.params;
      const [fav, created] = await Favorite.findOrCreate({
        where: { ProjectId: projectid, UserId: id },
        defaults: {
          ProjectId: projectid,
          UserId: id,
        },
      });

      if (created) {
        res
          .status(201)
          .json({ message: `Project Id : ${fav.id} has been add to favorite` });
      } else {
        throw { name: "duplicate_favorite" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteFav(req, res, next) {
    try {
      const { favid } = req.params;
      await Favorite.destroy({ where: { id: favid } });

      res.json({
        message: `Favorite with id : ${favid} has been deleted`
      })
    } catch (err) {
      next(err);
    }
  }
};
