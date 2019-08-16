import React from 'react'
import { Icon } from 'antd'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'

import './index.css'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

function ListUser(props) {
	const handleMinus = () => {
		const { menuId, dishId, countProps, orderId, updateOrder, t } = props
		if (countProps > 0) {
			updateOrder({
				mutation: UPDATE_ORDER,
				variables: {
					id: orderId,
					input: {
						menuId,
						dishId,
						count: countProps - 1
					}
				},
				refetchQueries: () => [
					{
						query: ORDER_BY_MENU,
						variables: {
							menuId
						}
					}
				]
			})
				.then(() => {
					// console.log(res)
					openNotificationWithIcon(
						'success',
						'success',
						'Success',
						t('src.pages.common.success')
					)
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	const { orderByMenu, dishId, getUserName, dishCount, countProps } = props

	return (
		<>
			{orderByMenu.dishId === dishId && getUserName.user && countProps !== 0 ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 10
					}}
				>
					{`${getUserName.user.fullName} ${countProps}/${dishCount}`}
					<div>
						<Icon type="minus" onClick={() => handleMinus(countProps)} />
					</div>
				</div>
			) : null}
		</>
	)
}

const GET_USER_NAME = gql`
	query user($_id: ID!) {
		user(_id: $_id) {
			username
			fullName
		}
	}
`

const ORDER_BY_MENU = gql`
	query ordersByMenu($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
			userId
			dishId
			count
			_id
		}
	}
`

const UPDATE_ORDER = gql`
	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
		updateOrder(id: $id, input: $input)
	}
`

export default compose(
	graphql(GET_USER_NAME, {
		name: 'getUserName',
		options: props => {
			return {
				variables: {
					_id: props.userId
				}
			}
		}
	}),
	graphql(UPDATE_ORDER, {
		name: 'updateOrder'
	})
)(ListUser)
