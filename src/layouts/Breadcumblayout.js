import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Breadcrumb } from 'antd'

const breadcrumbNameMap = {
	'/': 'dashboard',
	'/login': 'login',
	'/register': 'register',
	'/members': 'members',
	'/posts': 'posts',
	'/likes': 'likes',
	'/profile': 'profile',
	'/updateinformation': 'updateinformation',
	'/changepassword': 'changepassword'
}

const Breadcumblayout = props => {
	const { location } = props
	const pathSnippets = location.pathname.split('/').filter(i => i)

	const extraBreadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`

		const endpoint = `${pathSnippets.slice(0, index + 1)}`
		if (Object.values(breadcrumbNameMap).indexOf(endpoint) > -1) {
			return (
				<Breadcrumb.Item key={url}>
					{/* <Link to={url}>{breadcrumbNameMap[url].toUpperCase()}</Link> */}
					{breadcrumbNameMap[url].toUpperCase()}
				</Breadcrumb.Item>
			)
		}
		return null
	})

	const defaultBreadCrumb = [
		<Breadcrumb.Item key="/">
			{breadcrumbNameMap['/'].toUpperCase()}
		</Breadcrumb.Item>
	]

	const breadcrumbItems = [
		<Breadcrumb.Item key="/">
			<Link to="/">{breadcrumbNameMap['/'].toUpperCase()}</Link>
		</Breadcrumb.Item>
	].concat(extraBreadcrumbItems)

	return (
		<Breadcrumb separator=">" style={{ margin: '16px 16px' }}>
			{extraBreadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadCrumb}
		</Breadcrumb>
	)
}

export default withRouter(Breadcumblayout)
