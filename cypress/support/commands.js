// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-iframe';

Cypress.Commands.add('Login', (email, password) => {
    cy.get('input[name="email"]').type(email)
    cy.get('fieldset').eq(1)
        .children('button[type="submit"]').click()
    cy.get('.chunk')
        .children('input[type="password"]').type(password)
    cy.get('fieldset').eq(1)
        .children('button[type="submit"]').click()

})

Cypress.Commands.add('Logout', () => {
    cy.get('.userIcon')
    .should('have.class', 'initials').first().click({force: true})
    cy.get('.logout').click({force: true})
})

Cypress.Commands.add('createSpace',(spaceName) => {
    cy.intercept({
        method: 'POST',
        url: '/v1/spaces',
      }).as('createSpace')
    cy.get('.chunk').children('#name').type(spaceName)
    cy.get('.actions').children('button[type="submit"]').click()
    cy.wait('@createSpace',).its('response.statusCode').should('eq', 402)
})

Cypress.Commands.add('createRsStudioProject',() => {
    cy.intercept({
        method: 'POST',
        url: '/v1/projects',
      }).as('createProject')

    cy.wait(100)
    cy.get('.withActionTitle').click();
    cy.wait(6000)
    cy.get('.popupMenu')
       .should('have.class','open')
       .children('.newRStudioProject').click()
    cy.get('#headerTitle').click()
    cy.wait('@createProject',).its('response.statusCode').should('eq', 201)
})

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
    // For more info on targeting inside iframes refer to this GitHub issue:
    // https://github.com/cypress-io/cypress/issues/136
    cy.log('Getting iframe body')
   
    return cy
      .wrap($iframe)
      .should(iframe => expect(iframe.contents().find('body')).to.exist)
      .then(iframe => cy.wrap(iframe.contents().find('body')))
      .within({}, callback)
  })