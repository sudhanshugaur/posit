const { beforeEach } = require("mocha")

describe('Sample Test cases for RSpec.', () => {

  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl'))
    cy.get('.menuItems').children().first().click()
    cy.Login(Cypress.env('loginId'),Cypress.env('password'))
  })

  afterEach(() => {
    cy.Logout()
  })

  it('TRying to create a new space - Negative test case', () => {
    cy.wait(100)
    cy.get('#spaceOwner').click()
    cy.get('.newSpace').click()
    cy.createSpace('New space name')
  })

  it('Create RS studio project test case', () => {
  cy.intercept({
      method: 'GET',
      url: '/v1/tasks/**',
  }).as('newTasks')
  cy.createRsStudioProject()
  cy.wait('@newTasks')
  cy.wait(2000)
  cy.visit(Cypress.env('contentURL'))
  cy.wait(2000)
  cy.get(".dontBreak").invoke('text').should('not.be.empty')
  cy.get(".dontBreak").contains('1')
  
})

it('RStudio IDE loads', () => {
  cy.intercept({
      method: 'GET',
      url: '*/rstudio.nocache.js',
  }).as('loads')

  cy.intercept({
      method: 'GET',
      url: '/v1/tasks/**',
  }).as('newTasks')

  cy.createRsStudioProject()
  cy.wait('@newTasks')
  cy.wait(20000)
  cy.wait('@loads',).its('response.statusCode').should('eq', 200)
  cy.wait(10000) 
  cy.get('iframe').iframe(() => {
  // Make sure the existance of "File" menu on the IDE.
  cy.get('#rstudio_label_file_menu').should('have.text', 'File')
  })
  
  })

})