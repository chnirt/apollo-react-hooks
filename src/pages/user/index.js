import React, { useState, useRef } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import {
	Button,
	Card,
	Modal,
	Typography,
	List,
	Input,
	Tooltip,
	Icon
} from 'antd'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

import UserModal from './usermodal'

const { confirm } = Modal
const { Title } = Typography

function User(props) {
	const [visible, setVisible] = useState(false)
	const [userId, setUserId] = useState('')
	const [loading, setLoading] = useState(false)
	const inputEl = useRef(null)

	function showModal(_id) {
		// console.log(_id)
		setUserId(_id)
		setVisible(true)
	}

	function hideModal() {
		setVisible(false)
		setUserId('')
	}

	function onLockAndUnlock(_id, reason) {
		// console.log("onLockAndUnlock", _id)
		props
			.lockAndUnlockUser({
				variables: {
					_id,
					reason
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
					openNotificationWithIcon(
						'success',
						'success',
						t('src.pages.common.success'),
						null
					)
				setLoading(false)
			})
			.catch(err => {
				// console.log(err)
				const errors = err.graphQLErrors.map(error => error.message)
				openNotificationWithIcon(
					'error',
					'failed',
					t('src.pages.common.failed'),
					errors[0]
				)
				setLoading(false)
			})
	}

	function onDelete(_id) {
		// console.log("onDelete", _id)
		confirm({
			title: t('src.pages.user.deleteUser'),
			content: t('src.pages.common.confirmDelete'),
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
							openNotificationWithIcon(
								'success',
								'success',
								t('src.pages.common.success'),
								null
							)
						setLoading(false)
					})
					.catch(err => {
						// console.log(err)
						const errors = err.graphQLErrors.map(error => error.message)
						openNotificationWithIcon(
							'error',
							'failed',
							t('src.pages.common.failed'),
							errors[0]
						)
						setLoading(false)
					})
			},
			onCancel() {
				// console.log('Cancel');
				setLoading(false)
			}
		})
	}

	function showConfirm(_id) {
		confirm({
			title: t('src.pages.user.reason'),
			content: (
				<Input
					ref={inputEl}
					type="text"
					placeholder={t('src.pages.user.reasonRequired')}
				/>
			),
			onOk() {
				// console.log('OK')
				// console.log(_id, inputEl.current.state.value)
				onLockAndUnlock(_id, inputEl.current.state.value)
			},
			onCancel() {
				// console.log('Cancel')
				setLoading(false)
			}
		})
	}

	const { getUsers, t } = props
	const { users } = getUsers

	return (
		<>
			<Card
				title={
					<div>
						<Title style={{ color: '#ffffff' }} level={3}>
							{t('src.pages.user.manageUser')}
						</Title>
					</div>
				}
				bordered={false}
				extra={
					<div>
						<Button icon="plus" type="primary" block onClick={() => showModal()}>
							{t('src.pages.common.add')}
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
					loading={!users || loading ? true : false}
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
									onClick={() => {
										setLoading(true)
										if (user.isLocked) {
											onLockAndUnlock(user._id, '')
										} else {
											showConfirm(user._id)
										}
									}}
									icon={user.isLocked ? 'lock' : 'unlock'}
									type="link"
									name="btnLockNUnlockUser"
								/>,
								<Button
									onClick={() => {
										setLoading(true)
										onDelete(user._id)
									}}
									icon="delete"
									type="link"
									name="btnDeleteUser"
								/>
							]}
						>
							{`${user.fullName} `}
							{user.reason && (
								<Tooltip title={user.reason}>
									<Icon type="question-circle-o" />
								</Tooltip>
							)}
						</List.Item>
					)}
				/>
			</Card>
			<UserModal userId={userId} visible={visible} hideModal={hideModal} />
		</>
	)
}

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			_id
			username
			fullName
			reason
			isActive
			isLocked
		}
	}
`

const USER_LOCK_AND_UNLOCK = gql`
	mutation($_id: ID!, $reason: String!) {
		lockAndUnlockUser(_id: $_id, reason: $reason)
	}
`

const USER_DELETE = gql`
	mutation($_id: ID!) {
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
)(User)
