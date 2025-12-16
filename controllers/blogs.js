const router = require('express').Router()

const {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} = require('../util/middleware')

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', asyncHandler(async (req, res) => {
  const { title, url } = req.body
  if (!title || !url) {
    throw new BadRequestError('title or url missing')
  }
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
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

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

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