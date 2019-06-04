import React from 'react'
import Loadable from 'react-loadable'
import { Spin } from 'antd'

function Loading(props) {
	if (props.error) {
		return (
			<div>
				Error! <button onClick={props.retry}>Retry</button>
			</div>
		)
	} else if (props.timedOut) {
		return (
			<div>
				Taking a long time... <button onClick={props.retry}>Retry</button>
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
					margin: '20px 0'
				}}
			>
				<Spin size="large" />
			</div>
		)
	} else {
		return null
	}
}

const MyComponent = importComponent =>
	Loadable({
		loader: () => importComponent,
		loading: Loading,
		delay: 1000 // default 200ms = 0.2s
	})

export default MyComponent
