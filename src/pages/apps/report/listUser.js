import React from 'react'
import './index.css'
import { Select, Divider, Icon, Collapse, Button } from 'antd'
import gql from 'graphql-tag'

import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

class listUser extends React.Component {
  state = {
    count: this.props.count
  }

  handlePlus = () => {
    if(this.state.count < this.props.dishCount){
      this.setState(
        (prevState) => {
          return ({
            count: prevState.count + 1
          })
        }
      )
      this.props.mutate
        .orderDish({
          mutation: ORDER_DISH,
          variables: {
            input: {
              menuId: this.props.menuId,
              dishId: this.props.dishId,
              count: this.state.count + 1
            }
          }
        })
        .then(res => {
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  handleMinus = (count) => {
    if (this.state.count > 0) {
      this.setState(
        (prevState) => {
          return ({
            count: prevState.count - 1
          })
        }
      )
      this.props.mutate
        .orderDish({
          mutation: ORDER_DISH,
          variables: {
            input: {
              menuId: this.props.menuId,
              dishId: this.props.dishId,
              count: this.state.count - 1
            }
          }
        })
        .then(res => {
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  render() {
    console.log(this.props)

    return (
      <>
        {
          this.props.orderByMenu.dishId === this.props.dishId ?
            (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {this.props.getUserName.user.fullName + ' ' + this.state.count + '/' + this.props.dishCount}
                <div>
                  <Button style={{marginRight: 10}} onClick={() => this.handleMinus(this.state.count)}>
                    <Icon type="minus" />
                  </Button>
                  <Button onClick={() => this.handlePlus(this.state.count)}>
                    <Icon type="plus" />
                  </Button>
                </div>
              </div>
            )
            : null
        }
      </>
    )
  }
}

const GET_USER_NAME = gql`
	query user($_id: String!){
		user(_id: $_id){
			username
			fullName
		}
	}
`

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

export default HOCQueryMutation([
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
    mutation: ORDER_DISH,
    name: 'orderDish',
    option: {}
  }
])(listUser)
