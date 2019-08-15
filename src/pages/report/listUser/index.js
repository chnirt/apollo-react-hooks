import React, { useState } from 'react'
import { Icon, Button } from 'antd'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'

// import { HOCQueryMutation } from '../../components/shared/hocQueryAndMutation'
import '../index.css'

function ListUser(props) {
	const { menuId, dishId, dishCount, countProps, orderId } = props
	const [loading, setLoading] = useState(false)

	const handleMinus = () => {
		// const { mutate, menuId, dishId, countProps, orderId } = props
		setLoading(true)
		if (countProps > 0) {
			props
				.updateOrder({
					variables: {
						id: orderId,
						input: {
							menuId,
							dishId,
							count: countProps - 1
						}
					},
					refetchQueries: [
						{
							query: ORDER_BY_MENU,
							variables: {
								menuId
							}
						},
						{
							query: ORDER_COUNT_BY_MENU,
							variables: {
								menuId
							}
						}
					]
				})
				.then(() => {
					setLoading(false)
					// console.log(res)
				})
				.catch(err => {
					setLoading(false)
					console.log(err)
				})
		}
	}

	const { orderByMenu, getUserName } = props
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
							disabled={countProps === 0 || loading}
							loading={loading}
							style={{ marginRight: 10 }}
							onClick={() => handleMinus(countProps)}
							name="minus"
						>
							<Icon type="minus" />
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
			_id
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
const ORDER_COUNT_BY_MENU = gql`
	query($menuId: String!) {
		ordersCountByMenu(menuId: $menuId) {
			count
			menuId
			dishId
		}
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
		name: 'updateOrder',
		options: {}
	}),
	graphql(ORDER_COUNT_BY_MENU, {
		name: ' orderCountByMenu'
	})
)(withTranslation('translations')(ListUser))
