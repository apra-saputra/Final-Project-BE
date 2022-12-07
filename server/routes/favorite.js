const express = require("express");
const FavoriteControl = require("../controllers/favorite");
const Authorization = require("../middleware/authorization");
const favorite = express.Router();

favorite.get('/:id', FavoriteControl.readFav);
// favorite.get("/:projectid", FavoriteControl.readFavByProject);
favorite.post("/:projectid", FavoriteControl.createFav);
favorite.delete(
  "/:favid",
  Authorization.deleteFavorite,
  FavoriteControl.deleteFav
);

module.exports = favorite;
