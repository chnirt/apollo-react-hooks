import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const gridStyle = {
	width: '100%',
	height: '10vh',
	marginBottom: '10%',
	display: 'flex',
	alignItems: 'center'
}

function UserB(props) {
	const [users, setUsers] = useState([])

	useEffect(() => {
		// code to run on component mount
		props.client
			.query({
				query: USERS,
				variables: {
					offset: 1,
					limit: 100
				}
			})
			.then(res => {
				// console.log(res.data.users)
				setUsers(res.data.users)
			})
			.catch(err => {
				// console.log(err)
			})
	})

	function onClick(_id) {
		console.log(_id)
	}

	function onCreate() {
		console.log('Create')
	}

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
						<Button type="primary" block onClick={onCreate}>
							Create a new user
						</Button>
					}
					headStyle={{
						border: 0,
						margin: 0
					}}
				>
					{users &&
						users.map((item, i) => (
							<Col
								key={i}
								xs={{
									span: 22,
									offset: 1
								}}
								sm={{
									span: 10,
									offset: 1
								}}
								md={{
									span: 10,
									offset: 1
								}}
								lg={{
									span: 4,
									offset: 1
								}}
								onClick={() => onClick(item._id)}
							>
								<Card.Grid style={gridStyle}>{item.fullName}</Card.Grid>
							</Col>
						))}
				</Card>
			</Row>
		</>
	)
}

const USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			_id
			username
			password
			fullName
			isLocked
			reason
			isActive
			createdAt
			updatedAt
		}
	}
`

export default withApollo(withRouter(UserB))
