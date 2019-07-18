import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Row, Col, InputNumber, Icon, Modal } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon'

function ListDish(props) {
	const { form, data, menuById, updateMenu, shopId } = props

	const [dishes, setDishes] = useState(props.shopId !== '' && props.shopId !== menuById.menu.shopId 
		? [] 
		: (menuById.menu ? menuById.menu.dishes : [])
	)

	useEffect(() => {
		return () => {
			if (menuById.menu) {
				setDishes(menuById.menu.dishes)
			}
		};
	}, [menuById.menu])

	async function changeCount(value, id, name) {
		const index = dishes.findIndex(item => item._id === id)
		let list = []
		if (index !== -1) {
			if (value <= 0) {
				list = [...dishes.slice(0, index), ...dishes.slice(index + 1)]
				await setDishes([...dishes.slice(0, index), ...dishes.slice(index + 1)])
			} else {
				list = [...dishes.slice(0, index), {...dishes[index], count: value}, ...dishes.slice(index + 1)]
				await setDishes(list)
			}
		} else {
			list = [...dishes.slice(0), {_id: id, name: name, count: value}]
			await setDishes(list)
		}
		await updateMenu(list)
	}
	
	async function addDish(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				props.mutate.addDish({
					variables: {
						id: props.shopId,
						name: form.getFieldValue('name')
					}
				}).then(res => data.refetch(shopId) && form.resetFields())
					.catch(err)
			}
		})
	}

	async function deleteDish (dishId) {
		Modal.confirm({
			title: 'Xóa món ăn',
			content: 'Bạn có chắc chắn xóa món ăn này?',
			onOk: async () => {
				await props.mutate.deleteDish({
					variables: {
						id: props.shopId,
						dishId
					},
					refetchQueries: [{
						query: GET_SHOP_BY_ID,
						variables: {
							id: props.shopId
						}
					}]
				}).then(res => data.refetch(props.shopId) && openNotificationWithIcon('success', 'delete', 'Xóa món ăn thành công', ''))
			}
		})
	}

	const { getFieldDecorator } = form

  return (
    <div>
      {
				data.shop && data.shop.dishes.map((dish, index) => {
					return (
						<Row key={index}>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
								<Form.Item>{dish.name}</Form.Item>
							</Col>
							<Col xs={{ span: 8 }} sm={{ span: 8 }} lg={{ span: 4 }}>
								<Form.Item>
									<InputNumber
										defaultValue={ dishes.findIndex(item => item._id === dish._id) !== -1 
											? dishes[dishes.findIndex(item => item._id === dish._id)].count
											: 0}
										min={0}
										max={99}
										onChange={(value) => changeCount(value, dish._id, dish.name)}
									/>
								</Form.Item>
							</Col>
							<Col xs={{ span: 4 }} sm={{ span: 4 }} lg={{ span: 4 }}>
								<Form.Item>
									<Icon
										style={{ marginLeft: '25px' }}
										className='dynamic-delete-button'
										type='delete'
										onClick={() => deleteDish(dish._id)}
									/>
								</Form.Item>
							</Col>
						</Row>
					)
				})
			}
			{ props.shopId === '' 
			? (
				menuById.menu && menuById.menu.dishes.map((dish, index) => (
						<Row key={index}>
							<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
								<Form.Item>{dish.name}</Form.Item>
							</Col>
							<Col xs={{ span: 8 }} sm={{ span: 8 }} lg={{ span: 4 }}>
								<Form.Item>
									{dish.count}
								</Form.Item>
							</Col>
						</Row>
					))
				) 
			: (<Form onSubmit={addDish} wrapperCol={{ xs: {span: 24}, sm: {span: 16 } }}>
					<Form.Item>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: 'Nhập tên món ăn!' }],
							initialValue: ''
						})(
							<Input
								placeholder='Nhập tên món ăn'
							/>
						)}
					</Form.Item>
					<Form.Item>
						<Button icon='plus' htmlType='submit' type='dashed'>
							Thêm món
						</Button>
					</Form.Item>
				</Form>)
			}
    </div>
  )
}

const GET_SHOP_BY_ID = gql`
  query ($id: String!) {
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
	mutation ($id: String!, $name: String!) {
		addDish(id: $id, name: $name)
	}
`

const DELETE_DISH = gql`
	mutation ($id: String!, $dishId: String!) {
		deleteDish(id: $id, dishId: $dishId)
	}
`

const GET_MENU = gql`
	query menu($id: String!) {
		menu(id: $id) {
			_id
			name
			siteId
			shopId
			dishes {
				_id
				name
				count
			}
			isPublished
			isLocked
			isActive
		}
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
		query: GET_MENU,
		options: props => ({
			variables: {
				id: props.menuId
			}
		}),
		name: 'menuById'
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
