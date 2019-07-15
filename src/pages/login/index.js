import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Form, Typography, Icon, Input, Button } from 'antd'
import './login.scss'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

const { Title } = Typography

@inject('store')
@observer
class Login extends Component {
	state = {
		username: 'admin',
		password: '12345678'
	}
	handleSubmit = e => {
		e.preventDefault()
		this.setState({ loading: true, spin: true })
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values)
			}
			const { username, password } = values
			this.props.client
				.mutate({
					mutation: USER_LOGIN,
					variables: {
						input: {
							username,
							password
						}
					}
				})
				.then(res => {
					// console.log(res.data.login)
					const { token, sites } = res.data.login
					this.setState({
						loading: false,
						spin: false
					})
					this.props.store.authStore.authenticate(token, sites)
					this.props.history.push('/🥢')
				})
				.catch(err => {
					const errors = err.graphQLErrors.map(error => error.extensions.code)
					let mess = ''
					if (errors[0] === '401') {
						mess = 'Username or Password is not correct'
					}

					if (errors[0] === '423') {
						mess = 'Your account is locked by Admin'
					}

					if (errors[0] === '404') {
						mess = 'Your account is not exist'
					}

					this.setState({
						loading: false,
						spin: false
					})

					openNotificationWithIcon('error', 'login', 'Login Failed.', mess)
				})
		})
	}
	render() {
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
									<Title level={1}>Luncheon</Title>
								</div>
								<Form.Item>
									{getFieldDecorator('username', {
										valuePropName: 'defaultValue',
										initialValue: this.state.username,
										rules: [
											{
												required: true,
												message: 'Please input your username!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											placeholder="username"
										/>
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('password', {
										valuePropName: 'defaultValue',
										initialValue: this.state.password,
										rules: [
											{
												required: true,
												message: 'Please input your Password!'
											},
											{
												min: 1,
												message:
													'Your password must be between 1 and 8 characters'
											},
											{
												max: 8,
												message:
													'Your password must be between 1 and 8 characters'
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
										loading={this.state.loading}
										disabled={this.state.loading}
									>
										{!this.state.loading ? <Icon type="login" /> : null}
										Log in
									</Button>
								</Form.Item>
							</Form>
						</div>
					</Col>
				</Row>
			</>
		)
	}
}

const USER_LOGIN = gql`
	mutation($input: LoginUserInput!) {
		login(input: $input) {
			token
			sites {
				_id
				name
			}
		}
	}
`

export default withApollo(Form.create({ name: 'normal_login' })(Login))
