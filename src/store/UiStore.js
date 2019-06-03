import { action, observable } from 'mobx'

class UiStore {
	@observable theme = 'day6789'

	@action
	toggleTheme = () => {
		this.theme = this.theme === 'day' ? 'night' : 'day'
	}
}

export default new UiStore()
