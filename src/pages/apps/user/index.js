import React from 'react'
import { Button } from 'antd';
import './index.css'
import { Select, Modal, Form, Input, Checkbox } from 'antd';
import gql from 'graphql-tag'

import { withApollo } from 'react-apollo'

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const options = [
	{ label: 'Order', value: 'Apple' },
	{ label: 'Create Menu', value: 'Pear' },
	{ label: 'Unpublish Menu', value: 'Orange' },
	{ label: 'Lock Menu', value: 'x' },
	{ label: 'Lock User', value: 'c' },
	{ label: 'Require to delivery', value: 'v' }
];

function onChange(checkedValues) {
	console.log('checked = ', checkedValues);
}

const UserCreateForm = Form.create({ name: 'user_create' })(
	// eslint-disable-next-line
	class extends React.Component {
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			const formItemLayout = {
				labelCol: {
					xs: { span: 6 },
					sm: { span: 6 },
				},
				wrapperCol: {
					xs: { span: 16 },
					sm: { span: 16 },
				},
			};
			return (
				<Modal
					visible={visible}
					title="Thêm user"
					okText="Lưu"
					cancelText="Hủy"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form {...formItemLayout}>
						<Form.Item label="Name">
							{
								getFieldDecorator('fullName', {
									// rules: [
									// 	{
									// 		required: true,
									// 		message: 'Please input your name!',
									// 	},
									// ],
								})(
									<Input placeholder='Nhập tên' />)
							}
						</Form.Item>
						<Form.Item label="Username">
							{
								getFieldDecorator('username', {})(
									<Input placeholder='Nhập username' type='text' />)
							}
						</Form.Item>
						<Form.Item label="Password">
							{
								getFieldDecorator('password', {})(
									<Input placeholder='Nhập password' type='password' />)
							}
						</Form.Item>
						{/* <Form.Item label="Email">
							{
								getFieldDecorator('email', {})(
									<Input placeholder='Nhập email' />)
							}
						</Form.Item> */}
					</Form>
				</Modal>
			);
		}
	},
);

const UserEditForm = Form.create({ name: 'user_edit' })(
	class extends React.Component {
		render() {
			const { visible, onCancel, onEdit, form } = this.props;
			const { getFieldDecorator } = form;
			console.log(this.props)
			return (
				<Modal
					visible={visible}
					title="Cập nhật user"
					onCancel={onCancel}
					onOk={onEdit}
					footer={
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Button onClick={onCancel}>
								Cancel
            	</Button>
								<div>
									<Button onClick={onCancel}>
										Delete
									</Button>
									<Button onClick={onCancel}>
										Update
									</Button>
							</div>
						</div>
					}
				>
					<Form>
						<Form.Item>
							{
								getFieldDecorator('name', {

								})(
									<Input placeholder='New name' />)
							}
						</Form.Item>
						<Form.Item>
							{
								getFieldDecorator('password', {})(
									<Input placeholder='New password' type='password' />)
							}
						</Form.Item>
						<Form.Item>
							{
								getFieldDecorator('repeatPassword', {})(
									<Input placeholder='New repeat password' type='password' />)
							}
						</Form.Item>
						<Form.Item>
							{
								getFieldDecorator('siteHh', {})(
									<Select
										placeholder='Khu vực Hoa Hồng'
										dropdownRender={menu => {
											return (
												<div>
													<Checkbox.Group className='a' options={options} defaultValue={['Pear']} onChange={onChange} />
												</div>
											)
										}}
									>
									</Select>
								)
							}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	},
);

class UserManage extends React.Component {
	state = {
		visible: false,
		isPublish: false,
		visibleEditUser: false,
		users: []
	};

	componentDidMount() {
		this.props.client.query({
			query: GET_ALL_USERS,
		})
			.then(({ data }) => {
				this.setState({
					users: data.users
				})
			})
			.catch(err => {
				console.log(err)
				throw err
			})
	}

	showModalEditUser = () => {
		this.setState({ visibleEditUser: true });
		console.log('ok')
	};

	handleCancelEditUser = () => {
		this.setState({ visibleEditUser: false });
	};

	handleEditUser = () => {
		const { form } = this.formRef.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			console.log('Received values of form: ', values);
			form.resetFields();
			this.setState({ visibleEditUser: false });
		});
	};

	showModal = () => {
		this.setState({ visible: true });
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	handleCreate = () => {
		const { form } = this.formRef.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			console.log(values)
			this.props.client.mutate({
				mutation: CREATE_USER,
				variables: {
					input: {
						...values,
					}
				},
				fetchPolicy: 'no-cache',
				refetchQueries: () => [{ query: GET_ALL_USERS }]
			})
				.then((result) => {
					console.log(result)
				})
				.catch((err) => {
					console.log(err.message)
				})
			form.resetFields();
			this.setState({ visible: false });
		});
	};

	saveFormRef = formRef => {
		this.formRef = formRef;
	};

	saveFormRefEditUser = formRef => {
		this.formRef = formRef;
	};

	render() {
		return (
			<React.Fragment>
				{/* <label className='title'>Quản lí User</label> */}
				{
					this.state.users && this.state.users.filter(user => user.isActive).map(user => {
						return (
							<Button className='user-name' idUser={user._id} onClick={this.showModalEditUser} key={user._id}>
								{user.fullName}
							</Button>
						)
					})
				}
				<UserEditForm
					userId={this.state.users._id}
					wrappedComponentRef={(r) => this.saveFormRefEditUser(r)}
					visible={this.state.visibleEditUser}
					onCancel={this.handleCancelEditUser}
					onEdit={this.handleEditUser}
				/>

				{/* <Button className='user-name'>Nam</Button>
				<Button className='user-name'>Bảo</Button>
				<Button className='user-name'>Chung</Button> */}

				<Button className='add-user' onClick={this.showModal}>
					Thêm user
				</Button>
				<UserCreateForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					onCreate={this.handleCreate}
				/>
			</React.Fragment>
		)
	}
}

const GET_ALL_USERS = gql`
	query users	{
		users(offset: 0, limit: 100){
			username
			fullName
			isActive
			_id
		}
	}
`

const CREATE_USER = gql`mutation($input: CreateUserInput!){
  register(input: $input){
    username
		fullName
		password
  }
}`

const INACTIVE_PATIENT = gql`
  mutation deletePatient($patientId: ID!) {
    deletePatient(patientId: $patientId) 
  }`

export default withApollo(UserManage)
