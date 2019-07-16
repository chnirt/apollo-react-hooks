import React, { useState } from 'react'
import { Select, Row, Col, Button, Divider } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'
import ListDishes from './listDishes'

const Order = (props) => {
  const [dishes, setDishes] = useState([])
  // const [menuId, setMenuId] = useState()

  async function handleChange(selectedItems) {
    await localStorage.setItem('currentsite', selectedItems)
    setDishes([...dishes, ...props.data.menuPublishBySite.dishes])
    if (props.data.menuPublishBySite.isPublished === true && props.data.menuPublishBySite.isActive) {
      await localStorage.setItem('currentsite', selectedItems)
      await localStorage.setItem('menuId', props.data.menuPublishBySite._id)
      // setMenuId(props.data.menuPublishBySite._id)
    }
    if(props.data.error) {
      console.log(props.data.error)
    }
  }
  function handleClick() {
    return setDishes([])
  }
  const currentsite = window.localStorage.getItem('currentsite')
  const options = JSON.parse(window.localStorage.getItem('sites')).map(item =>
    <Select.Option value={item._id} key={item._id}>
        {item.name}
    </Select.Option>
  )
  return (
    <React.Fragment>
      <Button
        shape='circle'
        icon='left'
        onClick={() => props.history.push('/🥢')}
      />
      <Divider />
      <Row style={{ marginTop: 20 }}>
        <Col span={22} offset={1}>
          <Select
            style={{ width: '100%', marginBottom: 20 }}
            placeholder='Chọn khu vực'
            defaultValue={currentsite}
            onChange={handleClick}
            onSelect={e => handleChange(e)}
          >
            {options}
          </Select>
        </Col>
      </Row>	
      <Row>
					<Col span={22} offset={1}>
						<ListDishes siteId={window.localStorage.getItem('currentsite')} menuId={window.localStorage.getItem('menuId')} />
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

export default HOCQueryMutation([
	{
    query: MENU_BY_SELECTED_SITE,
    options: props => ({
			variables: {
				siteId: window.localStorage.getItem('currentsite')
			}
		})
  }
])(Order)