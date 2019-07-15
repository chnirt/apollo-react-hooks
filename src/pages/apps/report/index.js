import React from 'react'
import { Button } from 'antd'
import './index.css'
import { Select, Divider, Icon } from 'antd'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import logo from '../../../logoClinic.svg'

import jsPDF from 'jspdf'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

const { Option } = Select

class MenuDetail extends React.Component {
	state = {
		isActive: false,
	}

	isActive = menuId => {
		this.props.client
			.mutate({
				mutation: CLOSE_MENU,
				variables: {
					id: menuId
				},
				refetchQueries: [
					{
						query: GET_MENU_BY_SITE,
						variables: {
							siteId: localStorage.getItem('currentsite')
						}
					}
				]
			})
			.then(({ data }) => {
				openNotificationWithIcon('success', 'login', 'Close Menu Success')
			})
			.catch(err => {
				console.log(err)
				throw err
			})
		this.setState({
			isActive: !this.state.isActive
		})
		// console.log(this.props.history.push('/'))
	}

	isLock = menuId => {
		this.props.mutate
			.lockAndUnLockMenu({
				mutation: LOCK_AND_UNLOCK_MENU,
				variables: {
					id: menuId
				},
				refetchQueries: [
					{
						query: GET_MENU_BY_SITE,
						variables: {
							siteId: localStorage.getItem('currentsite')
						}
					}
				]
			})
			.then(data => {
				// console.log(data)
				openNotificationWithIcon('success', 'success', 'Success')
			})
			.catch(err => {
				// console.log(err)
				throw err
			})
	}

	onSelect = currentsite => {
		localStorage.setItem('currentsite', currentsite)
		this.props.getMenuBySite.variables.siteId = localStorage.getItem(
			'currentsite'
		)
		this.props.getMenuBySite.refetch({
			siteId: localStorage.getItem(
				'currentsite'
			)
		})
	}

	onRequest(menu) {
		var doc = new jsPDF({
			// orientation: 'landscape',
			unit: 'in',
			format: 'a4'
		})

		var img = new Image()
		img.src = '../../../logo.png'
		console.log(img)


		menu.dishes.map((dish, i) => {
			return (
				doc.text(dish.name, 1, i + 2),
				doc.text(dish.count.toString(), 6.5, i + 2)
			)
		})
		// doc.addFont("OpenSans.ttf", "Open Sans", "normal");
		// console.log(doc.getFontList())

		// doc.setFont("OpenSans.ttf", "normal")
		doc.setTextColor(16, 88, 101);
		doc.text(menu.name.toUpperCase(), 2.5, 1)

		doc.viewerPreferences({
			'HideWindowUI': true,
			'PrintArea': 'CropBox',
			'NumCopies': 10,
			'CenterWindow': true
		})

		doc.save(menu.name)

	}

	render() {
		const options = JSON.parse(localStorage.getItem('sites')).map((site, i) => {
			return (
				<Option value={site._id} key={i}>
					{site.name}
				</Option>
			)
		})
		return (
			<React.Fragment>
				<Button
					shape="circle"
					icon="left"
					onClick={() => this.props.history.push('/🥢')}
				/>
				<Divider />
				<div className='report'>
					<Select
						showSearch
						onSelect={this.onSelect}
						style={{ width: '100%', marginBottom: 20 }}
						defaultValue={localStorage.getItem('currentsite')}
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{options}
					</Select>

					{this.props.getMenuBySite.menusBySite &&
						this.props.getMenuBySite.menusBySite.map((menuBySite, i) => {
							return (
								<div key={i}>
									<h1
										style={{
											textAlign: 'center',
											display: 'block',
											marginBottom: 20
										}}
									>
										{menuBySite.name}
									</h1>

									{menuBySite.dishes &&
										menuBySite.dishes.map((dish, i) => {
											return (
												<Select
													disabled={menuBySite.isLocked ? true : false}
													key={i}
													style={{ marginBottom: 20, display: 'block' }}
													defaultValue={dish.name + ' x' + dish.count}
													dropdownRender={menu => {
														return (
															<div className="dish-detail">
																<Button className="user-name" disabled>
																	Nam
															</Button>
																<Button className="minus">-</Button>
																<Button className="plus">+</Button>
															</div>
														)
													}}
												/>
											)
										})}

									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between'
										}}
									>
										<Button
											className="publish"
											onClick={() => this.isLock(menuBySite._id)}
										>
											<Icon
												type={menuBySite.isLocked ? "lock" : 'unlock'}
											/>
										</Button>

										<Button
											onClick={() => this.onRequest(menuBySite)}
											variant="raised"
											color="secondary"
										>
											Request 1st delivery
									</Button>

										<Button
											className="publish"
											onClick={() => this.isActive(menuBySite._id)}
										>
											Complete
									</Button>
									</div>
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

export default HOCQueryMutation([
	{
		query: GET_MENU_BY_SITE,
		name: 'getMenuBySite',
		options: props => {
			return ({
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			})
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
])(MenuDetail)
