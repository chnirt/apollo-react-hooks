import React, { useState } from 'react'
import { Modal, Form, Button, Icon, Input, Col, Row, InputNumber } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

function MenuModal(props) {
	const { form, data } = props
	const { _id, dishes } = data.menu
	const [dishName, setDishName] = useState('')
	const [count, setCount] = useState(0)
	async function remove(id) {
		Modal.confirm({
			title: 'Bạn có chắc chắn muốn xóa?',
			async onOk() {
				await props.mutate.deleteDish({
					variables: {
						menuId: _id,
						dishId: id
					},
					refetchQueries: [
						{
							query: GET_MENU,
							variables: {
								id: props.menuId
							}
						}
					]
				})
			}
		})
	}

	async function submit(e) {
		e.preventDefault()
		props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				await props.mutate
					.addDish({
						variables: {
							id: _id,
							dishInput: {
								name: dishName,
								count: count
							}
						},
						refetchQueries: [
							{
								query: GET_MENU,
								variables: {
									id: props.menuId
								}
							}
						]
					})
					.then(result => {
						if (result) {
							// setDishName('')
							// setCount(0)
							form.resetFields(['name', 'count'])
						}
					})
					.catch(err)
			}
		})
	}

	function enterDishName(e) {
		setDishName(e.target.value)
	}

	function changeCount(value) {
		setCount(value)
	}

	async function publishAndUnpublish() {
		await props.mutate.publishAndUnpublish({
			variables: { id: data.menu._id }
		})
	}

	const formItems = dishes.map((dish, index) => (
		<Row key={index}>
			<Col xs={{ span: 16 }} sm={{ span: 16 }} lg={{ span: 16 }}>
				<Form.Item>{dish.name}</Form.Item>
			</Col>
			<Col xs={{ span: 4 }} sm={{ span: 4 }} lg={{ span: 4 }}>
				<Form.Item>{dish.count}</Form.Item>
			</Col>
			<Col xs={{ span: 4 }} sm={{ span: 4 }} lg={{ span: 4 }}>
				<Form.Item>
					<Icon
						style={{ marginLeft: '25px' }}
						className="dynamic-delete-button"
						type="delete"
						onClick={() => remove(dish._id)}
					/>
				</Form.Item>
			</Col>
		</Row>
	))
	const { getFieldDecorator } = form
	return (
		<Modal
			width="80%"
			title="Danh sách món"
			visible={props.visible}
			onCancel={props.handleCancel}
			cancelText="Đóng"
			okText={data.menu.isPublished ? 'Unpublish' : 'Publish'}
			onOk={publishAndUnpublish}
		>
			<Row style={{ marginBottom: '20px' }}>
				<Col span={16}>
					<b>Món ăn</b>
				</Col>
				<Col span={6}>
					<b>Số lượng</b>
				</Col>
			</Row>
			{formItems}
			<Form onSubmit={submit}>
				<Row>
					<Col span={16}>
						<Form.Item>
							{getFieldDecorator('name', {
								rules: [{ required: true, message: 'Nhập tên món ăn!' }],
								initialValue: ''
							})(
								<Input
									placeholder="Nhập tên món ăn"
									onChange={enterDishName}
									style={{ width: '90%' }}
								/>
							)}
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item>
							{getFieldDecorator('count', {
								initialValue: 0
							})(<InputNumber min={0} onChange={changeCount} width="50px" />)}
						</Form.Item>
					</Col>
					<Col span={16}>
						<Form.Item>
							<Button htmlType="submit" type="dashed" style={{ width: '90%' }}>
								<Icon type="plus" /> Thêm món
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

const GET_MENU = gql`
	query menu($id: String!) {
		menu(id: $id) {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
			isPublished
			isLocked
			isActived
		}
	}
`

const ADD_DISH = gql`
	mutation addDish($id: String!, $dishInput: DishInput!) {
		addDish(id: $id, dishInput: $dishInput)
	}
`

const DELETE_DISH = gql`
	mutation deleteDish($menuId: String!, $dishId: String!) {
		deleteDish(menuId: $menuId, dishId: $dishId)
	}
`

const PUBLISH_UNPUBLISH = gql`
	mutation publishAndUnpublish($id: String!) {
		publishAndUnpublish(id: $id)
	}
`

export default HOCQueryMutation([
	{
		query: GET_MENU,
		options: props => ({
			variables: {
				id: props.menuId
			}
		})
	},
	{
		mutation: PUBLISH_UNPUBLISH,
		name: 'publishAndUnpublish',
		options: {}
	},
	{
		mutation: ADD_DISH,
		name: 'addDish',
		options: {}
	},
	{
		mutation: DELETE_DISH,
		name: 'deleteDish',
		options: {}
	}
])(Form.create()(MenuModal))
