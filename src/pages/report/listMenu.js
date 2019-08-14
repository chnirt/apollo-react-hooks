import React from 'react'
import { Collapse, Button, Icon, Tooltip } from 'antd'
import gql from 'graphql-tag'
import XLSX from 'xlsx'
import { withTranslation } from 'react-i18next'

import ListUser from './listUser'
import { HOCQueryMutation } from '../../components/shared/hocQueryAndMutation'

import './index.css'

const { Panel } = Collapse

function listMenu(props) {
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
		ws[`D${dishes.length - 2}`] = {
			t: 'n',
			f: `SUM(D3:D${dishes.length - 3})` || 0
		}
		// console.log(ws)

		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
		XLSX.writeFile(wb, `${menu.name}.xlsx`, {
			bookType: 'xlsx',
			cellStyles: true
		})
	}

	const { menu, isLock, isActiveProps, getOrderByMenu, menuId } = props
	console.log(props)
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
								loading={!menu ? true : false}
							>
								<Icon type="check" />
							</Button>
						</Tooltip>

						<Tooltip title="Request menu">
							<Button
								className="publish style-btn request-menu"
								onClick={e => exportFile(e, menu)}
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
				key={menu._id}
				disabled={!!menu.isLocked}
			>
				<Collapse className="open-dishes">
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

export default withTranslation('translations')(
	HOCQueryMutation([
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
		}
	])(listMenu)
)
