import AuthStore from './auth'
import i18nStore from './i18n'
import TestStore from './test'

// Root Store Declaration
class Store {
	constructor() {
		this.authStore = new AuthStore(this)
		this.i18nStore = new i18nStore(this)
		this.testStore = new TestStore(this)
	}
}
export default new Store()
