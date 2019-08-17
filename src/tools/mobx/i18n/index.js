import { action, observable } from 'mobx'
import vi_VN from 'antd/lib/locale-provider/vi_VN'
import moment from 'moment'
import 'moment/locale/vi'

moment.locale('en')

class i18nStore {
	@observable locale =
		window.localStorage.getItem('i18nextLng') === 'vi-VN' ? vi_VN : null

	@action
	changeLanguage = locale => {
		this.locale = locale === 'vi-VN' ? vi_VN : null
	}
}

export default i18nStore
