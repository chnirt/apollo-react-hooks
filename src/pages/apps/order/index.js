import React from 'react'
import { Select, Button, List } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import './index.css'

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

	handleMinus (e, item) {
		console.log(item)
	}

	handlePlus (item) {
		console.log(item)
	}

	handleOrder (e) {
		this.props.client.mutate({
			mutation: ORDER_DISH,
			variables: {
				input: {
					menuId: this.state.menuId,
					dishId: this.state.dishes[0]._id,
					count: 1
				}
			}
		})
		.then((res) => {
			console.log(res)
		})
		.catch((error) => {
			console.dir(error)
		})
	}

	render() {
		const currentsite = window.localStorage.getItem('currentsite')
		const options = JSON.parse(window.localStorage.getItem('sites')).map(item =>
			<Select.Option value={item._id} key={item._id}>
					{item.name}
			</Select.Option>
		)
		// consosle.log(this.state.condition)
		return (
			<React.Fragment>
				<Select
					showSearch
					style={{ width: '100%', marginBottom: 20 }}
					placeholder='Chọn Site'
					defaultValue={currentsite}
					onChange={(e) => this.handleChange(e)}
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
								<List.Item actions={[<Button className='minus' onClick={(e, item) => this.handleMinus(e, item)}>-</Button>, <Button className='plus' onClick={(item) => this.handlePlus(item)}>+</Button>]}>
									<List.Item.Meta
										title={item.name}
										description={item.count}
									/>
								</List.Item>
							)}
						/>
					: ( this.state.condition.isActived === true && this.state.condition.isLocked === true && this.state.condition.isPublished === true
							? <List
									dataSource={this.state.dishes}
									renderItem={item => (
										<List.Item actions={[<Button className='minus' disabled>-</Button>, <Button className='plus' disabled>+</Button>]}>
											<List.Item.Meta
												title={item.name}
												description={item.count}
											/>
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

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
  	orderDish(input: $input)
	}
`

export default withApollo(Order)
