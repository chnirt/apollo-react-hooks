import React, { useState } from 'react'
import { Button, Divider, Select } from 'antd'
import BgDashboard from '../../../assets/images/bg-dashboard.jpg'

const { Option } = Select
function Layout(props) {
	const [currentsite, setCurrentsite] = useState(
		window.localStorage.getItem('currentsite')
	)
	const { children } = props
	function handleChange(value) {
		// console.log(`selected ${value}`)
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
	const currentPage = children.props.history.location.pathname
		.slice(4)
		.toUpperCase()
	const sitesHasPermission = userPers.filter(
		ele => ele.permissions.indexOf(currentPage) !== -1
	)
	// console.log(sitesHasPermission)
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
			{children.props.location.pathname === '/🥢' ? (
				children
			) : (
				<div
					style={
						{
							// perspectiveOrigin: '25% 75%',
							// transform: 'perspective(300px) rotateY(-20deg)'
						}
					}
				>
					<Button
						type="link"
						icon="left"
						size="large"
						style={{ color: '#ffffff' }}
						onClick={() => children.props.history.goBack()}
					/>
					<Select
						defaultValue={currentsite}
						style={{ width: 180, marginRight: '5vw' }}
						onChange={handleChange}
					>
						{sitesHasPermission.map(item => (
							<Option key={item.siteId} value={item.siteId}>
								{item.siteName}
							</Option>
						))}
					</Select>
					<Divider style={{ margin: '4px 0 0' }} />
					{children}
				</div>
			)}
		</div>
	)
}

export default Layout
