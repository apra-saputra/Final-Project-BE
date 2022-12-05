const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: "public_mvxeb0jYvA9rshwV1jEkVxxhhik=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/1pnzswpuu/"
})

module.exports = imagekit;