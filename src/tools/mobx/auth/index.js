import { action, observable } from 'mobx'

class AuthStore {
	@observable isAuth = window.localStorage.getItem('access-token') ? true : false

	@action
	authenticate = () => {
		this.isAuth = true
	}
	logout = () => {
		window.localStorage.removeItem('access-token')
		this.isAuth = false
	}
}

export default AuthStore
