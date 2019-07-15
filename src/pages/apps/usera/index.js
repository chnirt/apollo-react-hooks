import React, { useState, userEffect, useEffect } from 'react'
import { Row, Card, Button, Divider } from 'antd'

import UserList from './UserList'
import { GET_ALL_USERS } from './queries'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';
import UserModal from './usermodal';
import EditModal from './editModal'

function UserA(props) {
	const [visible, setVisible] = useState(false)
	const [visibleEdit, setVisibleEdit] = useState(false)
	// const [user, setUser] = useState(null)
	const [user, setUser] = useState('')

	function openModal() {
		setVisible(true)
	}

	function closeModal() {
		setVisible(false)
	}

	function openModalEdit() {
		setVisibleEdit(true)
	}

	function closeModalEdit() {
		setVisibleEdit(false)
	}

	// function set(user) {
	// 	setUser(user)
	// }

	function set(user) {
		setUser(user)
	}

	const users = props.data.users

	return (
		<>
			<Button
				shape="circle"
				icon="left"
				onClick={() => props.history.push('/🥢')}
			/>
			<Divider />
			<Row
				style={{
					height: 'calc(100vh - 60px)'
				}}
			>
				<Card
					title="Quản lí User"
					bordered={false}
					extra={
						<Button type="primary" block onClick={openModal}>
							Tạo user
						</Button>
					}
					headStyle={{
						border: 0
					}}
				>
					{users &&
						users.filter(user => user.isActive).map((user, i) => (
							<div key={i}>
								<UserList
									userData={user}
									key={i}
									visible={visibleEdit}
									openModal={openModalEdit}
									setUser={set}
								/>

							</div>
						))}
				</Card>
				<EditModal
					userData={user}
					// user={user}
					visible={visibleEdit}
					handleCancel={closeModalEdit}
				/>
				<UserModal
					// userId={userId}
					// user={user}
					visible={visible}
					handleCancel={closeModal}
				/>

			</Row>
		</>
	)
}

export default HOCQueryMutation([
	{
		query: GET_ALL_USERS
	}
])(UserA)


