import React from 'react'
import { Card, Icon, Col } from 'antd'

function MenuList() {
	return (
		<Col
			className="menu-item"
			xs={{ span: 22, offset: 1 }}
			sm={{ span: 22, offset: 1 }}
			lg={{ span: 6, offset: 1 }}
		>
			<Card
				actions={[
					<Icon type="delete" />,
					<Icon type="edit" />,
					<Icon type="ellipsis" />
				]}
			>
				Menu Hoa Hong
			</Card>
		</Col>
	)
}
export default MenuList
