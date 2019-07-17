import React, { useState } from 'react'
import { Row, Col, Select } from 'antd'
import MenuList from './menuList'
import MenuModal from './menuModal'

function Menu(props) {
	const [menuId, setMenuId] = useState('')
	const [visible, setVisible] = useState(false)
	const [siteId, setSiteId] = useState(
		window.localStorage.getItem('currentsite')
	)

	async function openModal(id) {
		await setMenuId(id)
		await setVisible(true)
	}

	async function changeSite(value) {
		window.localStorage.setItem('currentsite', value)
		setSiteId(value)
	}
	return (
		<div className='menu'>
			<Row className='menu-list'>
				<Col span={22} offset={1}>
					<Select
						defaultValue={siteId}
						onChange={changeSite}
						placeholder='Chọn site'
						style={{ width: '100%', margin: '25px 0' }}
					>
						{JSON.parse(window.localStorage.sites).map((site, index) => (
							<Select.Option key={index} value={site._id}>
								{site.name}
							</Select.Option>
						))}
					</Select>
				</Col>
				<MenuList siteId={siteId} openModal={openModal} />
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
