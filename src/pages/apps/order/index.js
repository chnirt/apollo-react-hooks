import React from 'react'
import { Select, Button, List } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

class Order extends React.Component {
	state = {
		sites: [],
		menuId: null,
		dishes: [],
		condition: []
	}

	componentDidMount () {
		this.handleDefaultDishes()
	}

	async handleDefaultDishes () {
		if (this.props.data.menuPublishBySite.isPublished === true && this.props.data.menuPublishBySite.isActived === true) {
			this.setState({
				menuId: this.props.data.menuPublishBySite._id,
				dishes: [...this.props.data.menuPublishBySite.dishes].map(dish => ({...dish, orderNumber: 0})),
				condition: this.props.data.menuPublishBySite
			})
		}

		if(this.props.data.error) {
			console.log(this.props.data.error)
		}
	}

	async handleChange (selectedItems) {
		await window.localStorage.setItem('currentsite', selectedItems)

		if (this.props.data.menuPublishBySite.isPublished === true && this.props.data.menuPublishBySite.isActived) {
			this.setState({
				menuId: this.props.data.menuPublishBySite._id,
				dishes: [...this.props.data.menuPublishBySite.dishes].map(dish => ({...dish, orderNumber: 0})),
				condition: this.props.data.menuPublishBySite
			})
		}

		if(this.props.data.error) {
			console.log(this.props.data.error)
		}
	}

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

	// handleConfirmOrder (e) {
	// 	this.props.client.mutate({
	// 		mutation: ORDER_DISH,
	// 		variables: {
	// 			input: {
	// 				menuId: this.state.menuId,
	// 				dishId: this.state.dishes[0]._id,
	// 				count: 1
	// 			}
	// 		}
	// 	})
	// 	.then((res) => {
	// 		console.log(res)
	// 	})
	// 	.catch((error) => {
	// 		console.dir(error)
	// 	})
	// }

	totalOrder (item) {
		let total = 0
		// this.props.client.mutate({
		// 	mutation: ORDERS_DISH,
		// 	variables: {
		// 		menuId: this.state.menuId,
		// 		dishId: item._id
		// 	}
		// })
		// .then(res => {
			// console.log(res.data.ordersDish[0].count)
			// res.data.ordersDish.map(order =>
			// 	console.log(order.count)
			// //stotal += order.count
			// )
		// 	total = res.data.ordersDish[0].count
		// 	console.log(total)
		// })
		// .catch((error) => {
		// 	console.dir(error)
		// })
		return total
	}

	render() {
		const currentsite = window.localStorage.getItem('currentsite')
		const options = JSON.parse(window.localStorage.getItem('sites')).map(item =>
			<Select.Option value={item._id} key={item._id}>
					{item.name}
			</Select.Option>
		)
		return (
			<React.Fragment>
				<Select
					style={{ width: '100%', marginBottom: 20 }}
					placeholder='Chọn khu vực'
					defaultValue={currentsite}
					onChange={() => this.setState({dishes: []})}
					onSelect={(e) => this.handleChange(e)}
				>
					{options}
				</Select>

				{/* <label style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>
					Danh sách món
				</label> */}

				{
					this.state.condition.isActived === true && this.state.condition.isLocked === false && this.state.condition.isPublished === true
					? <List
							dataSource={this.state.dishes}
							renderItem={item => (
								<List.Item key={item._id} actions={[<Button className='minus' onClick={() => this.handleMinus(item)}>-</Button>, <Button className='plus' onClick={() => this.handlePlus(item)}>+</Button>]}>
									<List.Item.Meta
										title={item.name}
										description={`${this.totalOrder(item)}/${item.count}`}
									/>
									<div>{item.orderNumber}</div>
								</List.Item>
							)}
						/>
					: ( this.state.condition.isActived === true && this.state.condition.isLocked === true && this.state.condition.isPublished === true
							? <List
									dataSource={this.state.dishes}
									renderItem={item => (
										<List.Item key={item._id} actions={[<Button className='minus' disabled>-</Button>, <Button className='plus' disabled>+</Button>]}>
											<List.Item.Meta
												title={item.name}
												description={`${this.totalOrder(item)}/${item.count}`}
											/>
											<div>{item.orderNumber}</div>
										</List.Item>
									)}
								/>
							:	'Hệ thống đã khóa'	
						)
				}
				<Button style={{ display: 'block', textAlign: 'center' }}>Xác nhận đã ăn</Button>
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
			isActived
			isLocked
			createAt
			updateAt
		}
	}
`

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
  	orderDish(input: $input)
	}
`

export default HOCQueryMutation([
	{
    query: MENU_BY_SELECTED_SITE,
    options: props => ({
			variables: {
				siteId: window.localStorage.getItem('currentsite')
			}
		})
  },
  {
    mutation: ORDER_DISH,
    name: 'orderDish',
    options: {}
  }
])(Order)