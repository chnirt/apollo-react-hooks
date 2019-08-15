import React from 'react'
import { Typography, Col, Row } from 'antd'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import DishesListAndActions from './dishesListAndActions'

function Order(props) {
	const { t, menuPublishBySite, ordersByMenu, ordersCountByUser } = props

	return (
		<React.Fragment>
			<Row
				style={{
					overflow: 'hidden',
					marginTop: 10
				}}
			>
				<Col span={22} offset={1}>
					<Typography.Title
						level={3}
						style={{
							color: '#fff'
						}}
					>
						{t('src.pages.dashBoard.Order')}
					</Typography.Title>
					{menuPublishBySite.menuPublishBySite &&
					ordersByMenu.ordersByMenu &&
					ordersCountByUser.ordersCountByUser ? (
						<DishesListAndActions
							t={t}
							menuId={menuPublishBySite.menuPublishBySite._id}
							isPublished={menuPublishBySite.menuPublishBySite.isPublished}
							isLocked={menuPublishBySite.menuPublishBySite.isLocked}
							dishes={menuPublishBySite.menuPublishBySite.dishes}
							ordersByMenuC={ordersByMenu.ordersByMenu}
							ordersCountByUserC={ordersCountByUser.ordersCountByUser}
						/>
					) : (
						<Row
							type="flex"
							justify="center"
							align="middle"
							style={{
								color: '#fff'
							}}
						>
							<div>{t('src.pages.order.systemHasLocked')}</div>
						</Row>
					)}
				</Col>
			</Row>
		</React.Fragment>
	)
}

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

const ORDERS_COUNT_BY_USER = gql`
	query ordersCountByUser($menuId: String!) {
		ordersCountByUser(menuId: $menuId) {
			menuId
			dishId
			count
		}
	}
`

export default compose(
	graphql(MENU_BY_SELECTED_SITE, {
		name: 'menuPublishBySite',
		skip: !localStorage.getItem('currentsite'),
		options: () => ({
			variables: {
				siteId: localStorage.getItem('currentsite')
			}
		})
	}),
	graphql(ORDERS_BY_MENU, {
		name: 'ordersByMenu',
		skip: props => !props.menuPublishBySite.menuPublishBySite,
		options: props => ({
			variables: {
				menuId:
					props.menuPublishBySite.menuPublishBySite &&
					props.menuPublishBySite.menuPublishBySite._id
			}
		})
	}),
	graphql(ORDERS_COUNT_BY_USER, {
		name: 'ordersCountByUser',
		skip: props => !props.menuPublishBySite.menuPublishBySite,
		options: props => ({
			variables: {
				menuId:
					props.menuPublishBySite.menuPublishBySite &&
					props.menuPublishBySite.menuPublishBySite._id
			}
		})
	})
)(Order)
