import React from 'react'
import { Select, Button, List } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import './index.css'

class Order extends React.Component {
	state = {
		visible: false,
		isPublish: false,
		sites: [],
		menus: []
	}

	showModal = () => {
		this.setState({ visible: true })
	}

	handleCancel = () => {
		this.setState({ visible: false })
	}

	handleCreate = () => {
		const { form } = this.formRef.props
		form.validateFields((err, values) => {
			if (err) {
				return
			}

			console.log('Received values of form: ', values)
			form.resetFields()
			this.setState({ visible: false })
		})
	}

	saveFormRef = formRef => {
		this.formRef = formRef
	}

	isPublish = () => {
		this.setState({
			isPublish: !this.state.isPublish
		})
	}

	componentDidMount () {
		this.handleGetSite()
		this.handleGetMenu()
	}

	// getData = callback => {
  //   reqwest({
  //     url: fakeDataUrl,
  //     type: 'json',
  //     method: 'get',
  //     contentType: 'application/json',
  //     success: res => {
  //       callback(res)
  //     },
  //   })
  // }

  // onLoadMore = () => {
  //   this.setState({
  //     loading: true,
  //     list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
  //   })
  //   this.getData(res => {
  //     const data = this.state.data.concat(res.results)
  //     this.setState(
  //       {
  //         data,
  //         list: data,
  //         loading: false,
  //       },
  //       () => {
  //         window.dispatchEvent(new Event('resize'))
  //       },
  //     )
	// 	})
	// }	
		

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
					console.log('aaaa',res.data.Menus)
          this.setState({
						menus: [...res.data.menus]
          })
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
			<Button key={dish.dishes.name} disabled>
				{dish.dishes.name}
			</Button>
		)
		return (
			<React.Fragment>
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

				{
					getDishes
				}
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
		Menus {
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

export default withApollo(Order)
