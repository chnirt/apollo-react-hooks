import AuthStore from './auth'
import i18nStore from './i18n'
import NavigationStore from './navigation'
import TestStore from './test'

// Root Store Declaration
class Store {
	constructor() {
		this.authStore = new AuthStore(this)
		this.i18nStore = new i18nStore(this)
		this.navigationStore = new NavigationStore(this)
		this.testStore = new TestStore(this)
	}
}
export default new Store()
