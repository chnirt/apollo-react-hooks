import React from 'react'
import { Layout as Layouts } from 'antd'
import BgDashboard from '../../../assets/images/bg-dashboard.jpg'

function Layout(props) {
	const { children } = props
	return (
		<Layouts
			className="layout"
			// id="layout-dashboard"
			style={{
				height: '100vh',
				backgroundImage: `url(${BgDashboard})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				backgroundAttachment: 'fixed',
				backgroundSize: 'cover'
			}}
		>
			{children}
		</Layouts>
	)
}

export default Layout
