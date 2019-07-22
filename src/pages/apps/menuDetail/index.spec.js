import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
import { BrowserRouter, withRouter } from 'react-router-dom'
import MenuDetail from './index'

// eslint-disable-next-line no-undef
it('menu detail correctly', () => {
	const MenuDetails = withRouter(MenuDetail)
	const menu = renderer
		.create(
			<MockedProvider mocks={[]}>
				<BrowserRouter>
					<MenuDetails />
				</BrowserRouter>
			</MockedProvider>
		)
		.toJSON()
	// eslint-disable-next-line no-undef
	expect(menu).toMatchSnapshot()
})
