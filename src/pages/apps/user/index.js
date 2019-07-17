import React, { useState } from 'react'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
import { Row, Col, Button, Divider, Card, Icon, Modal } from 'antd'

import UserList from './userlist'
import UserModal from './usermodal'

const { confirm } = Modal

function User(props) {
  const [visible, setVisible] = useState(false)
  const [userId, setUserId] = useState('')

  function showModal(_id) {
    // console.log(_id)
    setUserId(_id)
    setVisible(true)
  }

  function hideModal() {
    setVisible(false)
  }

  function onLockAndUnlock(_id) {
    // console.log("onLockAndUnlock", _id)
    props.mutate
      .lockAndUnlockUser({
        variables: {
          _id
        },
        refetchQueries: [
          {
            query: GET_ALL_USERS,
            variables: {
              offset: 0,
              limit: 100
            },
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
    // console.log("onDelete", _id)
    confirm({
      title: 'Delete',
      content: 'Do you want to delete this user?',
      onOk() {
        // console.log('OK');
        props.mutate
          .deleteUser({
            variables: {
              _id
            },
            refetchQueries: [
              {
                query: GET_ALL_USERS,
                variables: {
                  offset: 0,
                  limit: 100
                },
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
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }


  const { users } = props.data
  return (
    <>
      <Row
        style={{
          height: 'calc(100vh - 60px)'
        }}
      >
        <Button
          shape="circle"
          icon="left"
          onClick={() => props.history.push('/🥢')}
        />
        <Divider />
        <Card
          title="Quản lí user"
          bordered={false}
          extra={
            <Button type="primary" block onClick={() => showModal()}>
              Tạo user
						</Button>
          }
          headStyle={{
            border: 0
          }}
        >
          {users &&
            users
              .filter(item => item.isActive)
              .map((item, i) => <UserList key={i} {...item}
                showModal={showModal}
                onLockAndUnlock={onLockAndUnlock}
                onDelete={onDelete} />
              )}
        </Card>
        <UserModal userId={userId} visible={visible} hideModal={hideModal} />
      </Row>
    </>
  )
}

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
      _id
			username
			fullName
			isActive
			isLocked
		}
	}
`

const USER_LOCK_AND_UNLOCK = gql`
	mutation($_id: String!) {
		lockAndUnlockUser(_id: $_id)
	}
`

const USER_DELETE = gql`
	mutation($_id: String!) {
		deleteUser(_id: $_id)
	}
`

export default HOCQueryMutation([
  {
    query: GET_ALL_USERS,
    options: {
      variables: {
        offset: 0,
        limit: 100
      }
    }
  }, {
    mutation: USER_LOCK_AND_UNLOCK,
    name: 'lockAndUnlockUser',
    option: {}
  }, {
    mutation: USER_DELETE,
    name: 'deleteUser',
    option: {}
  }
])(User)