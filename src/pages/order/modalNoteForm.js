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
		setExtraRice(`${e.target.value}`)
	}

	function changeOptions(option) {
		let note = ''
		if (option[0]) {
			note = `${t('src.pages.order.moreRice')}, ${extraRice}`
		} else {
			note = extraRice.substr(`${t('src.pages.order.moreRice')}`.length + 2)
		}
		setExtraRice(note)
		form.setFieldsValue({
			note
		})
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
			title={t('src.pages.order.note')}
			onCancel={() => closeModal()}
			afterClose={() => form.resetFields()}
			footer={[
				<Button
					key="cancel"
					type="danger"
					onClick={() => closeModal()}
					name="cancelNote"
				>
					{t('src.pages.common.cancel')}
				</Button>,
				<Button key="save" type="primary" onClick={handleNote} name="addNote">
					{t('src.pages.common.add')}
				</Button>
			]}
		>
			<Form>
				<Form.Item>
					{getFieldDecorator('note', {
						rules: [
							{ required: false, message: t('src.pages.order.inputNote') }
						],
						initialValue: extraRice
					})(
						<Input.TextArea
							id="orderNoteInput"
							placeholder={t('src.pages.order.inputNote')}
							onChange={onChange}
							autosize={{ minRows: 3, maxRows: 7 }}
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('extraRiceOption', {
						initialValue: []
					})(
						<Checkbox.Group
							options={[t('src.pages.order.moreRice')]}
							id="extraRiceCheckbox"
							onChange={changeOptions}
						/>
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
