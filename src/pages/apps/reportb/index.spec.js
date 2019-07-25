import React from 'react'
import gql from 'graphql-tag'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
// import shallow from 'enzyme'
import ReportB from './index'

// eslint-disable-next-line no-undef
it('reportb correctly', () => {
	const GET_MENU_BY_SITE = gql`
		query($siteId: String!) {
			menusBySite(siteId: $siteId) {
				_id
				name
				isActive
				isLocked
				dishes {
					name
					count
					_id
				}
			}
		}
	`
	const mocks = [
		{
			request: {
				query: GET_MENU_BY_SITE,
				variables: {
					siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655'
				}
			},
			result: {
				data: {
					getMenuBySite: {
						menusBySite: [
							{
								dishes: [
									{
										count: 10,
										name: 'Ga Deli',
										_id: '1b2cff60-a6c6-11e9-9c55-df503bf9987e'
									}
								],
								isActive: true,
								isLocked: false,
								name: 'Menu Deli 2/4/6',
								_id: '357f4ca0-a861-11e9-ba38-9f9f09ef187f'
							}
						]
					}
				}
			}
		}
	]
	const reportb = renderer
		.create(
			<MockedProvider mocks={mocks} addTypename={false}>
				<ReportB />
			</MockedProvider>
		)
		.toJSON()
	// eslint-disable-next-line no-undef
	expect(reportb).toMatchSnapshot()
})
