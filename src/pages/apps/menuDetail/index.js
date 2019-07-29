import React, { useState } from 'react'
import { Form, Col, Row, Select, Typography } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import ListDish from './listDish'

function MenuDetail(props) {
	const { form, data, menuById } = props
	// eslint-disable-next-line react/destructuring-assignment
	const { menuId } = props.match.params
	const [shopId, setShopId] = useState('')

	function changeShop(value) {
		setShopId(value)
	}

	async function changeNameMenu(name) {
		if (name !== menuById.menu.name) {
			await props.mutate
				.updateMenu({
					variables: {
						id: menuId,
						menuInfo: {
							name
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
					openNotificationWithIcon('success', 'save', 'Thành công', '')
				})
		}
	}

	async function publishAndUnpublish(hasChange) {
		if (hasChange) {
			openNotificationWithIcon(
				'warning',
				'notsave',
				'Vui lòng lưu menu trước khi công khai',
				''
			)
		} else if (menuById.menu.dishes.length !== 0) {
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
				.then(() => {
					setShopId('')
					form.resetFields()
					openNotificationWithIcon(
						'success',
						'publish',
						menuById.menu && menuById.menu.isPublished
							? 'Hủy công khai menu thành công'
							: 'Công khai menu thành công',
						''
					)
				})
		} else {
			openNotificationWithIcon(
				'error',
				'publishfail',
				'Menu không có món ăn để công khai',
				''
			)
		}
	}

	const { getFieldDecorator } = form
	return (
		<Row style={{ marginBottom: '1em' }}>
			<Col span={22} offset={1} order={2}>
				<Typography.Title
					style={{ margin: '.5em 0', color: '#fff' }}
					level={3}
					editable={{ onChange: changeNameMenu }}
				>
					{menuById.menu && menuById.menu.name}
				</Typography.Title>
			</Col>
			<Col span={22} offset={1} order={2}>
				{getFieldDecorator('shop')(
					<Select
						onChange={changeShop}
						placeholder="Chọn quán"
						style={{ width: '100%' }}
						disabled={menuById.menu && menuById.menu.isPublished}
					>
						{data.loading
							? null
							: data.siteShopsBySiteId.map(shop => (
									<Select.Option key={shop} value={shop.shopId}>
										{shop.name}
									</Select.Option>
							  ))}
					</Select>
				)}
			</Col>
			<ListDish
				publishAndUnpublish={publishAndUnpublish}
				// eslint-disable-next-line react/destructuring-assignment
				menuId={props.match.params.menuId}
				shopId={shopId}
			/>
		</Row>
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
