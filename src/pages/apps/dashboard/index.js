import React from 'react'
import { Button } from 'antd';
import './index.css'
import { siderRoutes } from '../../../routes'

import { Link, withRouter } from 'react-router-dom'

function Dashboard() {
	// console.log(siderRoutes)
	return (
		<React.Fragment>
			<label style={{ display: 'block', width: '100%', marginBottom: '20px' }}>QUICK ACTIONS</label>
			<div className='wrap-btn'>

				<Button className='btn'>
					<Link to='/🥢/menumanage'>
						Quản lí Menu
					</Link>
				</Button>

				<Button className='btn' style={{ marginLeft: 'auto' }}>
					<Link to='/🥢/order'>
						Đặt món
					</Link>
				</Button>
				<Button className='btn'>
					<Link to='/🥢/usermanage'>
						Quản lí Tài Khoản
					</Link>
				</Button>
				<Button className='btn' style={{ marginLeft: 'auto' }}>
					<Link to='/🥢/report'>
						Báo cáo
					</Link>
				</Button>
			</div>
		</React.Fragment>
	)
}

export default withRouter(Dashboard)
