import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import MenuList from './menuList'

function Menu(props) {
	const [siteId] = useState(window.localStorage.getItem('currentsite'))
	const { t } = props
	return (
		<div className="menu">
			<h1 style={{ margin: '.3em 1em', color: '#fff', display: 'inline' }}>
				{t('Manage Menu')}
			</h1>
			<div className="menu-list">
				<MenuList {...props} siteId={siteId} />
			</div>
		</div>
	)
}

export default withTranslation('translations')(Menu)
