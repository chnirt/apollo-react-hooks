import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Divider } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import ListDishes from './listDishes'

const Order = props => {
	const [menuId, setMenuId] = useState()
	const [isPublished, setIsPublished] = useState()
	const [isActive, setisActive] = useState()
	const [dishes, setDishes] = useState()

	useEffect(() => {
		// eslint-disable-next-line no-use-before-define
		handleGetMenu()
	}, [])

	function handleGetMenu() {
		if (
			props.data.menuPublishBySite.isPublished === true &&
			props.data.menuPublishBySite.isActive === true
		) {
			setMenuId(props.data.menuPublishBySite._id)
			setDishes(props.data.menuPublishBySite.dishes)
			setIsPublished(props.data.menuPublishBySite.isPublished)
			setisActive(props.data.menuPublishBySite.isActive)
		}
	}

	return (
		<React.Fragment>
			<Button
				shape="circle"
				icon="left"
				onClick={() => props.history.push('/🥢')}
			/>
			<Divider />
			<Row>
				<Col span={22} offset={1}>
					<ListDishes
						menuId={menuId}
						dishes={dishes}
						isPublished={isPublished}
						isActive={isActive}
					/>
				</Col>
			</Row>
		</React.Fragment>
	)
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
		options: () => ({
			variables: {
				siteId: localStorage.getItem('currentsite')
			},
			fetchPolicy: 'network-only'
		})
	}
])(Order)
