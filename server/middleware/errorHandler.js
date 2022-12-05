const errorHandler = (err, req, res, next) => {
	console.log(err);
  let code = 500
  let message = "internal server error"

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    let errMsg = err.errors.map(el => el.message)
    code = 400
    message = errMsg[0]
  } else if (err.name === 'invalid_login') {
    code = 401
    message = "error, invalid email or password"
  } else if (err.name === "project_not_found") {
    code = 404
    message = "project not found"
  } else if (err.name === "tag_not_found") {
    code = 404
    message = "tag not found"
  } else if (err.name === "forbidden") {
    code = 403
    message = "you are not authorized"
  } else if (err.name === "invalid_token" || err.name === "JsonWebTokenError") {
    code = 401
    message = "error authentication - invalid token"
  } else if (err.name === "duplicate_favorite") {
    code = 400
    message = "project already on your favorite"
  } else if(err.name === "duplicate_report"){
    code = 400
    message = "project already on your report"
  }
  res.status(code).json({ message })
}

module.exports = errorHandler