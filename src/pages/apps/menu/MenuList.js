import React, { useState } from 'react'
import { Card, Icon, Col } from 'antd'
import MenuModal from './MenuModal'

function MenuList(props) {
	const { menuData } = props
	const [visible, setVisible] = useState(false)

	function openModal() {
		setVisible(true)
	}

	function closeModal() {
		setVisible(false)
	}

	return (
		<>
			<Col
				style={{ marginBottom: '20px' }}
				xs={{ span: 22, offset: 1 }}
				sm={{ span: 22, offset: 1 }}
				lg={{ span: 6, offset: 1 }}
			>
				<Card actions={[<Icon type="edit" onClick={openModal} />]}>
					<p style={{ height: '50px', lineHeight: '50px' }}>{props.children}</p>
				</Card>
			</Col>
			<MenuModal
				menuId={menuData._id}
				visible={visible}
				handleCancel={closeModal}
			/>
		</>
	)
}
export default MenuList
