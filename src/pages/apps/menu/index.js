import React from 'react'
import { Row } from 'antd'
import MenuList from './MenuList'
import './index.less'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

function Menu(props) {
	const menus = props.data.menus
	return (
		<div className="menu">
			<Row className="menu-list">
				{menus.map(menu => (
					<MenuList menuData={menu}>{menu.name}</MenuList>
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
			isActived
		}
	}
`

export default HOCQueryMutation([
	{
		query: GET_ALL_MENU,
		variables: {}
	}
])(Menu)
