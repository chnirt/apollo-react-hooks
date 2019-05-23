// // Landing
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Home from './pages/Home'

// // Application
// // Dashboard
// import Dashboard from './pages/apps/Dashboard'
// // Member
// import ScreenMember from './pages/apps/Member'
// // Post
// import ScreenPost from './pages/apps/Post'
// // Like
// import ScreenLike from './pages/apps/Like'
// // USER
// import { Profile, UpdateInformation, ChangePassword } from './pages/apps/User'

import React from 'react'
import Loadable from 'react-loadable'

function Loading({ error }) {
	if (error) {
		return 'Oh nooess!'
	} else {
		return <h3>Loading...</h3>
	}
}

const Login = Loadable({
	loader: () => import('./pages/Login'),
	loading: Loading,
	delay: 300
})

const Register = Loadable({
	loader: () => import('./pages/Register'),
	loading: Loading,
	delay: 300
})

const Home = Loadable({
	loader: () => import('./pages/Home'),
	loading: Loading,
	delay: 300
})

const Dashboard = Loadable({
	loader: () => import('./pages/apps/Dashboard'),
	loading: Loading,
	delay: 300
})

const Member = Loadable({
	loader: () => import('./pages/apps/Member'),
	loading: Loading
})

const Post = Loadable({
	loader: () => import('./pages/apps/Post'),
	loading: Loading,
	delay: 300
})

const Like = Loadable({
	loader: () => import('./pages/apps/Like'),
	loading: Loading,
	delay: 300
})

const Profile = Loadable({
	loader: () => import('./pages/apps/User/Profile'),
	loading: Loading,
	delay: 300
})

const UpdateInformation = Loadable({
	loader: () => import('./pages/apps/User/Updateinformation'),
	loading: Loading,
	delay: 300
})

const ChangePassword = Loadable({
	loader: () => import('./pages/apps/User/Changepassword'),
	loading: Loading,
	delay: 300
})

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
				component: Member
			},
			{
				label: 'posts',
				path: '/👻/posts',
				component: Post
			},
			{
				label: 'likes',
				path: '/👻/likes',
				component: Like
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

export const breadcrumbNameMap = {
	'/👻': 'dashboard',
	'/👻/members': 'members',
	'/👻/posts': 'posts',
	'/👻/likes': 'likes',
	'/👻/profile': 'profile',
	'/👻/updateinformation': 'updateinformation',
	'/👻/changepassword': 'changepassword'
}
