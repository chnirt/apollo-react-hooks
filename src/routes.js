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
				label: 'Dashboard',
				path: '/🥢',
				exact: true,
				component: 'dashboard'
			},
			{
				label: 'Manage Menu',
				path: '/🥢/menu',
				component: 'menu'
			},
			{
				label: 'Manage Order',
				path: '/🥢/order',
				icon: 'shopping-cart',
				component: 'order'
			},
			{
				label: 'Manage User',
				path: '/🥢/user',
				component: 'user'
			},
			{
				label: 'Report',
				path: '/🥢/report',
				component: 'report'
			}
		]
	}
]

export const menuRoutes = [
	{
		label: 'Manage Menu',
		path: '/🥢/menu',
		icon: 'bars'
	},
	{
		label: 'Manage Order',
		path: '/🥢/order',
		icon: 'shopping-cart'
	},
	{
		label: 'Manage User',
		path: '/🥢/user',
		icon: 'user'
	},
	{
		label: 'Report',
		path: '/🥢/report',
		icon: 'file-done'
	}
]
