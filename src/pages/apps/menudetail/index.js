import React from 'react'
import { Button, Divider } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'


function MenuDetail (props) {
	console.log(props)
	return (
		<div className='menu'>
				<Button
					shape='circle'
					icon='left'
					onClick={() => props.history.push('/🥢/menu')}
				/>
				<Divider />
		</div>
	)
}

const GET_MENU = gql`
	query menu($id: String!) {
		menu(id: $id) {
			_id
			name
			siteId
			shopId
		}
	}
`

const PUBLISH_UNPUBLISH = gql`
	mutation publishAndUnpublish($id: String!) {
		publishAndUnpublish(id: $id)
	}
`

const GET_SHOPS_BY_SITE = gql`
	query ($siteId: String!) {
  siteShopsBySiteId(siteId: $siteId){
    siteId
    shopId
    name
  }
}
`

const UPDATE_MENU = gql`
	mutation updateMenu ($id: String!, $menuInfo: MenuInfo!) {
		updateMenu (id: $id, menuInfo: $menuInfo)
	}
`

export default HOCQueryMutation([
	{
		query: GET_SHOPS_BY_SITE,
		options: props => ({
			variables: {
				siteId: props.match.params.siteId
			}
		})
	},
	{
		query: GET_MENU,
		options: props => ({
			variables: {
				id: props.match.params.menuId
			}
		}),
		name: 'menuById'
	}
])(MenuDetail)
