const { add } = require('lodash')
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostLiked = Math.max(...blogs.map(x => x.likes))
  const blog = blogs.filter(blog => blog.likes === mostLiked)[0]
  return blog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}
  const blogCounts = _.countBy(blogs, "author")
  const maxNumber = Math.max(...Object.values(blogCounts))
  const name = Object.keys(blogCounts).filter(author => blogCounts[author] === maxNumber)[0]
  return {
    author: name,
    blogs: maxNumber
  }
}

const mostLikes = (blogs) => {
  const likes = new Map()
  for (let i = 0; i < blogs.length; i++) {
    if (likes.has(blogs[i].author)) {
      const totalLikes = likes.get(blogs[i].author)
      const addLikes = blogs[i].likes
      likes.set(blogs[i].author, totalLikes + addLikes)
    } else {
      likes.set(blogs[i].author, blogs[i].likes)
    }
  }
  const orderedLikes = [...likes].sort((a,b) => b[1] - a[1])
  return {
    author: orderedLikes[0][0],
    likes: orderedLikes[0][1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}