const jwt = require("jsonwebtoken")
const { SECRET } = require("./config")

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === "ValidationError") {
    return response.status(400).json({
      error: "Validation isEmail on username failed",
    })
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).json({
      error: error.message,
    })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "token invalid",
    })
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: "token invalid" })
    }
  } else {
    return res.status(401).json({ error: "token missing" })
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}
