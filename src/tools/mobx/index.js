import AuthStore from './auth'
import TestStore from './test'

// Root Store Declaration
class Store {
	constructor() {
		this.authStore = new AuthStore(this)
		this.testStore = new TestStore(this)
	}
}
export default new Store()
