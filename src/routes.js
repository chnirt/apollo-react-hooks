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
		label: 'Home',
		path: '/👻',
		private: true,
		component: 'home',
		routes: [
			{
				label: 'dashboard',
				path: '/👻',
				exact: true,
				component: 'dashboard'
			},
			{
				label: 'members',
				path: '/👻/members',
				component: 'member'
			},
			{
				label: 'posts',
				path: '/👻/posts',
				component: 'post'
			},
			{
				label: 'likes',
				path: '/👻/likes',
				component: 'like'
			},
			{
				label: 'profile',
				path: '/👻/profile',
				component: 'profile'
			},
			{
				label: 'updateinformation',
				path: '/👻/updateinformation',
				component: 'updateinfo'
			},
			{
				label: 'changepassword',
				path: '/👻/changepassword',
				component: 'changepwd'
			}
		]
	}
]

export const siderRoutes = [
	{
		label: 'dashboard',
		icon: 'dashboard',
		path: '/👻'
	},
	{
		label: 'members',
		icon: 'team',
		path: '/👻/members'
	},
	{
		label: 'posts',
		icon: 'file',
		path: '/👻/posts'
	},
	{
		label: 'likes',
		icon: 'like',
		path: '/👻/likes'
	}
]

export const headerRoutes = [
	{
		label: 'my profile',
		icon: 'user',
		path: '/👻/profile'
	},
	{
		label: 'update information',
		icon: 'info-circle',
		path: '/👻/updateinformation'
	},
	{
		label: 'change password',
		icon: 'key',
		path: '/👻/changepassword'
	}
]

export const breadcrumbNameMap = {
	'/👻': 'dashboard',
	'/👻/members': 'members',
	'/👻/posts': 'posts',
	'/👻/likes': 'likes',
	'/👻/profile': 'profile',
	'/👻/updateinformation': 'updateinformation',
	'/👻/changepassword': 'changepassword'
}
