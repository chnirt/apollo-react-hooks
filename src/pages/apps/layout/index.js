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

	console.log(children.props.location.pathname.split('/🥢/')[1])

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
						style={{ width: 130, marginRight: '5vw' }}
						onChange={handleChange}
					>
						{JSON.parse(window.localStorage.getItem('user-permissions')).map(
							item => (
								<Option key={item.siteId} value={item.siteId}>
									{item.siteName}
								</Option>
							)
						)}
					</Select>
					<Divider style={{ margin: '4px 0 0' }} />
					{children}
				</div>
			)}
		</div>
	)
}

export default Layout
