const router = require('express').Router()
const { ReadingList } = require('../models')
const { asyncHandler, BadRequestError, tokenExtractor, NotFoundError } = require('../util/middleware')


router.get('/:id', asyncHandler(async (req, res) => {
  const entry = await ReadingList.findByPk(req.params.id)
  if (!entry) throw new NotFoundError('reading list entry not found')
  res.json(entry)
}))

router.post('/', asyncHandler(async (req, res) => {
  try {
    const { blog_id, user_id } = req.body
    if (!blog_id || !user_id) {
      throw new BadRequestError('blog_id and user_id are required')
    }

    const entry = await ReadingList.create({ blog_id, user_id })
    res.status(201).json(entry)
  } catch (error) {
    console.error('READINGLIST INSERT ERROR:', error.name, error.message)
    console.error('ORIGINAL:', error.original?.message)
    throw error
  }
}))

router.put('/:id', tokenExtractor, asyncHandler(async (req, res) => {
  const { read } = req.body

  if (typeof read !== 'boolean') {
    throw new BadRequestError('read must be boolean')
  }

  const entry = await ReadingList.findByPk(req.params.id)
  if (!entry) throw new NotFoundError('reading list entry not found')

  if (entry.userId !== req.decodedToken.id) {
    return res.status(401).json({ error: ['unauthorized'] })
  }

  entry.read = read
  await entry.save()

  res.json(entry)
}))

module.exports = router
