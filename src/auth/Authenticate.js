const Auth = {
	isAuthenticated: localStorage.getItem('access-token') ? true : false,
	authenticate(cb) {
		this.isAuthenticated = true
		setTimeout(cb, 100)
	},
	logout(cb) {
		this.isAuthenticated = false
		setTimeout(cb, 100)
	}
}

export default Auth
