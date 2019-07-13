import React, { useState } from 'react'
import { Row, Card, Button } from 'antd'

import UserList from './UserList'
import { GET_ALL_USERS } from './queries'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';
import UserModal from './usermodal';

function UserA(props) {
	const [visible, setVisible] = useState(false)
	const [user, setUser] = useState(null)
	const [userId, setUserId] = useState(null)

	function openModal() {
		setVisible(true)
	}

	function set(user) {
		setUser(user)
	}

	function setNull(userId) {
		setNullId(null)
	}

	function setId(userId) {
		setUserId(userId)
	}

	function closeModal() {
		setVisible(false)
	}

	const users = props.data.users

	return (
		<>
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
							<UserList userData={user} key={i} visible={visible}
								handleCancel={closeModal}
								 openModal={openModal}
									userId={userId} 
									setId={setId} 
									user={user} 
									setUser={set}
									/>
						))}
				</Card>
				<UserModal
					userId={userId}
					setNull={setNull}
					user={user}
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


