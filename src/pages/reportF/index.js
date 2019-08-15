import React from 'react'
import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'
import { Collapse, Button } from 'antd'
// import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

import {
	MENU_PUBLISH_BY_SITE,
	LOCK_UNLOCK_MENU,
	COUNT_BY_MENU,
	ORDER_DISH,
	UPDATE_ORDERJ,
	CLOSE_MENU
} from './reportQuery/reportQuery'
import ReportItemDish from './reportItemDish'
import './index.css'

const { Panel } = Collapse

function ReportF(props) {
	const { menuPublish, countOrderByMenu, me } = props
	const { menuPublishBySite } = menuPublish

	function onLock(e) {
		e.stopPropagation()

		props.lockAndUnlock({
			variables: {
				id: menuPublishBySite._id
			},
			refetchQueries: [
				{
					query: MENU_PUBLISH_BY_SITE,
					variables: {
						siteId: menuPublishBySite.siteId
					}
				}
			]
		})
	}

	function onPlus(e, dishId, currentCount) {
		e.stopPropagation()
		props.orderDish({
			variables: {
				input: {
					menuId: menuPublishBySite._id,
					dishId,
					count: currentCount + 1
				}
			}
		})
	}

	function onMinus(userId, dishId, count) {
		console.log(userId, dishId, count)
		props.updateOrder({
			variables: {
				input: {
					menuId: menuPublishBySite._id,
					dishId,
					count: count - 1
				},
				userId
			},
			refetchQueries: [
				{
					query: COUNT_BY_MENU,
					variables: {
						menuId: menuPublishBySite._id
					}
				}
			]
		})
	}

	function onCloseMenu() {
		props.closeMenuToExport({
			variables: {
				id: menuPublishBySite._id
			},
			refetchQueries: [
				{
					query: MENU_PUBLISH_BY_SITE,
					variables: {
						siteId: props.currentsite
					}
				}
			]
		})
	}

	return (
		<React.Fragment>
			<div className="report">
				{menuPublish.menuPublishBySite && (
					<Collapse>
						<Panel
							header={menuPublishBySite.name}
							extra={
								<div>
									<Button
										className="btn-report bottom"
										onClick={e => onLock(e)}
										type="link"
										icon={menuPublishBySite.isLocked ? 'lock' : 'unlock'}
										shape="circle"
									/>
									<Button
										className="btn-report bottom"
										icon="snippets"
										type="link"
										disabled={menuPublishBySite.isLocked}
										shape="circle"
										onClick={onCloseMenu}
									/>
									<Button
										className="btn-report bottom"
										type="link"
										icon="file-excel"
										shape="circle"
										disabled={menuPublishBySite.isLocked}
									/>
								</div>
							}
						>
							{countOrderByMenu.countByMenuJ &&
								menuPublishBySite.dishes.map(dish => (
									<ReportItemDish
										key={dish._id}
										{...dish}
										onPlus={onPlus}
										onMinus={onMinus}
										me={me}
										menu={countOrderByMenu.countByMenuJ}
									/>
								))}
						</Panel>
					</Collapse>
				)}
			</div>
		</React.Fragment>
	)
}

export default compose(
	graphql(MENU_PUBLISH_BY_SITE, {
		name: 'menuPublish',
		skip: props => !props.currentsite,
		options: props => ({
			variables: {
				siteId: props.currentsite
			}
		})
	}),
	graphql(LOCK_UNLOCK_MENU, {
		name: 'lockAndUnlock'
	}),
	graphql(COUNT_BY_MENU, {
		name: 'countOrderByMenu',
		skip: props => !props.menuPublish.menuPublishBySite,
		options: props => ({
			variables: {
				menuId:
					(props.menuPublish.menuPublishBySite &&
						props.menuPublish.menuPublishBySite._id) ||
					''
			}
		})
	}),
	graphql(ORDER_DISH, {
		name: 'orderDish'
	}),
	graphql(UPDATE_ORDERJ, {
		name: 'updateOrder'
	}),
	graphql(CLOSE_MENU, {
		name: 'closeMenuToExport'
	})
)(withTranslation('translations')(ReportF))
