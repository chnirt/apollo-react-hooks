import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import MenuList from './menuList'
import './index.scss'

function ReportB({
	getMenuBySite: { menusBySite },
	lockAndUnLockMenu,
	closeMenu,
	me
}) {
	const siteId = localStorage.getItem('currentsite')
	const handleCloseMenu = (e, menuId) => {
		// e.stopPropagation()
		closeMenu({
			mutation: CLOSE_MENU,
			variables: {
				id: menuId
			},
			refetchQueries: () => [
				{
					query: GET_MENU_BY_SITE,
					variables: {
						siteId
					}
				}
			]
		})
			.then(() => {
				openNotificationWithIcon('success', 'login', 'Close Menu Success')
			})
			.catch(err => {
				console.log(err)
				// throw err
			})
	}
	const handleLockMenu = (e, menuId) => {
		e.stopPropagation()
		lockAndUnLockMenu({
			mutation: LOCK_AND_UNLOCK_MENU,
			variables: {
				id: menuId
			},
			refetchQueries: () => [
				{
					query: GET_MENU_BY_SITE,
					variables: {
						siteId
					}
				}
			]
		})
			.then(() => {
				// console.log(data)
				openNotificationWithIcon('success', 'success', 'Success')
			})
			.catch(err => {
				// console.log(err)
				throw err
			})
	}

	return (
		<>
			{menusBySite &&
				menusBySite
					.filter(menuBySite => menuBySite.isPublished)
					.map(menuBySite => (
						<div key={menuBySite._id} className="report-menus">
							{menuBySite.dishes && (
								<MenuList
									menuBySite={menuBySite}
									key={menuBySite._id}
									closeMenu={handleCloseMenu}
									lockMenu={handleLockMenu}
									me={me}
								/>
							)}
						</div>
					))}
		</>
	)
}

const GET_MENU_BY_SITE = gql`
	query($siteId: String!) {
		menusBySite(siteId: $siteId) {
			_id
			name
			isPublished
			isActive
			isLocked
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

export default compose(
	graphql(GET_MENU_BY_SITE, {
		name: 'getMenuBySite',
		options: () => ({
			variables: {
				siteId: localStorage.getItem('currentsite')
			},
			fetchPolicy: 'no-cache'
		})
	}),
	graphql(LOCK_AND_UNLOCK_MENU, {
		name: 'lockAndUnLockMenu'
	}),
	graphql(CLOSE_MENU, {
		name: 'closeMenu'
	})
)(ReportB)
