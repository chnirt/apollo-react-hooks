import React, { useState } from 'react'
import { Collapse, Button, Icon, Tooltip } from 'antd'
import gql from 'graphql-tag'
// import XLSX from 'xlsx'
import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'

import ListUser from '../listUser'
// import { HOCQueryMutation } from '../../components/shared/hocQueryAndMutation'

import '../index.css'

const { Panel } = Collapse

function ListMenu(props) {
	// changeActive = () => {
	// 	this.setState(prevState => ({ isActive: !prevState.isActive }))
	// }

	// export(e, menu) {
	// 	e.stopPropagation()
	// 	const dishes = []
	// 	const { getOrderByMenu, me } = this.props

	// 	const orders = getOrderByMenu.ordersByMenu

	// 	const counts = {}

	// 	orders.map(order => {
	// 		if (Object.prototype.hasOwnProperty.call(counts, order.dishId)) {
	// 			counts[order.dishId] += order.count
	// 		} else {
	// 			counts[order.dishId] = order.count
	// 		}
	// 		return counts[order.dishId]
	// 		// console.log(order.dishId)
	// 	})

	// 	// console.log(counts)

	// 	menu.dishes.forEach(item =>
	// 		dishes.push([item.name, '', '', counts[item._id] || 0])
	// 	)

	// 	dishes.unshift(['Tên món ăn', '', '', 'Số lượng'])
	// 	dishes.unshift([menu.name])
	// 	dishes.push(['Tổng'])
	// 	dishes.push([new Date()])
	// 	dishes.push(['', '', `Người gửi : ${me.me.fullName}`])

	// 	// console.log(dishes)

	// 	const wb = XLSX.utils.book_new()
	// 	const ws = XLSX.utils.aoa_to_sheet(dishes, {
	// 		dateNF: 'HH:mm:ss DD-MM-YYYY'
	// 	})

	// 	if (!ws['!cols']) ws['!cols'] = []
	// 	ws['!cols'][5] = { wch: 17 }

	// 	const merge = [
	// 		{
	// 			s: { r: 0, c: 0 },
	// 			e: { r: 0, c: 3 }
	// 		},
	// 		{
	// 			s: {
	// 				r: dishes.length - 1,
	// 				c: 2
	// 			},
	// 			e: {
	// 				r: dishes.length - 1,
	// 				c: 3
	// 			}
	// 		},
	// 		{
	// 			s: {
	// 				r: dishes.length - 2,
	// 				c: 0
	// 			},
	// 			e: {
	// 				r: dishes.length - 2,
	// 				c: 3
	// 			}
	// 		},
	// 		{
	// 			s: {
	// 				r: dishes.length - 3,
	// 				c: 0
	// 			},
	// 			e: {
	// 				r: dishes.length - 3,
	// 				c: 2
	// 			}
	// 		}
	// 	]

	// 	ws['!merges'] = merge
	// 	ws['!formatRows'] = true
	// 	ws[`D${dishes.length - 2}`] = {
	// 		t: 'n',
	// 		f: `SUM(D3:D${dishes.length - 3})` || 0
	// 	}
	// 	// console.log(ws)

	// 	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
	// 	XLSX.writeFile(wb, `${menu.name}.xlsx`, {
	// 		bookType: 'xlsx',
	// 		cellStyles: true
	// 	})
	// }
	const [loading, setLoading] = useState(false)
	function handlePlus(e, a, b) {
		e.stopPropagation()
		setLoading(true)
		const d =
			getOrderByMenu.ordersByMenu &&
			getOrderByMenu.ordersByMenu.filter(
				menu =>
					menu.dishId === a &&
					menu.userId === 'c30c0730-be4f-11e9-9f04-f72d443f7ef2'
			)
		props
			.createOrderBonus({
				variables: {
					input: {
						menuId: b,
						dishId: a,
						count: d.length > 0 ? d[0].count + 1 : 1
					}
				},
				refetchQueries: [
					{
						query: ORDER_BY_MENU,
						variables: { menuId: b }
					},
					{
						query: ORDER_COUNT_BY_MENU,
						variables: {
							menuId: b
						}
					}
				]
			})
			.then(res => {
				console.log(res)
				setLoading(false)
			})
			.catch(err => {
				setLoading(false)
				throw err
			})
	}

	const {
		menu,
		isLock,
		isActiveProps,
		menuId,
		getOrderByMenu,
		orderCountByMenu
	} = props
	return (
		<Collapse className="open-menu">
			<Panel
				extra={
					<>
						<Tooltip title={menu.isLocked ? 'Unlock menu' : 'Lock menu'}>
							<Button
								className="publish style-btn lock-menu"
								onClick={e => {
									isLock(e, menu._id)
								}}
							>
								<Icon type={menu.isLocked ? 'lock' : 'unlock'} />
							</Button>
						</Tooltip>

						<Tooltip title="Complete menu">
							<Button
								className="publish style-btn complete-menu"
								onClick={e => isActiveProps(e, menu._id)}
								disabled={!menu.isLocked}
							>
								<Icon type="check" />
							</Button>
						</Tooltip>

						<Tooltip title="Request menu">
							<Button
								className="publish style-btn request-menu"
								// onClick={e => this.export(e, menu)}
								disabled={!menu.isLocked}
							>
								<Icon type="file-excel" />
							</Button>
						</Tooltip>
					</>
				}
				header={
					<span style={{ width: '10em', display: 'inline-block' }}>
						{menu.name}
					</span>
				}
			>
				<Collapse className="open-dishes">
					{menu.dishes &&
						orderCountByMenu.ordersCountByMenu &&
						menu.dishes.map(dish => {
							return (
								<Panel
									header={`${dish.name} x${
										orderCountByMenu.ordersCountByMenu.filter(
											order => order.dishId === dish._id
										)[0].count
									}`}
									key={dish._id}
									extra={
										<Button
											className="publish style-btn"
											loading={loading}
											disabled={loading}
											onClick={e => handlePlus(e, dish._id, menuId)}
											name="add"
										>
											<Icon type="plus" />
										</Button>
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

const ORDER_COUNT_BY_MENU = gql`
	query($menuId: String!) {
		ordersCountByMenu(menuId: $menuId) {
			count
			menuId
			dishId
		}
	}
`

const CREATE_ORDER_BONUS = gql`
	mutation($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

const ME = gql`
	{
		me {
			username
			fullName
		}
	}
`

export default compose(
	graphql(ORDER_BY_MENU, {
		name: 'getOrderByMenu',
		options: props => {
			return {
				variables: {
					menuId: props.menuId || ''
				}
			}
		}
	}),
	graphql(ME, {
		name: 'me'
	}),
	graphql(CREATE_ORDER_BONUS, {
		name: 'createOrderBonus'
	}),

	graphql(ORDER_COUNT_BY_MENU, {
		name: 'orderCountByMenu',
		options: props => ({
			variables: {
				menuId: props.menuId || ''
			}
		})
	})
)(withTranslation('translations')(ListMenu))
