import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog/>', () => {
  
  const blog = {
    title: "Hyvää joulua",
    author: "Joulupukki",
    url: "joulumaa.fi",
    user: "6399acab7b5a17dccac68943"
  }

  const newUser = {
      username: "jukkis",
      name: "Jukka Kukka",
  }

  const logged = {
      username: "jukkis",
      name: "Jukka Kukka"
  }

  test('renders only necessary content', () => {
      const blog = {
          title: "Hyvää joulua",
          author: "Joulupukki",
          url: "joulumaa.fi"
      }

      render(<Blog blog={blog} />)

      const element = screen.getByText('Hyvää joulua Joulupukki')
      const url = screen.queryByText('joulumaa.fi')

      expect(url).toBeNull

      expect(element).toBeDefined()
  })

  test('renders all content when button is pressed', async () => {


      render(
          <Blog blog={blog} user={newUser} logged={logged}/>
      )

      const user = userEvent.setup()
      const button = screen.getByText('view')
      await user.click(button)

      const titleAndName = screen.getByText('Hyvää joulua Joulupukki')
      const url = screen.getByText('joulumaa.fi')
      const username = screen.getByText('Jukka Kukka')

      expect(titleAndName).toBeDefined()
      expect(url).toBeDefined()
      expect(username).toBeDefined()
  })

  test('event handler is called two times when pressing the like button two times', async () => {
    const blog = {
      title: "Hyvää joulua",
      author: "Joulupukki",
      url: "joulumaa.fi",
      user: "6399acab7b5a17dccac68943"
    }

    

    const mockHandler = jest.fn()
    render(<Blog blog={blog} user={newUser} logged={logged} handleLike={mockHandler}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)



    
  })
  
})