import React, { Component } from 'react'
import { Form, Input, Icon, Button, Row, Col, Typography, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../utils/openNotificationWithIcon'

const { Title } = Typography
export class Register extends Component {
	state = {
		email: 'chin@gmail.com',
		password: 'd3f4ultP4ssword!',
		username: 'trinhchin',
		loading: false,
		errors: []
	}
	componentWillMount() {
		const token = localStorage.getItem('access-token')
		if (token) {
			this.props.history.push('/')
		}
	}
	handleSubmit = e => {
		e.preventDefault()
		this.setState({ loading: true, spin: true })
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values)
			}
			const { client } = this.props
			const { email, password, username } = values
			client
				.mutate({
					mutation: USER_REGISTER,
					variables: {
						userInput: {
							email,
							password,
							username
						}
					}
				})
				.then(res => {
					// console.log(res.data.register)
					if (res.data.register) {
						openNotificationWithIcon(
							'success',
							'register',
							'Registration Successful.',
							'We welcome a new MEMBER.',
							'bottomRight'
						)
						this.setState({
							email: '',
							password: '',
							username: '',
							loading: false,
							spin: false
						})
					}
				})
				.catch(res => {
					// console.log(res)
					const errors = res.graphQLErrors.map(error => error.message)
					openNotificationWithIcon(
						'error',
						'register',
						'Registration Failed.',
						errors[0]
					)
					this.setState({
						loading: false,
						spin: false,
						errors
					})
				})
		})
	}
	render() {
		const { email, password, username, loading } = this.state
		const { getFieldDecorator } = this.props.form
		return (
			<>
				<Row id="layout-login">
					<Col
						xs={{ span: 24, offset: 0 }}
						sm={{ span: 16, offset: 8 }}
						md={{ span: 14, offset: 10 }}
						lg={{ span: 12, offset: 12 }}
						xl={{ span: 7, offset: 17 }}
					>
						<div id="components-form-demo-normal-login">
							<Form onSubmit={this.handleSubmit} className="login-form">
								<div className="login-form-header">
									<Title level={1}>Chnirt</Title>
									<Title level={4}>
										Sign up to see photos and videos from your friends.
									</Title>
								</div>
								<Form.Item>
									{getFieldDecorator('username', {
										valuePropName: 'defaultValue',
										initialValue: username,
										rules: [
											{
												required: true,
												message: 'Please input your username!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											placeholder="Username"
										/>
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('email', {
										valuePropName: 'defaultValue',
										initialValue: email,
										rules: [
											{
												type: 'email',
												message: 'The input is not valid E-mail!'
											},
											{
												required: true,
												message: 'Please input your E-mail!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											placeholder="Your@email.com"
										/>
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('password', {
										valuePropName: 'defaultValue',
										initialValue: password,
										rules: [
											{
												required: true,
												message: 'Please input your Password!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											type="password"
											placeholder="Password"
										/>
									)}
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="login-form-button"
										loading={loading}
										disabled={loading}
									>
										{!loading ? <Icon type="user-add" /> : null}
										Register
									</Button>
									<Divider>OR</Divider>
									Already have an account?
									<Link to="/login"> Login.</Link>
								</Form.Item>
							</Form>
						</div>
					</Col>
				</Row>
			</>
		)
	}
}
const USER_REGISTER = gql`
	mutation($userInput: UserInput!) {
		register(userInput: $userInput)
	}
`

export default withApollo(Form.create({ name: 'register' })(Register))
