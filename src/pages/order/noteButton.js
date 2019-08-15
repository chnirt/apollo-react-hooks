/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
/* eslint-disable no-shadow */
import React, { useState, useRef } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Button, Form } from 'antd'
import NoteForm from './noteForm'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

function NoteButton(props) {
	const [modalVisible, setModalVisible] = useState(false)
	const [orderNote, setOrderNote] = useState()
	const {
		t,
		currentOrder,
		isLocked,
		updateOrder,
		menuId,
		quantity,
		ordersCountedByUser,
		dishId,
		ordersByMenu
	} = props
	let formRef = useRef()

	function getNote() {
		// eslint-disable-next-line no-unused-expressions
		currentOrder.currentOrder &&
			ordersByMenu.map(order =>
				order._id === currentOrder.currentOrder._id
					? setOrderNote(order.note)
					: null
			)
	}

	async function showModal() {
		await getNote()
		await setModalVisible(true)
	}

	function handleCancel() {
		setModalVisible(false)
	}

	function handleNote() {
		formRef.validateFields(async (err, values) => {
			if (err) {
				return
			}
			updateOrder({
				mutation: UPDATE_ORDER,
				variables: {
					id: currentOrder.currentOrder._id,
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
							t('src.pages.common.success'),
							null
						)
				})
				.catch(err => {
					// console.log(err)
					const errors = err.graphQLErrors.map(error => error.message)
					openNotificationWithIcon(
						'error',
						'failed',
						'src.pages.common.failed',
						errors[0]
					)
				})
			formRef.resetFields()
			setModalVisible(false)
		})
	}

	function saveFormRef(formRef) {
		// eslint-disable-next-line no-param-reassign
		formRef = formRef
	}

	const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(NoteForm)

	return (
		<div>
			<Button
				icon="form"
				shape="circle"
				type="primary"
				onClick={showModal}
				id={`note-order-${dishId}`}
				disabled={ordersCountedByUser[dishId] === 0 || isLocked}
			/>
			<CollectionCreateForm
				t={t}
				wrappedComponentRef={saveFormRef}
				visible={modalVisible}
				onCancel={handleCancel}
				onCreate={handleNote}
				// eslint-disable-next-line no-return-assign
				refForm={ref => (formRef = ref)}
				noted={orderNote || null}
			/>
		</div>
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
		name: 'currentOrder',
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
)(NoteButton)
