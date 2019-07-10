import { action, observable } from 'mobx'

class NavigationStore {
	@observable visible = false

	@action
	showDrawer = path => {
		this.visible = true
	}
	onClose = props => {
		this.visible = false
	}
}

export default NavigationStore
