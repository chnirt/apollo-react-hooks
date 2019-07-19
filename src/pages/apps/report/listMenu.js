import React from 'react'
import { Collapse, Button, Icon, Tooltip } from 'antd'
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
		const { getOrderByMenu, me } = this.props

		const orders = getOrderByMenu.ordersByMenu

		const counts = {}

		orders.map(order => {
			if (Object.prototype.hasOwnProperty.call(counts, order.dishId)) {
				counts[order.dishId] += order.count
			} else {
				counts[order.dishId] = order.count
			}
			return counts[order.dishId]
			// console.log(order.dishId)
		})

		// console.log(counts)

		menu.dishes.forEach(item =>
			dishes.push([item.name, '', '', counts[item._id] || 0])
		)

		dishes.unshift(['Tên món ăn', '', '', 'Số lượng'])
		dishes.unshift([menu.name])
		dishes.push(['Tổng'])
		dishes.push([new Date()])
		dishes.push(['', '', `Người gửi : ${me.me.fullName}`])

		// console.log(dishes)

		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.aoa_to_sheet(dishes, {
			dateNF: 'HH:mm:ss DD-MM-YYYY'
		})

		if (!ws['!cols']) ws['!cols'] = []
		ws['!cols'][5] = { wch: 17 }

		const merge = [
			{
				s: { r: 0, c: 0 },
				e: { r: 0, c: 3 }
			},
			{
				s: {
					r: dishes.length - 1,
					c: 2
				},
				e: {
					r: dishes.length - 1,
					c: 3
				}
			},
			{
				s: {
					r: dishes.length - 2,
					c: 0
				},
				e: {
					r: dishes.length - 2,
					c: 3
				}
			},
			{
				s: {
					r: dishes.length - 3,
					c: 0
				},
				e: {
					r: dishes.length - 3,
					c: 2
				}
			}
		]

		ws['!merges'] = merge
		ws['!formatRows'] = true
		ws.D7 = { t: 'n', f: `SUM(D3:D${dishes.length - 3})` || 0 }

		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
		XLSX.writeFile(wb, `${menu.name}.xlsx`, {
			bookType: 'xlsx',
			cellStyles: true
		})
	}

	render() {
		const { menu, isLock, isActiveProps, getOrderByMenu, menuId } = this.props
		const { isActive } = this.state
		return (
			<Collapse onChange={this.changeActive}>
				<Panel
					extra={
						<>
							<Tooltip title={menu.isLocked ? 'Unlock menu' : 'Lock menu'}>
								<Button
									className="publish style-btn"
									onClick={e => isLock(e, menu._id)}
								>
									<Icon type={menu.isLocked ? 'lock' : 'unlock'} />
								</Button>
							</Tooltip>

							<Tooltip title="Complete menu">
								<Button
									className="publish style-btn"
									onClick={e => isActiveProps(e, menu._id)}
								>
									<Icon type="check" />
								</Button>
							</Tooltip>

							<Tooltip title="Complete menu">
								<Button
									className="publish style-btn"
									onClick={() => this.export(menu)}
									disabled={!isActive}
								>
									<Icon type="file-excel" />
								</Button>
							</Tooltip>
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
														orderId={orderByMenu._id}
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

const ME = gql`
	query {
		me {
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
		query: ME,
		name: 'me'
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
