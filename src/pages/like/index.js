import React from 'react'
import { withTranslation } from 'react-i18next'

function Like(props) {
	const { t, i18n } = props
	function onChange(type) {
		i18n.changeLanguage('vn')
		console.log(type === 'vn')
		if (type === 'vn') {
			i18n.changeLanguage('vn')
		} else {
			i18n.changeLanguage('en')
		}
	}
	return (
		<div>
			<button onClick={() => onChange('vn')}>VN</button>
			<button onClick={() => onChange('en')}>EN</button>
			{t('hello')}
		</div>
	)
}

export default withTranslation()(Like)
