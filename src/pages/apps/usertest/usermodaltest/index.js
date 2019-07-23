/* eslint-disable no-shadow */
import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Modal, Form, Input, Select } from 'antd'

const { Option } = Select

const GET_USER = gql`
	query($_id: String!) {
		user(_id: $_id) {
			fullName
		}
	}
`

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

function index(props) {
	const [confirmDirty, setConfirmDirty] = useState(false)

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

	const { visible, handleOk, handleCancel, userId, form } = props

	const { getFieldDecorator } = form

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

	return (
		<div>
			<Modal
				title={userId ? 'Update' : 'Create'}
				visible={visible}
				onOk={handleOk}
				onCancel={() => {
					props.form.resetFields()
					handleCancel()
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
					{userId ? (
						<Query
							query={GET_USER}
							variables={{
								_id: userId
							}}
							fetchPolicy="no-cache"
						>
							{({ loading, error, data }) => {
								if (loading) return 'Loading...'
								if (error) return `Error! ${error.message}`
								return (
									<Form.Item label="Fullname">
										{getFieldDecorator('fullName', {
											initialValue: data.user.fullName,
											rules: [
												{
													required: true,
													message: 'Please input your fullname!'
												}
											]
										})(<Input style={{ fontSize: 16 }} />)}
									</Form.Item>
								)
							}}
						</Query>
					) : (
						<Form.Item label="Fullname">
							{getFieldDecorator('fullName', {
								initialValue: '',
								rules: [
									{
										required: true,
										message: 'Please input your fullname!'
									}
								]
							})(<Input style={{ fontSize: 16 }} />)}
						</Form.Item>
					)}
					<Query query={GET_ALL_SITES}>
						{({ loading, error, data }) => {
							if (loading) return 'Loading...'
							if (error) return `Error! ${error.message}`
							return (
								<>
									{data.sites.map(site => (
										<Form.Item key={site._id} label={site.name}>
											{getFieldDecorator(`sites.${site._id}`, {
												// initialValue: newArray
											})(
												<Select
													mode="multiple"
													placeholder="Please select permissions"
												>
													<Query key={site._id} query={GET_ALL_PERMISSIONS}>
														{({ loading, error, data }) => {
															if (loading) return 'Loading...'
															if (error) return `Error! ${error.message}`
															console.log(data)
															return data.permissions.map(permission => (
																<Option
																	key={permission._id}
																	value={`${permission._id},${permission.code}`}
																>
																	{permission.description}
																</Option>
															))
														}}
													</Query>
												</Select>
											)}
										</Form.Item>
									))}
								</>
							)
						}}
					</Query>
				</Form>
			</Modal>
		</div>
	)
}

export default Form.create({ name: 'createUserForm' })(index)
