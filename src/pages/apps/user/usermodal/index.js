/* eslint-disable */
import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Modal, Form, Input, Select } from 'antd'
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon'

const { Option } = Select

function UserModal(props) {
	const [confirmDirty, setConfirmDirty] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)

	function handleConfirmBlur(e) {
		const { value } = e.target
		setConfirmDirty(confirmDirty || !!value)
	}

	function compareToFirstPassword(rule, value, callback) {
		const { form } = props
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!')
		} else {
			callback()
		}
	}

	function validateToNextPassword(rule, value, callback) {
		const { form } = props
		if (value && confirmDirty) {
			form.validateFields(['confirm'], { force: true })
		}
		callback()
	}

	function handleOk() {
		// console.log('OK')
		props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				setConfirmLoading(true)
				// console.log('Received values of form: ', values)

				delete values.confirm

				const sites = []

				for (const [key, value] of Object.entries(values.sites)) {
					// console.log(Array.isArray(value));
					if (Array.isArray(value) && value.length > 1) {
						// console.log('------Array');
						// console.log(value);
						const permissions = []
						value.map(item => {
							// console.log(item);
							permissions.push({
								_id: item.split(',')[0],
								code: item.split(',')[1]
							})
						})
						// console.log(permissions);
						sites.push({
							siteId: key,
							permissions
						})
					} else {
						// console.log(value)
						if (value) {
							// console.log('------String');
							sites.push({
								siteId: key,
								permissions: [
									{
										_id: value[0].split(',')[0],
										code: value[0].split(',')[1]
									}
								]
							})
						} else {
							// console.log('------Undefine');
							// sites.push({
							//   siteId: key,
							//   permissions: []
							// })
						}
					}
				}

				values.sites = sites

				// console.log(values)

				props.userId
					? props.mutate
							.updateUser({
								mutation: UPDATE_USER,
								variables: {
									_id: props.userId,
									input: {
										...values
									}
								},
								refetchQueries: () => [
									{
										query: GET_ALL_USERS,
										variables: {
											offset: 0,
											limit: 100
										}
									},
									{
										query: GET_ALL_PERMISSIONS_BY_USERID,
										variables: {
											_id: props.userId
										}
									}
								]
							})
							.then(res => {
								// console.log(res)
								openNotificationWithIcon(
									'success',
									'success',
									'Success',
									'User is updated'
								)
								setConfirmLoading(false)
								props.form.resetFields()
								props.hideModal()
							})
							.catch(err => {
								// console.log(err)
								const errors = err.graphQLErrors.map(error => error.message)
								openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
								setConfirmLoading(false)
							})
					: props.mutate
							.createUser({
								mutation: CREATE_USER,
								variables: {
									input: {
										...values
									}
								},
								refetchQueries: () => [
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
								openNotificationWithIcon(
									'success',
									'success',
									'Success',
									'User is created'
								)
								setConfirmLoading(false)
								props.form.resetFields()
								props.hideModal()
							})
							.catch(err => {
								// console.log(err)
								const errors = err.graphQLErrors.map(error => error.message)
								openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
								setConfirmLoading(false)
							})
			}
		})
	}

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		}
	}

	// console.log(props)

	const { form, userId, visible, getAllSites, getAllPermissionsByUserId } = props
	const { getFieldDecorator } = form

	return (
		<Modal
			title={userId ? 'Update' : 'Create'}
			visible={visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={() => {
				props.form.resetFields()
				props.hideModal()
			}}
			okText="Submit"
		>
			<Form {...formItemLayout}>
				{!userId && (
					<Form.Item label="Username">
						{getFieldDecorator('username', {
							rules: [
								{
									required: true,
									message: 'Please input your username!'
								}
							]
						})(<Input style={{ fontSize: 16 }} />)}
					</Form.Item>
				)}
				<Form.Item label="Password">
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: 'Please input your password!'
							},
							{
								validator: validateToNextPassword
							}
						]
					})(<Input.Password visibilityToggle={false} autoComplete="off" />)}
				</Form.Item>
				<Form.Item label="Confirm Password">
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: 'Please confirm your password!'
							},
							{
								validator: compareToFirstPassword
							}
						]
					})(
						<Input.Password
							visibilityToggle={false}
							autoComplete="off"
							onBlur={handleConfirmBlur}
						/>
					)}
				</Form.Item>
				<Form.Item label="Fullname">
					{getFieldDecorator('fullName', {
						rules: [
							{
								required: true,
								message: 'Please input your fullname!'
							}
						]
					})(<Input style={{ fontSize: 16 }} />)}
				</Form.Item>
				{getAllSites.sites &&
					getAllSites.sites.map(item => {
						// console.log('Chin', props.getAllPermissionsByUserId.findAllByUserId)
						let array = []
						const newArray = []
						if (userId) {
							array =
								getAllPermissionsByUserId.findAllByUserId &&
								getAllPermissionsByUserId.findAllByUserId.filter(
									item1 => item1.siteId === item._id
								)
							getAllPermissionsByUserId.findAllByUserId &&
								array[0] &&
								array[0].permissions.map(item => {
									newArray.push(`${item._id},${item.code}`)
								})
						}

						return (
							<Form.Item key={item._id} label={item.name}>
								{getFieldDecorator(`sites.${item._id}`, {
									initialValue: newArray
								})(
									<Select
										mode="multiple"
										placeholder="Please select permissions"
									>
										{props.getAllPermissions.permissions &&
											props.getAllPermissions.permissions.map(item1 => {
												return (
													<Option
														key={item1._id}
														value={`${item1._id},${item1.code}`}
													>
														{item1.description}
													</Option>
												)
											})}
									</Select>
								)}
							</Form.Item>
						)
					})}
			</Form>
		</Modal>
	)
}

const GET_ALL_SITES = gql`
	query {
		sites {
			_id
			name
		}
	}
`
const GET_ALL_PERMISSIONS = gql`
	query {
		permissions {
			_id
			code
			description
		}
	}
`

const CREATE_USER = gql`
	mutation createUser($input: CreateUserInput!) {
		createUser(input: $input) {
			username
			fullName
		}
	}
`

const UPDATE_USER = gql`
	mutation updateUser($_id: String!, $input: UpdateUserInput!) {
		updateUser(_id: $_id, input: $input)
	}
`

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			username
			fullName
			isActive
			isLocked
			_id
		}
	}
`

const GET_ALL_PERMISSIONS_BY_USERID = gql`
	query($_id: String!) {
		findAllByUserId(_id: $_id) {
			siteId
			permissions {
				_id
				code
			}
		}
	}
`

const GET_USER = gql`
	query($_id: String!) {
		user(_id: $_id) {
			fullName
		}
	}
`

export default HOCQueryMutation([
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
		query: GET_ALL_PERMISSIONS_BY_USERID,
		name: 'getAllPermissionsByUserId',
		options: props => ({
			variables: {
				_id: props.userId || ''
			}
		})
	},
	{
		query: GET_ALL_SITES,
		name: 'getAllSites'
	},
	{
		query: GET_ALL_PERMISSIONS,
		name: 'getAllPermissions'
	},
	{
		query: GET_USER,
		name: 'getUser',
		options: props => ({
			variables: {
				_id: props.userId
			}
		})
	},
	{
		mutation: CREATE_USER,
		name: 'createUser',
		option: {}
	},
	{
		mutation: UPDATE_USER,
		name: 'updateUser',
		option: {}
	}
])(Form.create({ name: 'createUserForm' })(UserModal))
/* eslint-enable */
