import React from 'react'
import { Modal, Form, Button, Icon } from 'antd'

export default function MenuModal(props) {
	return (
		<Modal
			title="Basic Modal"
			visible={props.visible}
			//	onOk={this.handleOk}
			onCancel={props.handleCancel}
		>
			<Form>
				<Form.Item>
					<Button type="dashed" style={{ width: '100%' }}>
						<Icon type="plus" /> Add field
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}
