import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
import Menu from './index'

// eslint-disable-next-line no-undef
it('menu correctly', () => {
	const menu = renderer
		.create(
			<MockedProvider mocks={[]}>
				<Menu />
			</MockedProvider>
		)
		.toJSON()
	// eslint-disable-next-line no-undef
	expect(menu).toMatchSnapshot()
})
