const router = require('express').Router()
const {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} = require('../util/middleware')
const { User, Blog } = require('../models')

const userFinder = asyncHandler(async (req, res, next) => {
  const where = {}
  if (req.query.read === 'true') where.read = true
  if (req.query.read === 'false') where.read = false

  req.user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      through: {
        attributes: ['id', 'read'],
        ...(req.query.read ? { where } : {})
      }
    }
  })

  next()
})

router.get('/:id', userFinder, asyncHandler((req, res) => {
  if (!req.user) throw new NotFoundError('user not found')
  res.json(req.user)
}))

router.post('/', asyncHandler(async (req, res) => {
  const { name, username } = req.body
  if (!name || !username) {
    throw new BadRequestError('name or username missing')
  }

  const user = await User.create(req.body)
  res.status(201).json(user)
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