import React, { useState } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import XLSX from 'xlsx'
import { Collapse, Button } from 'antd'
import UserList from './userList'

const { Panel } = Collapse

const MenuList = ({
	menuBySite,
	getOrdersByMenu,
	handleCloseMenu,
	handleLockMenu,
	me
}) => {
	const [isActive, changeActive] = useState(!menuBySite.isLocked)
	const handleChangeLockState = (e, menuId) => {
		changeActive(!isActive)
		handleLockMenu(e, menuId)
	}
	const exportFile = menu => {
		const dishes = []
		const counts = {}
		const orders = getOrdersByMenu.ordersByMenu
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
	return (
		<Collapse>
			<Panel
				header={menuBySite.name}
				showArrow={false}
				bordered
				key="1"
				disabled={!isActive}
				extra={
					<>
						<Button
							className="publish style-btn"
							onClick={e => handleChangeLockState(e, menuBySite._id)}
							icon={menuBySite.isLocked ? 'lock' : 'unlock'}
							type="link"
						/>
						<Button
							className={`publish style-btn ${isActive ? 'disable-button' : ''}`}
							disabled={isActive}
							onClick={e => handleCloseMenu(e, menuBySite._id)}
							icon="check"
							type="link"
						/>
						<Button
							className={`publish style-btn ${isActive ? 'disable-button' : ''}`}
							disabled={isActive}
							onClick={() => exportFile(menuBySite)}
							icon="file-excel"
							type="link"
						/>
					</>
				}
			>
				<Collapse defaultActiveKey="1">
					{menuBySite.dishes &&
						menuBySite.dishes.map(dish => {
							const users =
								getOrdersByMenu.ordersByMenu &&
								getOrdersByMenu.ordersByMenu.filter(
									order => order.dishId === dish._id
								)
							// console.log(users)
							return (
								<Panel
									showArrow={false}
									header={`${dish.name} x${dish.count}`}
									key={dish._id}
								>
									{users &&
										users.map(user => (
											<UserList
												key={user.userId}
												user={user}
												dishCount={dish.count}
												orderCountIn={user.count}
												orderId={getOrdersByMenu.ordersByMenu.filter(
													order => order.userId === user.userId
												)}
												dishId={dish._id}
												menuId={menuBySite._id}
											/>
										))}
								</Panel>
							)
						})}
				</Collapse>
			</Panel>
		</Collapse>
	)
}

const GET_ORDERS_BY_MENU = gql`
	query($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
			_id
			userId
			dishId
			menuId
			count
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
export default compose(
	graphql(GET_ORDERS_BY_MENU, {
		name: 'getOrdersByMenu',
		options: props => ({
			variables: {
				menuId: props.menuBySite._id
			}
		})
	}),
	graphql(ME, {
		name: 'me'
	})
)(MenuList)
