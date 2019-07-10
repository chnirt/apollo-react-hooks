import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Link } from 'react-router-dom'

function Layouts(props) {
	// console.log(props.children.props.location.pathname)
	const { visible, onClose } = props.store.navigationStore
	// const [visible, setVisible] = useState(false)

	// return props.children.props.location.pathname === '/' ? (
	// 	<>{props.children}</>
	// ) : (
	// 	<Drawer
	// 		title="Basic Drawer"
	// 		width={'100%'}
	// 		placement="right"
	// 		closable={true}
	// 		onClose={() => {
	// 			onClose()
	// 			props.history.push('/🥢')
	// 		}}
	// 		visible={visible}
	// 	>
	// 		{props.children}
	// 	</Drawer>
	// )
	return (
		<>
			<Link to="/🥢">Dashboard</Link>
			<Link to="/🥢/menu">Menu</Link>
			<Link to="/🥢/order">Order</Link>
			<Link to="/🥢/user">User</Link>
			<Link to="/🥢/report">Report</Link>
			{props.children}
		</>
	)
}

export default withRouter(inject('store')(observer(Layouts)))
