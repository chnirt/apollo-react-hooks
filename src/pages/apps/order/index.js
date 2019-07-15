import React from 'react'
import { Select, Button, Divider, Row, Col } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'
import ListDishes from './listDishes'

class Order extends React.Component {
	state = {
		menuId: null,
		dishes: [],
		siteId: window.localStorage.getItem('currentsite')
	}

	componentDidMount() {
		this.handleDefaultDishes()
	}

	async handleDefaultDishes() {
		const orderNumbers = this.props.ordersByMenu.ordersByMenu.map(order => order.count)
		if (
			this.props.data.menuPublishBySite.isPublished === true &&
			this.props.data.menuPublishBySite.isActive === true
		) {
			this.setState({
				menuId: this.props.data.menuPublishBySite._id,
				dishes: [...this.props.data.menuPublishBySite.dishes].map((dish, index) => ({
					...dish,
					orderNumber: orderNumbers[index]
				}))
			})
		}
		// if (this.props.data.error) {
		// 	console.log(this.props.data.error)
		// }
	}

	async handleChange(selectedItems) {
		console.log(selectedItems)
		await localStorage.setItem('currentsite', selectedItems)
		await localStorage.setItem('menuId', this.props.data.menuPublishBySite._id)

		if (
			this.props.data.menuPublishBySite.isPublished === true &&
			this.props.data.menuPublishBySite.isActive
		) {
			this.setState({
				menuId: this.props.data.menuPublishBySite._id,
				dishes: [...this.props.data.menuPublishBySite.dishes].map(dish => ({...dish, orderNumber: 0})),
				siteId: selectedItems
			})
		}

		if (this.props.data.error) {
			console.log(this.props.data.error)
		}
		this.props.ordersByMenu.refetch({
			menuId: this.state.menuId
		})
	}

	render() {
		console.log(this.props.data.menuPublishBySite._id)
		const currentsite = window.localStorage.getItem('currentsite')
		const options = JSON.parse(window.localStorage.getItem('sites')).map(
			item => (
				<Select.Option value={item._id} key={item._id}>
					{item.name}
				</Select.Option>
			)
		)
		return (
			<React.Fragment>
				<Button
					shape='circle'
					icon='left'
					onClick={() => this.props.history.push('/🥢')}
				/>
				<Divider />
				<Row style={{ marginTop: 20 }}>
					<Col span={22} offset={1}>
						<Select
							style={{ width: '100%', marginBottom: 20 }}
							placeholder='Chọn khu vực'
							defaultValue={currentsite}
							onChange={() => this.setState({dishes: []})}
							onSelect={(e) => this.handleChange(e)}
						>
							{options}
						</Select>
					</Col>
				</Row>
				<Row>
					<Col span={22} offset={1}>
						<ListDishes siteId={this.state.siteId} />
					</Col>
				</Row>		
			</React.Fragment>
		)
	}
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

const ORDERS_BY_MENU = gql`
	query ordersByMenu($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
			_id
			userId
			menuId
			dishId
			note
			count
			isConfirmed
			createdAt
			updatedAt
		}
	}
`

export default HOCQueryMutation([
	{
		query: MENU_BY_SELECTED_SITE,
		options: props => ({
			variables: {
				siteId: localStorage.getItem('currentsite')
			}
		})
	},
	{
		query: ORDERS_BY_MENU,
		options: (props) => ({
			variables: {
				// menuId: props.data.menuPublishBySite._id
				menuId: localStorage.getItem('menuId')
			},
			fetchPolicy: 'network-only'
		}),
		name: 'ordersByMenu'
	}
])(Order)
