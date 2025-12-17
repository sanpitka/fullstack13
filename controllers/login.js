const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User, Session } = require('../models')
const { SECRET } = require('../util/config')
const { asyncHandler, BadRequestError } = require('../util/middleware')

router.post('/', asyncHandler(async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new BadRequestError('username and password are required')
  }

  const user = await User.findOne({ where: { username } })
  if (!user) throw new BadRequestError('invalid username or password')

  if (user.disabled) {
    throw new BadRequestError('account disabled')
  }

  const passwordOk = password === 'secret'
  if (!passwordOk) throw new BadRequestError('invalid username or password')

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: '2h' }
  )

  await Session.destroy({ where: { user_id: user.id } })
  await Session.create({ user_id: user.id, token })

  res.status(200).json({ token, username: user.username, name: user.name })
}))

module.exports = router
