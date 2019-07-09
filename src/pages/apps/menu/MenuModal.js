import React from 'react'
import { Modal, Form, Button, Icon, Input, Col, Row, InputNumber } from 'antd'

let id = 0

function MenuModal(props) {
	function remove(k) {
		const { form } = props
		// can use data-binding to get
		const keys = form.getFieldValue('keys')
		// We need at least one passenger
		if (keys.length === 1) {
			return
		}

		// can use data-binding to set
		form.setFieldsValue({
			keys: keys.filter(key => key !== k)
		})
	}

	function add() {
		const { form } = props
		// can use data-binding to get
		const keys = form.getFieldValue('keys')
		const nextKeys = keys.concat(id++)
		// can use data-binding to set
		// important! notify form to detect changes
		form.setFieldsValue({
			keys: nextKeys
		})
	}
	const { getFieldDecorator, getFieldValue } = props.form

	getFieldDecorator('keys', { initialValue: [] })
	const keys = getFieldValue('keys')
	const formItems = keys.map((k, index) => (
		<Row>
			<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
				<Form.Item required={false} key={k}>
					{getFieldDecorator(`dish[${k}]`, {
						validateTrigger: ['onChange', 'onBlur'],
						rules: [
							{
								required: true,
								whitespace: true,
								message: 'Nhập tên món'
							}
						]
					})(<Input style={{ width: '90%' }} />)}
				</Form.Item>
			</Col>
			<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }}>
				<Form.Item>
					<InputNumber width="50px" defaultValue={0} />
					{keys.length > 1 ? (
						<Icon
							style={{ marginLeft: '10px' }}
							className="dynamic-delete-button"
							type="minus-circle-o"
							onClick={() => remove(k)}
						/>
					) : null}
				</Form.Item>
			</Col>
		</Row>
	))
	return (
		<Modal
			width="80%"
			title="Danh sách món"
			visible={props.visible}
			//	onOk={this.handleOk}
			onCancel={props.handleCancel}
			destroyOnClose="true"
		>
			<Form>
				{formItems}
				<Form.Item>
					<Button type="dashed" onClick={add} style={{ width: '90%' }}>
						<Icon type="plus" /> Thêm món
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default Form.create()(MenuModal)
