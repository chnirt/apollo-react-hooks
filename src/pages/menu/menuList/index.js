import React, { useState } from 'react'
import {
	Col,
	Row,
	Button,
	Modal,
	Form,
	Input,
	List,
	Avatar,
	Card,
	Typography
} from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

const { Title } = Typography

function MenuList(props) {
	const { form, siteId } = props
	const [visible, setVisible] = useState(false)
	const [hasPublished, setHasPublished] = useState(false)

	const { data: dataMenu, loading: loadingMenu } = useQuery(GET_MENUS_BY_SITE, {
		variables: { siteId }
	})
	const [createMenu] = useMutation(ADD_MENU)
	const [deleteMenu] = useMutation(DELETE_MENU)

	async function onDelete(id) {
		Modal.confirm({
			title: t('src.pages.menu.deleteMenu'),
			content: t('src.pages.common.confirmDelete'),
			onOk: async () => {
				await deleteMenu({
					variables: {
						id
					},
					refetchQueries: [
						{
							query: GET_MENUS_BY_SITE,
							variables: {
								siteId: props.siteId
							}
						}
					]
				}).then(
					res =>
						res &&
						openNotificationWithIcon(
							'success',
							'delete',
							t('src.pages.common.success'),
							''
						)
				)
			}
		})
	}

	async function addMenu(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async err => {
			if (!err) {
				await createMenu({
					variables: {
						name: form.getFieldValue('name'),
						siteId: window.localStorage.getItem('currentsite')
					},
					refetchQueries: [
						{
							query: GET_MENUS_BY_SITE,
							variables: {
								siteId: props.siteId
							}
						}
					]
				}).then(res => {
					if (res) {
						openNotificationWithIcon(
							'success',
							'add',
							t('src.pages.menu.addMenuSuccess'),
							''
						)
						form.resetFields()
						setVisible(false)
					}
				})
			}
		})
	}
	const { getFieldDecorator } = form
	const { t } = props
	return (
		<>
			<Card
				title={
					<div>
						<Title style={{ color: '#ffffff' }} level={3}>
							{t('src.pages.menu.manageMenu')}
						</Title>
					</div>
				}
				bordered={false}
				extra={
					<div>
						<Button
							name="addNewMenu"
							type="primary"
							icon="plus"
							onClick={() => setVisible(true)}
						>
							{t('src.pages.common.add')}
						</Button>
					</div>
				}
				headStyle={{
					border: 0
				}}
				bodyStyle={{
					padding: 0
				}}
				style={{ backgroundColor: 'transparent' }}
			>
				<List
					pagination={{
						pageSize: 6
					}}
					style={{
						margin: '1em',
						padding: '1em',
						backgroundColor: '#fff',
						borderRadius: '.5em'
					}}
					loading={loadingMenu}
					dataSource={dataMenu.menusBySite}
					renderItem={menu => {
						if (menu.isPublished) {
							setHasPublished(true)
						}
						return (
							<List.Item
								actions={
									hasPublished
										? menu.isPublished && [
												<Button
													onClick={() =>
														props.history.push(
															`/🥢/menu/detail/${props.siteId}/${menu._id}`
														)
													}
													icon="edit"
													type="link"
													name="btnEditMenu"
												/>
										  ]
										: [
												<Button
													onClick={() =>
														props.history.push(
															`/🥢/menu/detail/${props.siteId}/${menu._id}`
														)
													}
													icon="edit"
													type="link"
													name="btnEditMenu"
												/>,
												<Button
													onClick={() => onDelete(menu._id)}
													icon="delete"
													type="link"
													name="btnDeleteMenu"
												/>
										  ]
								}
								style={{ fontWeight: 'bold' }}
							>
								<List.Item.Meta
									avatar={
										menu.isPublished && (
											<Avatar
												icon="check"
												size="small"
												style={{ backgroundColor: '#87d068' }}
											/>
										)
									}
									title={menu.name}
								/>
							</List.Item>
						)
					}}
				/>
			</Card>

			<Modal
				title={t('src.pages.menu.addMenu')}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={() => setVisible(false)}
						name="cancelAddMenu"
					>
						{t('src.pages.common.cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={addMenu} name="addMenu">
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
										{
											required: true,
											message: t('src.pages.menu.inputMenuName')
										}
									],
									initialValue: ''
								})(<Input placeholder={t('src.pages.menu.inputMenuName')} />)}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	)
}

const GET_MENUS_BY_SITE = gql`
	query($siteId: String!) {
		menusBySite(siteId: $siteId) {
			_id
			name
			isPublished
		}
	}
`
const ADD_MENU = gql`
	mutation($name: String!, $siteId: String!) {
		createMenu(name: $name, siteId: $siteId)
	}
`

const DELETE_MENU = gql`
	mutation($id: String!) {
		deleteMenu(id: $id)
	}
`

export default Form.create()(MenuList)
