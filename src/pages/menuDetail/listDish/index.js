import React, { useState, useEffect } from 'react'
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

import { useQuery } from '@apollo/react-hooks'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

function ListDish(props) {
	const {
		form,
		data,
		menuById,
		shopId,
		menuId,
		publishAndUnpublish,
		loading,
		t
	} = props

	const [dishes, setDishes] = useState([])

	const { data: menuData, loading: menuLoading } = useQuery(GET_MENU, {
		variables: { id: menuId }
	})

	useEffect(() => {
		if (menuData.menu) {
			if (shopId !== '' && shopId !== menuData.menu.shopId) {
				setDishes([])
				setHasChange(false)
			} else {
				setDishes(menuData.menu.dishes)
				setHasChange(false)
			}
		} else {
			setDishes([])
			setHasChange(false)
		}
	}, [shopId])

	const [visible, setVisible] = useState(false)
	const [hasChange, setHasChange] = useState(false)

	async function addDish(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async err => {
			if (!err) {
				props
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
								t('src.pages.menu.addDishSuccess'),
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
		if (index !== -1) {
			if (value <= 0) {
				await setDishes([...dishes.slice(0, index), ...dishes.slice(index + 1)])
			} else {
				await setDishes([
					...dishes.slice(0, index),
					{ ...dishes[index], count: value },
					...dishes.slice(index + 1)
				])
			}
		} else {
			await setDishes([...dishes.slice(0), { _id: id, name, count: value }])
		}
		await setHasChange(true)
	}

	async function updateMenu() {
		// eslint-disable-next-line no-unused-expressions
		hasChange
			? await props
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
							t('src.pages.common.success'),
							''
						)
						setHasChange(false)
					})
			: openNotificationWithIcon(
					'info',
					'nochange',
					t('src.pages.menu.menuNoChange'),
					''
			  )
	}

	async function deleteDishInMenu(dishId) {
		const index = dishes.findIndex(item => item._id === dishId)
		if (index !== -1) {
			const list = [...dishes.slice(0, index), ...dishes.slice(index + 1)]
			await props.updateMenu({
				variables: {
					id: menuId,
					menuInfo: {
						dishes: list.map(dish => ({
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
			await setDishes(list)
		}
	}

	async function deleteDish(dishId) {
		Modal.confirm({
			title: t('src.pages.deleteDish'),
			content: t('src.pages.common.confirmDelete'),
			onOk: async () => {
				await props
					.deleteDish({
						variables: {
							id: dishId
						}
					})
					.then(async () => {
						data.refetch(shopId)
						deleteDishInMenu(dishId)
						openNotificationWithIcon(
							'success',
							'delete',
							t('src.pages.common.success'),
							''
						)
					})
			}
		})
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
						{t('src.pages.menu.addDish')}
					</Button>
					<Button
						name="btnSaveMenu"
						type="primary"
						onClick={updateMenu}
						style={{ marginRight: '1em' }}
						hidden={
							shopId === '' || (menuData.menu && menuData.menu.isPublished)
						}
					>
						{t('src.pages.common.save')}
					</Button>
					<Button
						name="btnPublishMenu"
						type="primary"
						loading={loading}
						onClick={() => publishAndUnpublish(hasChange)}
					>
						{menuData.menu && menuData.menu.isPublished
							? t('src.pages.menu.unpublish')
							: t('src.pages.menu.publish')}
					</Button>
				</Row>
			</Col>
			<Col span={22} offset={1} style={{ marginTop: '1em' }} order={3}>
				{shopId === '' ? (
					<List
						style={{
							padding: '1em',
							backgroundColor: '#fff',
							borderRadius: '.5em'
						}}
						loading={menuLoading}
						pagination={{
							pageSize: 6
						}}
						header={
							<Row>
								<Col span={12} offset={1}>
									<b>{t('src.pages.menu.dish')}</b>
								</Col>
								<Col span={6} offset={1}>
									<b>{t('src.pages.menu.count')}</b>
								</Col>
							</Row>
						}
						dataSource={menuData.menu ? menuData.menu.dishes : []}
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
				) : (
					data.dishesByShop &&
					(data.dishesByShop.length !== 0 && (
						<List
							style={{
								padding: '1em',
								backgroundColor: '#fff',
								borderRadius: '.5em'
							}}
							loading={data.loading}
							pagination={{
								pageSize: 6
							}}
							header={
								<Row>
									<Col span={12}>
										<b>{t('src.pages.menu.dish')}</b>
									</Col>
									<Col span={6}>
										<b>{t('src.pages.menu.count')}</b>
									</Col>
								</Row>
							}
							dataSource={data.loading ? [] : data.dishesByShop}
							renderItem={dish => (
								<List.Item
									actions={[
										<Icon type="delete" onClick={() => deleteDish(dish._id)} />
									]}
								>
									<Col span={12}>{dish.name}</Col>
									<Col span={6} style={{ marginRight: '2em' }}>
										<InputNumber
											key={dish._id}
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
					))
				)}
			</Col>
			<Modal
				title={t('src.pages.common.add')}
				visible={visible}
				onCancel={() => setVisible(false)}
				afterClose={() => form.resetFields(['name'])}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={() => setVisible(false)}
						name="cancelAddDish"
					>
						{t('src.pages.common.cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={addDish} name="addDish">
						{t('src.pages.common.add')}
					</Button>
				]}
			>
				<Form>
					<Row>
						<Col span={20} offset={2}>
							<Form.Item>
								{getFieldDecorator('name', {
									rules: [
										{ required: true, message: t('src.pages.menu.inputDish') }
									],
									initialValue: ''
								})(<Input placeholder={t('src.pages.menu.inputDish')} />)}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	)
}

// const GET_DISHES_BY_SHOP = gql`
// 	query($shopId: String!) {
// 		dishesByShop(shopId: $shopId) {
// 			_id
// 			name
// 		}
// 	}
// `

// const DELETE_DISH = gql`
// 	mutation($id: String!) {
// 		deleteDish(id: $id)
// 	}
// `

// const ADD_DISH_TO_SHOP = gql`
// 	mutation($name: String!, $shopId: String!) {
// 		createDish(name: $name, shopId: $shopId)
// 	}
// `

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

// const UPDATE_MENU = gql`
// 	mutation updateMenu($id: String!, $menuInfo: MenuInfo!) {
// 		updateMenu(id: $id, menuInfo: $menuInfo)
// 	}
// `

export default Form.create()(ListDish)
