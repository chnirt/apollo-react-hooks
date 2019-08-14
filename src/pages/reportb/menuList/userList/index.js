import React, { useState } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Button, Spin } from 'antd'

const UserList = ({
	orderCountIn,
	menuId,
	dishId,
	dishCount,
	orderId,
	getUser,
	updateOrder
}) => {
	const [orderCount, setOrderCount] = useState(orderCountIn)
	const { user } = getUser
	const handleChange = type => {
		if (orderCount <= dishCount) {
			updateOrder({
				mutation: UPDATE_ORDER,
				variables: {
					id: orderId[0]._id,
					input: {
						menuId,
						dishId,
						count: type === 'add' ? orderCount + 1 : orderCount - 1
					}
				}
			})
				.then(() => {
					setOrderCount(type === 'add' ? orderCount + 1 : orderCount - 1)
				})
				.catch(err => {
					console.log(err)
				})
		}
	}
	return (
		<>
			{user && orderCount !== 0 ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 10
					}}
				>
					{`${user.fullName} ${orderCount}/${dishCount}`}
					<div>
						<Button
							icon="minus"
							shape="circle"
							disabled={orderCount === 0}
							style={{ marginRight: 10 }}
							onClick={() => handleChange('sub')}
						/>
						<Button
							icon="plus"
							shape="circle"
							disabled={orderCount === dishCount || user.username !== 'admin'}
							onClick={() => handleChange('add')}
						/>
					</div>
				</div>
			) : (
				// <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				<Spin style={{ marginLeft: '40%' }} tip="Loading..." />
			)}
		</>
	)
}

const GET_USER_NAME = gql`
	query($_id: String!) {
		user(_id: $_id) {
			username
			fullName
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
		name: 'getUser',
		options: props => {
			return {
				variables: {
					_id: props.user.userId
				},
				fetchPolicy: 'no-cache'
			}
		}
	}),
	graphql(UPDATE_ORDER, {
		name: 'updateOrder'
	})
)(UserList)
