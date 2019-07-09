import { action, observable } from 'mobx'

class AuthStore {
	@observable isAuth = window.localStorage.getItem('access-token') ? true : false

	@action
	authenticate = (token, sites) => {
		window.localStorage.setItem('access-token', token)
		window.localStorage.setItem('currentsite', sites[0])
		window.localStorage.setItem('sites', sites)
		this.isAuth = true
	}
	logout = () => {
		window.localStorage.clear()
		this.isAuth = false
	}
}

export default AuthStore
