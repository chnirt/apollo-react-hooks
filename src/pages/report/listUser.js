import React from 'react'
import { Icon, Button } from 'antd'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'

import './index.css'

function ListUser(props) {
	const handlePlus = () => {
		const { menuId, dishId, dishCount, countProps, orderId, updateOrder } = props
		// console.log(countProps, '-----order')
		// console.log(menuId, '-----menuId')
		// console.log(dishId, '-----dishId')
		// console.log(dishCount, '-----dishCount')
		if (countProps < dishCount) {
			updateOrder({
				mutation: UPDATE_ORDER,
				variables: {
					id: orderId,
					input: {
						menuId,
						dishId,
						count: countProps + 1
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
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	const handleMinus = () => {
		const { menuId, dishId, countProps, orderId, updateOrder } = props
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
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	const {
		orderByMenu,
		dishId,
		getUserName,
		dishCount,
		countProps,
		userId
	} = props
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
						<Button
							disabled={countProps === 0}
							style={{ marginRight: 10 }}
							onClick={() => handleMinus(countProps)}
							name="minus"
						>
							<Icon type="minus" />
						</Button>
						<Button
							disabled={
								countProps >= dishCount ||
								userId !== '40eb5c20-9e41-11e9-8ded-f5462f3a1447'
							}
							onClick={() => handlePlus(countProps)}
							name="add"
						>
							<Icon type="plus" />
						</Button>
					</div>
				</div>
			) : null}
		</>
	)
}

const GET_USER_NAME = gql`
	query user($_id: String!) {
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
