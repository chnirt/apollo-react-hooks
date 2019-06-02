import React, { useState, useEffect } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { Table, Button, Modal, Form, Input } from 'antd'
// import { CTX } from '../../store'

function Dainty(props) {
	const [visible, setVisible] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [dataSource, setDataSource] = useState([])
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
			width: 90,
			render: (text, record) =>
				dataSource.length >= 1 ? (
					<>
						<Button
							style={{ marginRight: 10 }}
							icon="edit"
							onClick={() => handleClick(record, 'update')}
						/>
						<Button
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
				setDataSource(res.data.dainties)
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
		setLoading(true)
		props.form.validateFields((err, values) => {
			if (err) {
				setConfirmLoading(false)
				return
			}
			// console.log('Received values of form: ', values)
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
					// console.log(res)
					if (res.data.createDainty) {
						setDataSource([...dataSource, res.data.createDainty])
						setLoading(false)
					}
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
		setLoading(true)
		// console.log(record, type)
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
						// console.log(res)
						if (res.data.deleteDainty === true) {
							setDataSource([
								...dataSource.filter(item => item._id !== record._id)
							])
							setLoading(false)
						}
					})
					.catch(err => {
						console.log(err)
					})
	}
	const { getFieldDecorator } = props.form
	return (
		<>
			Dainty
			<Button
				style={{ marginBottom: 16, float: 'right', zIndex: 1 }}
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
						})(<Input style={{ fontSize: 16 }} />)}
					</Form.Item>
					<Form.Item label="Name">
						{getFieldDecorator('name', {
							rules: [
								{
									required: true,
									message: 'Please input the name of collection!'
								}
							]
						})(<Input style={{ fontSize: 16 }} />)}
					</Form.Item>
					<Form.Item label="Quantity">
						{getFieldDecorator('quantity', {
							rules: [
								{
									required: true,
									message: 'Please input the quantity of collection!'
								}
							]
						})(<Input style={{ fontSize: 16 }} type="number" />)}
					</Form.Item>
				</Form>
			</Modal>
			<Table
				rowKey={record => record._id}
				dataSource={dataSource}
				columns={columns}
				bordered
				// title={() => 'Header'}
				// footer={() => 'Footer'}
				loading={loading}
				size="small"
				pagination={{ pageSize: 5 }}
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
		createDainty(daintyInput: $daintyInput) {
			_id
			imageUrl
			name
			quantity
		}
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
