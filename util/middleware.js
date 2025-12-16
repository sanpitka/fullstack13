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
  res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'BadRequestError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message })
  }

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeDatabaseError'
  ) {
    return res.status(400).json({ error: 'database error' })
  }

  return res.status(500).json({ error: 'internal server error' })
}

module.exports = {
  asyncHandler,
  BadRequestError,
  NotFoundError,
  unknownEndpoint,
  errorHandler,
}