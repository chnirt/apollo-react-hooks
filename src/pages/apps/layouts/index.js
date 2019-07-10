import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Link } from 'react-router-dom'
import { Drawer } from 'antd'

function Layouts(props) {
	console.log(props.children.props.location.pathname)
	const { visible, onClose } = props.store.navigationStore
	// const [visible, setVisible] = useState(false)

	return props.children.props.location.pathname === '/🥢' ? (
		<>{props.children}</>
	) : (
		<Drawer
			title="Basic Drawer"
			width={'100%'}
			placement="right"
			closable={true}
			onClose={() => {
				onClose()
				props.history.push('/🥢')
			}}
			visible={visible}
		>
			{props.children}
		</Drawer>
	)
}

export default withRouter(inject('store')(observer(Layouts)))
