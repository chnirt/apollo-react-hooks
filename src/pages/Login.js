import React, { Component } from 'react'
import { Row, Col, Form, Typography, Icon, Input, Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import './Login.scss'
import Auth from '../auth/Authenticate'
import openNotificationWithIcon from '../utils/openNotificationWithIcon'

const { Title } = Typography

export class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: 'chin@gmail.com',
			password: 'd3f4ultP4ssword!',
			loading: false,
			errors: []
		}
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
				console.log('Received values of form: ', values)
			}
			const { client } = this.props
			const { email, password } = values
			client
				.mutate({
					mutation: USER_LOGIN,
					variables: {
						userInput: {
							email,
							password
						}
					}
				})
				.then(res => {
					Auth.authenticate(() => {
						localStorage.setItem('access-token', res.data.login.token)
						this.props.history.push('/')
						this.setState({ loading: false, spin: false })
					})
				})
				.catch(res => {
					// console.log(res)
					const errors = res.graphQLErrors.map(error => error.message)
					openNotificationWithIcon('error', 'login', 'Login Failed.', errors[0])
					this.setState({
						loading: false,
						spin: false,
						errors
					})
				})
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const { email, password, loading } = this.state
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
								</div>
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
										{!loading ? <Icon type="login" /> : null}
										Log in
									</Button>
								</Form.Item>
								<Divider>OR</Divider>
								<br />
								<Link to="/forgot">Forgot password?</Link>
								<br />
								<span>Don't have an account?</span>
								<Link to="/register"> Register.</Link>
							</Form>
						</div>
					</Col>
				</Row>
			</>
		)
	}
}

const USER_LOGIN = gql`
	mutation($userInput: LoginUserInput!) {
		login(userInput: $userInput) {
			token
		}
	}
`

export default withApollo(Form.create({ name: 'normal_login' })(Login))
