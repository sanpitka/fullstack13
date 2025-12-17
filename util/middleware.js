const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
  }
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: ['unknown endpoint'] })
}

const errorHandler = (error, req, res, next) => {

  console.error('ORIGINAL:', error.original?.message)
  console.error('ERRORS:', error.errors?.map(e => e.message))
  console.error(error.name, error.message)

  if (error.name === 'BadRequestError') {
    return res.status(400).json({ error: [error.message] })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: [error.message] })
  }

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({
      error: error.errors.map(e => e.message),
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: [error.message] })
  }

  return res.status(500).json({ error: [error.message || 'internal server error'] })
}


module.exports = {
  asyncHandler,
  BadRequestError,
  NotFoundError,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}