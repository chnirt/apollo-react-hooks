import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Row, Button, Card, Modal, Typography } from 'antd'
import { withTranslation } from 'react-i18next'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

import UserList from './userlist'
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
		setTimeout(() => {
			setUserId('')
		}, 200)
	}

	function onLockAndUnlock(_id) {
		// console.log("onLockAndUnlock", _id)
		props.mutate
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
					openNotificationWithIcon('success', 'success', 'Success', _id)
			})
			.catch(err => {
				// console.log(err)
				const errors = err.graphQLErrors.map(error => error.message)
				openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
			})
	}

	function onDelete(_id) {
		// console.log("onDelete", _id)
		confirm({
			title: 'Delete',
			content: 'Do you want to delete this user?',
			onOk() {
				// console.log('OK');
				props.mutate
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
							openNotificationWithIcon('success', 'success', 'Success', _id)
					})
					.catch(err => {
						// console.log(err)
						const errors = err.graphQLErrors.map(error => error.message)
						openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
					})
			},
			onCancel() {
				// console.log('Cancel');
			}
		})
	}

	const { data, t } = props
	const { users } = data

	return (
		<>
			<Row>
				<Card
					title={
						<Title style={{ color: '#ffffff' }} level={3}>
							{t('Manage User')}
						</Title>
					}
					bordered={false}
					extra={
						<Button type="primary" block onClick={() => showModal()}>
							{t('Add user')}
						</Button>
					}
					headStyle={{
						border: 0
					}}
					bodyStyle={{
						padding: 0
					}}
					style={{ backgroundColor: 'transparent' }}
				>
					{users &&
						users
							.filter(item => item.isActive)
							.map(item => (
								<UserList
									key={item._id}
									{...item}
									showModal={showModal}
									onLockAndUnlock={onLockAndUnlock}
									onDelete={onDelete}
									visible={visible}
									hideModal={hideModal}
								/>
							))}
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

export default withTranslation('translations')(
	HOCQueryMutation([
		{
			query: GET_ALL_USERS,
			options: {
				variables: {
					offset: 0,
					limit: 100
				}
			}
		},
		{
			mutation: USER_LOCK_AND_UNLOCK,
			name: 'lockAndUnlockUser',
			option: {}
		},
		{
			mutation: USER_DELETE,
			name: 'deleteUser',
			option: {}
		}
	])(User)
)
