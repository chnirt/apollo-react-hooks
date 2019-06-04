import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../../assets/i18n/locales/en.json'
import vi from '../../assets/i18n/locales/vi.json'

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources: {
			en: {
				translations: en
			},
			vi: {
				translations: vi
			}
		},
		lng: 'en',
		fallbackLng: 'en', // use en if detected lng is not available

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false // react already safes from xss
		},
		// have a common namespace used around the full app
		ns: ['translations'],
		defaultNS: 'translations'
	})

export default i18n
