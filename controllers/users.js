const router = require('express').Router()

const {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} = require('../util/middleware')

const { User } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  next()
}

router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll()
  res.json(users)
}))

router.post('/', asyncHandler(async (req, res) => {
  const { name, username } = req.body
  if (!name || !username) {
    throw new BadRequestError('name or username missing')
  }
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
}))

router.get('/:id', userFinder, asyncHandler(async (req, res) => {
  if (req.user) {
    res.json(req.user)
  } else {
    res.status(404).end()
  }
}))

router.put('/:username', asyncHandler(async (req, res) => {
  const { username } = req.params
  const { name } = req.body

  if (!name || name.trim() === '') {
    throw new BadRequestError('name is required')
  }

  const user = await User.findOne({ where: { username } })
  if (!user) {
    throw new NotFoundError('user not found')
  }
  user.name = name
  await user.save()
  res.json(user)
}))

module.exports = router