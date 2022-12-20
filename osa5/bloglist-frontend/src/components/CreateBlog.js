import { useState } from 'react'

const CreateBlog = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    addBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
    
  }

  return (  
    <div>
      <h1>create new</h1>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input 
            type="text" 
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlog