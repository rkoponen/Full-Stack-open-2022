import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      notify('wrong username or password', 'alert')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleUsername = ({ target }) => {
    setUsername(target.value)
  }

  const handlePassword = ({ target }) => {
    setPassword(target.value)
  }

  const handleLike = async (blog) => {
    const newBlog = {
      name: blog.user.name,
      username: blog.user.username,
      url: blog.url,
      author: blog.author,
      likes: blog.likes + 1
    }
    await blogService.update(blog.id, newBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? b = { ...b, likes: b.likes + 1 } : b))
  }

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    const blog = await blogService.create(newBlog)
    if (blog) {
      notify(`a new blog ${blog.title} added by ${user.name}`)
      setBlogs(blogs.concat(newBlog))
    } else {
      notify(`addition of the blog failed`, 'alert')
    }
  }

  const deleteBlog = async (blog) => {
    const confirm = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirm) {
      const response = await blogService.deleteBlog(blog.id)
      console.log(response.data)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification}/>
        <LoginForm handleLogin={handleLogin}
          handleUsername={handleUsername}
          handlePassword={handlePassword}
          username={username}
          password={password}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      <div>{user.name} logged in
        <button type="button" onClick={handleLogout}>log out</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef} id='new-blog'>
        <CreateBlog handleNewBlog={addBlog}/>
      </Togglable>
      {(blogs.sort((a, b) => a.likes - b.likes ).map(blog =>
        <Blog key={blog.id} blog={blog} user={blog.user} logged={user} handleDelete={deleteBlog} handleLike={handleLike}/>
      ))}
    </div>
  )
}

export default App
