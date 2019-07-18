import React, { useState } from 'react'
import { Modal, Form, Button, Col, Row, Select, Drawer } from 'antd'
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'
import ListDish from './ListDish'
import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon';

function MenuModal(props) {
	const { form, data, menuById } = props

	const [dishes, setDishes] = useState([])
	const [shopId, setShopId] = useState('')
	const [hasChange, setHasChange] = useState(false)

	function changeShop(value) {
		setShopId(value)
	}

	async function publishAndUnpublish() {
		await props.mutate.publishAndUnpublish({
			variables: { id: props.menuId },
			refetchQueries: [
				{
					query: GET_MENU,
					variables: {
						id: props.menuId
					}
				}
			]
		}).then(res => openNotificationWithIcon(
				'success',
				'publish',
				(menuById.menu && menuById.menu.isPublished 
					? 'Hủy công khai menu thành công'
					: 'Công khai menu thành công'
				),
				''
			))
	}

	async function updateDishes (data) {
		await setDishes(data)
		await setHasChange(true)
	}

	async function updateMenu () {
		hasChange ? (
			await props.mutate.updateMenu({
				variables: {
					id: props.menuId,
					menuInfo: {
						shopId,
						dishes: dishes.map(dish => ({_id: dish._id, name: dish.name, count: dish.count}))
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
			}).then(res => openNotificationWithIcon('success', 'save', 'Lưu menu thành công', ''))
		) : openNotificationWithIcon('info', 'nochange', 'Menu không có thay đổi', '')
	}

	const { getFieldDecorator } = form
	return (
		<Modal
			width='100%'
			title='Danh sách món'
			visible={props.visible}
			onCancel={props.handleCancel}
			onOk={publishAndUnpublish}
			afterClose={() => {
				form.resetFields(['shop'])
				setShopId('')
			}}
			footer={[
				<Button onClick={updateMenu} key='save'>Lưu</Button>,
				<Button onClick={publishAndUnpublish} key='publish' loading={menuById.menu ? false : true}>{menuById.menu && menuById.menu.isPublished ? 'Hủy công khai' : 'Công khai'}</Button>
			]}
		>
			<Row style={{ marginBottom: '20px' }}>
				<Col span={22} offset={1}>
					{getFieldDecorator('shop')(
						<Select
							onChange={changeShop}
							placeholder='Chọn quán'
							style={{ width: '100%', margin: '25px 0' }}
						>
							{data.loading ? null : data.siteShopsBySiteId.map((shop, index) => (
								<Select.Option key={index} value={shop.shopId}>
									{shop.name}
								</Select.Option>
							))}
						</Select>
					)}
				</Col>
				<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 16 }}>
					<b>Món ăn</b>
				</Col>
				<Col xs={{ span: 8 }} sm={{ span: 8 }} lg={{ span: 4 }}>
					<b>Số lượng</b>
				</Col>
			</Row>
			<ListDish updateMenu={updateDishes} shopId={shopId} menuId={props.menuId} />
		</Modal>
	)
}

const GET_MENU = gql`
	query menu($id: String!) {
		menu(id: $id) {
			_id
			name
			siteId
			shopId
			isPublished
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
  siteShopsBySiteId(siteId: $siteId){
    siteId
    shopId
    name
  }
}
`

const UPDATE_MENU = gql`
	mutation updateMenu ($id: String!, $menuInfo: MenuInfo!) {
		updateMenu (id: $id, menuInfo: $menuInfo)
	}
`

export default HOCQueryMutation([
	{
		query: GET_SHOPS_BY_SITE,
		options: props => ({
			variables: {
				siteId: props.siteId
			}
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
		mutation: PUBLISH_UNPUBLISH,
		name: 'publishAndUnpublish',
		options: {}
	},
	{
		mutation: UPDATE_MENU,
		name: 'updateMenu',
		options: {}
	}
])(Form.create()(MenuModal))
