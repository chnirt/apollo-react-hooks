import React, { useState } from 'react'
import {
	Form,
	Button,
	Input,
	Row,
	Col,
	InputNumber,
	Icon,
	Modal,
	List
} from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon'

function ListDish(props) {
	const { form, data, menuById, shopId, menuId, publishAndUnpublish } = props

	const [dishes, setDishes] = useState(
		// eslint-disable-next-line no-nested-ternary
		menuById.menu
			? shopId !== '' && shopId !== menuById.menu.shopId
				? []
				: menuById.menu.dishes
			: []
	)

	const [visible, setVisible] = useState(false)
	const [hasChange, setHasChange] = useState(false)

	async function deleteDish(dishId) {
		Modal.confirm({
			title: 'Xóa món ăn',
			content: 'Bạn có chắc chắn xóa món ăn này?',
			onOk: async () => {
				await props.mutate
					.deleteDish({
						variables: {
							id: dishId
						}
					})
					.then(
						() =>
							data.refetch(shopId) &&
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

	async function addDish(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async err => {
			if (!err) {
				props.mutate
					.addDish({
						variables: {
							name: form.getFieldValue('name'),
							shopId: props.shopId
						}
					})
					.then(res => {
						if (res) {
							setVisible(false)
							data.refetch(shopId)
							openNotificationWithIcon(
								'success',
								'delete',
								'Xóa món ăn thành công',
								''
							)
						}
					})
					.catch(err)
			}
		})
	}

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
		await setHasChange(true)
	}

	async function updateMenu() {
		// eslint-disable-next-line no-unused-expressions
		hasChange
			? await props.mutate
					.updateMenu({
						variables: {
							id: menuId,
							menuInfo: {
								shopId,
								dishes: dishes.map(dish => ({
									_id: dish._id,
									name: dish.name,
									count: dish.count
								}))
							}
						},
						refetchQueries: [
							{
								query: GET_MENU,
								variables: {
									id: menuId
								}
							}
						]
					})
					.then(() => {
						openNotificationWithIcon(
							'success',
							'save',
							'Lưu menu thành công',
							''
						)
						setHasChange(false)
					})
			: openNotificationWithIcon(
					'info',
					'nochange',
					'Menu không có thay đổi',
					''
			  )
	}

	const { getFieldDecorator } = form

	return (
		<>
			<Col span={22} offset={1} style={{ marginTop: '1em' }} order={1}>
				<Row type="flex" justify="end" align="middle">
					<Button
						name="btnAddDish"
						type="primary"
						style={{ marginRight: '1em' }}
						onClick={() => setVisible(true)}
						hidden={shopId === ''}
					>
						Thêm món
					</Button>
					<Button
						name="btnSaveMenu"
						type="primary"
						onClick={updateMenu}
						style={{ marginRight: '1em' }}
						hidden={
							shopId === '' || (menuById.menu && menuById.menu.isPublished)
						}
					>
						Lưu
					</Button>
					<Button
						name="btnPublishMenu"
						type="primary"
						onClick={() => publishAndUnpublish(hasChange)}
					>
						{menuById.menu && menuById.menu.isPublished
							? 'Hủy công khai'
							: 'Công khai'}
					</Button>
				</Row>
			</Col>
			<Col span={22} offset={1} style={{ marginTop: '1em' }} order={3}>
				{data.dishesByShop.length !== 0 && (
					<List
						style={{
							padding: '1em',
							backgroundColor: '#fff',
							borderRadius: '.5em'
						}}
						pagination
						header={
							<Row>
								<Col span={12}>
									<b>Món ăn</b>
								</Col>
								<Col span={6}>
									<b>Số lượng</b>
								</Col>
							</Row>
						}
						dataSource={data.dishesByShop}
						renderItem={dish => (
							<List.Item
								actions={[
									<Icon type="delete" onClick={() => deleteDish(dish._id)} />
								]}
							>
								<Col span={12}>{dish.name}</Col>
								<Col span={6} style={{ marginRight: '2em' }}>
									<InputNumber
										defaultValue={
											menuById.menu.dishes.findIndex(
												item => item._id === dish._id
											) !== -1
												? menuById.menu.dishes[
														menuById.menu.dishes.findIndex(
															item => item._id === dish._id
														)
												  ].count
												: 0
										}
										min={0}
										max={99}
										onChange={value => changeCount(value, dish._id, dish.name)}
									/>
								</Col>
							</List.Item>
						)}
					/>
				)}
				{shopId === '' && (
					<List
						style={{
							padding: '1em',
							backgroundColor: '#fff',
							borderRadius: '.5em'
						}}
						pagination
						header={
							<Row>
								<Col span={12} offset={1}>
									<b>Món ăn</b>
								</Col>
								<Col span={6} offset={1}>
									<b>Số lượng</b>
								</Col>
							</Row>
						}
						dataSource={menuById.menu ? menuById.menu.dishes : []}
						renderItem={dish => (
							<List.Item>
								<Col span={12} offset={1}>
									{dish.name}
								</Col>
								<Col span={6} offset={1}>
									{dish.count}
								</Col>
							</List.Item>
						)}
					/>
				)}
			</Col>
			<Modal
				title="Thêm món ăn"
				// cancelText="Đóng"
				visible={visible}
				// okText="Lưu"
				// onCancel={() => setVisible(false)}
				// onOk={addDish}
				afterClose={() => form.resetFields(['name'])}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={() => setVisible(false)}
						name="cancelAddDish"
					>
						Đóng
					</Button>,
					<Button key="save" type="primary" onClick={addDish} name="addDish">
						Lưu
					</Button>
				]}
			>
				<Form>
					<Row>
						<Col span={20} offset={2}>
							<Form.Item>
								{getFieldDecorator('name', {
									rules: [{ required: true, message: 'Nhập tên món ăn!' }],
									initialValue: ''
								})(<Input placeholder="Nhập tên món ăn" />)}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	)
}

const GET_DISHES_BY_SHOP = gql`
	query($shopId: String!) {
		dishesByShop(shopId: $shopId) {
			_id
			name
		}
	}
`

const DELETE_DISH = gql`
	mutation($id: String!) {
		deleteDish(id: $id)
	}
`

const ADD_DISH_TO_SHOP = gql`
	mutation($name: String!, $shopId: String!) {
		createDish(name: $name, shopId: $shopId)
	}
`

const GET_MENU = gql`
	query menu($id: String!) {
		menu(id: $id) {
			_id
			name
			siteId
			shopId
			isPublished
			dishes {
				_id
				name
				count
			}
		}
	}
`

const UPDATE_MENU = gql`
	mutation updateMenu($id: String!, $menuInfo: MenuInfo!) {
		updateMenu(id: $id, menuInfo: $menuInfo)
	}
`

export default HOCQueryMutation([
	{
		query: GET_DISHES_BY_SHOP,
		options: props => ({
			variables: {
				shopId: props.shopId
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
		mutation: DELETE_DISH,
		name: 'deleteDish',
		options: {}
	},
	{
		mutation: ADD_DISH_TO_SHOP,
		name: 'addDish',
		options: {}
	},
	{
		mutation: UPDATE_MENU,
		name: 'updateMenu',
		options: {}
	}
])(Form.create()(ListDish))
