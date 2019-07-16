import gql from 'graphql-tag'

const GET_ALL_USERS = gql`
	query users	{
		users(offset: 0, limit: 100){
			username
			fullName
			password
      isActive
      isLocked
			_id
		}
	}
`

const CREATE_USER = gql`mutation($input: CreateUserInput!){
  createUser(input: $input){
    username
		fullName
		password
  }
}`

const INACTIVE_USER = gql`
mutation deleteUser($_id: String!){
  deleteUser(_id:$_id)
}`

const UPDATE_USER = gql`
	mutation updateUser($_id: String!, $input: UpdateUserInput!){
		updateUser(_id: $_id, input: $input)
	}
`

const USER_LOCK_AND_UNLOCK = gql`
	mutation($_id: String!) {
		lockAndUnlockUser(_id: $_id)
	}
`

const GET_ALL_SITES = gql`
	query sites{
		sites
		{
			_id
			name
		}
	}

`
const GET_ALL_PERMISSIONS = gql`
	query permissions{
		permissions{
			code
			_id
			description
		}
	}
`

const GET_ALL_PERMISSIONS_BY_USERID = gql`
	query($_id: String!) {
		findAllByUserId(_id: $_id) {
			siteId
			permissions {
				_id
				code
			}
		}
	}
`

export {
  GET_ALL_USERS,
  CREATE_USER,
  INACTIVE_USER,
  UPDATE_USER,
  USER_LOCK_AND_UNLOCK,
  GET_ALL_SITES,
	GET_ALL_PERMISSIONS,
	GET_ALL_PERMISSIONS_BY_USERID
}