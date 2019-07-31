// import React from 'react'
// import { configure, mount } from 'enzyme'
// import toJson from 'enzyme-to-json'
// import { MockedProvider } from 'react-apollo/test-utils'
// import gql from 'graphql-tag'
// import Adapter from 'enzyme-adapter-react-16'
// // import ConfirmButton from '../comfirmButton'

// configure({ adapter: new Adapter() })

// const CONFIRM_ORDER = gql`
// 	mutation confirmOrder($orderIds: [String]) {
// 		confirmOrder(orderIds: $orderIds)
// 	}
// `

// const ORDERS_BY_USER = gql`
// 	query ordersByUser($menuId: String!) {
// 		ordersByUser(menuId: $menuId) {
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

// const MENU_BY_SELECTED_SITE = gql`
// 	query menuPublishBySite($siteId: String!) {
// 		menuPublishBySite(siteId: $siteId) {
// 			_id
// 			name
// 			siteId
// 			dishes {
// 				_id
// 				name
// 				count
// 			}
// 			isPublished
// 			isActive
// 			isLocked
// 			createAt
// 			updateAt
// 		}
// 	}
// `

// describe('Confirm Button', () => {
// 	it('should render correctly', () => {
// 		const mocks = [
// 			{
// 				request: {
// 					query: MENU_BY_SELECTED_SITE,
// 					variables: {
// 						// siteId: localStorage.getItem('currentsite')
// 						siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655'
// 					}
// 				},
// 				result: {
// 					data: {
// 						menuPublishBySite: {
// 							_id: '357f4ca0-a861-11e9-ba38-9f9f09ef187f',
// 							isActive: true,
// 							isLocked: false,
// 							isPublished: true,
// 							name: 'Menu Hoa Hồng 2/4/6',
// 							dishes: [
// 								{
// 									_id: '1b2cff60-a6c6-11e9-9c55-df503bf9987e',
// 									name: 'Ga Deli',
// 									count: 10
// 								},
// 								{
// 									_id: 'a500f6b0-a6c6-11e9-9c55-df503bf9987e',
// 									name: 'Ca Deli',
// 									count: 10
// 								},
// 								{
// 									_id: 'a976a050-a6c6-11e9-9c55-df503bf9987e',
// 									name: 'Tom Deli',
// 									count: 15
// 								}
// 							]
// 						}
// 					}
// 				}
// 			},
// 			{
// 				request: {
// 					query: ORDERS_BY_USER,
// 					variables: {
// 						// siteId: localStorage.getItem('currentsite')
// 						siteId: 'fcfd3a00-a22e-11e9-9e72-bb7f31d38655'
// 					}
// 				},
// 				result: {
// 					data: {}
// 				}
// 			},
// 			{
// 				request: {
// 					muatation: CONFIRM_ORDER,
// 					variables: {
// 						orderIds: []
// 					}
// 				},
// 				result: {
// 					data: {}
// 				}
// 			}
// 		]

// 		expect(
// 			toJson(
// 				mount(
// 					<MockedProvider addTypename={false}>
// 						{/* <ConfirmButton /> */}
// 						<button
// 							onClick={() => mutate({ variables: { orderIds: 'abc' } })}
// 							id="confirm-order"
// 							type="submit"
// 							mocks={mocks}
// 						>
// 							Xác nhận
// 						</button>
// 					</MockedProvider>
// 				)
// 			)
// 		).toMatchSnapshot()
// 	})
// })
