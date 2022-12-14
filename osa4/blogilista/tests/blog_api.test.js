const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salis', 10)
  const user = new User({ username: 'bobi', passwordHash })
  await user.save()
  const userForToken = {
    username: user.username,
    id: user._id
  }
  token = jwt.sign(userForToken, process.env.SECRET)
})

describe('when there are some blogs in the database', () => {

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id field is "id", not "_id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).toBe(undefined)
  })
})



describe('addition of a new blog', () => {
  const newBlog = {
    title: 'Moro kaikille',
    author: 'Bobby',
    url: 'bobbysblog.com',
    likes: 123
  }
  test('succeeds when content and authorization are correct', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Moro kaikille')
  })

  test('fails when no token is given', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('likes is set to 0 when no value has been assigned to it', async () => {
    const newBlog = {
      title: 'Hello everyone',
      author: 'Jirry',
      url: 'jirryblogs.com'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('fails when title and url are missing', async () => {
    const newBlog = {
      author: 'Bobby'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(b => b.id)
  expect(titles).not.toContain(blogToDelete.id)

})

test('a blog can be edited', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const update = {
    title: "I want to edit this title",
    likes: 169
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(update)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[0].likes).toBe(169)
  expect(blogsAtEnd[0].title).toEqual('I want to edit this title')
})

describe('when there is initially one user at db', () => {
  beforeAll(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salis', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('a user with a non-unique username cannot be added', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "root",
      name: "Ruut Ruut",
      password: "root123"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('a user with too short password cannot be added and a proper statuscode and error message is returned', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "mikko21",
      name: "Mikko Meikäläinen",
      password: "hi"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('a user with too short username cannot be added and a proper statuscode and error message is returned', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "an",
      name: "An Hietsa",
      password: "anhie"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})


afterAll(() => {
  mongoose.connection.close()
})