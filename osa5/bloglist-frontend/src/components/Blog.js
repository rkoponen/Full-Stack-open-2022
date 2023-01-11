import { useState } from "react"

const Blog = ({ blog, user, logged, handleDelete, handleLike }) => {

  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop:10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  /*
  const handleLike = async (blog) => {
    const newBlog = {
      user: user.id,
      title: blog.title,
      author: blog.author,
      likes: likes + 1,
      url: blog.url,
    }
    await blogService.update(blog.id, newBlog)
    setLikes(likes + 1)
  }
*/
  const delButton = () => {
    if (user.username === logged.username) {
      return (
        <div>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </div>
      )
    }
  }


  if (visible) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button id='hide' onClick={() => setVisible(!visible)}>hide</button>
        </div>
        <p>{blog.url}</p>
        <div>
          likes:
          {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <p>{user.name}</p>
        {delButton()}
      </div>
    )
  } else {
    return(
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button id='view'onClick={() => setVisible(!visible)}>view</button>
      </div>
    )
  }


}

export default Blog