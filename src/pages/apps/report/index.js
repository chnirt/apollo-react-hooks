import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

function index(props) {
	console.log(props)
	return <div>Test</div>
}

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			username
			fullName
			isActive
			isLocked
			_id
		}
	}
`

const GET_ALL_SITES = gql`
	query {
		sites {
			_id
			name
		}
	}
`
const GET_ALL_PERMISSIONS = gql`
	query {
		permissions {
			_id
			code
			description
		}
	}
`

export default compose(
	graphql(GET_ALL_USERS, {
		name: 'getAllUsers',
		options: {
			variables: {
				offset: 0,
				limit: 100
			}
		}
	}),
	graphql(GET_ALL_SITES, {
		name: 'getAllSites'
	}),
	graphql(GET_ALL_PERMISSIONS, {
		name: 'getAllPermissions'
	})
)(index)
