import React from 'react'
// import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
// import wait from 'waait'
import Adapter from 'enzyme-adapter-react-16'
import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'
// import { addTypenameToDocument } from 'apollo-client'
import Order from '../index'
// import MENU_BY_SELECTED_SITE from '../lishDishesAndActions'

configure({ adapter: new Adapter() })

const MENU_BY_SELECTED_SITE = gql`
	query menuPublishBySite($siteId: String!) {
		menuPublishBySite(siteId: $siteId) {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
			isPublished
			isActive
			isLocked
			createAt
			updateAt
		}
	}
`

// const ORDER_DISH = gql`
// 	mutation orderDish($input: CreateOrderInput!) {
// 		orderDish(input: $input)
// 	}
// `

// const UPDATE_ORDER = gql`
// 	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
// 		updateOrder(id: $id, input: $input)
// 	}
// `

// const ORDERS_COUNT_BY_USER = gql`
// 	query ordersCountByUser($menuId: String!) {
// 		ordersCountByUser(menuId: $menuId) {
// 			menuId
// 			dishId
// 			count
// 		}
// 	}
// `

// const SUBSCRIPTION = gql`
// 	subscription {
// 		ordersByMenuCreated {
// 			menuId
// 			count
// 			_id
// 			dishId
// 		}
// 	}
// `

const ORDERS_BY_MENU = gql`
	query ordersByMenu($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
			_id
			userId
			menuId
			dishId
			note
			count
			isConfirmed
			createdAt
			updatedAt
		}
	}
`

// const CURRENT_ORDER = gql`
// 	query currentOrder($menuId: String!, $dishId: String!) {
// 		currentOrder(menuId: $menuId, dishId: $dishId) {
// 			_id
// 			userId
// 			menuId
// 			dishId
// 			note
// 			count
// 			isConfirmed
// 		}
// 	}
// `

//

test('Make Order', async () => {
	const mocks = [
		{
			request: {
				query: MENU_BY_SELECTED_SITE,
				variables: {
					// siteId: localStorage.getItem('currentsite')
					siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655'
				}
			},
			result: {
				data: {
					menuPublishBySite: {
						_id: '357f4ca0-a861-11e9-ba38-9f9f09ef187f',
						isActive: true,
						isLocked: false,
						isPublished: true,
						name: 'Menu Hoa Hồng 2/4/6',
						dishes: [
							{
								_id: '1b2cff60-a6c6-11e9-9c55-df503bf9987e',
								name: 'Ga Deli',
								count: 10
							},
							{
								_id: 'a500f6b0-a6c6-11e9-9c55-df503bf9987e',
								name: 'Ca Deli',
								count: 10
							},
							{
								_id: 'a976a050-a6c6-11e9-9c55-df503bf9987e',
								name: 'Tom Deli',
								count: 15
							}
						]
					}
				}
			}
		},
		{
			request: {
				query: ORDERS_BY_MENU,
				variables: {
					menuId: '357f4ca0-a861-11e9-ba38-9f9f09ef187f'
				}
			},
			result: {
				data: { ordersByMenu: { _id: '' } }
			}
		}
	]
	// console.log(mocks)
	const wrapper = mount(
		<MockedProvider mocks={mocks} addTypename={false}>
			<Order />
		</MockedProvider>
	)
	console.log(wrapper.debug())
	// await wait(0)
	// expect(wrapper.text()).toContain('357f4ca0-a861-11e9-ba38-9f9f09ef187f')
	expect(wrapper).toMatchSnapshot()
})
