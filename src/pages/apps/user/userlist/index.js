import React from 'react'
import { Col, Card, Icon } from 'antd'

function UserList (props) {
  const { showModal, onLockAndUnlock, onDelete, _id, isLocked, fullName } = props
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
          <Icon type='edit' onClick={() => showModal(_id)} />,
          <Icon
            type={isLocked ? 'lock' : 'unlock'}
            onClick={() => onLockAndUnlock(_id)}
          />,
          <Icon type='delete' onClick={() => onDelete(_id)} />
        ]}
      >
        {fullName}
      </Card>
    </Col>
  )
}

export default UserList
