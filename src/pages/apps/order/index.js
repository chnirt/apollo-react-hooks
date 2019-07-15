import React from 'react'
import { Select, Row, Col, Button, Divider } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'
import ListDishes from './listDishes'

class Order extends React.Component {
	state = {
		siteId: window.localStorage.getItem('currentsite')
	}

	async handleChange (selectedItems) {
		await window.localStorage.setItem('currentsite', selectedItems)
		if (this.props.data.menuPublishBySite.isPublished === true && this.props.data.menuPublishBySite.isActive) {
			this.setState({
				siteId: selectedItems
			})
		}

		if(this.props.data.error) {
			console.log(this.props.data.error)
		}
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

export default HOCQueryMutation([
	{
    query: MENU_BY_SELECTED_SITE,
    options: props => ({
			variables: {
				siteId: window.localStorage.getItem('currentsite')
			}
		})
  }
])(Order)