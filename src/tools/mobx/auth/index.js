import { action, observable } from 'mobx'

class AuthStore {
	@observable isAuth = !!window.localStorage.getItem('access-token')

	@action
	authenticate = (token, userPermissions) => {
		window.localStorage.setItem('access-token', token)
		window.localStorage.setItem('currentsite', userPermissions[0].siteId)
		window.localStorage.setItem(
			'user-permissions',
			JSON.stringify(userPermissions)
		)
		this.isAuth = true
	}

	logout = () => {
		window.localStorage.clear()
		this.isAuth = false
	}
}

export default AuthStore
