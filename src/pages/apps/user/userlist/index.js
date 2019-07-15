import React from 'react'
import { Col, Card, Icon } from 'antd'

function UserList(props) {
  return (
    <Col
      xs={{
        span: 22,
        offset: 1
      }}
      sm={{
        span: 10,
        offset: 1
      }}
      md={{
        span: 10,
        offset: 1
      }}
      lg={{
        span: 4,
        offset: 1
      }}
      style={{
        marginBottom: 20
      }}
    >
      <Card
        actions={[
          <Icon type="edit" onClick={() => props.showModal(props._id)} />,
          <Icon
            type={props.isLocked ? 'lock' : 'unlock'}
            onClick={() => props.onLockAndUnlock(props._id)}
          />,
          <Icon type="delete" onClick={() => props.onDelete(props._id)} />
        ]}
      >
        {props.fullName}
      </Card>
    </Col>
  )
}

export default UserList