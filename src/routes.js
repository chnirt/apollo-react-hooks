import Login from './pages/Login'
import Register from './pages/Register'

// Application
import Home from './pages/Home'
import Dashboard from './pages/apps/Dashboard'

// Member
import ScreenMember from './pages/apps/Member'
// Post
import ScreenPost from './pages/apps/Post'
// Like
import ScreenLike from './pages/apps/Like'
// USER
import Profile from './pages/apps/User/Profile'
import UpdateInformation from './pages/apps/User/Updateinformation'
import ChangePassword from './pages/apps/User/Changepassword'
// import {
// 	Profile,
// 	UpdateInformation,
// 	ChangePassword
// } from './pages/Dashboard/User';

export const routes = [
	{
		label: 'Login',
		path: '/login',
		component: Login
	},
	{
		label: 'Register',
		path: '/register',
		component: Register
	},
	{
		label: 'Home',
		path: '/👻',
		private: true,
		component: Home,
		routes: [
			{
				label: 'dashboard',
				path: '/👻',
				exact: true,
				component: Dashboard
			},
			{
				label: 'members',
				path: '/👻/members',
				component: ScreenMember
			},
			{
				label: 'posts',
				path: '/👻/posts',
				component: ScreenPost
			},
			{
				label: 'likes',
				path: '/👻/likes',
				component: ScreenLike
			},
			{
				label: 'profile',
				path: '/👻/profile',
				component: Profile
			},
			{
				label: 'updateinformation',
				path: '/👻/updateinformation',
				component: UpdateInformation
			},
			{
				label: 'changepassword',
				path: '/👻/changepassword',
				component: ChangePassword
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
