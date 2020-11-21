describe('Tags', () => {
  it('Adicionar', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.contains('testecypress').click()
    cy.location('pathname').should('contains', '/profile')
    cy.get('.article-preview').get('h1').first().click()
    cy.contains('Edit Article').click()
    cy.get('[formcontrolname="Enter tags"]').type('dungeons{enter}')
    cy.get('[formcontrolname="Enter tags"]').type('dragons{enter}')
    cy.contains('Published Article').click()
    cy.get('.tag-list').contains('dragons')
  })
})
