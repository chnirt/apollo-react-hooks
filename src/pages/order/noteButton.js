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
