import { action, observable } from 'mobx'

class TestStore {
	@observable test = '6789'

	@action
	onClick = () => {
	  this.test = '9876'
	}
}

export default TestStore
