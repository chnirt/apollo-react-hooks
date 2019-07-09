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
				label: 'Menu',
				path: '/🥢/menu',
				content: 'Manage Menu',
				icon: 'bars',
				component: 'menu'
			},
			{
				label: 'Order',
				path: '/🥢/order',
				content: 'Manage Order',
				icon: 'shopping-cart',
				component: 'order'
			},
			{
				label: 'User',
				path: '/🥢/user',
				content: 'Manage User',
				icon: 'user',
				component: 'user'
			},
			{
				label: 'Report',
				path: '/🥢/report',
				content: 'Report',
				icon: 'file-done',
				component: 'report'
			}
		]
	}
]
