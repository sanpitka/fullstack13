const router = require('express').Router()
const { User } = require('../models')

const {
  asyncHandler,
  BadRequestError,
  NotFoundError,
  tokenExtractor,
} = require('../util/middleware')

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where.title = { [Op.iLike]: `%${req.query.search}%` }
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['username']
    }, 
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, asyncHandler(async (req, res) => {
  const { title, url } = req.body
  if (!title || !url) {
    throw new BadRequestError('title or url missing')
  }
  try {
    const user = await User.findByPk(req.token.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
}))

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, asyncHandler(async (req, res) => {
  if (req.blog) {
    if (req.blog.userId === req.token.id) {
      await req.blog.destroy()
      return res.status(204).end()
    } else {
      return res.status(401).json({ error: 'unauthorized' })
    }
  }
  res.status(204).end()
}))

router.put('/:id', blogFinder, asyncHandler(async (req, res) => {
    if (!req.blog) {
      throw new NotFoundError('blog not found')
    }
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  })
)

module.exports = router