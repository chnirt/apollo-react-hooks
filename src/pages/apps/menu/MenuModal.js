import React, { useState } from 'react'
import { Modal, Form, Button, Icon, Input, Col, Row, Select } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

function MenuModal(props) {
	const { form, data, shops } = props
	const [dishName, setDishName] = useState('')
	const [shop, setShop] = useState(shops.shopsBySite ? shops.shopsBySite[0] : null)
	
	async function remove(id) {
		Modal.confirm({
			title: 'Bạn có chắc chắn muốn xóa?',
			async onOk() {
				await props.mutate.deleteDish({
					variables: {
						menuId: data.menu._id,
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

	function changeShop(value) {
		shops.shopsBySite.map(shop => shop._id === value ? setShop(shop) : null)
	}

	function enterDishName(e) {
		setDishName(e.target.value)
	}

	// function validateCount(rule, value, callback) {
	// 	const regex = /[0-9]$/
	// 	if (value && !regex.test(value)) {
	// 		callback('Số lượng chỉ nhập số')
	// 	} else if (value < 0) {
	// 		callback('Số lượng phải lớn hơn hoặc bằng 0')
	// 	} else {
	// 		setCount(value)
	// 		callback()
	// 	}
	// }

	async function publishAndUnpublish() {
		await props.mutate.publishAndUnpublish({
			variables: { id: data.menu._id },
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

	const formItems = shop === null ? [] : shop.dishes.map((dish, index) => (
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
						className='dynamic-delete-button'
						type='delete'
						onClick={() => remove(dish._id)}
					/>
				</Form.Item>
			</Col>
		</Row>
	))
	const { getFieldDecorator } = form
	return (
		<Modal
			width='80%'
			title='Danh sách món'
			visible={props.visible}
			onCancel={props.handleCancel}
			cancelText='Đóng'
			onOk={publishAndUnpublish}
			centered
		>
			<Row style={{ marginBottom: '20px' }}>
				<Col span={22} offset={1}>
					<Select
						defaultValue={shops.shopsBySite ? shops.shopsBySite[0]._id : ''}
						onChange={changeShop}
						placeholder='Chọn quán'
						style={{ width: '100%', margin: '25px 0' }}
					>
						{shops.loading ? null : shops.shopsBySite.map((shop, index) => (
							<Select.Option key={index} value={shop._id}>
								{shop.name}
							</Select.Option>
						))}
					</Select>
				</Col>
				<Col span={16}>
					<b>Món ăn</b>
				</Col>
				<Col span={6}>
					<b>Số lượng</b>
				</Col>
			</Row>
			{formItems}
			<Form wrapperCol={{ xs: {span: 24}, sm: {span: 16 } }}>
				<Form.Item>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: 'Nhập tên món ăn!' }],
						initialValue: ''
					})(
						<Input
							placeholder='Nhập tên món ăn'
							onChange={enterDishName}
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button htmlType='submit' type='dashed'>
						<Icon type='plus' /> Thêm món
					</Button>
				</Form.Item>
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
			isActive
		}
	}
`

const PUBLISH_UNPUBLISH = gql`
	mutation publishAndUnpublish($id: String!) {
		publishAndUnpublish(id: $id)
	}
`

const GET_SHOPS_BY_SITE = gql`
	query ($siteId: String!) {
		shopsBySite(siteId: $siteId) {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
		}
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
		query: GET_SHOPS_BY_SITE,
		options: props => ({
			variables: {
				siteId: props.siteId
			}
		}),
		name: 'shops'
	},
	{
		mutation: PUBLISH_UNPUBLISH,
		name: 'publishAndUnpublish',
		options: {}
	}
])(Form.create()(MenuModal))
