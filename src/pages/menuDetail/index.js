import React, { useState } from 'react'
import { Form, Col, Row, Select, Typography } from 'antd'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import ListDish from './listDish'

function MenuDetail(props) {
	const { form, data, menuById, match } = props
	const { menuId } = match.params
	const [shopId, setShopId] = useState('')

	function changeShop(value) {
		setShopId(value)
	}

	async function changeNameMenu(name) {
		if (name !== menuById.menu.name) {
			await props
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
					openNotificationWithIcon(
						'success',
						'save',
						t('src.pages.common.success'),
						''
					)
				})
		}
	}

	async function onPublishAndUnpublish(hasChange) {
		if (hasChange) {
			openNotificationWithIcon(
				'warning',
				'notsave',
				t('src.pages.menu.confirmSaveMenu'),
				''
			)
		} else if (menuById.menu.dishes.length !== 0) {
			await props
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
							? t('src.pages.menu.unpublishedMenu')
							: t('src.pages.menu.publishedMenu'),
						''
					)
				})
		} else {
			openNotificationWithIcon(
				'error',
				'publishfail',
				t('src.pages.menu.menuNoDish'),
				''
			)
		}
	}

	const { getFieldDecorator } = form
	const { t } = props
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
						placeholder={t('src.pages.menu.selectShop')}
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
				{...props}
				publishAndUnpublish={onPublishAndUnpublish}
				menuId={match.params.menuId}
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

export default compose(
	graphql(GET_SHOPS_BY_SITE, {
		options: props => ({
			variables: {
				siteId: props.match.params.siteId
			}
		})
	}),
	graphql(GET_MENU, {
		options: props => ({
			variables: {
				id: props.match.params.menuId
			}
		}),
		name: 'menuById'
	}),
	graphql(PUBLISH_UNPUBLISH, {
		name: 'publishAndUnpublish'
	}),
	graphql(UPDATE_MENU, {
		name: 'updateMenu'
	})
)(Form.create()(MenuDetail))
