// import setting from '../../setting.json'

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
// Cypress.Commands.add("login", (email, password) => { ... })
/*eslint-disable */
Cypress.Commands.add('login', type => {
	switch (type) {
		case 'admin':
			// cy.visit(setting.webLink)
			window.localStorage.setItem(
				'access-token',
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vbHVuY2hhcHAyLmRldi5pbyIsInN1YmplY3QiOiI0MGViNWMyMC05ZTQxLTExZTktOGRlZC1mNTQ2MmYzYTE0NDciLCJhdWRpZW5jZSI6ImFkbWluIiwiaWF0IjoxNTY1MTcwODQ2LCJleHAiOjE1Njc3NjI4NDZ9.1DPXO0u6ZzfOtvrUuIBfFnlNFcHRL4jsBec_f1InDTQ'
			)
			window.localStorage.setItem('user', 'admin')
			break
		default:
			break
	}
})
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
