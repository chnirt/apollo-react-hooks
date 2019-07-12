import React from 'react'
import { Button } from 'antd';
import { Select, Modal, Form, Input, Checkbox } from 'antd';
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation';
import { CREATE_USER, GET_ALL_USERS, GET_ALL_PERMISSIONS, GET_ALL_SITES } from '../queries'

function UserModel(props) {

	function onCreate() {
		
	}

	function onChange() {
		console.log('cancel')
	}

	console.log(props)

	const { getFieldDecorator } = props.form
	return (
		<Modal
			visible={props.visible}
			title="Thêm user"
			okText="Lưu"
			cancelText="Hủy"
			onCancel={props.handleCancel}
			onOk={onCreate}
		>
			<Form>
				<Form.Item>
					{
						getFieldDecorator('fullName', {

						})(
							<Input placeholder='Nhập tên' />)
					}
				</Form.Item>
				<Form.Item>
					{
						getFieldDecorator('username', {})(
							<Input placeholder='Nhập username' type='text' />)
					}
				</Form.Item>
				<Form.Item>
					{
						getFieldDecorator('password', {})(
							<Input placeholder='Nhập password' type='password' />)
					}
				</Form.Item>
				{/* {
					this.state.sites && this.state.sites.map(site => {
						return (
							<Form.Item>
								{
									getFieldDecorator(site.name, {})(
										<Select
											placeholder={site.name}
											dropdownRender={menu => {
												return (
													<div>
														<Checkbox.Group className='cb' options={options} onChange={onChange} />
													</div>
												)
											}}
										>
										</Select>
									)
								}
							</Form.Item>
						)
					})
				} */}
			</Form>
		</Modal>
	);
}

export default HOCQueryMutation([
	{
		query: GET_ALL_USERS,
		name: 'getAllUsers'
	},

	{
		query: GET_ALL_PERMISSIONS,
		name: 'getAllPermissions'
	},
	{
		query: GET_ALL_SITES,
		name: 'getAllSites'
	},
	{
		mutation: CREATE_USER,
		name: 'createUser',
		option: {}
	}
])(Form.create({ name: 'user_create' })(UserModel))