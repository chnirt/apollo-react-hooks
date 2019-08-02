import React from 'react'
import renderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'
import Menu from './index'
import i18n from '../../../tools/i18n'

// eslint-disable-next-line no-undef
it('menu correctly', () => {
	const GET_MENUS_BY_SITE = gql`
		query($siteId: String!) {
			menusBySite(siteId: $siteId) {
				_id
				name
				isPublished
			}
		}
	`
	const mocks = [
		{
			request: {
				query: GET_MENUS_BY_SITE,
				variables: {
					siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655'
				}
			},
			result: {
				data: {
					menusBySite: [
						{
							_id: '956fb000-b432-11e9-b65c-637a7533e809',
							name: 'Sư Vạn Hạnh Test close button',
							isPublished: false
						},
						{
							_id: 'd29d8f70-b369-11e9-bfb3-87c4d28033b8',
							name: 'Menu Hoa Hồng 2/4/6',
							isPublished: false
						},
						{
							_id: 'b3658490-b432-11e9-b65c-637a7533e809',
							name: 'Hoa Hồng Grab Food các ngày 03, 11, 15, 19, 21, 25, 29',
							isPublished: true
						}
					]
				}
			}
		}
	]
	const menu = renderer
		.create(
			<MockedProvider mocks={mocks} addTypename={false}>
				<I18nextProvider i18n={i18n}>
					<Menu />
				</I18nextProvider>
			</MockedProvider>
		)
		.toJSON()
	// eslint-disable-next-line no-undef
	expect(menu).toMatchSnapshot()
})
