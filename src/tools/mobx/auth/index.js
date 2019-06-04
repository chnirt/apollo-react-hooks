import { action, observable } from 'mobx'

class AuthStore {
	@observable isAuth = false

	@action
	authenticate = () => {
		this.isAuth = true
	}
	logout = () => {
		this.isAuth = false
	}
}

export default AuthStore
