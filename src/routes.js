export const routes = [
	{
		label: 'Login',
		path: '/login',
		component: 'login'
	},
	{
		label: 'Register',
		path: '/register',
		component: 'register'
	},
	{
		label: 'App',
		path: '/',
		private: true,
		component: 'apps',
		routes: [
			{
				label: 'dashboard',
				path: '/👻',
				exact: true,
				component: 'dashboard'
			}
			// {
			// 	label: 'members',
			// 	path: '/👻/members',
			// 	component: 'member'
			// },
			// {
			// 	label: 'dainties',
			// 	path: '/👻/dainties',
			// 	component: 'dainty'
			// },
			// {
			// 	label: 'likes',
			// 	path: '/👻/likes',
			// 	component: 'like'
			// },
			// {
			// 	label: 'profile',
			// 	path: '/👻/profile',
			// 	component: 'profile'
			// }
			// {
			// 	label: 'updateinformation',
			// 	path: '/👻/updateinformation',
			// 	component: 'updateinfo'
			// },
			// {
			// 	label: 'changepassword',
			// 	path: '/👻/changepassword',
			// 	component: 'changepwd'
			// }
		]
	}
]

export const siderRoutes = [
	{
		label: 'dashboard',
		icon: 'dashboard',
		path: '/👻'
	}
	// {
	// 	label: 'members',
	// 	icon: 'team',
	// 	path: '/👻/members'
	// },
	// {
	// 	label: 'dainties',
	// 	icon: 'file',
	// 	path: '/👻/dainties'
	// },
	// {
	// 	label: 'likes',
	// 	icon: 'like',
	// 	path: '/👻/likes'
	// }
]

export const headerRoutes = [
	{
		label: 'my profile',
		icon: 'user',
		path: '/👻/profile'
	}
	// {
	// 	label: 'update information',
	// 	icon: 'info-circle',
	// 	path: '/👻/updateinformation'
	// },
	// {
	// 	label: 'change password',
	// 	icon: 'key',
	// 	path: '/👻/changepassword'
	// }
]

export const breadcrumbNameMap = {
	'/👻': 'dashboard',
	'/👻/members': 'members',
	'/👻/dainties': 'dainties',
	'/👻/likes': 'likes',
	'/👻/profile': 'my profile'
	// '/👻/updateinformation': 'update information',
	// '/👻/changepassword': 'change password'
}
