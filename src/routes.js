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
			// {
			// 	label: 'menumanage',
			// 	path: '/🥢/menumanage',
			// 	component: 'menumanage'
			// },
			// {
			// 	label: 'menudetail',
			// 	path: '/🥢/menudetail',
			// 	component: 'menudetail'
			// },
			// {
			// 	label: 'order',
			// 	path: '/🥢/order',
			// 	component: 'order'
			// },
			// {
			// 	label: 'usermanage',
			// 	path: '/🥢/usermanage',
			// 	component: 'usermanage'
			// }
			// {
			// 	label: 'report',
			// 	path: '/🥢/report',
			// 	component: 'report'
			// }
		]
	}
]
