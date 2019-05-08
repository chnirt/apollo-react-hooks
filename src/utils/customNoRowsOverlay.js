import React, { Component } from 'react'
import { Empty } from 'antd'
export default class CustomNoRowsOverlay extends Component {
	render() {
		return (
			<Empty
				image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
				imageStyle={{
					height: 100
				}}
				description={<span>No Data</span>}
			/>
		)
	}
}
