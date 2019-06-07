import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

function Profile() {
	function callback(key) {
		console.log(key)
	}
	return (
		<Tabs defaultActiveKey="1" onChange={callback} tabPosition="left">
			<TabPane tab="Update information" key="1">
				Content of Tab Pane 1
			</TabPane>
			<TabPane tab="Change password" key="2">
				Content of Tab Pane 2
			</TabPane>
		</Tabs>
	)
}

export default Profile
