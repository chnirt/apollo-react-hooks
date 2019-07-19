import React, { useState } from 'react'
import { Form, Button, Col, Row, Select, Divider, Layout } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import ListDish from './ListDish'


function MenuDetail (props) {

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
		<div className='menu'>
			<Button
				type='link'
				icon='left'
				size='large'
				onClick={() => props.history.push('/🥢/menu')}
			/>
			<Divider style={{ marginTop: 0 }} />
			<Row style={{ marginBottom: '1em' }}>
				<Col span={22} offset={1}>
					{getFieldDecorator('shop')(
						<Select
							onChange={changeShop}
							placeholder='Chọn quán'
							style={{ width: '100%', margin: '1em 0' }}
						>
							{data.loading ? null : data.siteShopsBySiteId.map((shop, index) => (
								<Select.Option key={index} value={shop.shopId}>
									{shop.name}
								</Select.Option>
							))}
						</Select>
					)}
				</Col>
				<Col span={12} offset={1}>
					<b>Món ăn</b>
				</Col>
				<Col span={6} offset={1}>
					<b>Số lượng</b>
				</Col>
			</Row>
			<ListDish updateDishes={updateDishes} shopId={shopId} menuId={props.match.params.menuId} />
			<Row type='flex' justify='center' align='middle'>
				<Button onClick={updateMenu} style={{width: '10em', marginRight: '1em'}}>Lưu</Button>
				<Button onClick={publishAndUnpublish} style={{width: '10em'}}>{menuById.menu && menuById.menu.isPublished ? 'Hủy công khai' : 'Công khai'}</Button>
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
