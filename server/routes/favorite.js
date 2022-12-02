const authentication = require('../middleware/authentication');
const express = require('express');
const FavoriteControl = require('../controllers/favorite');
const favorite = express.Router();

favorite.get('/:projectid', FavoriteControl.readFavByProject)
favorite.post('/:projectid', FavoriteControl.createFav)
favorite.delete('/:favId', FavoriteControl.deleteFav)

module.exports = favorite