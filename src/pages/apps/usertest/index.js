import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { Card, Typography, Button } from 'antd'
import UserList from './userlisttest'
import UserModal from './usermodaltest'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

const { Title } = Typography

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			_id
			username
			fullName
			isActive
			isLocked
		}
	}
`

const USER_LOCK_AND_UNLOCK = gql`
	mutation($_id: String!) {
		lockAndUnlockUser(_id: $_id)
	}
`

const USER_DELETE = gql`
	mutation($_id: String!) {
		deleteUser(_id: $_id)
	}
`

const Users = ({ onUserSelected, showModal }) => (
	<Query
		query={GET_ALL_USERS}
		variables={{
			offset: 0,
			limit: 100
		}}
	>
		{({ loading, error, data }) => {
			if (loading) return 'Loading...'
			if (error) return `Error! ${error.message}`
			return (
				<Card
					title={
						<Title style={{ color: '#ffffff' }} level={3}>
							Manage user
						</Title>
					}
					bordered={false}
					extra={
						<Button type="primary" block onClick={showModal}>
							Create user
						</Button>
					}
					headStyle={{
						border: 0
					}}
					// bodyStyle={{
					// 	padding: 0
					// }}
					style={{ backgroundColor: 'transparent' }}
				>
					{data.users
						.filter(user => user.isActive)
						.map(user => (
							<Mutation
								mutation={USER_LOCK_AND_UNLOCK}
								key={user._id}
								refetchQueries={[
									{
										query: GET_ALL_USERS,
										variables: {
											offset: 0,
											limit: 100
										}
									}
								]}
							>
								{lockAndUnlockUser => (
									<Mutation
										mutation={USER_DELETE}
										key={user._id}
										refetchQueries={[
											{
												query: GET_ALL_USERS,
												variables: {
													offset: 0,
													limit: 100
												}
											}
										]}
									>
										{deleteUser => (
											<UserList
												key={user._id}
												{...user}
												onUserSelected={onUserSelected}
												onLockAndUnlock={() => {
													lockAndUnlockUser({
														variables: { _id: user._id }
													}).then(res => {
														//  console.log('hello', res)
														if (res.data.lockAndUnlockUser === true)
															openNotificationWithIcon(
																'success',
																'success',
																'Success',
																user._id
															)
													})
												}}
												onDelete={() =>
													deleteUser({
														variables: { _id: user._id }
													}).then(res => {
														//  console.log('hello', res)
														if (res.data.deleteUser === true)
															openNotificationWithIcon(
																'success',
																'success',
																'Success',
																user._id
															)
													})
												}
											/>
										)}
									</Mutation>
								)}
							</Mutation>
						))}
				</Card>
			)
		}}
	</Query>
)

function index() {
	const [visible, setVisible] = useState(false)
	const [userId, setUserId] = useState('')

	function showModal() {
		setVisible(true)
	}

	function handleOk() {
		console.log('handleOk')
		setVisible(false)
	}

	function handleCancel() {
		console.log('handleCancel')
		setUserId('')
		setVisible(false)
	}

	function onUserSelected(value) {
		console.log(value)
		setUserId(value)
		showModal()
	}

	return (
		<>
			<Users showModal={showModal} onUserSelected={onUserSelected} />
			<UserModal
				userId={userId}
				visible={visible}
				handleOk={handleOk}
				handleCancel={handleCancel}
			/>
		</>
	)
}

export default index
