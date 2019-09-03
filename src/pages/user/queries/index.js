import gql from 'graphql-tag'

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			_id
			fullName
			reason
			isActive
			isLocked
		}
	}
`

const USER_LOCK_AND_UNLOCK = gql`
	mutation($_id: ID!, $reason: String!) {
		lockAndUnlockUser(_id: $_id, reason: $reason)
	}
`

const USER_DELETE = gql`
	mutation($_id: ID!) {
		deleteUser(_id: $_id)
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

const CREATE_USER = gql`
	mutation createUser($input: CreateUserInput!) {
		createUser(input: $input) {
			_id
			lastName
			firstName
			fullName
			reason
			isActive
			isLocked
		}
	}
`

const UPDATE_USER = gql`
	mutation updateUser($_id: ID!, $input: UpdateUserInput!) {
		updateUser(_id: $_id, input: $input)
	}
`

const GET_ALL_PERMISSIONS_BY_USERID = gql`
	query($_id: ID!) {
		findAllByUserId(_id: $_id) {
			siteId
			permissions {
				_id
				code
			}
		}
	}
`

const GET_USER = gql`
	query($_id: ID!) {
		user(_id: $_id) {
			firstName
			lastName
		}
	}
`

export {
	GET_ALL_USERS,
	USER_LOCK_AND_UNLOCK,
	USER_DELETE,
	GET_ALL_SITES,
	GET_ALL_PERMISSIONS,
	CREATE_USER,
	UPDATE_USER,
	GET_ALL_PERMISSIONS_BY_USERID,
	GET_USER
}
