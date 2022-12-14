const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    "title": "This is my first blog",
    "author": "Harry",
    "url": "harrysblog.com",
    "likes": 1002
  },
  {
    "title": "This is my second blog",
    "author": "Jerry",
    "url": "jerrysblog.com",
    "likes": 425
  }
]

const initialUsers = [
  {
    "username": "robert1",
    "name": "Robert Hel",
    "password": "robbyboy1"
  },
  {
    "username": "bobby",
    "name": "bob wilkinson",
    "password": "bobi321"
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON)
}



module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb
}