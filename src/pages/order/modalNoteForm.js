import React, { useState, useEffect } from 'react'
import { Modal, Form, Checkbox, Input, Button } from 'antd'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

function ModalNoteForm(props) {
	const {
		visible,
		closeModal,
		form,
		t,
		updateOrder,
		data,
		quantity,
		menuId,
		dishId
	} = props
	const { getFieldDecorator } = form
	const [extraRice, setExtraRice] = useState(
		data
			? data.currentOrder && data.currentOrder.note
				? data.currentOrder.note
				: ''
			: ''
	)

	useEffect(() => {
		setExtraRice(
			data
				? data.currentOrder && data.currentOrder.note
					? data.currentOrder.note
					: ''
				: ''
		)
	}, [data])

	function onChange(e) {
		if (e.target.checked) {
			setExtraRice(
				extraRice !== ''
					? `${t('order.More rice')}, ${extraRice}`
					: t('order.More rice')
			)
		}
	}

	function handleNote() {
		form.validateFields(async (err, values) => {
			if (err) {
				return
			}
			updateOrder({
				mutation: UPDATE_ORDER,
				variables: {
					id: data.currentOrder._id,
					input: {
						menuId,
						dishId,
						note: values.note,
						count: quantity
					}
				},
				refetchQueries: [
					{
						query: CURRENT_ORDER,
						variables: {
							menuId,
							dishId
						}
					}
				]
			})
				.then(res => {
					if (res.data.updateOrder === true)
						openNotificationWithIcon(
							'success',
							'success-add-note',
							t('Success'),
							null
						)
				})
				.catch(error => {
					const errors = error.graphQLErrors.map(er => er.message)
					openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
				})
			form.resetFields()
			closeModal()
		})
	}

	return (
		<Modal
			visible={visible}
			title={t('order.Note')}
			onCancel={() => closeModal()}
			footer={[
				<Button
					key="cancel"
					type="danger"
					onClick={() => closeModal()}
					name="cancelNote"
				>
					{t('common.Cancel')}
				</Button>,
				<Button key="save" type="primary" onClick={handleNote} name="addNote">
					{t('common.Add')}
				</Button>
			]}
		>
			<Form>
				<Form.Item>
					{getFieldDecorator('note', {
						rules: [{ required: false, message: t('order.Input note') }],
						initialValue: extraRice
					})(
						<Input.TextArea
							id="orderNoteInput"
							placeholder={t('order.Input note')}
							autosize={{ minRows: 3, maxRows: 7 }}
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('extraRiceOption', {
						rules: [{ required: false }]
					})(
						<Checkbox id="extraRiceCheckbox" onChange={onChange}>
							{t('order.More rice')}
						</Checkbox>
					)}
				</Form.Item>
			</Form>
		</Modal>
	)
}

const CURRENT_ORDER = gql`
	query currentOrder($menuId: String!, $dishId: String!) {
		currentOrder(menuId: $menuId, dishId: $dishId) {
			_id
			note
		}
	}
`

const UPDATE_ORDER = gql`
	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
		updateOrder(id: $id, input: $input)
	}
`

export default compose(
	graphql(CURRENT_ORDER, {
		skip: props => !props.visible,
		options: props => ({
			variables: {
				menuId: props.menuId,
				dishId: props.dishId
			}
		})
	}),
	graphql(UPDATE_ORDER, {
		name: 'updateOrder'
	})
)(Form.create()(ModalNoteForm))
