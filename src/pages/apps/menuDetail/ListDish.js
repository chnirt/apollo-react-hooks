import React, { useState } from 'react'
import { Form, Button, Input, Row, Col, InputNumber, Icon, Modal } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

function ListDish(props) {
	const { form, data, updateDishes, shopId, menuShop } = props

	const [dishes, setDishes] = useState(
		shopId !== '' && shopId !== menuShop
			? []
			: // eslint-disable-next-line react/destructuring-assignment
			  props.dishes
	)

	async function changeCount(value, id, name) {
		const index = dishes.findIndex(item => item._id === id)
		let list = []
		if (index !== -1) {
			if (value <= 0) {
				list = [...dishes.slice(0, index), ...dishes.slice(index + 1)]
				await setDishes([...dishes.slice(0, index), ...dishes.slice(index + 1)])
			} else {
				list = [
					...dishes.slice(0, index),
					{ ...dishes[index], count: value },
					...dishes.slice(index + 1)
				]
				await setDishes(list)
			}
		} else {
			list = [...dishes.slice(0), { _id: id, name, count: value }]
			await setDishes(list)
		}
		await updateDishes(list)
	}

	async function addDish(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async err => {
			if (!err) {
				props.mutate
					.addDish({
						variables: {
							id: props.shopId,
							name: form.getFieldValue('name')
						}
					})
					.then(() => data.refetch(shopId) && form.resetFields())
					.catch(err)
			}
		})
	}

	async function deleteDish(dishId) {
		Modal.confirm({
			title: 'Xóa món ăn',
			content: 'Bạn có chắc chắn xóa món ăn này?',
			onOk: async () => {
				await props.mutate
					.deleteDish({
						variables: {
							id: props.shopId,
							dishId
						},
						refetchQueries: [
							{
								query: GET_SHOP_BY_ID,
								variables: {
									id: props.shopId
								}
							}
						]
					})
					.then(
						() =>
							data.refetch(props.shopId) &&
							openNotificationWithIcon(
								'success',
								'delete',
								'Xóa món ăn thành công',
								''
							)
					)
			}
		})
	}

	const { getFieldDecorator } = form

	return (
		<div>
			{data.shop ? (
				<div style={{ overflow: 'auto', height: '40vh' }}>
					{data.shop.dishes.map(dish => {
						return (
							<Row key={dish._id}>
								<Col span={12} offset={1}>
									<Form.Item style={{ color: '#fff' }}>
										<b>{dish.name}</b>
									</Form.Item>
								</Col>
								<Col span={6} offset={1}>
									<Form.Item>
										<InputNumber
											defaultValue={
												props.dishes.findIndex(item => item._id === dish._id) !==
												-1
													? props.dishes[
															props.dishes.findIndex(
																item => item._id === dish._id
															)
													  ].count
													: 0
											}
											min={0}
											max={99}
											onChange={value => changeCount(value, dish._id, dish.name)}
										/>
									</Form.Item>
								</Col>
								<Col xs={{ span: 2 }} sm={{ span: 2 }} lg={{ span: 2 }}>
									<Form.Item>
										<Icon
											style={{ marginLeft: '1em', color: '#fff' }}
											className="dynamic-delete-button"
											type="delete"
											onClick={() => deleteDish(dish._id)}
										/>
									</Form.Item>
								</Col>
							</Row>
						)
					})}
				</div>
			) : null}
			{shopId === '' ? (
				<div style={{ overflow: 'auto', height: '60vh' }}>
					{// eslint-disable-next-line react/destructuring-assignment
					props.dishes &&
						// eslint-disable-next-line react/destructuring-assignment
						props.dishes.map(dish => (
							<Row key={dish._id}>
								<Col span={12} offset={1}>
									<Form.Item style={{ color: '#fff' }}>
										<b>{dish.name}</b>
									</Form.Item>
								</Col>
								<Col span={6} offset={1}>
									<Form.Item style={{ color: '#fff' }}>
										<b>{dish.count}</b>
									</Form.Item>
								</Col>
							</Row>
						))}
				</div>
			) : (
				<Form
					style={{ marginTop: '1em' }}
					onSubmit={addDish}
					wrapperCol={{
						xs: { span: 12, offset: 1 },
						lg: { span: 12, offset: 1 }
					}}
				>
					<Form.Item>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: 'Nhập tên món ăn!' }],
							initialValue: ''
						})(<Input placeholder="Nhập tên món ăn" />)}
					</Form.Item>
					<Form.Item>
						<Button ghost icon="plus" htmlType="submit" type="dashed">
							Thêm món
						</Button>
					</Form.Item>
				</Form>
			)}
		</div>
	)
}

const GET_SHOP_BY_ID = gql`
	query($id: String!) {
		shop(id: $id) {
			_id
			name
			siteId
			dishes {
				_id
				name
			}
		}
	}
`

const ADD_DISH_TO_SHOP = gql`
	mutation($id: String!, $name: String!) {
		addDish(id: $id, name: $name)
	}
`

const DELETE_DISH = gql`
	mutation($id: String!, $dishId: String!) {
		deleteDish(id: $id, dishId: $dishId)
	}
`

export default HOCQueryMutation([
	{
		query: GET_SHOP_BY_ID,
		options: props => ({
			variables: {
				id: props.shopId
			},
			fetchPolicy: 'no-cache'
		})
	},
	{
		mutation: ADD_DISH_TO_SHOP,
		name: 'addDish',
		options: {}
	},
	{
		mutation: DELETE_DISH,
		name: 'deleteDish',
		options: {}
	}
])(Form.create()(ListDish))
