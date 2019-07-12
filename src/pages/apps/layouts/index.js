import React from 'react'
import { Link } from 'react-router-dom'

function Layouts(props) {
	return (
		<>
			<Link to="/🥢">Dashboard</Link>
			<Link to="/🥢/menu">Menu</Link>
			<Link to="/🥢/order">Order</Link>
			<Link to="/🥢/userB">User</Link>
			<Link to="/🥢/report">Report</Link>
			{props.children}
		</>
	)
}

export default Layouts
