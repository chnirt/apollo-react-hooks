import React, { useState } from 'react'
import { Button } from 'antd'
import ModalNoteForm from './modalNoteForm'

function NoteButton(props) {
	const [modalVisible, setModalVisible] = useState(false)
	const { t, isLocked, menuId, quantity, dishId } = props

	async function showModal() {
		await setModalVisible(true)
	}

	function handleCancel() {
		setModalVisible(false)
	}

	// function handleNote() {
	// 	formRef.validateFields(async (err, values) => {
	// 		if (err) {
	// 			return
	// 		}
	// 		updateOrder({
	// 			mutation: UPDATE_ORDER,
	// 			variables: {
	// 				id: currentOrder.currentOrder._id,
	// 				input: {
	// 					menuId,
	// 					dishId,
	// 					note: values.note,
	// 					count: quantity
	// 				}
	// 			},
	// 			refetchQueries: [
	// 				{
	// 					query: CURRENT_ORDER,
	// 					variables: {
	// 						menuId,
	// 						dishId
	// 					}
	// 				}
	// 			]
	// 		})
	// 			.then(res => {
	// 				if (res.data.updateOrder === true)
	// 					openNotificationWithIcon(
	// 						'success',
	// 						'success-add-note',
	// 						t('src.pages.common.success'),
	// 						null
	// 					)
	// 			})
	// 			.catch(err => {
	// 				// console.log(err)
	// 				const errors = err.graphQLErrors.map(error => error.message)
	// 				openNotificationWithIcon(
	// 					'error',
	// 					'failed',
	// 					'src.pages.common.failed',
	// 					errors[0]
	// 				)
	// 			})
	// 		formRef.resetFields()
	// 		setModalVisible(false)
	// 	})
	// }

	// function saveFormRef(formRef) {
	// 	// eslint-disable-next-line no-param-reassign
	// 	formRef = formRef
	// }

	// const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(NoteForm)

	return (
		<div>
			<Button
				icon="form"
				shape="circle"
				type="primary"
				onClick={showModal}
				id={`note-order-${dishId}`}
				disabled={isLocked}
			/>
			<ModalNoteForm
				t={t}
				visible={modalVisible}
				closeModal={handleCancel}
				menuId={menuId}
				dishId={dishId}
				quantity={quantity}
			/>
		</div>
	)
}

export default NoteButton
