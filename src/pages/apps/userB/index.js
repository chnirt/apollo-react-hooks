import React, { useState } from 'react'
import { Row, Card, Button } from 'antd'

import UserList from './UserList'
import { GET_ALL_USERS } from './queries'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import UserModal from './usermodal'

function UserB(props) {
	const [visible, setVisible] = useState(false)

	function openModal() {
		setVisible(true)
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
					title="Quản lí user"
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
						users
							.filter(user => user.isActive)
							.map((user, i) => <UserList userData={user} key={i} />)}
				</Card>
				<UserModal visible={visible} handleCancel={closeModal} />
			</Row>
		</>
	)
}

export default HOCQueryMutation([
	{
		query: GET_ALL_USERS
	}
])(UserB)
