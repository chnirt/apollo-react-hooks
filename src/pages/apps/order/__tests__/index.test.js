import React from 'react'
// import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import wait from 'waait'
// import toJSON from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'
import Order from '../index'
// import MENU_BY_SELECTED_SITE
// 				ORDER_DISH
// 				UPDATE_ORDER
// 				ORDERS_COUNT_BY_USER
// 				ORDERS_BY_MENU
// 				CURRENT_ORDER from '../lishDishesAndActions'

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

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

const UPDATE_ORDER = gql`
	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
		updateOrder(id: $id, input: $input)
	}
`

const ORDERS_COUNT_BY_USER = gql`
	query ordersCountByUser($menuId: String!) {
		ordersCountByUser(menuId: $menuId) {
			menuId
			dishId
			count
		}
	}
`

const SUBSCRIPTION = gql`
	subscription {
		ordersByMenuCreated {
			menuId
			count
			_id
			dishId
		}
	}
`

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

const CURRENT_ORDER = gql`
	query currentOrder($menuId: String!, $dishId: String!) {
		currentOrder(menuId: $menuId, dishId: $dishId) {
			_id
			userId
			menuId
			dishId
			note
			count
			isConfirmed
		}
	}
`

it('Make Order', async () => {
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
						_id: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
						name: 'Menu Hoa Hồng 2/4/6',
						siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655',
						dishes: [
							{
								_id: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
								name: 'Heo Deli',
								count: 10
							},
							{
								_id: 'ebe8ab20-b1bd-11e9-8a03-4fee329edc02',
								name: 'Gà Deli',
								count: 10
							}
						],
						isPublished: true,
						isLocked: true,
						isActive: true,
						createAt: '1564381441843',
						updateAt: '1564452133012'
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
				data: {
					ordersByMenu: [
						{
							_id: 'e24426c0-b1cd-11e9-937f-c9208d81d848',
							userId: '40eb5c20-9e41-11e9-8ded-f5462f3a1447',
							menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
							dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
							note: 'khong canh',
							count: 1,
							isConfirmed: true,
							createdAt: '1564383343405',
							updatedAt: '1564383790024'
						},
						{
							_id: '06952dd0-b1ce-11e9-937f-c9208d81d848',
							userId: 'a4bb0cb0-a93a-11e9-be84-b1071be82caa',
							menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
							dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
							note: null,
							count: 1,
							isConfirmed: false,
							createdAt: '1564383404333',
							updatedAt: '1564383456555'
						}
					]
				}
			}
		},
		{
			request: {
				query: ORDERS_COUNT_BY_USER,
				variables: {
					menuId: '357f4ca0-a861-11e9-ba38-9f9f09ef187f'
				}
			},
			result: {
				data: {
					ordersByMenu: [
						{
							menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
							dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
							count: 1
						}
					]
				}
			}
		},
		{
			request: {
				query: CURRENT_ORDER,
				variables: {
					menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
					dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02'
				}
			},
			result: {
				data: {
					currentOrder: {
						_id: 'e24426c0-b1cd-11e9-937f-c9208d81d848',
						userId: '40eb5c20-9e41-11e9-8ded-f5462f3a1447',
						menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
						dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
						note: 'khong canh',
						count: 1,
						isConfirmed: true
					}
				}
			}
		},
		{
			request: {
				query: ORDER_DISH,
				variables: {
					input: {
						menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
						dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
						count: 1
					}
				}
			}
		},
		{
			request: {
				query: UPDATE_ORDER,
				variables: {
					input: {
						note: 'admin khong hanh',
						menuId: '74d8d120-b1c9-11e9-9655-bbbbd1bf3765',
						dishId: '1b1ef620-b1bd-11e9-8a03-4fee329edc02',
						count: 2
					}
				}
			}
		},
		{
			request: {
				query: SUBSCRIPTION
			}
		}
	]
	const wrapper = mount(
		<MockedProvider mocks={mocks} addTypename={false}>
			<Order />
		</MockedProvider>
	)
	// console.log(wrapper.debug())
	await wait()
	// console.log(mocks)
	expect(wrapper).toMatchSnapshot()
	// expect(toJSON(wrapper.find('header'))).toMatchSnapshot()
	// expect(wrapper.find('ListDishes')).toHaveLength(1)
})
