import React, { useState } from 'react'
import gql from 'graphql-tag'
// import { graphql, compose } from 'react-apollo'
import { Modal, Form, Input, Select } from 'antd'
import { withTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@apollo/react-hooks'
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
			callback(t('src.pages.user.inconsistentPassword'))
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
					? updateUser({
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
								if (res.data.updateUser)
									openNotificationWithIcon(
										'success',
										'success',
										'Success',
										t('src.pages.user.updateUserSuccess')
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
									t('src.pages.common.failed'),
									errors[0]
								)
								setConfirmLoading(false)
							})
					: createUser({
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
								if (res.data.createUser)
									openNotificationWithIcon(
										'success',
										'success',
										'Success',
										t('src.pages.user.addUserSuccess')
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
									t('src.pages.common.failed'),
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

	const { form, userId, visible, hideModal, t } = props
	const { getFieldDecorator } = form

	const [updateUser] = useMutation(UPDATE_USER)
	const [createUser] = useMutation(CREATE_USER)
	const { data: dataSites } = useQuery(GET_ALL_SITES)
	const { data: dataPermissions } = useQuery(GET_ALL_PERMISSIONS)
	const { data: dataPermissionsByUser } = useQuery(
		GET_ALL_PERMISSIONS_BY_USERID,
		{
			variables: { _id: userId }
		}
	)
	const { data: dataUser } = useQuery(GET_USER, { variables: { _id: userId } })

	return (
		<Modal
			title={userId ? t('src.pages.common.update') : t('src.pages.common.add')}
			visible={visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={hideModal}
			okText={userId ? t('src.pages.common.update') : t('src.pages.common.add')}
			cancelText={t('src.pages.common.cancel')}
		>
			<Form {...formItemLayout}>
				{!userId && (
					<Form.Item label={t('src.pages.user.username')}>
						{getFieldDecorator('username', {
							rules: [
								{
									required: true,
									message: t('src.pages.user.usernameRequired')
								},
								{
									min: 4,
									message: t('src.pages.user.userNameMin4Characters')
								}
							]
						})(<Input style={{ fontSize: 16 }} />)}
					</Form.Item>
				)}
				<Form.Item label={t('src.pages.user.password')}>
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: t('src.pages.user.passwordRequired')
							},
							{
								min: 1,
								message: t('src.pages.user.passwordMin1Max8')
							},
							{
								max: 8,
								message: t('src.pages.user.passwordMin1Max8')
							},
							{
								validator: validateToNextPassword
							}
						]
					})(<Input.Password visibilityToggle={false} autoComplete="off" />)}
				</Form.Item>
				<Form.Item label={t('src.pages.user.confirmPassword')}>
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: t('src.pages.user.confirmPasswordAgain')
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
				<Form.Item label={t('src.pages.user.fullname')}>
					{getFieldDecorator('fullName', {
						initialValue: userId && dataUser.user && dataUser.user.fullName,
						rules: [
							{
								required: true,
								message: t('src.pages.user.fullNameRequired')
							},
							{
								min: 3,
								message: t('src.pages.user.fullNameMin3Max20')
							},
							{
								max: 20,
								message: t('src.pages.user.fullNameMin3Max20')
							}
						]
					})(<Input style={{ fontSize: 16 }} />)}
				</Form.Item>
				{visible &&
					dataSites.sites &&
					dataSites.sites.map(item => {
						// console.log('Chin', props.getAllPermissionsByUserId.findAllByUserId)
						let array = []
						const newArray = []
						if (userId) {
							array =
								dataPermissionsByUser.findAllByUserId &&
								dataPermissionsByUser.findAllByUserId.filter(
									item1 => item1.siteId === item._id
								)
							dataPermissionsByUser.findAllByUserId &&
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
										placeholder={t('src.pages.user.selectPermissions')}
									>
										{dataPermissions.permissions &&
											dataPermissions.permissions.map(item1 => {
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
	mutation updateUser($_id: ID!, $input: UpdateUserInput!) {
		updateUser(_id: $_id, input: $input)
	}
`

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

const GET_ALL_PERMISSIONS_BY_USERID = gql`
	query($_id: ID!) {
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
	query($_id: ID!) {
		user(_id: $_id) {
			fullName
		}
	}
`

export default withTranslation('translations')(
	Form.create({ name: 'createUserForm' })(UserModal)
)
