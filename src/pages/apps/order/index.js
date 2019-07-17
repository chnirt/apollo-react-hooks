import React from 'react'
import { Select, Button, List, Divider } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

class Order extends React.Component {
	state = {
		menuId: null,
		dishes: []
	}

	componentDidMount() {
		this.handleDefaultDishes()
	}

	async handleDefaultDishes() {
		if (
			this.props.data.menuPublishBySite.isPublished === true &&
			this.props.data.menuPublishBySite.isActive === true
		) {
			this.setState({
				menuId: this.props.data.menuPublishBySite._id,
				dishes: [...this.props.data.menuPublishBySite.dishes].map(dish => ({
					...dish,
					orderNumber: 0
				}))
			})
		}

		if (this.props.data.error) {
			console.log(this.props.data.error)
		}
	}

	async handleChange(selectedItems) {
		await window.localStorage.setItem('currentsite', selectedItems)

		if (
			this.props.data.menuPublishBySite.isPublished === true &&
			this.props.data.menuPublishBySite.isActive
		) {
			this.setState({
				menuId: this.props.data.menuPublishBySite._id,
				dishes: [...this.props.data.menuPublishBySite.dishes].map(dish => ({
					...dish,
					orderNumber: 0
				}))
			})
		}

		if (this.props.data.error) {
			console.log(this.props.data.error)
		}
	}

	async createOrder(item) {
		await this.props.mutate
			.orderDish({
				variables: {
					input: {
						menuId: this.state.menuId,
						dishId: item._id,
						count: item.orderNumber
					}
				}
			})
			.then(res => {
				res ? console.log('success') : console.log('something went wrong')
			})
			.catch(error => {
				console.dir(error)
			})
	}

	async selectDishHandler(index, item) {
		let theDish = [...this.state.dishes]
		await this.state.dishes.map(dish =>
			dish._id === item._id && dish.orderNumber < item.count
				? (theDish[index] = {
						...theDish[index],
						orderNumber: item.orderNumber++
				  })
				: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		)

		await this.setState({ dishes: theDish })
		await this.createOrder(item)
	}

	async unselectDishHandler(index, item) {
		let theDish = [...this.state.dishes]
		await this.state.dishes.map(dish =>
			dish._id === item._id && dish.orderNumber > 0
				? (theDish[index] = {
						...theDish[index],
						orderNumber: item.orderNumber--
				  })
				: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		)

		await this.setState({ dishes: theDish })
		await this.createOrder(item)
	}

	async handleMinus(item) {
		const index = this.state.dishes.map(dish => '-').indexOf(item._id)
		await this.unselectDishHandler(index, item)
	}

	async handlePlus(item) {
		const index = this.state.dishes.map(dish => '+').indexOf(item._id)
		this.selectDishHandler(index, item)
	}

	async handleConfirmOrder(item) {
		this.state.dishes.map(dish =>
			dish.orderNumber !== 0
				? this.props.mutate
						.confirmOrder({
							variables: {
								menuId: this.state.menuId,
								dishId: dish._id
							}
						})
						.then(res => {
							res
								? alert('Xác nhận thành công')
								: console.log('something went wrong')
						})
						.catch(error => {
							console.dir(error)
						})
				: null
		)
	}

	totalOrder(item) {
		let total = 0
		return total
	}

	render() {
		const { data } = this.props
		const currentsite = window.localStorage.getItem('currentsite')
		const options = JSON.parse(window.localStorage.getItem('sites')).map(
			item => (
				<Select.Option value={item._id} key={item._id}>
					{item.name}
				</Select.Option>
			)
		)
		const time = new Date(Date.now()).getHours()
		const confirmButton =
			time >= 12 && time < 14 ? (
				<Button
					onClick={() => this.handleConfirmOrder()}
					style={{ display: 'block', textAlign: 'center' }}
				>
					Xác nhận
				</Button>
			) : null
		return (
			<React.Fragment>
				<Button
					shape="circle"
					icon="left"
					onClick={() => this.props.history.push('/🥢')}
				/>
				<Divider />
				<Select
					style={{ width: '100%', marginBottom: 20 }}
					placeholder="Chọn khu vực"
					defaultValue={currentsite}
					onChange={() => this.setState({ dishes: [] })}
					onSelect={e => this.handleChange(e)}
				>
					{options}
				</Select>

				{data.menuPublishBySite.isActive === true &&
				data.menuPublishBySite.isLocked === false &&
				data.menuPublishBySite.isPublished === true ? (
					<>
						<List
							dataSource={this.state.dishes}
							renderItem={item => (
								<List.Item
									key={item._id}
									actions={[
										<Button
											className="minus"
											onClick={() => this.handleMinus(item)}
										>
											-
										</Button>,
										<Button
											className="plus"
											onClick={() => this.handlePlus(item)}
										>
											+
										</Button>
									]}
								>
									<List.Item.Meta
										title={item.name}
										description={`${this.totalOrder(item)}/${item.count}`}
									/>
									<div>{item.orderNumber}</div>
								</List.Item>
							)}
						/>
						{confirmButton}
					</>
				) : data.menuPublishBySite.isActive === true &&
				  data.menuPublishBySite.isLocked === true &&
				  data.menuPublishBySite.isPublished === true ? (
					<>
						<List
							dataSource={this.state.dishes}
							renderItem={item => (
								<List.Item
									key={item._id}
									actions={[
										<Button className="minus" disabled>
											-
										</Button>,
										<Button className="plus" disabled>
											+
										</Button>
									]}
								>
									<List.Item.Meta
										title={item.name}
										description={`${this.totalOrder(item)}/${item.count}`}
									/>
									<div>{item.orderNumber}</div>
								</List.Item>
							)}
						/>
						{confirmButton}
					</>
				) : (
					<div>Hệ thống đã khóa</div>
				)}
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
	},
	{
		mutation: CONFIRM_ORDER,
		name: 'confirmOrder',
		options: {}
	}
])(Order)
