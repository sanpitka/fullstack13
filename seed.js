const { User, Blog } = require('./models')
require('dotenv').config()

const seed = async () => {
  const user1 = await User.findOrCreate({
    where: { username: 'tofslan@email.com' },
    defaults: { name: 'Tove Jansson' }
  })
  const user2 = await User.findOrCreate({
    where: { username: 'julle@email.com' },
    defaults: { name: 'Julia Capulet' }
  })
  const u1 = user1[0]
  const u2 = user2[0]

  await Blog.findOrCreate({
    where: { title: 'Taikatalvi' },
    defaults: {
      author: 'Tove Jansson',
      url: 'http://hattivatti.blogspot.com',
      likes: 12345,
      year: 1995,
      userId: u1.id
    }
  })

  await Blog.findOrCreate({
    where: { title: 'Veronan yöt' },
    defaults: {
      author: 'Julia Capulet',
      url: 'http://oiromeo.lily.fi',
      likes: 4152,
      year: 2001,
      userId: u2.id
    }
  })

  console.log('Seed completed')
}

seed()