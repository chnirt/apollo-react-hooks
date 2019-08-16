import React, { useState } from 'react'
import MenuList from './menuList'

function Menu(props) {
	const { currentsite } = props
	const [siteId] = useState(currentsite)
	return (
		<div className="menu">
			<MenuList {...props} siteId={siteId} />
		</div>
	)
}

export default Menu
