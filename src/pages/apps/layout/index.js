import React from 'react'
import { Layout as Layouts } from 'antd'

function Layout(props) {
	const { children } = props
	return (
		<>
			<Layouts
				className="layout"
				id="layout-dashboard"
				style={{
					height: '100vh'
				}}
			>
				{children}
			</Layouts>
		</>
	)
}

export default Layout
