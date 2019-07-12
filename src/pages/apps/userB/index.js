import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Icon } from 'antd'

import UserList from './UserList'
import { GET_ALL_USERS, USER_LOCK_AND_UNLOCK } from './queries'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';
import UserModal from './UserModal/index';

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
					title="Manage user"
					bordered={false}
					extra={
						<Button type="primary" block onClick={openModal}>
							Create a new user
						</Button>
					}
					headStyle={{
						border: 0
					}}
				>
					{users &&
						users.map((user, i) => (
							<UserList userData={user} key={i} />
						))}
				</Card>
				<UserModal
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
])(UserB)


