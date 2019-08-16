import React, { useState, useEffect } from 'react'
import {
	Divider,
	Select,
	PageHeader,
	Icon,
	Menu,
	Dropdown,
	ConfigProvider,
	Row
} from 'antd'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import BgDashboard from '../../assets/images/bg-dashboard.jpg'

const { Option } = Select
function Layout(props) {
	const [currentsite, setCurrentsite] = useState(
		window.localStorage.getItem('currentsite')
	)
	const { children, t, store } = props

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

	if (!localStorage.getItem('user-permissions')) {
		onLogout()
	}

	const userPermissions = JSON.parse(
		localStorage.getItem('user-permissions')
	).map(item => ({
		siteName: item.siteName,
		siteId: item.siteId,
		permissions: item.sitepermissions
	}))

	const currentPage = children.props.location.pathname.slice(4).toUpperCase()

	const sitesHasPermission = userPermissions.filter(
		item => item.permissions.indexOf(currentPage) !== -1
	)

	const info = (
		<Menu>
			<Menu.Item disabled>
				<Icon type="user" />
				<span>{me.username}</span>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item onClick={onLogout}>
				<Icon type="logout" />
				<span>{t('src.pages.common.logOut')}</span>
			</Menu.Item>
		</Menu>
	)

	function changeLocale({ key }) {
		// console.log(key)
		if (key === 'vi') {
			props.i18n.changeLanguage('vi')
			props.store.i18nStore.changeLanguage('vi')
		} else {
			props.i18n.changeLanguage('en')
			props.store.i18nStore.changeLanguage('en')
		}
	}

	const languages = (
		<Menu onClick={changeLocale}>
			<Menu.Item key="vi" value="vi">
				<span role="img" aria-label="vi">
					🇻🇳
				</span>
			</Menu.Item>
			<Menu.Item key="en" value="en">
				<span role="img" aria-label="en">
					🇬🇧
				</span>
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
			<ConfigProvider locale={store.i18nStore.locale}>
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
							key="1"
							disabled={children.props.location.pathname.split('/').length > 3}
							defaultValue={currentsite}
							style={{ width: '10em', marginRight: '.5em' }}
							onChange={handleChange}
						>
							{children.props.location.pathname === '/🥢'
								? JSON.parse(
										window.localStorage.getItem('user-permissions')
								  ).map(item => (
										<Option key={item.siteId} value={item.siteId}>
											{item.siteName}
										</Option>
								  ))
								: sitesHasPermission.map(item => (
										<Option key={item.siteId} value={item.siteId}>
											{item.siteName}
										</Option>
								  ))}
						</Select>,
						<Dropdown
							key="2"
							overlay={info}
							trigger={['click']}
							placement="bottomCenter"
						>
							<Icon
								type="user"
								style={{
									color: '#ffffff',
									fontSize: '16px',
									fontWeight: 'bold',
									cursor: 'pointer',
									marginRight: '.5em',
									paddingBottom: 9
								}}
							/>
						</Dropdown>,
						<Dropdown
							key="3"
							overlay={languages}
							trigger={['click']}
							placement="bottomCenter"
						>
							<span
								style={{ color: '#fff', cursor: 'pointer', paddingBottom: 9 }}
							>
								{window.localStorage.getItem('i18nextLng') === 'vi'
									? 'VI'
									: 'EN'}
							</span>
						</Dropdown>
					]}
					footer={<Divider style={{ margin: '0' }} />}
				/>
			</ConfigProvider>
			<Row
				style={{
					height: 'calc(100vh - 67px)'
				}}
			>
				{React.cloneElement(children, { currentsite, me, t })}
			</Row>
		</div>
	)
}

const ME = gql`
	query {
		me {
			username
			fullName
			_id
		}
	}
`

export default withApollo(
	withRouter(inject('store')(observer(withTranslation('translations')(Layout))))
)
