import React, { useState } from 'react'
import { Row, Button, Divider } from 'antd'
import MenuList from './menuList'
import MenuModal from './menuModal'

function Menu(props) {
	const [menuId, setMenuId] = useState('')
	const [visible, setVisible] = useState(false)
	
	const [siteId] = useState(
		window.localStorage.getItem('currentsite')
	)

	function openModal(id) {
		setMenuId(id)
		setVisible(true)
	}

	console.log(props)

	return (
		<div className='menu'>
			<Button
				shape='circle'
				icon='left'
				onClick={() => props.history.push('/🥢')}
			/>
			<Divider />
			<Row className='menu-list'>
				<MenuList {...props} siteId={siteId} openModal={openModal} />
				<MenuModal
					siteId={siteId}
					menuId={menuId}
					visible={visible}
					handleCancel={() => setVisible(false)}
				/>
			</Row>
		</div>
	)
}

export default Menu
