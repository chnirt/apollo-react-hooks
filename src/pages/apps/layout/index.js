import React, { useState, useEffect } from 'react'
import { Divider, Select, PageHeader, Icon, Avatar, Menu, Dropdown } from 'antd'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import BgDashboard from '../../../assets/images/bg-dashboard.jpg'

const { Option } = Select
function Layout(props) {
	const [currentsite, setCurrentsite] = useState(
		window.localStorage.getItem('currentsite')
	)
	const { children } = props

	const [me, setMe] = useState('')

	useEffect(() => {
		// code to run on component mount
		props.client
			.query({ query: ME })
			.then(res => {
				// console.log(res.data.me)
				setMe(res.data.me)
			})
			.catch(err => {
				console.log(err)
			})
	})

	function onLogout() {
		props.store.authStore.logout()
		props.client.resetStore()
		props.history.push('/login')
	}

	function handleChange(value) {
		setCurrentsite(value)
		window.localStorage.setItem('currentsite', value)
	}
	const userPers = JSON.parse(localStorage.getItem('user-permissions')).map(
		ele => ({
			siteName: ele.siteName,
			siteId: ele.siteId,
			permissions: ele.permissions
				.map(per => per.code)
				.map(code => code.split('_'))
				.map(name => name[0])
				.filter((value, index, arr) => arr.indexOf(value) === index)
		})
	)
	const currentPage = children.props.location.pathname.slice(4).toUpperCase()

	const sitesHasPermission = userPers.filter(
		ele => ele.permissions.indexOf(currentPage) !== -1
	)

	const menu = (
		<Menu>
			<Menu.Item>
				<Icon type="user" />
				<span>{me.username}</span>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item onClick={onLogout}>
				<Icon type="logout" />
				<span>Đăng xuất</span>
			</Menu.Item>
		</Menu>
	)

	const languages = (
		<Menu>
			<Menu.Item>
				<span role="img" aria-label="vi">
					🇻🇳
				</span>
				<span>Việt Nam</span>
			</Menu.Item>
			<Menu.Item onClick={onLogout}>
				<span role="img" aria-label="gb">
					🇬🇧
				</span>
				<span>English</span>
			</Menu.Item>
		</Menu>
	)

	return (
		<div
			style={{
				height: '100vh',
				backgroundImage: `url(${BgDashboard})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				backgroundAttachment: 'fixed',
				backgroundSize: 'cover',
				overflowY: 'scroll',
				WebkitOverflowScrolling: 'touch'
			}}
		>
			<PageHeader
				style={{ backgroundColor: 'transparent' }}
				title={
					<Icon
						type="home"
						onClick={() => children.props.history.push('/🥢')}
						style={{ color: '#ffffff' }}
					/>
				}
				onBack={() => children.props.history.goBack()}
				backIcon={<Icon type="arrow-left" style={{ color: '#ffffff' }} />}
				extra={[
					<Select
						disabled={children.props.location.pathname.split('/').length > 3}
						key="1"
						defaultValue={currentsite}
						style={{ width: '12em', marginRight: '1em' }}
						onChange={handleChange}
					>
						{children.props.location.pathname === '/🥢'
							? JSON.parse(window.localStorage.getItem('user-permissions')).map(
									item => (
										<Option key={item.siteId} value={item.siteId}>
											{item.siteName}
										</Option>
									)
							  )
							: sitesHasPermission.map(item => (
									<Option key={item.siteId} value={item.siteId}>
										{item.siteName}
									</Option>
							  ))}
					</Select>,
					<Dropdown key="2" overlay={menu}>
						<Avatar
							icon="user"
							style={{
								color: '#ffffff',
								backgroundColor: 'transparent',
								marginRight: '.5em'
							}}
						/>
					</Dropdown>,
					<Dropdown key="3" overlay={languages}>
						<Avatar
							icon="global"
							style={{ color: '#ffffff', backgroundColor: 'transparent' }}
						/>
					</Dropdown>
				]}
				footer={<Divider style={{ margin: '0' }} />}
			/>
			<div>{React.cloneElement(children, { siteId: currentsite })}</div>
		</div>
	)
}

const ME = gql`
	query {
		me {
			username
		}
	}
`

export default withApollo(withRouter(inject('store')(observer(Layout))))
