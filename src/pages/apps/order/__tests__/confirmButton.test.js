import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import ConfirmButton from '../comfirmButton'

describe('Confirm Button', () => {
	it('should render correctly', () => {
		expect(
			toJson(
				mount(
					<MockedProvider addTypename={false}>
						<ConfirmButton />
					</MockedProvider>
				)
			)
		).toMatchSnapshot()
	})
})
