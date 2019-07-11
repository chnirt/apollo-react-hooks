import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

function UserB(props) {
	const [users, setUsers] = useState([])

	useEffect(() => {
		// code to run on component mount
		props.client
			.query({
				query: USERS,
				variables: { offset: 0, limit: 100 },
				options: { fetchPolicy: 'network-only', awaitRefetchQueries: true }
			})
			.then(res => {
				// console.log(res.data.users)
				setUsers(res.data.users)
			})
			.catch(err => {
				// console.log(err)
			})
	})

	function onCreate() {
		console.log('Create')
	}

	function onEdit(_id) {
		console.log('Edit', _id)
	}

	function onLockAndUnlock(_id) {
		console.log('LockAndUnlock', _id)
		props.client
			.mutate({
				mutation: USER_LOCK_AND_UNLOCK,
				variables: {
					_id
				},
				options: { fetchPolicy: 'network-only' },
				refetchQueries: [
					{
						query: USERS,
						variables: { offset: 0, limit: 100 }
					}
				]
			})
			.then(res => {
				// console.log(res)
				openNotificationWithIcon('success', 'success', 'Success', _id)
			})
			.catch(err => {
				// console.log(err)
				const errors = err.graphQLErrors.map(error => error.message)
				openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
			})

		// props.client.refetchQueries([
		// 	{
		// 		query: USERS,
		// 		variables: { offset: 0, limit: 100 }
		// 	}
		// ])
	}

	function onDelete(_id) {
		console.log('Delete', _id)
	}

	return (
		<>
			<Row
				style={{
					height: 'calc(100vh - 60px)'
				}}
			>
				<Card
					title="Manage user"
					bordered={false}
					extra={
						<Button type="primary" block onClick={onCreate}>
							Create a new user
						</Button>
					}
					headStyle={{
						border: 0
					}}
				>
					{users &&
						users.map((item, i) => (
							<Col
								key={i}
								xs={{
									span: 22,
									offset: 1
								}}
								sm={{
									span: 10,
									offset: 1
								}}
								md={{
									span: 10,
									offset: 1
								}}
								lg={{
									span: 4,
									offset: 1
								}}
								style={{
									marginBottom: 20
								}}
							>
								<Card
									actions={[
										<Icon type="edit" onClick={() => onEdit(item._id)} />,
										item.isLocked ? (
											<Icon
												type="unlock"
												onClick={() => onLockAndUnlock(item._id)}
											/>
										) : (
											<Icon
												type="lock"
												onClick={() => onLockAndUnlock(item._id)}
											/>
										),
										<Icon type="delete" onClick={() => onDelete(item._id)} />
									]}
								>
									{item.fullName}
								</Card>
							</Col>
						))}
				</Card>
			</Row>
		</>
	)
}

const USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			_id
			username
			password
			fullName
			isLocked
			reason
			isActive
			createdAt
			updatedAt
		}
	}
`

const USER_LOCK_AND_UNLOCK = gql`
	mutation($_id: String!) {
		lockAndUnlockUser(_id: $_id)
	}
`

export default withApollo(withRouter(UserB))
