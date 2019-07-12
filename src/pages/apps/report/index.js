import React from 'react'
import { Button } from 'antd';
import './index.css'
import { Select, Modal, Form, Input } from 'antd';
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo';
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon';

import jsPDF from 'jspdf';

const { Option } = Select;

class MenuDetail extends React.Component {
	state = {
		isActive: false,
		menusBySite: [],
		menuIdBySite: '',
	};

	componentDidMount() {
		this.props.client.query({
			query: GET_MENU_BY_SITE
		})
			.then(({ data }) => {
				this.setState({
					menusBySite: data.menusBySite
				})
			})
			.catch(err => {
				console.log(err)
				throw err
			})
	}

	isActive = (menuId) => {
		this.props.client.mutate({
			mutation: CLOSE_MENU,
			variables: {
				id: menuId
			}
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

	isLock = (menuId) => {
		this.props.client.mutate({
			mutation: LOCK_AND_UNLOCK_MENU,
			variables: {
				id: menuId
			},
		})
			.then( data  => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
				throw err
			})

	}

	onSelect = (currentsite) => {
		console.log(currentsite)
		localStorage.setItem('currentsite', currentsite)
	}

	onRequest(menu) {

		var doc = new jsPDF({
			// orientation: 'landscape',
			unit: 'in',
			format: 'a4'
		})

		menu.dishes.map((dish, i) => {
			return (
				doc.text(dish.name, .5, i + 1),
				doc.text(dish.count.toString(), 7, i + 1)
			)
		})

		doc.text(menu.name.toUpperCase(), 3, .5)

		doc.save(menu.name)
	};

	render() {
		const options = JSON.parse(localStorage.getItem('sites'))
			.map((site, i) => {
				return (
					<Option value={site._id} key={i}>{site.name}</Option>
				)
			})
		return (
			<React.Fragment>
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

				{
					this.state.menusBySite && this.state.menusBySite.map((menuBySite, i) => {
						return (
							<div key={i}>
								<h1 style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>
									{menuBySite.name}
								</h1>

								{menuBySite.dishes && menuBySite.dishes.map((dish, i) => {
									return (
										<Select
											disabled={menuBySite.isLocked ? true : false}
											key={i}
											style={{ marginBottom: 10, display: 'block' }}
											defaultValue={dish.name + ' x' + dish.count}
											dropdownRender={menu => {
												return (
													<div className='dish-detail'>
														<Button className='user-name' disabled>Nam</Button>
														<Button className='minus'>-</Button>
														<Button className='plus'>+</Button>
													</div>
												)
											}}
										>
										</Select>
									)
								})}

								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<Button className='publish' onClick={() => this.isLock(menuBySite._id)}>
										{menuBySite.isLocked ? 'Un Lock' : 'Lock'}
									</Button>

									{/* <Button className='request-delivery' onClick={() => this.request(menuBySite._id)} >
										Request 1st delivery
									</Button> */}
									<Button onClick={() => this.onRequest(menuBySite)}
										variant="raised" color="secondary" >
										Request 1st delivery
									</Button>

									<Button className='publish' onClick={() => this.isActive(menuBySite._id)}>
										Complete
									</Button>
								</div>


							</div>

						)
					})
				}


			</React.Fragment>
		)
	}
}

const GET_MENU_BY_SITE = gql`
	mutation menusBySite{
		menusBySite{
			_id
			name
			isActived
			isLocked
			dishes{
				name
				count
				_id
			}
		}
}	`

const LOCK_AND_UNLOCK_MENU = gql`
	mutation lockAndUnlockMenu($id: String!){
		lockAndUnlockMenu(id: $id)
	}
`

const CLOSE_MENU = gql`
	mutation closeMenu($id: String!){
		closeMenu(id: $id)
	}
`

export default withApollo(MenuDetail)
