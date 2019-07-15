import React from 'react'
import { Button, List, Row } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

class ListDishes extends React.Component {
	state = {
		menuId: this.props.data.menuPublishBySite._id,
		dishes: []
	}

  componentDidMount () {
		// this.handleDefaultDishes()
		// this.handleLoadData()
		// localStorage.setItem('menuId', this.props.data.menuPublishBySite._id)
	}

	// async handleDefaultDishes () {
	// 	console.log(this.props)
	// 	const orderNumbers = this.props.ordersByMenu.ordersByMenu.map(order => order.count)
	// 	// console.log(orderNumbers)
	// 	if (this.props.data.menuPublishBySite.isPublished === true && this.props.data.menuPublishBySite.isActive === true) {
	// 		this.setState({
	// 			menuId: this.props.data.menuPublishBySite._id,
	// 			dishes: [...this.props.data.menuPublishBySite.dishes].map((dish, index) => ({...dish, orderNumber: orderNumbers[index]}))
	// 		})
	// 	}

	// 	if(this.props.data.error) {
	// 		console.log(this.props.data.error)
	// 	}
	// }
	
	// async handleLoadData () {
	// 	console.log(this.props)
	// 	const orderNumbers = this.props.ordersByMenu.ordersByMenu.map(order => order.count)
	// 	localStorage.setItem('menuId', this.props.data.menuPublishBySite._id)
	// 	if (this.props.data.menuPublishBySite.isPublished === true && this.props.data.menuPublishBySite.isActive === true) {
	// 		this.setState({
	// 			// menuId: this.props.data.menuPublishBySite._id,
	// 			dishes: [...this.props.data.menuPublishBySite.dishes].map((dish, index) => ({...dish, orderNumber: orderNumbers[index]}))
	// 		})
	// 	}
	// }
  
	async createOrder (item) {
		await this.props.mutate.orderDish({
			variables: {
				input: {
					menuId: this.state.menuId,
					dishId: item._id,
					count: item.orderNumber
				}
			}
		})
		.then((res) => {
			(res)
			? console.log('success')
			: console.log('something went wrong')
		})
		.catch((error) => {
			console.dir(error)
		})
	}

	async selectDishHandler (index, item) {
		let theDish = [...this.state.dishes]
		await this.state.dishes.map(dish =>
			(dish._id === item._id && dish.orderNumber < item.count)
			? theDish[index] = {...theDish[index], orderNumber: item.orderNumber++}
			: theDish[index] = {...theDish[index], orderNumber: item.orderNumber}
		)

		await this.setState({dishes: theDish})
		await this.createOrder(item)
	}

	async unselectDishHandler (index, item) {
		let theDish = [...this.state.dishes]
		await this.state.dishes.map(dish =>
			(dish._id === item._id && dish.orderNumber > 0)
			? theDish[index] = {...theDish[index], orderNumber: item.orderNumber--}
			: theDish[index] = {...theDish[index], orderNumber: item.orderNumber}
		)

		await this.setState({dishes: theDish})
		await this.createOrder(item)
	}
	
	async handleMinus (item) {
		const index = this.state.dishes.map(dish => '-').indexOf(item._id)
		await this.unselectDishHandler(index,item)
	}

	async handlePlus (item) {
		const index = this.state.dishes.map(dish => '+').indexOf(item._id)
		this.selectDishHandler(index, item)
	}

	async handleConfirmOrder (item) {
		this.state.dishes.map(dish =>
			(dish.orderNumber !== 0)
			? this.props.mutate.confirmOrder({
					variables: {
						menuId: this.state.menuId,
						dishId: dish._id
					}
				})
				.then(res => {
					(res)
					? alert('Xác nhận thành công')
					: console.log('something went wrong')
				})
				.catch((error) => {
					console.dir(error)
				})
			:	null	
		)
	}

	totalOrder (item) {
		let total = 0
		return total
	}

	render() {
		const { data } = this.props
		const time = (new Date(Date.now())).getHours()
		const confirmButton = (time >= 12 && time < 14) 
		? <Button onClick={() => this.handleConfirmOrder()} style={{ display: 'block', textAlign: 'center' }}>Xác nhận</Button>
		: null
		return (
			<React.Fragment>
				{
					data.menuPublishBySite.isPublished === true
					? <>
							<List
								dataSource={this.state.dishes}
								renderItem={item => (
									<List.Item key={item._id} actions={[<Button className='minus' disabled={data.menuPublishBySite.isLocked} onClick={() => this.handleMinus(item)}>-</Button>, <Button className='plus' disabled={data.menuPublishBySite.isLocked} onClick={() => this.handlePlus(item)}>+</Button>]}>
										<List.Item.Meta
											title={item.name}
											// description={`${this.totalOrder(item)}/${item.count}`}
											description={`${item.orderNumber}/${item.count}`}
										/>
										<div>{item.orderNumber}</div>
									</List.Item>
								)}
							/>
							<Row type='flex' justify='center' align='bottom'>
								{confirmButton}
							</Row>
						</>
					:	<Row type='flex' justify='center' align='middle'>
							<div>Hệ thống đã khóa</div>
						</Row>
				}
			</React.Fragment>
		)
	}
}

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

const CONFIRM_ORDER = gql`
	mutation confirmOrder($menuId: String!, $dishId: String!) {
		confirmOrder(menuId: $menuId, dishId: $dishId)
	}
`

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
		options: (props) => ({
			variables: {
				siteId: props.siteId
			},
			fetchPolicy: 'network-only'
		})
	},
	{
		query: ORDERS_BY_MENU,
		options: (props) => ({
			variables: {
				// menuId: props.menuId
				menuId: localStorage.getItem('menuId')
			},
			fetchPolicy: 'network-only'
		}),
		name: 'ordersByMenu'
	},
  {
    mutation: ORDER_DISH,
    name: 'orderDish',
    options: {}
	},
	{
    mutation: CONFIRM_ORDER,
    name: 'confirmOrder',
    options: {}
  }
])(ListDishes)