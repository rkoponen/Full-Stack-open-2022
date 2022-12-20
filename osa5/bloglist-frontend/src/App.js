import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

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

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addBlog = async (newBlog) => {
    const blog = await blogService.create(newBlog)
    if (blog) {
      notify(`a new blog ${blogs[blogs.length - 1].title} added by ${user.name}`)
    } else {
      notify(`addition of the blog failed`, 'alert')
    }
    setBlogs(blogs.concat(blog))
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
      <CreateBlog addBlog={addBlog}></CreateBlog>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
