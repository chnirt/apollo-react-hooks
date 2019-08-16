import React, { useState } from 'react'
import MenuList from './menuList'

function Menu(props) {
	const [siteId] = useState(window.localStorage.getItem('currentsite'))
	return (
		<div className="menu">
			<MenuList {...props} siteId={siteId} />
		</div>
	)
}

export default Menu
