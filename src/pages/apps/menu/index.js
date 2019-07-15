import React from 'react'
import { Row, Divider, Button } from 'antd'
import MenuList from './MenuList'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

function Menu(props) {
	const menus = props.data.menus

	function onClick() {
		props.history.push('/🥢')
	}

	return (
		<div className="menu">
			<Button shape="circle" icon="left" onClick={onClick} />
			<Divider />
			<Row className="menu-list">
				{menus.map((menu, index) => (
					<MenuList key={index} menuData={menu}>
						{menu.name}
					</MenuList>
				))}
			</Row>
		</div>
	)
}

const GET_ALL_MENU = gql`
	query {
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
			isActive
		}
	}
`

export default HOCQueryMutation([
	{
		query: GET_ALL_MENU
	}
])(Menu)
