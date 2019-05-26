import React, { useState, useEffect } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { Table, Button, Modal, Form, Input } from 'antd'
// import { CTX } from '../../store'

function Dainty(props) {
	const [visible, setVisible] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [rowData, setRowData] = useState([])
	const [loading, setLoading] = useState(true)
	// const [appState] = React.useContext(CTX)
	const columns = [
		{
			title: 'Image',
			dataIndex: 'imageUrl'
			// key: 'image'
		},
		{
			title: 'Name',
			dataIndex: 'name'
			// key: 'name'
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity'
			// key: 'quantity'
		},
		{
			title: 'Action',
			dataIndex: 'action',
			fixed: 'right',
			width: 200,
			render: (text, record) =>
				rowData.length >= 1 ? (
					<>
						<Button
							style={{ marginRight: 10 }}
							type="primary"
							icon="edit"
							onClick={() => handleClick(record, 'update')}
						/>
						<Button
							type="primary"
							icon="delete"
							onClick={() => handleClick(record, 'delete')}
						/>
					</>
				) : null
		}
	]
	useEffect(() => {
		props.client
			.query({ query: DAINTIES })
			.then(res => {
				// console.log(res)
				setRowData(res.data.dainties)
				setLoading(false)
			})
			.catch(err => {
				console.log(err)
			})
	})
	function showModal() {
		setVisible(true)
	}
	function handleOk() {
		setConfirmLoading(true)
		props.form.validateFields((err, values) => {
			if (err) {
				setConfirmLoading(false)
				return
			}
			console.log('Received values of form: ', values)
			const { imageUrl, name, quantity } = values
			props.client
				.mutate({
					mutation: CREATE_DAINTY,
					variables: {
						daintyInput: {
							imageUrl,
							name,
							quantity: parseInt(quantity)
						}
					}
				})
				.then(res => {
					console.log(res.data.createDainty)
				})
				.catch(err => {
					console.log(err)
				})
			props.form.resetFields()
			setVisible(false)
			setConfirmLoading(false)
		})
	}
	function handleCancel() {
		props.form.resetFields()
		setVisible(false)
	}
	function handleClick(record, type) {
		console.log(record, type)
		type === 'update'
			? console.log('update')
			: props.client
					.mutate({
						mutation: DELETE_DAINTY,
						variables: {
							_id: record._id
						}
					})
					.then(res => {
						console.log(res.data)
					})
					.catch(err => {
						console.log(err)
					})
	}
	const { getFieldDecorator } = props.form
	return (
		<>
			<Button
				style={{ marginBottom: 16 }}
				icon="plus"
				type="primary"
				onClick={showModal}
			>
				New
			</Button>
			<Modal
				title="New Dainty"
				visible={visible}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				okText="Submit"
			>
				<Form layout="vertical">
					<Form.Item label="Image">
						{getFieldDecorator('imageUrl', {
							rules: [
								{
									required: true,
									message: 'Please input the image of collection!'
								}
							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="Name">
						{getFieldDecorator('name', {
							rules: [
								{
									required: true,
									message: 'Please input the name of collection!'
								}
							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="Quantity">
						{getFieldDecorator('quantity', {
							rules: [
								{
									required: true,
									message: 'Please input the quantity of collection!'
								}
							]
						})(<Input type="number" />)}
					</Form.Item>
				</Form>
			</Modal>
			<Table
				rowKey={record => record._id}
				dataSource={rowData}
				columns={columns}
				bordered
				// title={() => 'Header'}
				// footer={() => 'Footer'}
				loading={loading}
				size="small"
			/>
		</>
	)
}

const DAINTIES = gql`
	query {
		dainties {
			_id
			imageUrl
			name
			quantity
			createdAt
			updatedAt
		}
	}
`

const CREATE_DAINTY = gql`
	mutation($daintyInput: DaintyInput!) {
		createDainty(daintyInput: $daintyInput)
	}
`

// const UPDATE_DAINTY = gql`
// 	mutation($_id: ID!, $daintyInput: DaintyInput!) {
// 		updateDainty(_id: $_id, daintyInput: $daintyInput)
// 	}
// `

const DELETE_DAINTY = gql`
	mutation($_id: ID!) {
		deleteDainty(_id: $_id)
	}
`

export default withApollo(Form.create({ name: 'daintyCreateForm' })(Dainty))
