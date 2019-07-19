import React from 'react'
import { Button, Divider } from 'antd'
import BgDashboard from '../../../assets/images/bg-dashboard.jpg'

function Layout(props) {
	const { children } = props
	return (
		<div
			style={{
				height: '100vh',
				backgroundImage: `url(${BgDashboard})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				backgroundAttachment: 'fixed',
				backgroundSize: 'cover',
				overflow: 'hidden'
			}}
		>
			{children.props.location.pathname === '/🥢' ? (
				children
			) : (
				<div>
					<Button
						type="link"
						icon="left"
						size="large"
						style={{ color: '#ffffff' }}
						onClick={() => children.props.history.goBack()}
					/>
					<Divider style={{ margin: '4px 0 0' }} />
					{children}
				</div>
			)}
		</div>
	)
}

export default Layout
