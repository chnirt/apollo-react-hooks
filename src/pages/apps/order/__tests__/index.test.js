import React from 'react'
// import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'
// import { addTypenameToDocument } from 'apollo-client'
import Order from '../index'
// import MENU_BY_SELECTED_SITE from '../lishDishesAndActions'

configure({ adapter: new Adapter() })

it('make order', async () => {
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

	// const ORDERS_BY_MENU = gql`
	// 	query ordersByMenu($menuId: String!) {
	// 		ordersByMenu(menuId: $menuId) {
	// 			_id
	// 			userId
	// 			menuId
	// 			dishId
	// 			note
	// 			count
	// 			isConfirmed
	// 			createdAt
	// 			updatedAt
	// 		}
	// 	}
	// `

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

	const mocks = [
		{
			request: {
				query: MENU_BY_SELECTED_SITE,
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			}
			// result: { data: { menuPublishBySite:
			//   { _id: '357f4ca0-a861-11e9-ba38-9f9f09ef187f' }
			// }}
		}
		// {
		// 	request: {
		//     query: ORDERS_COUNT_BY_USER,
		//     variables: {
		// 			siteId: localStorage.getItem('currentsite')
		// 		},
		//   },
		//   result: { data: { menuPublishBySite:
		//     { _id: '357f4ca0-a861-11e9-ba38-9f9f09ef187f' }
		// 	}}
		// }
	]

	// console.log(mocks)

	// const routerParams = { params: {userId: '1'}}

	const wrapper = mount(
		<MockedProvider mocks={mocks} addTypename={false}>
			<Order />
		</MockedProvider>
	)
	await new Promise(resolve => setTimeout(resolve))
	// console.log( wrapper.debug() )
	// const title = wrapper.find('#title').getDOMNode()
	// title.value = '1'
	// wrapper.update()
	expect(wrapper).toMatchSnapshot()
})
