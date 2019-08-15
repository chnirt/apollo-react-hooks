import React from 'react'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'
import { compose, graphql } from 'react-apollo'

import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import ListMenu from './listMenu'
// import { HOCQueryMutation } from '../../components/shared/hocQueryAndMutation'

import './index.css'

function Report(props) {
	const isActive = (e, menuId) => {
		const { closeMenu } = props
		e.stopPropagation()
		closeMenu({
			mutation: CLOSE_MENU,
			variables: {
				id: menuId
			},
			refetchQueries: () => [
				{
					query: GET_MENU_BY_SITE,
					variables: {
						siteId: localStorage.getItem('currentsite')
					}
				}
			]
		})
			.then(() => {
				openNotificationWithIcon('success', 'login', t('common.Success'))
			})
			.catch(() => {
				// console.log(err)
				// throw err
			})
	}

	const isLock = (e, menuId) => {
		e.stopPropagation()
		const { lockAndUnLockMenu, t } = props
		lockAndUnLockMenu({
			mutation: LOCK_AND_UNLOCK_MENU,
			variables: {
				id: menuId
			},
			refetchQueries: () => [
				{
					query: GET_MENU_BY_SITE,
					variables: {
						siteId: localStorage.getItem('currentsite')
					}
				}
			]
		})
			.then(() => {
				// console.log(data)
				openNotificationWithIcon('success', 'success', t('common.Success'))
			})
			.catch(err => {
				// console.log(err)
				throw err
			})
	}

	// componentWillUpdate() {
	// 	console.log( props)
	// }
	console.log(props)
	const { getMenuBySite } = props
	return (
		<React.Fragment>
			<div className="report">
				{getMenuBySite.menusBySite &&
					getMenuBySite.menusBySite
						.filter(menuBySite => menuBySite.isPublished)
						.map(menuBySite => {
							return (
								<div key={menuBySite._id} style={{ marginBottom: 10 }}>
									<ListMenu
										isLock={isLock}
										isActiveProps={isActive}
										menuId={menuBySite._id}
										menu={menuBySite}
										{...props}
									/>
									<div
										style={{
											display: 'flex',
											marginTop: 10,
											justifyContent: 'space-between'
										}}
									/>
								</div>
							)
						})}
			</div>
		</React.Fragment>
	)
}

const GET_MENU_BY_SITE = gql`
	query menusBySite($siteId: String!) {
		menusBySite(siteId: $siteId) {
			_id
			name
			isActive
			isLocked
			isPublished
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

export default withTranslation('translations')(
	compose(
		graphql(GET_MENU_BY_SITE, {
			name: 'getMenuBySite',
			options: props => {
				return {
					variables: {
						siteId: props.currentsite
					}
				}
			}
		}),
		graphql(LOCK_AND_UNLOCK_MENU, {
			name: 'lockAndUnLockMenu'
		}),
		graphql(CLOSE_MENU, {
			name: 'closeMenu'
		})
	)(Report)
)
