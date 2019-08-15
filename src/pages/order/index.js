import React from 'react'
import { Typography, Col, Row } from 'antd'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { withTranslation } from 'react-i18next'
import DishesListAndActions from './dishesListAndActions'

function Order(props) {
	const { t, menuPublishBySite, menuPublishedSubscription } = props

	if (!menuPublishedSubscription.loading) {
		menuPublishBySite.refetch(localStorage.getItem('currentsite'))
	}

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
						{t('dashBoard.Order')}
					</Typography.Title>
					{menuPublishBySite.menuPublishBySite ? (
						<DishesListAndActions
							t={t}
							menuId={menuPublishBySite.menuPublishBySite._id}
							isPublished={menuPublishBySite.menuPublishBySite.isPublished}
							isLocked={menuPublishBySite.menuPublishBySite.isLocked}
							dishes={menuPublishBySite.menuPublishBySite.dishes}
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
							<div>{t('System has locked')}</div>
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

const SUBSCRIPTION_PUBLISHED_MENU = gql`
	subscription {
		menuPublished
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
	graphql(SUBSCRIPTION_PUBLISHED_MENU, {
		name: 'menuPublishedSubscription'
	})
)(withTranslation('translations')(Order))
