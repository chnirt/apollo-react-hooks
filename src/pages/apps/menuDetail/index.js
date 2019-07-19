import React, { useState } from 'react'
import { Form, Button, Col, Row, Select } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import ListDish from './ListDish'

function MenuDetail(props) {
	const { form, data, menuById } = props
	// eslint-disable-next-line react/destructuring-assignment
	const { menuId } = props.match.params

	const [dishes, setDishes] = useState([])
	const [shopId, setShopId] = useState('')
	const [hasChange, setHasChange] = useState(false)

	function changeShop(value) {
		setShopId(value)
		setDishes([])
		setHasChange(false)
	}

	async function publishAndUnpublish() {
		await props.mutate
			.publishAndUnpublish({
				variables: { id: menuId },
				refetchQueries: [
					{
						query: GET_MENU,
						variables: {
							id: menuId
						}
					}
				]
			})
			.then(
				res =>
					res &&
					openNotificationWithIcon(
						'success',
						'publish',
						menuById.menu && menuById.menu.isPublished
							? 'Hủy công khai menu thành công'
							: 'Công khai menu thành công',
						''
					)
			)
	}

	// eslint-disable-next-line no-shadow
	async function updateDishes(data) {
		await setDishes(data)
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
					.then(() =>
						openNotificationWithIcon(
							'success',
							'save',
							'Lưu menu thành công',
							''
						)
					)
			: openNotificationWithIcon(
					'info',
					'nochange',
					'Menu không có thay đổi',
					''
			  )
	}
	const { getFieldDecorator } = form
	return (
		<div className="menu">
			<h2 style={{ margin: '16px 24px', color: '#fff' }}>
				{menuById.menu && menuById.menu.name}
			</h2>
			<Row style={{ marginBottom: '1em' }}>
				<Col span={22} offset={1}>
					{getFieldDecorator('shop')(
						<Select
							onChange={changeShop}
							placeholder="Chọn quán"
							style={{ width: '100%', margin: '1em 0' }}
						>
							{data.loading
								? null
								: data.siteShopsBySiteId.map(shop => (
										<Select.Option key={shop._id} value={shop.shopId}>
											{shop.name}
										</Select.Option>
								  ))}
						</Select>
					)}
				</Col>
				<Col span={12} offset={1}>
					<b style={{ color: '#ffd600' }}>Món ăn</b>
				</Col>
				<Col span={6} offset={1}>
					<b style={{ color: '#ffd600' }}>Số lượng</b>
				</Col>
			</Row>
			<ListDish
				updateDishes={updateDishes}
				shopId={shopId}
				menuShop={menuById.menu && menuById.menu.shopId}
				dishes={menuById.menu && menuById.menu.dishes}
			/>
			<Row type="flex" justify="center" align="middle">
				<Button
					ghost
					onClick={updateMenu}
					style={{ width: '10em', marginRight: '1em' }}
				>
					Lưu
				</Button>
				<Button ghost onClick={publishAndUnpublish} style={{ width: '10em' }}>
					{menuById.menu && menuById.menu.isPublished
						? 'Hủy công khai'
						: 'Công khai'}
				</Button>
			</Row>
		</div>
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
			dishes {
				_id
				name
				count
			}
		}
	}
`

const PUBLISH_UNPUBLISH = gql`
	mutation publishAndUnpublish($id: String!) {
		publishAndUnpublish(id: $id)
	}
`

const GET_SHOPS_BY_SITE = gql`
	query($siteId: String!) {
		siteShopsBySiteId(siteId: $siteId) {
			siteId
			shopId
			name
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
		query: GET_SHOPS_BY_SITE,
		options: props => ({
			variables: {
				siteId: props.match.params.siteId
			}
		})
	},
	{
		query: GET_MENU,
		options: props => ({
			variables: {
				id: props.match.params.menuId
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
])(Form.create()(MenuDetail))
