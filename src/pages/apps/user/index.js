import React from 'react'
import { Button } from 'antd';
import './index.css'
import { Select, Modal, Form, Input, Checkbox } from 'antd';
import gql from 'graphql-tag'

import { withApollo } from 'react-apollo'

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

function onChange(checkedValues) {
	console.log('checked = ', checkedValues);
}

const UserCreateForm = Form.create({ name: 'user_create' })(
	// eslint-disable-next-line
	class extends React.Component {
		state = {
			sites: [],
			permissions: []
		}

		componentDidMount() {
			this.props.client.query({
				query: GET_ALL_SITES
			})
				.then(({ data }) => {
					this.setState({
						sites: data.sites
					})
				})
				.catch(err => {
					console.log(err)
					throw err
				})
			this.props.client.query({
				query: GET_ALL_PERMISSIONS
			})
				.then(({ data }) => {
					this.setState({
						permissions: data.permissions
					})
				})
				.catch(err => {
					console.log(err)
					throw err
				})
		}

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
			const options = this.state.permissions.map(permission => {
				return (
					{ label: permission.code, value: permission._id }
				)
			}
			)
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
						<Form.Item>
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
						{
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
						}
					</Form>
				</Modal>
			);
		}
	},
);

const UserEditForm = Form.create({ name: 'user_edit' })(
	class extends React.Component {
		render() {
			const { visible, onCancel, onEdit, onDelete, form } = this.props;
			const { getFieldDecorator } = form;
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
								<Button onClick={() => onDelete(this.props.userId)}>
									Delete
									</Button>
								<Button onClick={() => onEdit(this.props.userId)}>
									Update
									</Button>
							</div>
						</div>
					}
				>
					<Form>
						<Form.Item>
							{
								getFieldDecorator('fullName',  {

								})(
									<Input placeholder='New name' />)
							}
						</Form.Item>
						{/* <Form.Item>
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
						</Form.Item> */}
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
		users: [],
		userId: "",
		userName: ""
	};

	componentWillReceiveProps(nextProps) {
		console.log('ok')
		console.log(nextProps)
	}

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

	showModalEditUser = (userId, userName) => {
		this.setState({ userId, userName })
		this.setState({ visibleEditUser: true });
	};

	handleCancelEditUser = () => {
		this.setState({ visibleEditUser: false });
	};

	handleEditUser = (userId) => {
		console.log(userId)
		const { form } = this.formRefEdit.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			console.log('Received values of form: ', values);
			this.setState({ visibleEditUser: false });
			this.props.client.mutate({
				mutation: UPDATE_USER,
				variables: {
					_id: userId,
					input: { ...values }
				},
				fetchPolicy: 'no-cache',
				refetchQueries: () => [
					{
						query: GET_ALL_USERS,
						variables:
						{
							offset: 0, limit: 100
						}
					}
				]
			})
				.then((result) => {
					console.log(result)
				})
				.catch((err) => {
					console.log(err.message)
				})
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
			console.log(this.props.client.cache)
			this.props.client.mutate({
				mutation: CREATE_USER,
				variables: {
					input: {
						...values,
					}
				},
				fetchPolicy: 'no-cache',
				refetchQueries: () => [
					{
						query: GET_ALL_USERS
					}
				]
			
			})
				.then((result) => {
					console.log(result)
				})
				.catch((err) => {
					console.log(err.message)
				})
			form.resetFields();
			this.props.client.cache.reset()
			this.setState({ visible: false });
		});
	};

	deleteUser = (userId) => {
		console.log(userId)
		this.setState({ visibleEditUser: false });
		this.props.client.mutate({
			mutation: INACTIVE_USER,
			variables: {
				_id: userId
			},
			fetchPolicy: 'no-cache',
			refetchQueries: () => [
				{
					query: GET_ALL_USERS,
					variables:
					{
						offset: 0, limit: 100
					}
				}
			]
		})
			.then((result) => {
				console.log(result)
			})
			.catch((err) => {
				console.log(err.message)
			})
	}

	saveFormRef = formRef => {
		this.formRef = formRef;
	};

	saveFormRefEditUser = formRefEdit => {
		this.formRefEdit = formRefEdit;
	};

	render() {
		return (
			<React.Fragment>
				{/* <label className='title'>Quản lí User</label> */}
				{
					this.state.users && this.state.users.filter(user => user.isActive).map((user, i) => {
						return (
							<Button className='user-name' onClick={() => this.showModalEditUser(user._id, user.fullName)} key={i}>
								{user.fullName}
							</Button>
						)
					})
				}
				<UserEditForm
					userId={this.state.userId}
					userName={this.state.userName}
					wrappedComponentRef={(r) => this.saveFormRefEditUser(r)}
					visible={this.state.visibleEditUser}
					onCancel={this.handleCancelEditUser}
					onEdit={this.handleEditUser}
					onDelete={this.deleteUser}
				/>

				<Button className='add-user' onClick={this.showModal}>
					Thêm user
				</Button>
				<UserCreateForm
					client={this.props.client}
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

const INACTIVE_USER = gql`
mutation deleteUser($_id: String!){
  deleteUser(_id:$_id)
}`

const GET_ALL_SITES = gql`
	query sites{
		sites
		{
			_id
			name
		}
	}

`
const GET_ALL_PERMISSIONS = gql`
	query permissions{
		permissions{
			code
			_id
		}
	}
`

const UPDATE_USER = gql`
	mutation updateUser($_id: String!, $input: UpdateUserInput!){
		updateUser(_id: $_id, input: $input)
	}
`

export default withApollo(UserManage)
