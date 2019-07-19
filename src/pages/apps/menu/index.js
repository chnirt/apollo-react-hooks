import React, { useState } from 'react'
import { Row, Button, Divider } from 'antd'
import MenuList from './menuList'
import MenuModal from './menuModal'

function Menu(props) {
	
	const [siteId] = useState(
		window.localStorage.getItem('currentsite')
	)

	return (
		<div className='menu'>
			<Button
				type='link'
				icon='left'
				size='large'
				style={{ color: '#ffffff' }}
				onClick={() => props.history.push('/🥢')}
			/>
			<Divider style={{ marginTop: 0 }} />
			<Row className='menu-list'>
				<MenuList {...props} siteId={siteId} />
			</Row>
		</div>
	)
}

export default Menu
