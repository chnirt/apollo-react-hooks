import React, { useState } from 'react'
<<<<<<< HEAD:src/pages/apps/userB/index.js
import { Row, Card, Button } from 'antd'

import UserList from './UserList'
import { GET_ALL_USERS } from './queries'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';
import UserModal from './UserModal/index';
=======
import { Row, Card, Button, Divider } from 'antd'

import UserList from './UserList'
import { GET_ALL_USERS } from './queries'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import UserModal from './usermodal'
>>>>>>> f8a2e8cb0099ec9390a4fe19dabada25a05e2bc5:src/pages/apps/usera/index.js

function UserB(props) {
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
	console.log(users)

	return (
		<>
			<Row
				style={{
					height: 'calc(100vh - 60px)'
				}}
			>
				<Button
					shape="circle"
					icon="left"
					onClick={() => props.history.push('/🥢')}
				/>
				<Divider />
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
<<<<<<< HEAD:src/pages/apps/userB/index.js
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
=======
						users
							.filter(user => user.isActive)
							.map((user, i) => <UserList userData={user} key={i} />)}
				</Card>
				<UserModal visible={visible} handleCancel={closeModal} />
>>>>>>> f8a2e8cb0099ec9390a4fe19dabada25a05e2bc5:src/pages/apps/usera/index.js
			</Row>
		</>
	)
}

export default HOCQueryMutation([
	{
		query: GET_ALL_USERS
	}
])(UserB)
