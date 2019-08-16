import React, { useState } from 'react'
import { Collapse, Button, Icon } from 'antd'
import gql from 'graphql-tag'
import XLSX from 'xlsx'
import { compose, graphql } from 'react-apollo'

import ListUser from './listUser'

import './index.css'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

const { Panel } = Collapse

function ListMenu(props) {
	const exportFile = (e, menu) => {
		e.stopPropagation()
		const dishes = []
		const { getOrderByMenu, me } = props

		const orders = getOrderByMenu.ordersByMenu

		const counts = {}

		orders.map(order => {
			if (Object.prototype.hasOwnProperty.call(counts, order.dishId)) {
				counts[order.dishId] += order.count
			} else {
				counts[order.dishId] = order.count
			}
			return counts[order.dishId]
		})

		menu.dishes.forEach(item =>
			dishes.push([item.name, '', '', '', '', counts[item._id] || 0])
		)

		// eslint-disable-next-line prefer-numeric-literals
		dishes.unshift(['Tên món ăn', '', '', '', '', 'Số lượng'])
		dishes.unshift([menu.name])
		dishes.push(['', '', '', '', 'Tổng'])
		dishes.push([new Date()])
		dishes.push(['', '', '', '', `Người gửi : ${me.fullName}`])

		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.aoa_to_sheet(dishes, {
			dateNF: 'HH:mm:ss DD-MM-YYYY'
		})

		if (!ws['!cols']) ws['!cols'] = []
		ws['!cols'][5] = { wch: 17 }

		const merge = [
			{
				s: { r: 0, c: 0 },
				e: { r: 0, c: 5 }
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
					c: 5
				}
			},
			{
				s: {
					r: dishes.length - 3,
					c: 0
				},
				e: {
					r: dishes.length - 3,
					c: 4
				}
			}
		]

		ws['!merges'] = merge
		ws['!formatRows'] = true
		ws[`F${dishes.length - 2}`] = {
			t: 'n',
			f: `SUM(F3:F${dishes.length - 3})` || 0
		}

		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
		XLSX.writeFile(wb, `${menu.name}.xlsx`, {
			bookType: 'xlsx',
			cellStyles: true
		})
	}

	const handlePlus = (e, dishId) => {
		e.stopPropagation()
		const { menuId, getOrderByMenu, orderDish, t, menu, me } = props

		const currentOrder = getOrderByMenu.ordersByMenu.filter(order => {
			return me._id === order.userId && dishId === order.dishId
		})

		if (currentOrder.length < 1) {
			currentOrder.push({
				dishId,
				menuId,
				count: 0
			})
		}

		const totalCount = menu.dishes.filter(dish => {
			return dish._id === dishId
		})[0].count

		const orders = getOrderByMenu.ordersByMenu

		const counts = {}

		orders.map(order => {
			if (Object.prototype.hasOwnProperty.call(counts, order.dishId)) {
				counts[order.dishId] += order.count
			} else {
				counts[order.dishId] = order.count
			}
			return counts[order.dishId]
		})

		if (!counts[dishId]) {
			counts[dishId] = 0
		}

		if (counts[dishId] < totalCount) {
			orderDish({
				mutation: ORDER_DISH,
				variables: {
					input: {
						menuId,
						dishId,
						count: currentOrder[0].count + 1
					}
				},
				refetchQueries: () => [
					{
						query: ORDER_BY_MENU,
						variables: {
							menuId
						}
					}
				]
			}).then(() => {
				openNotificationWithIcon(
					'success',
					'success',
					'Success',
					t('src.pages.common.success')
				)
			})
		}
	}

	const { menu, isLock, isActiveProps, getOrderByMenu, menuId, t } = props
	const [isActive, changeActive] = useState(false)

	return (
		<Collapse className="open-menu" defaultActiveKey={menu._id}>
			<Panel
				key={menu._id}
				header={
					<span style={{ width: '10em', display: 'inline-block' }}>
						{menu.name}
					</span>
				}
				disabled={!!menu.isLocked}
				extra={
					<>
						<Button
							className="publish style-btn lock-menu"
							onClick={e => {
								isLock(e, menu._id)
							}}
						>
							<Icon type={menu.isLocked ? 'lock' : 'unlock'} />
						</Button>

						<Button
							className="publish style-btn complete-menu"
							onClick={e => {
								isActiveProps(e, menu._id)
								changeActive(!isActive)
							}}
							disabled={!menu.isLocked || isActive}
						>
							<Icon type={!isActive ? 'check' : 'loading'} />
						</Button>

						<Button
							className="publish style-btn request-menu"
							onClick={e => exportFile(e, menu)}
							disabled={!menu.isLocked}
						>
							<Icon type="file-excel" />
						</Button>
					</>
				}
			>
				<Collapse className="open-dishes">
					{menu.dishes &&
						menu.dishes.map(dish => {
							return (
								<Panel
									key={dish._id}
									header={
										<span style={{ width: '10em', display: 'inline-block' }}>
											{dish.name} x{dish.count}
										</span>
									}
									extra={
										<Icon
											disabled
											type="plus"
											onClick={e => handlePlus(e, dish._id)}
										/>
									}
								>
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
													t={t}
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

const UPDATE_ORDER = gql`
	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
		updateOrder(id: $id, input: $input)
	}
`

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

export default compose(
	graphql(ORDER_BY_MENU, {
		name: 'getOrderByMenu',
		options: props => {
			return {
				variables: {
					menuId: props.menuId
				}
			}
		}
	}),
	graphql(UPDATE_ORDER, {
		name: 'updateOrder'
	}),
	graphql(ORDER_DISH, {
		name: 'orderDish'
	})
)(ListMenu)
