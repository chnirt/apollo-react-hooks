import setting from '../../../setting.json'
/*eslint-disable */
const { admin, password, wait } = setting

describe('Test login page', () => {
	it('login', () => {
		cy.visit('/')
		cy.wait(wait * 2)
		cy.get('input#normal_login_username')
			.should('be.visible')
			.clear()
			.type(admin)
		cy.get('input#normal_login_password')
			.should('be.visible')
			.clear()
			.type(password)
		cy.get('button.login-form-button')
			.should('be.visible')
			.click()
		cy.wait(wait)
	})
})
