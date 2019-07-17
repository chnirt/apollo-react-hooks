import React, { useState, useEffect } from 'react'
import { Button, List, Row } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'

const ListDishes = (props) => {
  const { data } = props
  const [dishes, setDishes] = useState([])
  const [menuId, setMenuId] = useState()
  const [orderNumber, setOrderNumber] = useState()
  const [isPublish, setIsPublish] = useState()


  useEffect(() => {
    if (props.data.menuPublishBySite.isPublished === true && props.data.menuPublishBySite.isActive === true) {
      handleDefaultDishes()
    }
  }, [])
  
  async function handleDefaultDishes() {
    setIsPublish(props.data.menuPublishBySite.isPublished)
    // setDishes([...props.data.menuPublishBySite.dishes])
    const orderNumbers =  (props.ordersByMenu.ordersByMenu)
    ? props.ordersByMenu.ordersByMenu.map(order => order.count)
    : {'0': 1,'1': 2,'2': 3,'3': 4,'4': 5}
    console.log(orderNumbers)

		if (props.data.menuPublishBySite.isPublished === true && props.data.menuPublishBySite.isActive === true) {
      setMenuId(props.data.menuPublishBySite._id)   
      setOrderNumber([...props.data.menuPublishBySite.dishes].map((dish, index) => (
        dish.orderNumber = orderNumbers[index]
      )))
      setDishes([...props.data.menuPublishBySite.dishes])
    }
		if(props.data.error) {
			console.log(props.data.error)
    }
  }
  
	async function createOrder(item) {
		await props.mutate.orderDish({
			variables: {
				input: {
					menuId: props.data.menuPublishBySite._id,
					dishId: item._id,
					count: item.orderNumber
				}
			}
		})
		.then((res) => {
			(res)
			? console.log('success')
			: console.log('something went wrong')
		})
		.catch((error) => {
			console.dir(error)
		})
	}

	async function selectDishHandler(index, item) {
		let theDish = [...dishes]
		await dishes.map(dish =>
			(dish._id === item._id && dish.orderNumber < item.count)
			? theDish[index] = {...theDish[index], orderNumber: item.orderNumber++}
			: theDish[index] = {...theDish[index], orderNumber: item.orderNumber}
		)
    setDishes(theDish)
		await createOrder(item)
	}

	async function unselectDishHandler(index, item) {
		let theDish = [...dishes]
		await dishes.map(dish =>
			(dish._id === item._id && dish.orderNumber > 0)
			? theDish[index] = {...theDish[index], orderNumber: item.orderNumber--}
			: theDish[index] = {...theDish[index], orderNumber: item.orderNumber}
		)

    setDishes(theDish)
		await createOrder(item)
  }
  
  async function handleMinus(item) {
    const index = dishes.map(dish => '-').indexOf(item._id)
    await unselectDishHandler(index, item)
  }

  async function handlePlus(item) {
    const index = dishes.map(dish => '+').indexOf(item._id)
    await selectDishHandler(index, item)
  }

  async function handleConfirmOrder(item) {
    dishes.map(dish =>
      (dish.count !== 0)
      ? props.mutate.confirmOrder({
          variables: {
            menuId: menuId,
            dishId: dish._id
          }
        })
        .then(res => {
          (res)
          ? alert('Xác nhận thành công')
          : console.log('something went wrong')
        })
        .catch((error) => {
          console.dir(error)
        })
      :	null	
    )
  }

  const time = (new Date(Date.now())).getHours()
  const confirmButton = (time >= 12 && time < 14) 
    ? <Button onClick={handleConfirmOrder} style={{ display: 'block', textAlign: 'center' }}>Xác nhận</Button>
    : null
  return (
    <React.Fragment>
      {
        isPublish === true
        ? <>
            <List
              dataSource={data.menuPublishBySite.dishes}
              renderItem={item => (
                <List.Item key={item._id} actions={[<Button className='minus' disabled={data.menuPublishBySite.isLocked} onClick={() => handleMinus(item)}>-</Button>, <Button className='plus' disabled={data.menuPublishBySite.isLocked} onClick={() => handlePlus(item)}>+</Button>]}>
                  <List.Item.Meta
                    title={item.name}
                    description={(`${item.orderNumber}` === 'undefined') ? `${0}/${item.count}` : `${item.orderNumber}/${item.count}`}
                  />
                  <div>{item.orderNumber}</div>
                </List.Item>
              )}
            />
            <Row type='flex' justify='center' align='bottom'>
              {confirmButton}
            </Row>
          </>
        :	<Row type='flex' justify='center' align='middle'>
            <div>Hệ thống đã khóa</div>
          </Row>
      }
    </React.Fragment>
  )
}

const MENU_BY_SELECTED_SITE = gql`
	query menuPublishBySite($siteId: String!) {
		menuPublishBySite(siteId: $siteId) {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
			isPublished
			isActive
			isLocked
			createAt
			updateAt
		}
	}
`

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

const CONFIRM_ORDER = gql`
	mutation confirmOrder($menuId: String!, $dishId: String!) {
		confirmOrder(menuId: $menuId, dishId: $dishId)
	}
`

const ORDERS_BY_MENU 	= gql`
	query ordersByMenu($menuId: String!) {
    ordersByMenu(menuId: $menuId) {
      _id
      userId
      menuId
      dishId
      note
      count
      isConfirmed
      createdAt
      updatedAt
    }
  }
`

export default HOCQueryMutation([
  {
    query: ORDERS_BY_MENU,
    options: (props) => {
      console.log(props.menuId)
      return {
        variables: {
          // menuId: '3f423520-a214-11e9-83ee-5f5fb731ebb3'
          menuId: props.menuId
        },
        skip: !props.menuId,
        fetchPolicy: 'network-only'
      }
    },
    name: 'ordersByMenu'
  },
  {
    query: MENU_BY_SELECTED_SITE,
    options: (props) => ({
      variables: {
        siteId: props.siteId
      },
      fetchPolicy: 'network-only'
    })
  },
  {
    mutation: ORDER_DISH,
    name: 'orderDish',
    options: {}
	},
	{
    mutation: CONFIRM_ORDER,
    name: 'confirmOrder',
    options: {}
  }
])(ListDishes)