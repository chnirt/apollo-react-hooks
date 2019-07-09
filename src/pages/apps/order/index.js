import React from 'react'
import { Select, Button, List } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import './index.css'

class Order extends React.Component {
	state = {
		sites: [],
		menus: [],
		sitesAllow: []
	}

	componentDidMount () {
		this.handleGetSite()
		this.handleGetMenu()
	}

	handleGetSite (siteName) {
    if (String(siteName).length > 0) {
      this.props.client.query({
        query: SITES,
        variables: {
          siteName: String(siteName)
        }
      })
			.then(res => {
				this.setState({
					sites: [...res.data.sites]
				})
			})
			.catch((error) => {
				console.log(error)
			})
    }
	}

	handleGetMenu (menu) {
    if (String(menu).length > 0) {
      this.props.client.query({
        query: MENUS,
        variables: {
          menu: String(menu)
        }
      })
			.then(res => {
				console.log('aaaa',res.data.menus)
				console.log(res.data.menus.map(site => site.isActived))
				this.setState({
					menus: [...res.data.menus]
				})
			})
			.catch((error) => {
				console.log(error)
			})
    }
	}

	siteAccess (site) {
    if (String(site).length > 0) {
			window.localStorage.sites.split(',').map(aSite =>
				this.props.client.query({
					query: SITE,
					variables: {
						_id: aSite
					}
				})
				.then(res => {
					console.log(res.data)
					this.setState({
						siteAllow: [...res.data]
					})
				})
				.catch((error) => {
					console.log(error)
				})
			)
    }
	}

	handleCurrentSite (currentSite) {
		if (String(currentSite).length > 0) {
      this.props.client.query({
        query: MENU_BY_CURRENTSITE,
        variables: {
          currentSite: String(currentSite)
        }
      })
        .then(res => {
					console.log('aaaa',res.data)
          // this.setState({
					// 	menus: [...res.data.Menus]
          // })
        })
        .catch((error) => {
          console.log(error)
        })
    }
	}

	render() {
		const getSite = this.state.sites.map(site =>
			<Select.Option key={site.name}>
					{site.name}
			</Select.Option>
		)
		const getDishes = this.state.menus.map(dish =>
			<List.Item actions={[<Button className='minus'>-</Button>, <Button className='plus'>+</Button>]}>
				<List.Item.Meta
					title='dsadasdas'
				/>
			</List.Item>
		)
		return (
			<React.Fragment>
				<Button onClick={() => this.siteAccess()}>
					Test
				</Button>
				<Select
					showSearch
					style={{ width: '100%', marginBottom: 20 }}
					placeholder='Chọn Site'
					optionFilterProp='children'
					filterOption={(input, option) =>
						option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
					onSelect={() => this.handleGetSite()}
				>
					{getSite}
				</Select>

				<label style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>
					Danh sách món
				</label>
				
				<List
					className='demo-loadmore-list'
					dataSource={getSite}
					renderItem={item => (
						<List.Item actions={[<Button className='minus'>-</Button>, <Button className='plus'>+</Button>]}>
								<List.Item.Meta
									title='dsadasdas'
								/>
						</List.Item>
					)}
				/>
			</React.Fragment>
		)
	}
}

const MENUS = gql`
	{
		menus {
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
const SITES = gql`
	{
  sites {
    _id
    name
    createdAt
    updatedAt
  }
}
`

const SITE = gql`
	query site($_id: String!) {
  site(_id: $_id) {
    _id
    name
    createdAt
    updatedAt
  }
}
`

const MENU_BY_CURRENTSITE = gql`
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
