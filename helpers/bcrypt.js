const bcrypt = require('bcryptjs')

const hashPassword = (password) => {
	return bcrypt.hashSync(password, 10)
}

const comparePassword = (password,hashPassword) => {
	return bcrypt.compareSync(password, hashPassword)
}

module.exports = {
	hashPassword,
	comparePassword
}