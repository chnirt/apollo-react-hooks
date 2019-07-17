import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Divider, List } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const Order = (props) => {
  const [dishes, setDishes] = useState([])
  const [menuId, setMenuId] = useState()
  const [orderNumber, setOrderNumber] = useState()
  const [orderNumbers, setOrderNumbers] = useState()
  const [isPublish, setIsPublish] = useState()
  const [isLocked, setIsLocked] = useState()
  
  useEffect(() => {
    props.client.query({
      query: MENU_BY_SELECTED_SITE,
      variables: {
        siteId: localStorage.getItem('currentsite')
      }	
    })
    .then(res => {
      setIsPublish(res.data.menuPublishBySite.isPublished)
      if (res.data.menuPublishBySite.isPublished === true && res.data.menuPublishBySite.isActive === true) {
        props.client.query({
          query: ORDERS_BY_MENU,
          variables: {
            menuId: res.data.menuPublishBySite._id
          }	
        })
        .then(res => {
          if (res.data.ordersByMenu) {
            // setOrderNumbers(res.data.ordersByMenu.map(order => order.count))
            localStorage.setItem('orderNumbers',[...res.data.ordersByMenu.map(order => order.count)])
          }
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    getOrdersByMenu()
    handleDefaultDishes()
  }, [])

  async function getOrdersByMenu() {
    await props.client.query({
      query: MENU_BY_SELECTED_SITE,
      variables: {
				siteId: localStorage.getItem('currentsite')
			}	
		})
		.then(async res => {
      setMenuId(res.data.menuPublishBySite._id)
			if (res.data.menuPublishBySite.isPublished === true && res.data.menuPublishBySite.isActive === true) {
        await props.client.query({
          query: ORDERS_BY_MENU,
          variables: {
            menuId: res.data.menuPublishBySite._id
          }	
        })
        .then(result => {
          const emptyArray = [].concat(Array(res.data.menuPublishBySite.dishes.length).fill(0))
          if (result.data.ordersByMenu.length > 0) {
            setOrderNumbers(result.data.ordersByMenu.map(order => order.count))
            localStorage.setItem('orderNumbers',[...result.data.ordersByMenu.map(order => order.count)])
          } else {
            localStorage.setItem('orderNumbers',[...emptyArray])
          }
        })
      }  
		})
		.catch((error) => {
			console.log(error)
    })

  }

  async function handleDefaultDishes() {
    await getOrdersByMenu()
    // const orderNumbers = await props.ordersByMenu.ordersByMenu.map(order => order.count)
    const orderNumbers = localStorage.getItem('orderNumbers').split(',')
    await props.client.query({
      query: MENU_BY_SELECTED_SITE,
      variables: {
				siteId: localStorage.getItem('currentsite')
			}	
		})
		.then(res => {
      setIsPublish(res.data.menuPublishBySite.isPublished)
      setIsLocked(res.data.menuPublishBySite.isLocked)
			if (res.data.menuPublishBySite.isPublished === true && res.data.menuPublishBySite.isActive === true) {
        setMenuId(res.data.menuPublishBySite._id)   
        setOrderNumber([...res.data.menuPublishBySite.dishes].map((dish, index) => (
          dish.orderNumber = orderNumbers[index]
        )))
        setDishes([...res.data.menuPublishBySite.dishes])
      }
		})
		.catch((error) => {
			console.log(error)
    })
  }
  
	async function createOrder(item) {
		await props.client.mutate({
			mutation: ORDER_DISH,
			variables: {
				input: {
					menuId: menuId,
					dishId: item._id,
					count: item.orderNumber
				}
			}
		})
		.then((res) => {
      (res.data.orderDish)
      // ? alert('Đặt thành công')
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
    await props.client.query({
      query: ORDERS_BY_USER,
      variables: {
        menuId: menuId
      }	
    })
    .then(async result => {
      await result.data.ordersByUser.map(dish =>
        (dish.count !== 0)
        ? props.client.mutate({
            mutation: CONFIRM_ORDER,
            variables: {
              menuId: menuId,
              dishId: dish.dishId
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
    })
  }
  
  const time = (new Date(Date.now())).getHours()
  const confirmButton = (time >= 12 && time < 16) 
    ? <Button onClick={handleConfirmOrder} style={{ display: 'block', textAlign: 'center' }}>Xác nhận</Button>
    : null
  return (
    <React.Fragment>
      <Button
        shape='circle'
        icon='left'
        onClick={() => props.history.push('/🥢')}
      />
      <Divider />
      <Row>
					<Col span={22} offset={1}>
            {
              isPublish === true
              ? <>
                  <List
                    dataSource={dishes}
                    renderItem={item => (
                    <List.Item key={item._id} actions={[<Button className='minus' disabled={isLocked} onClick={() => handleMinus(item)}>-</Button>, <Button className='plus' disabled={isLocked} onClick={() => handlePlus(item)}>+</Button>]}>
                        <List.Item.Meta
                          title={item.name}
                          description={(`${item.orderNumber}` === 'undefined') ? `${0}/${item.count}` : `${item.orderNumber}/${item.count}`}
                        />
                        {/* <div>{(`${item.orderNumber}` === 'undefined') ? `${0}` : `${item.orderNumber}`}</div> */}
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
					</Col>
				</Row>	
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

const ORDERS_BY_USER = gql`
  query ordersByUser($menuId: String!) {
    ordersByUser(menuId: $menuId) {
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

export default withApollo(Order)