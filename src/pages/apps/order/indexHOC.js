import React, { useState } from 'react'
import { Select, Row, Col, Button, Divider } from 'antd'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'
import gql from 'graphql-tag'
import ListDishes from './listDishes'

const Order = (props) => {
  const [siteId, setSiteId] = useState(localStorage.getItem('currentsite'))
  const [menuId, setMenuId] = useState()

  function handleChange(selectedItems) {
    localStorage.setItem('currentsite', selectedItems)
			if (props.data.menuPublishBySite.isPublished === true && props.data.menuPublishBySite.isActive === true) {
        setSiteId(selectedItems)
        setMenuId(props.data.menuPublishBySite._id)
      }
  }
  
  const currentsite = localStorage.getItem('currentsite')
  const options = JSON.parse(localStorage.getItem('sites')).map(item =>
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
            onChange={e => handleChange(e)}
          >
            {options}
          </Select>
        </Col>
      </Row>	
      <Row>
					<Col span={22} offset={1}>
						<ListDishes siteId={siteId} menuId={menuId} />
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
				siteId: localStorage.getItem('currentsite')
			},
    fetchPolicy: 'network-only'
		})
  }
])(Order)