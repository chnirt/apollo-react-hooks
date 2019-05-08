import React, { Component } from 'react'
import { Spin } from 'antd'

export default class CustomLoadingOverlay extends Component {
	render() {
		return (
			<>
				<Spin tip="Loading..." />
			</>
		)
	}
}
