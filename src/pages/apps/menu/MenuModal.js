import React, { useState } from 'react'
import { Modal, Form, Button, Icon, Input, Col, Row, InputNumber } from 'antd'

function MenuModal(props) {
	const { listDish } = props
	const [dishes, setDishes] = useState(listDish)

	function remove(id) {
		setDishes(dishes.filter(d => d._id !== id))
	}

	function add() {
		setDishes(
			dishes.push({
				name: '',
				count: 0,
				__typename: 'DishInfo'
			})
		)
		console.log(dishes)
	}
	const { getFieldDecorator } = props.form
	const formItems = dishes.map((dish, index) => (
		<Row>
			<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
				<Form.Item required={false} key={dish.name}>
					{getFieldDecorator(`${dish.name}`, {
						validateTrigger: ['onChange', 'onBlur'],
						rules: [
							{
								required: true,
								whitespace: true,
								message: 'Nhập tên món'
							}
						],
						initialValue: dish.name
					})(<Input style={{ width: '90%' }} />)}
				</Form.Item>
			</Col>
			<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }}>
				<Form.Item>
					<InputNumber width="50px" defaultValue={dish.count} />
					<Icon
						style={{ marginLeft: '10px', fontSize: '18px' }}
						type="minus-circle-o"
						onClick={() => remove(dish._id || '')}
					/>
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
			okText="Lưu"
			cancelText="Hủy"
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
