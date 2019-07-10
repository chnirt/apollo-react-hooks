import React, { useState } from 'react'
import { Modal, Form, Button, Icon, Input, Col, Row, InputNumber } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

function MenuModal(props) {
	const { listDish } = props
	const [dishes, setDishes] = useState(listDish)

	function remove(id) {
		setDishes(dishes.filter(d => d._id !== id))
	}

	async function add() {
		if (dishes[dishes.length - 1]._id) {
			const list = dishes.slice(0)
			list.push({
				name: '',
				count: 0
			})
			setDishes(list)
		} else {
			const { name, count } = dishes[dishes.length - 1]
			await props.mutate.addDish({
				varibles: {
					id: props.menuId,
					dishInput: { name, count }
				}
			})
		}
	}
	const { getFieldDecorator } = props.form
	const formItems = dishes.map((dish, index) => (
		<Row key={index}>
			<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
				<Form.Item>
					{getFieldDecorator(`dish[${dish._id}]`, {
						validateTrigger: ['onChange', 'onBlur'],
						rules: [
							{
								required: true,
								whitespace: true,
								message: 'Nhập tên món ăn'
							}
						],
						initialValue: dish.name || ''
					})(<Input style={{ width: '90%' }} />)}
				</Form.Item>
			</Col>
			<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }}>
				<Form.Item>
					<InputNumber width="50px" defaultValue={dish.count} />
					{index >= 0 ? (
						<Icon
							style={{ marginLeft: '10px', fontSize: '18px' }}
							type="minus-circle-o"
							onClick={() => remove(dish._id)}
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
			okText="Lưu"
			cancelText="Hủy"
		>
			<Row style={{ marginBottom: '20px' }}>
				<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
					<b>Món ăn</b>
				</Col>
				<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<b>Số lượng</b>
				</Col>
			</Row>
			<Form>
				{formItems}
				<Form.Item>
					<Button type="dashed" onClick={add} style={{ width: '60%' }}>
						<Icon type="plus" /> Thêm món
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

const ADD_DISH = gql`
	mutation addDish($id: String!, $dishInput: DishInput!) {
		addDish(id: $id, dishInput: $dishInput)
	}
`

export default HOCQueryMutation([
	{
		mutation: ADD_DISH,
		name: 'addDish',
		options: {}
	}
])(Form.create()(MenuModal))
