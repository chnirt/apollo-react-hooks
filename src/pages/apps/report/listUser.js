import React from 'react'
import './index.css'
import { Select, Divider, Icon, Collapse } from 'antd'
import gql from 'graphql-tag'

import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

class listUser extends React.Component {
  state = {

  }
  render() {
    return (
      <div>
        {
          this.props.orderByMenu.dishId === this.props.dishId ?
          (
            <div>
              {this.props.getUserName.user.fullName + ' x' + this.props.orderByMenu.count}
            </div>
          )
          : null
        }
      </div>
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
  // {
  //   query: ORDER_BY_MENU,
  //   name: 'getOrderByMenu',
  //   options: props => {
  //     return ({
  //       variables: {
  //         menuId: props.menuId
  //       }
  //     })
  //   }
  // },
  {
    query: GET_USER_NAME,
    name: 'getUserName',
    options: props => {
      return ({
        variables: {
          _id: props.userId
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
])(listUser)
