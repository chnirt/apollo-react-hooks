import React, { useState } from 'react'
import { Col, Row, Button, Modal, Form, Input, List, Avatar } from 'antd'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'
import { compose, graphql } from 'react-apollo'
import openNotificationWithIcon from '../../../../components/shared/openNotificationWithIcon'

function MenuList(props) {
	console.log(props)
	const { data, form } = props
	const [visible, setVisible] = useState(false)
	const [hasPublished, setHasPublished] = useState(false)

	async function deleteMenu(id) {
		Modal.confirm({
			title: t('DeleteMenu'),
			content: t('ConfirmDelete'),
			onOk: async () => {
				await props
					.deleteMenu({
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
					})
					.then(
						res =>
							res &&
							openNotificationWithIcon('success', 'delete', t('Success'), '')
					)
			}
		})
	}

	async function addMenu(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async err => {
			if (!err) {
				await props
					.addMenu({
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
					})
					.then(res => {
						if (res) {
							openNotificationWithIcon('success', 'add', t('AddMenuSuccess'), '')
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
			<Row type="flex" justify="end" style={{ marginRight: '1em' }}>
				<Button
					name="addNewMenu"
					type="primary"
					icon="plus"
					onClick={() => setVisible(true)}
				>
					{t('Add menu')}
				</Button>
			</Row>
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
				dataSource={data.menusBySite}
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
												onClick={() => deleteMenu(menu._id)}
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
			<Modal
				title={t('Add menu')}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={() => setVisible(false)}
						name="cancelAddMenu"
					>
						{t('Cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={addMenu} name="addMenu">
						{t('Add')}
					</Button>
				]}
			>
				<Form>
					<Row>
						<Col span={20} offset={2}>
							<Form.Item>
								{getFieldDecorator('name', {
									rules: [{ required: true, message: t('Input menu name') }],
									initialValue: ''
								})(<Input placeholder={t('Input menu name')} />)}
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

export default compose(
	graphql(GET_MENUS_BY_SITE, {
		options: props => ({
			variables: {
				siteId: props.siteId
			}
		})
	}),
	graphql(ADD_MENU, {
		name: 'addMenu'
	}),
	graphql(DELETE_MENU, {
		name: 'deleteMenu'
	})
)(withTranslation('translations')(Form.create()(MenuList)))
