import React, { useState } from 'react'
import MenuList from './menuList'

function Menu(props) {
	const [siteId] = useState(window.localStorage.getItem('currentsite'))

	return (
		<div className="menu">
			<h1 style={{ margin: '.3em 1em', color: '#fff', display: 'inline' }}>
				Quản lý menu
			</h1>
			<div className="menu-list">
				<MenuList {...props} siteId={siteId} />
			</div>
		</div>
	)
}

export default Menu
