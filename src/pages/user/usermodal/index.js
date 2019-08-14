import React, { useState } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Modal, Form, Input, Select } from 'antd'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

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
			callback(t('user.InconsistentPw'))
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
				const copyValues = Object.assign(values)
				delete copyValues.confirm

				const sites = []

				/* eslint-disable */

				for (const [key, value] of Object.entries(copyValues.sites)) {
					// console.log(Array.isArray(value));
					if (Array.isArray(value) && value.length > 1) {
						// console.log('------Array')
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
						// console.log('String', value)
						if (value) {
							// console.log('------String')
							// console.log(value)
							if (value.length > 0) {
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
								sites.push({
									siteId: key,
									permissions: []
								})
							}
						} else {
							// console.log('------Undefine')
							// sites.push({
							// 	siteId: key,
							// 	permissions: []
							// })
						}
					}
				}

				copyValues.sites = sites

				// console.log(copyValues)

				props.userId
					? props
							.updateUser({
								mutation: UPDATE_USER,
								variables: {
									_id: props.userId,
									input: {
										...copyValues
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
									},
									{
										query: GET_USER,
										variables: {
											_id: props.userId
										}
									}
								]
							})
							.then(res => {
								// console.log(res)
								if (res.data.updateUser === true)
									openNotificationWithIcon(
										'success',
										'success',
										'Success',
										t('user.UpdateUserSuccess')
									)
								setConfirmLoading(false)

								props.hideModal()
								props.form.resetFields()
							})
							.catch(err => {
								// console.log(err)
								const errors = err.graphQLErrors.map(error => error.message)
								openNotificationWithIcon(
									'error',
									'failed',
									t('common.Failed'),
									errors[0]
								)
								setConfirmLoading(false)
							})
					: props
							.createUser({
								mutation: CREATE_USER,
								variables: {
									input: {
										...copyValues
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
								if (res.data.createUser === true)
									openNotificationWithIcon(
										'success',
										'success',
										'Success',
										t('user.AddUserSuccess')
									)
								setConfirmLoading(false)

								props.hideModal()
								props.form.resetFields()
							})
							.catch(err => {
								// console.log(err)
								const errors = err.graphQLErrors.map(error => error.message)
								openNotificationWithIcon(
									'error',
									'failed',
									t('common.Failed'),
									errors[0]
								)
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

	const {
		form,
		userId,
		visible,
		getAllSites,
		getAllPermissionsByUserId,
		getUser,
		hideModal,
		t
	} = props
	const { getFieldDecorator } = form

	return (
		<Modal
			title={userId ? t('common.Update') : t('common.Add')}
			visible={visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={hideModal}
			okText={userId ? t('common.Update') : t('common.Add')}
			cancelText={t('common.Cancel')}
		>
			<Form {...formItemLayout}>
				{!userId && (
					<Form.Item label={t('user.Username')}>
						{getFieldDecorator('username', {
							rules: [
								{
									required: true,
									message: t('user.InputUsername')
								},
								{
									min: 4,
									message: t('user.UserName4C')
								}
							]
						})(<Input style={{ fontSize: 16 }} />)}
					</Form.Item>
				)}
				<Form.Item label={t('user.Password')}>
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: t('user.InputPassword')
							},
							{
								min: 1,
								message: t('user.Pw1-8')
							},
							{
								max: 8,
								message: t('user.Pw1-8')
							},
							{
								validator: validateToNextPassword
							}
						]
					})(<Input.Password visibilityToggle={false} autoComplete="off" />)}
				</Form.Item>
				<Form.Item label={t('user.Confirm Password')}>
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: t('user.ConfirmPassword')
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
				<Form.Item label={t('user.Fullname')}>
					{getFieldDecorator('fullName', {
						initialValue: userId && getUser.user && getUser.user.fullName,
						rules: [
							{
								required: true,
								message: t('user.InputFullname')
							},
							{
								min: 3,
								message: t('user.Fn3-20')
							},
							{
								max: 20,
								message: t('user.Fn3-20')
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
										placeholder={t('user.SelectPermissions')}
										readonly="true"
										onFocus={() => {
											e.preventDefault()
											// you could change the color of the field to indicate this is the active field.
										}}
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
// export default HOCQueryMutation([
// 	{
// 		query: GET_ALL_USERS,
// 		options: {
// 			variables: {
// 				offset: 0,
// 				limit: 100
// 			}
// 		}
// 	},
// 	{
// 		query: GET_ALL_PERMISSIONS_BY_USERID,
// 		name: 'getAllPermissionsByUserId',
// 		options: props => ({
// 			variables: {
// 				_id: props.userId || ''
// 			},
// 			fetchPolicy: 'no-cache'
// 		})
// 	},
// 	{
// 		query: GET_ALL_SITES,
// 		name: 'getAllSites',
// 		options: {}
// 	},
// 	{
// 		query: GET_ALL_PERMISSIONS,
// 		name: 'getAllPermissions',
// 		options: {}
// 	},
// 	{
// 		query: GET_USER,
// 		name: 'getUser',
// 		options: props => ({
// 			variables: {
// 				_id: props.userId || ''
// 			}
// 		})
// 	},
// 	{
// 		mutation: CREATE_USER,
// 		name: 'createUser',
// 		option: {}
// 	},
// 	{
// 		mutation: UPDATE_USER,
// 		name: 'updateUser',
// 		options: {}
// 	}
// ])(
// 	withTranslation('translations')(
// 		Form.create({ name: 'createUserForm' })(UserModal)
// 	)
// )

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
	graphql(GET_ALL_SITES, {
		name: 'getAllSites'
	}),
	graphql(GET_ALL_PERMISSIONS, {
		name: 'getAllPermissions'
	}),
	graphql(GET_USER, {
		name: 'getUser',
		skip: props => !props.userId,
		options: props => ({
			variables: {
				_id: props.userId
			}
		})
	}),
	graphql(GET_ALL_PERMISSIONS_BY_USERID, {
		name: 'getAllPermissionsByUserId',
		skip: props => !props.userId,
		options: props => ({
			variables: {
				_id: props.userId
			},
			fetchPolicy: 'no-cache'
		})
	}),
	graphql(CREATE_USER, {
		name: 'createUser'
	}),
	graphql(UPDATE_USER, {
		name: 'updateUser'
	})
)(Form.create({ name: 'createUserForm' })(UserModal))
