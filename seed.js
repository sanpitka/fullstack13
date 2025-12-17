const { User, Blog } = require('./models')
const { connectToDatabase } = require('./util/db')

const seed = async () => {
  await connectToDatabase()
  const user1 = await User.create({ name: 'Tove Jansson', username: 'tofslan@email.com' })
  const user2 = await User.create({ name: 'Julia Capulet', username: 'julle@email.com' })
  await Blog.create({ author: 'Tove Jansson', url: 'http://hattivatti.blogspot.com', title: 'Taikatalvi', likes: 12345, userId: user1.id })
  await Blog.create({ author: 'Julia Capulet', url: 'http://oiromeo.lily.fi', title: 'Veronan yöt', likes: 4152, userId: user2.id })
  console.log('Seed completed')
  process.exit(0)
}

seed()