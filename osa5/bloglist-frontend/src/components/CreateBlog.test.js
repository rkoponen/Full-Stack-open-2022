import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

describe('<CreateBlog/>', () => {

    test('form calls the callback func with right parameters', () => {
      const mockHandler = jest.fn()


      render(<CreateBlog handleNewBlog={mockHandler} />)
      const titleInput = screen.getByPlaceholderText('title')
      const authorInput = screen.getByPlaceholderText('author')
      const urlInput = screen.getByPlaceholderText('url')

      const createButton = screen.getByText('create')
      
      userEvent.type(titleInput, 'testing title')
      userEvent.type(authorInput, 'testing author')
      userEvent.type(urlInput, 'testing url')
      screen.debug()

      userEvent.click(createButton)
      
      expect(mockHandler.calls).toHaveLength(1)
      expect(mockHandler.mock.calls[0][0].content).toBe('testing title')
      expect(mockHandler.mock.calls[0][1].content).toBe('testing author')
      expect(mockHandler.mock.calls[0][2].content).toBe('testing url')
    })
      
    
})