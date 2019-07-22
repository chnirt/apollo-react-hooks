import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
import Login from './index'
import store from '../../tools/mobx'

/* eslint-disable */
describe('Login component', () => {
	it('matches the snapshot', () => {
		const tree = renderer
			.create(
				<MockedProvider mocks={[]}>
					<Login store={store} />
				</MockedProvider>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
