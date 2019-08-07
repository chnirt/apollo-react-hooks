import setting from '../../../setting.json'
/*eslint-disable */
// const randomNumber = (max = 100000, min = 0) =>
//   Math.floor(Math.random() * (max - min + 1) + min)
const randomText = (length = 5) => {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * 62)]
	}
	return result
}
let pos = 0
const sites = ['Hoa Hồng', 'Sư Vạn Hạnh', 'Nha Trang']
const inputs = ['username', 'fullName']
const { viewportWidth, viewportHeight, webLink, admin, password, wait } = setting

describe('Test inputs user', () => {
	it('user', () => {
		/*eslint-disable */
		cy.viewport(viewportWidth, viewportHeight)
		cy.visit(webLink)

		cy.wait(wait * 2)
		cy.login('admin')
		// cy.get('input#normal_login_username')
		// 	.should('be.visible')
		// 	.clear()
		// 	.type(admin)
		// cy.get('input#normal_login_password')
		// 	.should('be.visible')
		// 	.clear()
		// 	.type(password)
		cy.get('button.login-form-button')
			.should('be.visible')
			.click()
		cy.wait(wait)
		cy.get('div#manage-user')
			.should('be.visible')
			.click()

		cy.visit(`${webLink}/🥢/user`)

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
		cy.wait(wait * 2)

		// edit user
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

		// // lock-delete user
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
		cy.wait(wait * 3)
	})
})
