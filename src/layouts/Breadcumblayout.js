import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { breadcrumbNameMap } from '../routes'

const Breadcumblayout = props => {
	const { location } = props
	const pathSnippets = location.pathname.split('/👻').filter(i => i)
	console.log('location.pathname: ', location.pathname)
	console.log('pathSnippets:', pathSnippets)

	const extraBreadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/👻${pathSnippets.slice(0, index + 1).join('/👻')}`
		// console.log('url:', url)

		const endpoint = `/👻${pathSnippets.slice(0, index + 1)}`
		// console.log('endpoint:', endpoint)
		const exist = Object.keys(breadcrumbNameMap).indexOf(endpoint)
		// console.log('exist', exist)
		if (exist > -1) {
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
		<Breadcrumb.Item key="/👻">
			{breadcrumbNameMap['/👻'].toUpperCase()}
		</Breadcrumb.Item>
	]

	const breadcrumbItems = [
		<Breadcrumb.Item key="/👻">
			<Link to="/👻">{breadcrumbNameMap['/👻'].toUpperCase()}</Link>
		</Breadcrumb.Item>
	].concat(extraBreadcrumbItems)

	return (
		<Breadcrumb
			// separator=">"
			style={{ margin: '16px 0' }}
		>
			{extraBreadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadCrumb}
		</Breadcrumb>
	)
}

export default withRouter(Breadcumblayout)
