import React from 'react'
import { Button } from 'antd';
import { Select, Modal, Form, Input, Checkbox } from 'antd';
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation';
import { CREATE_USER, GET_ALL_USERS, GET_ALL_PERMISSIONS, GET_ALL_SITES } from '../queries'

function UserModel(props) {

	function onCreate() {
		props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			// console.log('Received values of form: ', values);
			let sites = []

			for (let [key, value] of Object.entries(values.sites)) {
				// console.log(Array.isArray(value));
				// console.log(key, value)
				if (Array.isArray(value) && value.length > 1) {
					// console.log("------Array");
					// console.log(value);
					const permissions = [];
					value.map(item => {
						// console.log(item);
						return permissions.push({
							code: item.split(' ')[0],
								_id: item.split(' ')[1]
						});
					});
					// console.log(permissions);
					sites.push({
						siteId: key,
						permissions
					});
				} 
				else {
					// console.log("------String");
					console.log(value)
					sites.push({
						siteId: key,
						permissions: [
							{
								code: value[0].split(' ')[0],
								_id: value[0].split(' ')[1]
							}
						]
					});
				}
			}

			values.sites = sites

			console.log(values)
			props.mutate
			.createUser({
				mutation: CREATE_USER,
				variables: {
					input: {
						...values,
					}
				},
				refetchQueries: () => [
					{
						query: GET_ALL_USERS
					}
				]
			})
				.then((result) => {
					// console.log(result)

				})
				.catch((err) => {
					// console.log(err.message)
				})
				
			props.form.resetFields();
			props.handleCancel()
		});
	}

	function onChange(checkedValues) {
	}

	const { Option } = Select;
	const { getFieldDecorator } = props.form
	const children = [];
	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		},
	};
	props.getAllPermissions.permissions && props.getAllPermissions.permissions.map((permission,i) => {
		return (
			children.push(<Option key={i} value={permission.code + ' ' + permission._id}>{permission.code}</Option>)
		)
	})

	return (
		<Modal
			visible={props.visible}
			title="Thêm user"
			okText="Lưu"
			cancelText="Hủy"
			onCancel={props.handleCancel}
			onOk={onCreate}
		>
			<Form {...formItemLayout}>
				<Form.Item label='Tên'>
					{
						getFieldDecorator('fullName', {

						})(
							<Input placeholder='Nhập tên' />)
					}
				</Form.Item>
				<Form.Item label='Tên đăng nhập'>
					{
						getFieldDecorator('username', {})(
							<Input placeholder='Nhập username' type='text' />)
					}
				</Form.Item>
				<Form.Item label='Mật khẩu'>
					{
						getFieldDecorator('password', {})(
							<Input placeholder='Nhập password' type='password' />)
					}
				</Form.Item>
				{
					props.getAllSites.sites && props.getAllSites.sites.map((site, i) => {
						return (
							<Form.Item key={i} label={site.name}>
								{
									getFieldDecorator(`sites.${site._id}`, {
										// rules: [
										// 	{
										// 		required: true,
										// 		message: `Please chose permission of ${site.name}`,
										// 	},
										// ]
									})(
										<Select
											mode="multiple"
											placeholder={site.name}
											onChange={onChange}
										>
											{children}
										</Select>
									)
								}
							</Form.Item>
						)
					})
				}
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