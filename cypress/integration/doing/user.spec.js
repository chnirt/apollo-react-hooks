import setting from '../../../setting.json'
/*eslint-disable */
const { randomText } = require('../common')
let pos = 0
const sites = ['Hoa Hồng', 'Sư Vạn Hạnh', 'Nha Trang']
const inputs = ['username', 'fullName']
const { wait, password } = setting

describe('Test user', () => {
	it('Visit page', () => {
		cy.visit('/')
		cy.wait(wait)
	})
	it('Create user', () => {
		cy.wait(wait)
		cy.login('admin')
		cy.visit('🥢/user')

		// create user
		cy.get('button.ant-btn.ant-btn-primary.ant-btn-block')
			.should('be.visible')
			.click()
		// cy.get('button#btn-create').should('be.visible').click()
		cy.wait(wait)
		inputs.forEach(input => {
			cy.get(`input#createUserForm_${input}`)
				.should('be.visible')
				.clear()
				.type(randomText(8))
		})
		cy.get('input#createUserForm_password')
			.should('be.visible')
			.clear()
			.type(password)
		cy.get('input#createUserForm_confirm')
			.should('be.visible')
			.clear()
			.type(password)
		sites.forEach((site, index) => {
			let choose = !index ? pos : (pos += 11)
			cy.get(
				'.ant-select-selection__rendered > .ant-select-selection__placeholder'
			)
				.eq(index)
				.click()
			cy.get('.ant-select-dropdown-menu-item')
				.eq(choose)
				.click()
			cy.get('.ant-select-dropdown-menu-item')
				.eq(choose + 1)
				.click()
			cy.get('input#createUserForm_password').click()
		})
		cy.get('.ant-modal-footer > div > .ant-btn-primary')
			.should('be.visible')
			.click()
		cy.wait(wait)
	})

	// edit user
	it('Edit user', () => {
		cy.wait(wait)
		cy.login('admin')

		cy.get('button[name=btnEditUser]')
			.eq(0)
			.should('be.visible')
			.click()
		cy.get('input#createUserForm_password')
			.should('be.visible')
			.clear()
			.type(password)
		cy.get('input#createUserForm_confirm')
			.should('be.visible')
			.clear()
			.type(password)
		cy.get(`input#createUserForm_fullName`)
			.should('be.visible')
			.clear()
			.type('Updated Name')
		cy.get('.ant-modal-footer > div > .ant-btn-primary')
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
	})

	// lock-delete user
	it('Lock-delete user', () => {
		cy.wait(wait)
		cy.login('admin')
		cy.get('button[name=btnLockNUnlockUser]')
			.eq(0)
			.click()
		cy.wait(wait * 2)
		cy.get('button[name=btnDeleteUser]')
			.eq(0)
			.click()
		cy.wait(wait)
		cy.get('.ant-modal-confirm-btns > .ant-btn-primary')
			.should('be.visible')
			.click()
	})
})
