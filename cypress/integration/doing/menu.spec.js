import setting from '../../../setting.json'
/*eslint-disable */

const { wait } = setting

describe('Test menu', () => {
	it('Visit page', () => {
		cy.visit('/')
		cy.wait(wait)
		cy.login('admin')
		cy.visit('🥢/menu')
		cy.wait(wait)
	})
	// add menu
	it('Add menu', () => {
		cy.login('admin')
		cy.get('button[name="addNewMenu"]')
			.eq(0)
			.should('be.visible')
			.click()
		cy.wait(wait)

		cy.get('input#name')
			.should('be.visible')
			.clear()
			.type('menu 2')
		cy.get('button[name="addMenu"]')
			.eq(0)
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
	})

	// delete menu
	it('Delete menu', () => {
		cy.login('admin')
		cy.visit('🥢/menu')
		cy.wait(wait * 2)
		cy.get('button[name="btnDeleteMenu"]')
			.eq(0)
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
		cy.get('div.ant-modal-confirm-body-wrapper button.ant-btn.ant-btn-primary')
			.should('be.visible')
			.click()
		cy.wait(wait * 3)
	})

	// edit menu
	it('Edit menu', () => {
		cy.login('admin')
		cy.get('button[name="btnEditMenu"]')
			.eq(0)
			.should('be.visible')
			.click()
		cy.wait(wait * 3)
	})

	// edit name menu
	it('Edit menu name', () => {
		cy.login('admin')
		cy.get('div.ant-typography-edit')
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
		cy.get('div.ant-typography-edit-content > textarea')
			.should('be.visible')
			.clear()
			.type('Menu 2/4/6 test')
			.blur()
		cy.wait(wait * 3)
	})

	// add dish
	it('Add dish', () => {
		cy.login('admin')
		cy.get('div#shop')
			.should('be.visible')
			.click()
		cy.wait(wait)
		cy.get('.ant-select-dropdown-menu-item')
			.eq(0)
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
		cy.get('button[name="btnAddDish"]')
			.should('be.visible')
			.click()
		cy.get('input#name')
			.should('be.visible')
			.clear()
			.type('Mon an 1')
		cy.wait(wait)
		cy.get('button[name="addDish"]')
			.should('be.visible')
			.click()
		cy.wait(wait * 3)
	})

	// delete dish
	it('Delete dish', () => {
		cy.login('admin')
		cy.get('li.ant-pagination-next')
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
		cy.get('i.anticon.anticon-delete')
			.last()
			.click()
		cy.wait(wait * 2)
		cy.get('div.ant-modal-confirm-btns button.ant-btn.ant-btn-primary')
			.should('be.visible')
			.click()
		cy.wait(wait * 3)
	})

	// update menu
	it('Update menu', () => {
		cy.login('admin')
		cy.get('li.ant-pagination-item.ant-pagination-item-1')
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
		for (let i = 0; i < 4; i++) {
			cy.get('input.ant-input-number-input')
				.eq(i)
				.should('be.visible')
				.clear()
				.type('10')
		}
		cy.wait(wait)
		cy.get('button[name="btnSaveMenu"]')
			.should('be.visible')
			.click()
		cy.wait(wait * 2)
		cy.get('button[name="btnPublishMenu"]')
			.should('be.visible')
			.click()
		cy.wait(wait * 3)
	})
})
