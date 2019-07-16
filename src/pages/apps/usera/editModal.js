import React, { useState } from 'react'
import { Select, Modal, Form, Input } from 'antd';
import { HOCQueryMutation } from './../../../components/shared/hocQueryAndMutation';
import { GET_ALL_USERS, GET_ALL_PERMISSIONS, GET_ALL_SITES, UPDATE_USER } from './queries'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon';

function EditModal(props) {
	const [confirmLoading, setConfirmLoading] = useState(false)

	function onEdit(_id) {
		props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			setConfirmLoading(true)
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
					// console.log(value)
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

			props.mutate
				.updateUser({
					mutation: UPDATE_USER,
					variables: {
						_id,
						input: {
							...values,
						}
					},
					refetchQueries: [
						{
							query: GET_ALL_USERS
						}
					]
				})
				.then((result) => {
					// console.log(result)
					setConfirmLoading(false)
					openNotificationWithIcon('success', 'success', `Sửa ${values.fullName} thành công`, null)
				})
				.catch((err) => {
					// console.log(err.message)
					const errors = err.graphQLErrors.map(error => error.message)
					openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
				})

			// props.form.resetFields();
			props.handleCancel()
		});
	}

	console.log(props)

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
	props.getAllPermissions.permissions && props.getAllPermissions.permissions.map((permission, i) => {
		return (
			children.push(<Option key={i} value={permission.code + ' ' + permission._id}>{permission.code}</Option>)
		)
	})

	return (
		<Modal
			visible={props.visible}
			title='Sửa user'
			okText='Sửa'
			cancelText="Hủy"
			confirmLoading={confirmLoading}
			onCancel={props.handleCancel}
			onOk={() => onEdit(props.userData._id)}
		>
			<Form {...formItemLayout}>
				<Form.Item label='Tên'>
					{
						getFieldDecorator('fullName', {
							initialValue: props.userData && props.userData.fullName
						})(
							<Input placeholder='Nhập tên' />)
					}
				</Form.Item>
				<Form.Item label='Mật khẩu'>
					{
						getFieldDecorator('password', {
							initialValue: props.user && props.user.password
						})(
							<Input placeholder='Nhập password' type='password' />)
					}
				</Form.Item>
				{
					props.getAllSites.sites && props.getAllSites.sites.map((site, i) => {
						return (
							<Form.Item key={i} label={site.name}>
								{
									getFieldDecorator(`sites.${site._id}`, {
										rules: [
											{
												required: true,
												message: `Please chose permission of ${site.name}`,
											},
										]
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
		mutation: UPDATE_USER,
		name: 'updateUser',
		options: {}
	}
])(Form.create()(EditModal))