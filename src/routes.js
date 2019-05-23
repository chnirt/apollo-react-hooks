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
import { Spin } from 'antd'

function Loading(props) {
	if (props.error) {
		return <div>{/* Error! <button onClick={props.retry}>Retry</button> */}</div>
	} else if (props.timedOut) {
		return (
			<div>
				{/* Taking a long time... <button onClick={props.retry}>Retry</button> */}
			</div>
		)
	} else if (props.pastDelay) {
		return (
			<div
				style={{
					textAlign: 'center',
					borderRadius: '4px',
					marginBottom: '20px',
					padding: '30px 50px',
					margin: '20px 0',
					height: '100vh'
				}}
			>
				<Spin size="large" />
			</div>
		)
	} else {
		return null
	}
}

const Login = Loadable({
	loader: () => import('./pages/login'),
	loading: Loading,
	delay: 300
})

const Register = Loadable({
	loader: () => import('./pages/register'),
	loading: Loading,
	delay: 300
})

const Home = Loadable({
	loader: () => import('./pages/home'),
	loading: Loading,
	delay: 300
})

const Dashboard = Loadable({
	loader: () => import('./pages/dashboard'),
	loading: Loading,
	delay: 300
})

const Member = Loadable({
	loader: () => import('./pages/member'),
	loading: Loading
})

const Post = Loadable({
	loader: () => import('./pages/post'),
	loading: Loading,
	delay: 300
})

const Like = Loadable({
	loader: () => import('./pages/like'),
	loading: Loading,
	delay: 300
})

const Profile = Loadable({
	loader: () => import('./pages/profile'),
	loading: Loading,
	delay: 300
})

const UpdateInformation = Loadable({
	loader: () => import('./pages/updateinfo'),
	loading: Loading,
	delay: 300
})

const ChangePassword = Loadable({
	loader: () => import('./pages/changepwd'),
	loading: Loading,
	delay: 300
})

export const routes = [
	{
		label: 'Login',
		path: '/login',
		component: Login,
		component1: 'login'
	},
	{
		label: 'Register',
		path: '/register',
		component: Register,
		component1: 'register'
	},
	{
		label: 'Home',
		path: '/👻',
		private: true,
		component: Home,
		component1: 'home',
		routes: [
			{
				label: 'dashboard',
				path: '/👻',
				exact: true,
				component: Dashboard,
				compoenent1: 'dashboard'
			},
			{
				label: 'members',
				path: '/👻/members',
				component: Member,
				compoenent1: 'member'
			},
			{
				label: 'posts',
				path: '/👻/posts',
				component: Post,
				compoenent1: 'post'
			},
			{
				label: 'likes',
				path: '/👻/likes',
				component: Like,
				compoenent1: 'like'
			},
			{
				label: 'profile',
				path: '/👻/profile',
				component: Profile,
				compoenent1: 'profile'
			},
			{
				label: 'updateinformation',
				path: '/👻/updateinformation',
				component: UpdateInformation,
				compoenent1: 'updateinfo'
			},
			{
				label: 'changepassword',
				path: '/👻/changepassword',
				component: ChangePassword,
				compoenent1: 'changepwd'
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
