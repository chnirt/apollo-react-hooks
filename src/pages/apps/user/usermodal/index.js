import React, { useState } from 'react'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon'
import { Modal, Form, Input, Select } from 'antd'

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

				delete values['confirm']

				let sites = []

				for (let [key, value] of Object.entries(values.sites)) {
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
								}
							],
						})
						.then(res => {
							// console.log(res)
							openNotificationWithIcon(
								'success',
								'success',
								'Success',
								'User is updated'
							)
							props.data.refetch()
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

	const { getFieldDecorator } = props.form

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

	// console.log(props.getAllPermissionsByUserId)

	return (
		<Modal
			title={props.userId ? 'Update ' : 'Create'}
			visible={props.visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={props.hideModal}
			okText="Submit"
		>
			<Form {...formItemLayout}>
				{!props.userId && (
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
				{props.getAllSites.sites &&
					props.getAllSites.sites.map((item, i) => {
						{
							/* if (props.userId) {
							const array = props.getAllPermissionsByUserId.findAllByUserId.filter(
								item1 => item1.siteId === item._id
							)
							if (Array.isArray(array)) {
								console.log('asdsada', array[0])
							}
						} */
						}

						return (
							<Form.Item key={i} label={item.name}>
								{getFieldDecorator(`sites.${item._id}`, {
									//valuePropName: defaultValue
								})(
									<Select
										mode="multiple"
										placeholder="Please select permissions"
									>
										{props.getAllPermissions.permissions &&
											props.getAllPermissions.permissions.map((item, i) => {
												return (
													<Option key={i} value={`${item._id},${item.code}`}>
														{item.description}
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
				_id: props.userId
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
