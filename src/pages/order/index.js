import React from 'react'
import { Typography, Col, Row } from 'antd'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import DishesListAndActions from './dishesListAndActions'

function Order(props) {
	const { t, getMenuPublishBySite, getMenuSubscription, currentsite } = props
	const { menuSubscription, loading } = getMenuSubscription
	const { menuPublishBySite } = getMenuPublishBySite

	const menu = loading
		? menuPublishBySite
		: menuSubscription.siteId === currentsite
		? menuSubscription
		: menuPublishBySite

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
					{menu ? (
						<DishesListAndActions
							t={t}
							menuId={menu._id}
							isPublished={menu.isPublished}
							isLocked={menu.isLocked}
							dishes={menu.dishes}
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
			isLocked
		}
	}
`

const SUBSCRIPTION_MENU = gql`
	subscription {
		menuSubscription {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
			isPublished
			isLocked
		}
	}
`

export default compose(
	graphql(MENU_BY_SELECTED_SITE, {
		name: 'getMenuPublishBySite',
		skip: props => !props.currentsite,
		options: props => ({
			variables: {
				siteId: props.currentsite
			},
			fetchPolicy: 'network-only'
		})
	}),
	graphql(SUBSCRIPTION_MENU, {
		name: 'getMenuSubscription'
	})
)(Order)
