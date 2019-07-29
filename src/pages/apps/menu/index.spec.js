import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'
import Menu from './index'

// eslint-disable-next-line no-undef
it('menu correctly', () => {
	const GET_MENUS_BY_SITE = gql`
		query($siteId: String!) {
			menusBySite(siteId: $siteId) {
				_id
				name
			}
		}
	`
	const mocks = [
		{
			request: {
				query: GET_MENUS_BY_SITE,
				variables: { siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655' }
			},
			result: {
				data: {
					menusBySite: [
						{
							_id: '357f4ca0-a861-11e9-ba38-9f9f09ef187f',
							name: 'Menu Deli 2/4/6'
						},
						{
							_id: '2f7c7b70-add4-11e9-bf32-7f74609da087',
							name: 'Menu Deli HH 3/5/7'
						},
						{
							_id: '1c001ec0-add5-11e9-bf32-7f74609da087',
							name: 'Menu Deli 2/4/6'
						}
					]
				}
			}
		}
	]
	const menu = renderer
		.create(
			<MockedProvider addTypename={false} mocks={mocks}>
				<Menu />
			</MockedProvider>
		)
		.toJSON()
	// eslint-disable-next-line no-undef
	expect(menu).toMatchSnapshot()
})
