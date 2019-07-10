import React from 'react'
import { Link } from 'react-router-dom'

export default function Layouts(props) {
	console.log(props.children)
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
