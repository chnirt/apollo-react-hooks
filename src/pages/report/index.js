import React from 'react'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'

import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import ListMenu from './listMenu'
import { HOCQueryMutation } from '../../components/shared/hocQueryAndMutation'

import './index.css'

class Report extends React.Component {
	isActive = (e, menuId) => {
		const { mutate } = this.props
		e.stopPropagation()
		mutate
			.closeMenu({
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
				openNotificationWithIcon('success', 'login', t('Success'))
			})
			.catch(() => {
				// console.log(err)
				// throw err
			})
	}

	isLock = (e, menuId) => {
		e.stopPropagation()
		const { mutate, t } = this.props
		mutate
			.lockAndUnLockMenu({
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

	render() {
		const { getMenuBySite } = this.props
		console.log(this.props)
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
											isLock={this.isLock}
											isActiveProps={this.isActive}
											menuId={menuBySite._id}
											menu={menuBySite}
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
	HOCQueryMutation([
		{
			query: GET_MENU_BY_SITE,
			name: 'getMenuBySite',
			options: () => {
				return {
					variables: {
						siteId: window.localStorage.getItem('currentsite')
					},
					fetchPolicy: 'no-cache'
				}
			}
		},
		{
			mutation: LOCK_AND_UNLOCK_MENU,
			name: 'lockAndUnLockMenu',
			option: {}
		},
		{
			mutation: CLOSE_MENU,
			name: 'closeMenu',
			option: {}
		}
	])(Report)
)
