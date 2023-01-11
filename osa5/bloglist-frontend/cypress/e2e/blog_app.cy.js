
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Timo Mimonen',
      username: 'bloggaaja42',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.contains('password')
    cy.contains('username')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('bloggaaja42')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
      
      cy.contains('Timo Mimonen logged in')

    })
    
    it('fails with wrong credentials', function() {
      cy.get('#username').type('bloggaaja43')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {

    beforeEach(function() {
      cy.login({ username: 'bloggaaja42', password: 'secret'})
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Hello everyone')
      cy.get('#author').type('Timo')
      cy.get('#url').type('timonblog.com')
      cy.get('#create').click()

      cy.contains('Hello everyone')
      
    })

    describe('and several posts exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Mitäs keskiviikkona', author: 'Timo', url: 'timonblog.com', likes: 13 })
        cy.createBlog({ title: 'Mitäs torstaina', author: 'Timo', url: 'timonblog.com', likes: 21 })
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('14')
      })

      it('A blog can be removed', function() {
        cy.contains('view').click()
        cy.contains('remove').parent().find('button').as('removeButton')
        cy.get('@removeButton').click()
        cy.get('html').should('not.contain', 'Mitäs keskiviikkona')
      })
    })


  })

})