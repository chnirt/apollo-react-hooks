import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Icon } from 'antd'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';
import { USER_LOCK_AND_UNLOCK, GET_ALL_USERS } from './queries'


function UserList(props) {

  function onCreate() {
    console.log('Create')
  }

  function onEdit(_id) {
    console.log('Edit', _id)
  }

  function onLockAndUnlock(_id) {
    console.log('LockAndUnlock', _id)
    props.mutate
      .lockAndUnlockUser({
        variables: {
          _id
        },
        refetchQueries: [
          {
            query: GET_ALL_USERS
          }
        ]
      })
      .then(res => {
        // console.log(res)
        openNotificationWithIcon('success', 'success', 'Success', _id)
      })
      .catch(err => {
        // console.log(err)
        const errors = err.graphQLErrors.map(error => error.message)
        openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
      })

  }

  function onDelete(_id) {
    console.log('Delete', _id)
  }

  return (
    <Col
      // key={i}
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
          <Icon type="edit" onClick={() => onEdit(props.userData._id)} />,
          <Icon
            type={props.userData.isLocked ? "lock" : 'unlock'}
            onClick={() => onLockAndUnlock(props.userData._id)}
          />,
          <Icon type="delete" onClick={() => onDelete(props.userData._id)} />
        ]}
      >
        {props.userData.fullName}
      </Card>
    </Col>
  )
}

export default HOCQueryMutation([
  {
    query: GET_ALL_USERS
  },
	{
    mutation: USER_LOCK_AND_UNLOCK,
    name: 'lockAndUnlockUser',
    option: {}
	}
])(UserList)

// export default withApollo(UserList)
