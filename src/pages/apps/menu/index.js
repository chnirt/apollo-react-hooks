import React, { useState } from 'react'
import { Row } from 'antd'
import MenuList from './menuList'

function Menu (props) {
  const [siteId] = useState(window.localStorage.getItem('currentsite'))

  return (
    <div className='menu'>
      <h1 style={{ margin: '16px 24px', color: '#fff' }}>Quản lý menu</h1>
      <Row className='menu-list'>
        <MenuList {...props} siteId={siteId} />
      </Row>
    </div>
  )
}

export default Menu
