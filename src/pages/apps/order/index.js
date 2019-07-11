import React from 'react'
import { Select, Button, List } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
// import './index.css'

let myRef = React.createRef()

class Order extends React.Component {
	state = {
		sites: [],
		menuId: null,
		dishes: [],
		condition: [],
		dishCountOrdered: 0
	}

	componentDidMount () {
		this.handleDefaultDishes()
	}

	handleDefaultDishes () {
		this.props.client.query({
			query: MENU_BY_SELECTED_SITE
		})
		.then(res => {
			if (res.data.menuPublishBySite.isPublished === true && res.data.menuPublishBySite.isActived === true) {
				this.setState({
					menuId: res.data.menuPublishBySite._id,
					dishes: [...res.data.menuPublishBySite.dishes],
					condition: res.data.menuPublishBySite
				})
			}
		})
		.catch((error) => {
			console.log(error)
		})
	}

	async handleChange (selectedItems) {
		await window.localStorage.setItem('currentsite', selectedItems)
		await this.props.client.cache.reset()
		await this.props.client.query({
			query: MENU_BY_SELECTED_SITE
		})
		.then(res => {
			if (res.data.menuPublishBySite.isPublished === true && res.data.menuPublishBySite.isActived) {
				this.setState({
					menuId: res.data.menuPublishBySite._id,
					dishes: [...res.data.menuPublishBySite.dishes],
					condition: res.data.menuPublishBySite
				})
			}
		})
		.catch((error) => {
			console.log(error)
		})
  }

	async handleMinus (item, number) {
		console.log(number)
		console.log(item)
		console.log(window.clicks)
		// await this.props.client.mutate({
		// 	mutation: ORDER_DISH,
		// 	variables: {
		// 		input: {
		// 			menuId: this.state.menuId,
		// 			dishId: item._id,
		// 			count: 2
		// 		}
		// 	}
		// })
		// .then((res) => {
		// 	console.log(res)
		// 	let a = this.state.dishCountOrdered
		// 	this.setState({
		// 		dishCountOrdered: a--
		// 	})
		// 	console.log(this.state.dishCountOrdered)
		// })
		// .catch((error) => {
		// 	console.dir(error)
		// })
		this.handleCountOrder()
	}

	async handlePlus (item) {
		console.log(item)
		await this.props.client.mutate({
			mutation: ORDER_DISH,
			variables: {
				input: {
					menuId: this.state.menuId,
					dishId: item._id,
					count: 2
				}
			}
		})
		.then((res) => {
			console.log(res)
			// this.setState({
			// 	dishCountOrdered: this.state.dishCountOrdered++
			// })
			this.setState({ dishCountOrdered: this.myRef.current.value+1})
			console.log(this.state.dishCountOrdered)
		})
		.catch((error) => {
			console.dir(error)
		})
	}

	handleCountOrder (number) {
		// let count = number
		// this.props.client.mutate({
		// 	mutation: ORDER_DISH,
		// 	variables: {
		// 		input: {
		// 			menuId: this.state.menuId,
		// 			dishId: item._id,
		// 			count: 1
		// 		}
		// 	}
		// })
		// .then(res => {
		// 	console.log(res.data)
		// 	console.log(count)
		// })
		// .catch((error) => {
		// 	console.dir(error)
		// })
		return number
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
		console.log(myRef)
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
					placeholder='Chọn Site'
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
									<div ref={myRef}>{this.state.dishCountOrdered}</div>
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
											<div ref={this.myRef}>{this.state.dishCountOrdered}</div>
										</List.Item>
									)}
								/>
							:	'Hệ thống đã khóa'	
						)
				}
			</React.Fragment>
		)
	}
}

const MENU_BY_SELECTED_SITE = gql`
	{
		menuPublishBySite {
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

const ORDERS_DISH = gql`
	query ordersDish($menuId: String!, $dishId: String!) {
		ordersDish(menuId: $menuId, dishId: $dishId) {
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

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
  	orderDish(input: $input)
	}
`

const UPDATE_DISH = gql`
	mutation updateDish($menuId: String!, $dishId: String!, $dishInput: DishInput!) {
		updateDish(menuId: $menuId, dishId: $dishId, dishInput: $dishInput)
	}
`

export default withApollo(Order)
