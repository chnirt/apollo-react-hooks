import React from 'react'
import { Select, Button, List } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import './index.css'

class Order extends React.Component {
	state = {
		sites: [],
		menuId: null,
		dishes: []
	}

	componentDidMount () {
		this.handleGetSites(window.localStorage.getItem('sites').split(','))
	}

	handleChange (selectedItems) {
		window.localStorage.setItem('currentsite', selectedItems)
		this.props.client.query({
			query: MENU_BY_SELECTED_SITE
		})
		.then(res => {
			console.log('aaaa',res.data.menuPublishBySite._id)
			this.setState({
				menuId: res.data.menuPublishBySite._id
			})
		})
		.catch((error) => {
			console.log(error)
		})
  }

	handleGetSites (sitesIds) {
		this.props.client.query({
			query: SITES_BY_IDS,
			variables: {
				ids: sitesIds
			}
		})
		.then(res => {
			this.setState({
				sites: [...res.data.sitesByIds]
			})
		})
		.catch((error) => {
			console.log(error)
		})
	}

	handleGetDishes (menuId) {
		this.props.client.query({
			query: MENU,
			variables: {
				id: String(menuId)
			}
		})
		.then(res => {
			this.setState({
				dishes: [...res.data.menu.dishes]
			})
			console.log(this.state.dishes)
		})
		.catch((error) => {
			console.log(error)
		})
	}

	render() {
		const currentsite = window.localStorage.getItem('currentsite')
		const options = this.state.sites.map(item =>
			<Select.Option value={item._id} key={item._id}>
					{item.name}
			</Select.Option>
		)
		// const x = this.state.sites.map(site =>
		// 	if (site._id === currentsite) {
		// 		return site._id
		// 	}
		// )
		// const getDishes = this.state.menus.map(dish =>
		// 	<List.Item actions={[<Button className='minus'>-</Button>, <Button className='plus'>+</Button>]}>
		// 		<List.Item.Meta
		// 			title='dsadasdas'
		// 		/>
		// 	</List.Item>
		// )
		return (
			<React.Fragment>
				<Button onClick={() => this.handleGetDishes(this.state.menuId)}>
					get dishes
				</Button>
				<Select
					showSearch
					style={{ width: '100%', marginBottom: 20 }}
					placeholder='Chọn Site'
					defaultValue={currentsite}
					onChange={(e) => this.handleChange(e)}
				>
					{options}
				</Select>

				<label style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>
					Danh sách món
				</label>
				
				<List
					className='demo-loadmore-list'
					dataSource={this.state.dishes}
					renderItem={item => (
						<List.Item actions={[<Button className='minus'>-</Button>, <Button className='plus'>+</Button>]}>
								<List.Item.Meta
									title={item.name}
									description={item.count}
								/>
						</List.Item>
					)}
				/>
			</React.Fragment>
		)
	}
}

const SITES_BY_IDS = gql`
	query sitesByIds($ids: [String!]) {
		sitesByIds(ids: $ids) {
			_id
			name
			createdAt
			updatedAt
		}
	}
`

const MENU = gql`
	query	menu($id: String!) {
		menu(id: $id) {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
			isPublished
			isLocked
			isActived
			createAt
			updateAt
		}
	}
`

const MENU_BY_SELECTED_SITE = gql`
	{
  menuPublishBySite {
    _id
    name
    isPublished
    isActived
    isLocked
  }
}
`

export default withApollo(Order)
