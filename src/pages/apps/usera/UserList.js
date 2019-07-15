import React, { useState } from 'react'
import { Col, Card, Modal, Icon, Avatar } from 'antd'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation';
import { USER_LOCK_AND_UNLOCK, GET_ALL_USERS, INACTIVE_USER } from './queries'

function UserList(props) {
  const [visible, setVisible] = useState(false)

  function openModal() {
    setVisible(true)
  }

  function closeModal() {
    setVisible(false)
  }


  function onDelete(_id) {
    Modal.confirm({
      title: 'Bạn có muốn xóa không ?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      icon: 'question-circle',
      onOk: () => props.mutate
        .deleteUser({
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
          openNotificationWithIcon('success', 'success', 'Xóa user thành công', null)
        })
        .catch(err => {
          // console.log(err)
          const errors = err.graphQLErrors.map(error => error.message)
          openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
        })
    });

  }

  function onLockAndUnlock(_id) {
    // console.log('LockAndUnlock', _id)
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
        openNotificationWithIcon('success', 'success', 'Lock user thành công', null)
      })
      .catch(err => {
        // console.log(err)
        const errors = err.graphQLErrors.map(error => error.message)
        openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
      })

  }

  function onEdit(user) {
    props.setUser(user)
    props.openModal()
  }
  const { Meta } = Card;


  return (
    <>
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
            <Icon type="edit" onClick={() => onEdit(props.userData)} />,
            <Icon
              type={props.userData.isLocked ? "lock" : 'unlock'}
              onClick={() => onLockAndUnlock(props.userData._id)}
            />,
            <Icon type="delete" onClick={() => onDelete(props.userData._id)} />
          ]}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {props.userData.fullName}
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            />
          </div>
        </Card>
      </Col>

    </>
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
  },
  {
    mutation: INACTIVE_USER,
    name: 'deleteUser',
    option: {}
  }
])(UserList)
