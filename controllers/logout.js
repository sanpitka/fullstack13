const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor, asyncHandler } = require('../util/middleware')

router.delete('/', tokenExtractor, asyncHandler(async (req, res) => {
  await Session.destroy({ where: { token: req.token } })
  res.status(204).end()
}))

module.exports = router
