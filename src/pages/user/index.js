import React, { useState } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Row, Button, Card, Modal, Typography, List } from 'antd'
import { withTranslation } from 'react-i18next'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

import UserModal from './usermodal'

const { confirm } = Modal
const { Title } = Typography

function User(props) {
	const [visible, setVisible] = useState(false)
	const [userId, setUserId] = useState('')

	function showModal(_id) {
		// console.log(_id)
		setUserId(_id)
		setVisible(true)
	}

	function hideModal() {
		setVisible(false)
		setUserId('')
	}

	function onLockAndUnlock(_id) {
		// console.log("onLockAndUnlock", _id)
		props
			.lockAndUnlockUser({
				variables: {
					_id
				},
				refetchQueries: [
					{
						query: GET_ALL_USERS,
						variables: {
							offset: 0,
							limit: 100
						}
					}
				]
			})
			.then(res => {
				//  console.log('hello', res)
				if (res.data.lockAndUnlockUser === true)
					openNotificationWithIcon('success', 'success', t('Success'), null)
			})
			.catch(err => {
				// console.log(err)
				const errors = err.graphQLErrors.map(error => error.message)
				openNotificationWithIcon('error', 'failed', t('Failed'), errors[0])
			})
	}

	function onDelete(_id) {
		// console.log("onDelete", _id)
		confirm({
			title: t('DeleteUser'),
			content: t('ConfirmDelete'),
			onOk() {
				// console.log('OK');
				props
					.deleteUser({
						variables: {
							_id
						},
						refetchQueries: [
							{
								query: GET_ALL_USERS,
								variables: {
									offset: 0,
									limit: 100
								}
							}
						]
					})
					.then(res => {
						// console.log(res)
						if (res.data.lockAndUnlockUser === true)
							openNotificationWithIcon('success', 'success', t('Success'), null)
					})
					.catch(err => {
						// console.log(err)
						const errors = err.graphQLErrors.map(error => error.message)
						openNotificationWithIcon('error', 'failed', t('Failed'), errors[0])
					})
			},
			onCancel() {
				// console.log('Cancel');
			}
		})
	}

	const { getUsers, t } = props
	const { users } = getUsers

	return (
		<>
			<Row>
				<Card
					title={
						<div>
							<Title style={{ color: '#ffffff' }} level={3}>
								{t('Manage User')}
							</Title>
						</div>
					}
					bordered={false}
					extra={
						<div>
							<Button type="primary" block onClick={() => showModal()}>
								{t('Add user')}
							</Button>
						</div>
					}
					headStyle={{
						border: 0
					}}
					bodyStyle={{
						padding: 0
					}}
					style={{ backgroundColor: 'transparent' }}
				>
					<List
						pagination={{
							pageSize: 8
						}}
						style={{
							margin: '1em',
							padding: '1em',
							backgroundColor: '#fff',
							borderRadius: '.5em'
						}}
						dataSource={users && users.filter(item => item.isActive)}
						renderItem={user => (
							<List.Item
								actions={[
									<Button
										onClick={() => showModal(user._id)}
										icon="edit"
										type="link"
										name="btnEditUser"
									/>,
									<Button
										onClick={() => onLockAndUnlock(user._id)}
										icon={user.isLocked ? 'lock' : 'unlock'}
										type="link"
										name="btnLockNUnlockUser"
									/>,
									<Button
										onClick={() => onDelete(user._id)}
										icon="delete"
										type="link"
										name="btnDeleteUser"
									/>
								]}
							>
								{user.fullName}
							</List.Item>
						)}
					/>
				</Card>
				<UserModal userId={userId} visible={visible} hideModal={hideModal} />
			</Row>
		</>
	)
}

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

export default compose(
	graphql(GET_ALL_USERS, {
		name: 'getUsers',
		options: {
			variables: {
				offset: 0,
				limit: 100
			}
		}
	}),
	graphql(USER_LOCK_AND_UNLOCK, {
		name: 'lockAndUnlockUser'
	}),
	graphql(USER_DELETE, {
		name: 'deleteUser'
	})
)(withTranslation('translations')(User))