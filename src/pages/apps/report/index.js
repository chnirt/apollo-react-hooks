import React from 'react'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import ListMenu from './listMenu'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

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
				openNotificationWithIcon('success', 'login', 'Close Menu Success')
			})
			.catch(() => {
				// console.log(err)
				// throw err
			})
	}

	isLock = (e, menuId) => {
		e.stopPropagation()
		const { mutate } = this.props
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
				openNotificationWithIcon('success', 'success', 'Success')
			})
			.catch(err => {
				// console.log(err)
				throw err
			})
	}

	render() {
		const { getMenuBySite } = this.props
		return (
			<React.Fragment>
				<div className="report">
					{getMenuBySite.menusBySite &&
						getMenuBySite.menusBySite.map(menuBySite => {
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

const ORDER_BY_MENU = gql`
	query ordersByMenu($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
			userId
			dishId
			count
		}
	}
`

export default HOCQueryMutation([
	{
		query: GET_MENU_BY_SITE,
		name: 'getMenuBySite',
		options: () => {
			return {
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			}
		}
	},
	{
		query: ORDER_BY_MENU,
		name: 'getOrderByMenu',
		options: () => {
			return {
				variables: {
					menuId: '3f423520-a214-11e9-83ee-5f5fb731ebb3'
				}
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
