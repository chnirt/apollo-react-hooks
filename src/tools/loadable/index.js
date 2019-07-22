import React from 'react'
import Loadable from 'react-loadable'
import { Button, Spin } from 'antd'

function Loading (props) {
  const { error, retry, timedOut, pastDelay } = props
  if (error) {
    return (
      <div>
				Error! 
        {' '}
        <Button onClick={retry}>Retry</Button>
      </div>
    )
  }
  if (timedOut) {
    return (
      <div>
				Taking a long time... 
        {' '}
        <Button onClick={retry}>Retry</Button>
      </div>
    )
  }
  if (pastDelay) {
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
        <Spin size='large' />
      </div>
    )
  }
  return null
}

const MyComponent = importComponent => Loadable({
  loader: () => importComponent,
  loading: Loading,
  delay: 1000 // default 200ms = 0.2s
})

export default MyComponent
