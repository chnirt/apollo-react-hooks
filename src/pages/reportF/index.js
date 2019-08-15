import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'

import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import ListMenu from './listMenu'

import './index.css'

function Report(props) {
	const { getMenuPublishBySite } = props
	const { menuPublishBySite } = getMenuPublishBySite

	function isActive(e, menuId) {
		e.stopPropagation()
		props
			.closeMenu({
				variables: {
					id: menuId
				},
				refetchQueries: [
					{
						query: GET_MENU_PUBLISHED_BY_SITE,
						variables: {
							siteId: localStorage.getItem('currentsite')
						}
					}
				]
			})
			.then(() => {
				openNotificationWithIcon('success', 'login', t('Success'))
			})
			.catch(() => {
				// console.log(err)
				// throw err
			})
	}

	const isLock = (e, menuId) => {
		e.stopPropagation()
		const { t } = props
		props
			.lockAndUnLockMenu({
				variables: {
					id: menuId
				},
				refetchQueries: [
					{
						query: GET_MENU_PUBLISHED_BY_SITE,
						variables: {
							siteId: localStorage.getItem('currentsite')
						}
					}
				]
			})
			.then(() => {
				// console.log(data)
				openNotificationWithIcon('success', 'success', t('Success'))
			})
			.catch(err => {
				// console.log(err)
				throw err
			})
	}

	// componentWillUpdate() {
	// 	console.log(this.props)
	// }

	return (
		<React.Fragment>
			<div className="report">
				{getMenuPublishBySite.menuPublishBySite && (
					<div style={{ marginBottom: 10 }}>
						<ListMenu
							isLock={isLock}
							isActiveProps={isActive}
							menuId={menuPublishBySite._id}
							menu={menuPublishBySite}
						/>
						<div
							style={{
								display: 'flex',
								marginTop: 10,
								justifyContent: 'space-between'
							}}
						/>
					</div>
				)}
			</div>
		</React.Fragment>
	)
}

const GET_MENU_PUBLISHED_BY_SITE = gql`
	query($siteId: String!) {
		menuPublishBySite(siteId: $siteId) {
			_id
			name
			siteId
			shopId
			dishes {
				_id
				name
				count
			}
			isLocked
			isActive
			isPublished
		}
	}
`

const LOCK_AND_UNLOCK_MENU = gql`
	mutation($id: String!) {
		lockAndUnlockMenu(id: $id)
	}
`

const CLOSE_MENU = gql`
	mutation closeMenu($id: String!) {
		closeMenu(id: $id)
	}
`

export default compose(
	graphql(LOCK_AND_UNLOCK_MENU, {
		name: 'lockAndUnLockMenu'
	}),
	graphql(CLOSE_MENU, {
		name: 'closeMenu',
		options: {}
	}),
	graphql(GET_MENU_PUBLISHED_BY_SITE, {
		name: 'getMenuPublishBySite',
		options: () => ({
			// fetchPolicy: 'no-cache',
			variables: {
				siteId: window.localStorage.getItem('currentsite')
			}
		})
	})
)(withTranslation('translations')(Report))
