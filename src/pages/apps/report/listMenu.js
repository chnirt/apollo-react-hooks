import React from 'react'
import './index.css'
import { Select, Divider, Icon, Collapse, Button, Tooltip } from 'antd'
import gql from 'graphql-tag'
// import './Lobster-Regular-normal'
import ListUser from './listUser'
import AddUserModal from './AddUserModal'

import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

const { Panel } = Collapse

class listMenu extends React.Component {
  state = {
    userId: '',
    visible: false
  }

  showModal = (e) => {
    e.stopPropagation()
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {

    return (
      <Collapse>
        <Panel header={this.props.menu.name} key='1' disabled={this.props.menu.isLocked ? true : false} >
          <Collapse defaultActiveKey="1">
            {this.props.menu.dishes &&
              this.props.menu.dishes.map((dish, i) => {
                // console.log(dish)
                return (
                  <Panel header={dish.name + ' x' + dish.count} key={i + 1} extra={(
                    <>
                      <Button
                        icon="plus"
                        onClick={e => this.showModal(e)} >
                        Thêm user
                        </Button>
                      <AddUserModal
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                      />
                    </>
                  )}
                    className='add-user-button'
                  >
                    {
                      this.props.getOrderByMenu.ordersByMenu && this.props.getOrderByMenu.ordersByMenu.map((orderByMenu, i) => {
                        return (
                          <ListUser dishCount={dish.count} menuId={this.props.menuId} orderByMenu={orderByMenu} key={i} userId={orderByMenu.userId} count={orderByMenu.count} dishId={dish._id} />
                        )
                      })
                    }
                  </Panel>
                )
              })}
          </Collapse>
        </Panel>
      </Collapse>
    )
  }
}

const GET_MENU_BY_SITE = gql`
	query menusBySite($siteId: String!) {
		menusBySite(siteId: $siteId) {
			_id
			name
			isActive
			isLocked
			dishes {
				name
				count
				_id
			}
		}
	}
`

const LOCK_AND_UNLOCK_MENU = gql`
	mutation lockAndUnlockMenu($id: String!) {
		lockAndUnlockMenu(id: $id)
	}
`

const CLOSE_MENU = gql`
	mutation closeMenu($id: String!) {
		closeMenu(id: $id)
	}
`

const ORDER_BY_MENU = gql`
	query ordersByMenu($menuId: String!){
		ordersByMenu(menuId: $menuId){
			userId
			dishId
			count
		}
	}
`

const GET_USER_NAME = gql`
	query user($_id: String!){
		user(_id: $_id){
			username
			fullName
		}
	}
`

export default HOCQueryMutation([
  {
    query: GET_MENU_BY_SITE,
    name: 'getMenuBySite',
    options: props => {
      return ({
        variables: {
          siteId: localStorage.getItem('currentsite')
        }
      })
    }
  },
  {
    query: ORDER_BY_MENU,
    name: 'getOrderByMenu',
    options: props => {
      return ({
        variables: {
          menuId: props.menuId
        }
      })
    }
  },
  {
    query: GET_USER_NAME,
    name: 'getUserName',
    options: props => {
      return ({
        variables: {
          _id: "40eb5c20-9e41-11e9-8ded-f5462f3a1447"
        }
      })
    }
  },
  {
    mutation: LOCK_AND_UNLOCK_MENU,
    name: 'lockAndUnLockMenu',
    option: {}
  },
  {
    mutation: CLOSE_MENU,
    name: 'closeMenu',
    option: {}
  }
])(listMenu)
