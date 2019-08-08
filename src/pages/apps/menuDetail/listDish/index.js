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
import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'

import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon'

function ListDish(props) {
	const { form, data, menuById, shopId, menuId, publishAndUnpublish } = props

	const [dishes, setDishes] = useState([])

	useEffect(() => {
		if (menuById.menu) {
			if (shopId !== '' && shopId !== menuById.menu.shopId) {
				setDishes([])
			} else {
				setDishes(menuById.menu.dishes)
			}
		} else {
			setDishes([])
		}
	}, [shopId])

	const [visible, setVisible] = useState(false)
	const [hasChange, setHasChange] = useState(false)

	async function deleteDish(dishId) {
		Modal.confirm({
			title: t('DeleteDish'),
			content: t('ConfirmDelete'),
			onOk: async () => {
				await props
					.deleteDish({
						variables: {
							id: dishId
						}
					})
					.then(
						() =>
							data.refetch(shopId) &&
							openNotificationWithIcon('success', 'delete', t('Success'), '')
					)
			}
		})
	}

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
								t('AddDishSuccess'),
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
						openNotificationWithIcon('success', 'save', t('Success'), '')
						setHasChange(false)
					})
			: openNotificationWithIcon('info', 'nochange', t('MenuNoChange'), '')
	}

	const { getFieldDecorator } = form
	const { t } = props

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
						{t('AddDish')}
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
						{t('Save')}
					</Button>
					<Button
						name="btnPublishMenu"
						type="primary"
						onClick={() => publishAndUnpublish(hasChange)}
					>
						{menuById.menu && menuById.menu.isPublished
							? t('UnPublish')
							: t('Publish')}
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
						loading={data.loading}
						pagination={{
							pageSize: 6
						}}
						header={
							<Row>
								<Col span={12} offset={1}>
									<b>{t('Dish')}</b>
								</Col>
								<Col span={6} offset={1}>
									<b>{t('Count')}</b>
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
										<b>{t('Dish')}</b>
									</Col>
									<Col span={6}>
										<b>{t('Count')}</b>
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
				title={t('Add')}
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
						{t('Cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={addDish} name="addDish">
						{t('Add')}
					</Button>
				]}
			>
				<Form>
					<Row>
						<Col span={20} offset={2}>
							<Form.Item>
								{getFieldDecorator('name', {
									rules: [{ required: true, message: t('InputDish') }],
									initialValue: ''
								})(<Input placeholder={t('InputDish')} />)}
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

export default compose(
	graphql(GET_DISHES_BY_SHOP, {
		options: props => ({
			variables: {
				shopId: props.shopId
			},
			fetchPolicy: 'no-cache'
		})
	}),
	graphql(GET_MENU, {
		options: props => ({
			variables: {
				id: props.menuId
			}
		}),
		name: 'menuById'
	}),
	graphql(DELETE_DISH, {
		name: 'deleteDish'
	}),
	graphql(ADD_DISH_TO_SHOP, {
		name: 'addDish'
	}),
	graphql(UPDATE_MENU, {
		name: 'updateMenu'
	})
)(withTranslation('translations')(Form.create()(ListDish)))
