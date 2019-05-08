import React, { Component } from 'react'
import { Row, Col, Input, Button } from 'antd'

export default class index extends Component {
	state = {
		vars: { '@primary-color': '#dddddd' }
	}
	onChange = e => {
		const color = e.target.value
		if (color.match(/^#[a-f0-9]{3,6}$/i)) {
			const vars = this.state.vars
			vars['@primary-color'] = color
			this.setState({ vars })
		}
	}
	updateVars = () => {
		window.less.modifyVars(this.state.vars).then(() => {
			console.log('Theme updated successfully')
		})
	}
	onClick = () => {
		window.less.modifyVars({
			'@primary-color': '#0035ff'
		})
	}
	render() {
		return (
			<div>
				Members
				<Row>
					<Col xs={16}>
						Primary Color: <Input onChange={this.onChange} />
					</Col>
					<Col xs={24}>
						<Button type="primary" onClick={this.onClick}>
							Update Vars
						</Button>
					</Col>
				</Row>
			</div>
		)
	}
}
