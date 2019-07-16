import React, { useState } from 'react'
import { Card, Icon, Col, Row, Button, Modal, Form, Input } from 'antd'
import gql from 'graphql-tag';
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';

function MenuList(props) {
	const { data, form } = props
	const [visible, setVisible] = useState(false)

	function openModal(id) {
		props.openModal(id)
	}

	async function submitMenu(e) {
		e.preventDefault()
		form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				await props.mutate.addMenu({
					variables: {
						name: form.getFieldValue('name'),
						siteId: window.localStorage.getItem('currentsite')
					},
					refetchQueries: [{
						query: GET_MENUS_BY_SITE,
						variables: {
							siteId: props.siteId
						}
					}]
				}).then(result => {
					form.resetFields()
					setVisible(false)
				})
			}
		})
	}
	const { getFieldDecorator } = props.form 
	return (
		<>
			{data.menusBySite.map((menu, index) => 
					<Col
						key={index}
						style={{ marginBottom: '20px' }}
						xs={{ span: 22, offset: 1 }}
						sm={{ span: 22, offset: 1 }}
						lg={{ span: 6, offset: 1 }}
					>
						<Card actions={[<Icon type='edit' onClick={ () => openModal(menu._id)} />, <Icon type='ellipsis' />]}
						>
							<p style={{ height: '50px', lineHeight: '50px' }}>{menu.name}</p>
						</Card>
					</Col>
			)}
				<Col span={8} offset={8}>
					<Button icon='plus' onClick={() => setVisible(true)} block>
						Thêm menu
					</Button>
					<Modal
						title='Thêm menu'
						cancelText='Đóng'
						visible={visible}
						okText='Lưu'
						onCancel={() => setVisible(false)}
						onOk={submitMenu}
						centered
					>
						<Form>
							<Row>
								<Col span={20} offset={2}>
									<Form.Item>
										{getFieldDecorator('name', {
											rules: [{ required: true, message: 'Nhập tên menu' }],
											initialValue: ''
										})(
											<Input
												placeholder='Nhập tên menu'
												style={{ width: '90%' }}
											/>
										)}
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Modal>
				</Col>
		</>
	)
}

const GET_MENUS_BY_SITE = gql`
	query($siteId: String!) {
		menusBySite(siteId: $siteId) {
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
const ADD_MENU = gql`
	mutation ($name: String!, $siteId: String!) {
		createMenu(name: $name, siteId: $siteId)
	}
`

export default HOCQueryMutation([
	{
		query: GET_MENUS_BY_SITE,
		options: props => ({
			variables: {
				siteId: props.siteId
			}
		})
	}, {
		mutation: ADD_MENU,
		name: 'addMenu'
	}
])(Form.create()(MenuList))
