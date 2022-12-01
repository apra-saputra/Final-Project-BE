const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

const encodeToken = (payload) => {
	return jwt.sign(payload, SECRET)
}

const decodeToken = (token) => {
	return jwt.verify(token, SECRET)
}

 
module.exports = {
	encodeToken,
	decodeToken
}