describe('Profile', () => {
  it('Editar Perfil', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.contains('testecypress').click()
    cy.contains('Edit Profile Settings').click()
    cy.get('[formcontrolname="image"]').clear()
    cy.get('[formcontrolname="image"]')
      .type('https://thispersondoesnotexist.com/image')
    cy.get('[formcontrolname="password"]').type('testecypress')
    cy.contains('Update Settings').click()
  })

  it('Dados Invalidos', () => {
    cy.login('usuario@inexistente.com', 'senhaerrada')
    cy.get('.error-messages > li')
      .should('contais', 'email or password is invalid')
  })
})
