import React from 'react'
import { Collapse, Button } from 'antd'
import gql from 'graphql-tag'
import XLSX from 'xlsx'
import ListUser from './listUser'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

import './index.css'

const { Panel } = Collapse

class listMenu extends React.Component {
	state = {
		isActive: false
	}

	changeActive = () => {
		this.setState(prevState => ({ isActive: !prevState.isActive }))
	}

	export(menu) {
		const dishes = []
		const { getOrderByMenu } = this.props

		menu.dishes.forEach(item => dishes.push([item.name, '', '']))

		getOrderByMenu.ordersByMenu.forEach((order, i) =>
			dishes[i].push(order.count)
		)
		dishes.unshift(['Tên món ăn', '', '', 'Số lượng'])

		// console.log(dishes)

		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.aoa_to_sheet(dishes)

		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
		XLSX.writeFile(wb, `${menu.name}.xlsx`, { bookType: 'xlsx' })
	}

	render() {
		const { menu, isLock, isActiveProps, getOrderByMenu, menuId } = this.props
		const { isActive } = this.state

		return (
			<Collapse onChange={this.changeActive}>
				<Panel
					extra={
						<>
							<Button
								className="publish style-btn"
								onClick={e => isLock(e, menu._id)}
							>
								{menu.isLocked ? 'Unlock' : 'Lock'}
							</Button>

							<Button
								className="publish style-btn"
								onClick={e => isActiveProps(e, menu._id)}
							>
								Complete
							</Button>

							<Button
								className="style-btn"
								onClick={() => this.export(menu)}
								variant="raised"
								color="secondary"
								disabled={!isActive}
							>
								Request
							</Button>
						</>
					}
					header={menu.name}
					key="1"
					disabled={!!menu.isLocked}
				>
					<Collapse>
						{menu.dishes &&
							menu.dishes.map(dish => {
								// console.log(dish)
								return (
									<Panel header={`${dish.name} x${dish.count}`} key={dish._id}>
										{getOrderByMenu.ordersByMenu &&
											getOrderByMenu.ordersByMenu.map(orderByMenu => {
												return (
													<ListUser
														dishCount={dish.count}
														menuId={menuId}
														orderByMenu={orderByMenu}
														key={orderByMenu._id}
														userId={orderByMenu.userId}
														countProps={orderByMenu.count}
														dishId={dish._id}
													/>
												)
											})}
									</Panel>
								)
							})}
					</Collapse>
				</Panel>
			</Collapse>
		)
	}
}

const GET_MENU_BY_SITE = gql`
	query menusBySite($siteId: String!) {
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

const LOCK_AND_UNLOCK_MENU = gql`
	mutation lockAndUnlockMenu($id: String!) {
		lockAndUnlockMenu(id: $id)
	}
`

const CLOSE_MENU = gql`
	mutation closeMenu($id: String!) {
		closeMenu(id: $id)
	}
`

const ORDER_BY_MENU = gql`
	query ordersByMenu($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
			userId
			dishId
			count
			_id
		}
	}
`

const GET_USER_NAME = gql`
	query user($_id: String!) {
		user(_id: $_id) {
			username
			fullName
		}
	}
`

export default HOCQueryMutation([
	{
		query: GET_MENU_BY_SITE,
		name: 'getMenuBySite',
		options: () => {
			return {
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			}
		}
	},
	{
		query: ORDER_BY_MENU,
		name: 'getOrderByMenu',
		options: props => {
			return {
				variables: {
					menuId: props.menuId
				}
			}
		}
	},
	{
		query: GET_USER_NAME,
		name: 'getUserName',
		options: () => {
			return {
				variables: {
					_id: '40eb5c20-9e41-11e9-8ded-f5462f3a1447'
				}
			}
		}
	},
	{
		mutation: LOCK_AND_UNLOCK_MENU,
		name: 'lockAndUnLockMenu',
		option: {}
	},
	{
		mutation: CLOSE_MENU,
		name: 'closeMenu',
		option: {}
	}
])(listMenu)
