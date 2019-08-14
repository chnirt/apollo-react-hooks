import setting from '../../../setting.json'

const { wait } = setting

it('Report', () => {
	cy.visit('http://lunch4test.digihcs.com')
	cy.wait(wait)
	cy.get('input#normal_login_username')
		.should('be.visible')
		.clear()
		.type('admin')
	cy.get('input#normal_login_password')
		.should('be.visible')
		.clear()
		.type('12345678')
	cy.get('button.login-form-button')
		.should('be.visible')
		.click()
	cy.wait(wait)
	cy.get('div#report').click({ force: true })
	cy.wait(wait * 3)
	cy.get('body').then(body => {
		cy.wait(wait)
		// if (body.find('#report').text(null)) {
		//   return
		// }
		if (body.find('.ant-collapse-item.ant-collapse-item-disabled').length > 0) {
			cy.wait(wait)
			cy.get('.lock-menu').click()
			cy.wait(wait * 3)
		}
	})

	// // cy.get('body').then(body => {
	// // 	if (body.find('.ant-collapse-item.ant-collapse-item-disabled').length > 0) {
	// // 		cy.get('.lock-menu').click()
	// // 		cy.wait(wait * 3)
	// // 	}
	// // })

	cy.get('.open-menu').click()
	cy.wait(wait * 3)
	cy.get('.open-dishes > .ant-collapse-item')
		.eq(0)
		.click()
	cy.wait(wait * 2)
	cy.get('button[name=add]')
		.eq(0)
		.click()
	cy.wait(wait * 3)
	cy.get('button[name=minus]')
		.eq(0)
		.click()
	cy.wait(wait * 3)
	// cy.get('.lock-menu').click()
	// cy.wait(wait * 3)
	// cy.get('.request-menu').click()
	// cy.wait(wait * 3)
	// // cy.get('.complete-menu').click()
	// // cy.wait(wait * 3)
	// cy.get('.lock-menu').click()
})
