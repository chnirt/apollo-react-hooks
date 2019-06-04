import React from 'react'

const CTX = React.createContext()

export { CTX }

export default function Store(props) {
	const stateHook = React.useState({ hello: 'world' })
	return <CTX.Provider value={stateHook}>{props.children}</CTX.Provider>
}
