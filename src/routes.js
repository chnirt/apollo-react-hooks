import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'

import Dashboard from './pages/dashboard'
import Member from './pages/member'
import Dainty from './pages/dainty'
import Like from './pages/like'

import Profile from './pages/profile'
import ChangePwd from './pages/changepwd'
import UpdateInfo from './pages/updateinfo'

export const routes = [
	{
		label: 'Login',
		path: '/login',
		component: 'login',
		import: Login
	},
	{
		label: 'Register',
		path: '/register',
		component: 'register',
		import: Register
	},
	{
		label: 'Home',
		path: '/',
		private: true,
		component: 'home',
		import: Home,
		routes: [
			{
				label: 'dashboard',
				path: '/👻',
				exact: true,
				component: 'dashboard',
				import: Dashboard
			},
			{
				label: 'members',
				path: '/👻/members',
				component: 'member',
				import: Member
			},
			{
				label: 'dainties',
				path: '/👻/dainties',
				component: 'dainty',
				import: Dainty
			},
			{
				label: 'likes',
				path: '/👻/likes',
				component: 'like',
				import: Like
			},
			{
				label: 'profile',
				path: '/👻/profile',
				component: 'profile',
				import: Profile
			},
			{
				label: 'updateinformation',
				path: '/👻/updateinformation',
				component: 'updateinfo',
				import: UpdateInfo
			},
			{
				label: 'changepassword',
				path: '/👻/changepassword',
				component: 'changepwd',
				import: ChangePwd
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
		label: 'dainties',
		icon: 'file',
		path: '/👻/dainties'
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
	'/👻/dainties': 'dainties',
	'/👻/likes': 'likes',
	'/👻/profile': 'my profile',
	'/👻/updateinformation': 'update information',
	'/👻/changepassword': 'change password'
}
