import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
import Order from '../index'

it('make order', () => {
	const order = renderer
		.create(
			<MockedProvider mocks={[]}>
				<Order />
			</MockedProvider>
		)
		.toJSON()
	expect(order).toMatchSnapshot()
})
