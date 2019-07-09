import React from 'react'
import { Select, Row } from 'antd'
import MenuList from './MenuList'
import './index.less'

const { Option } = Select

export default function Menu() {
	return (
		<div className='menu'>
			<Select
					showSearch
					style={{ width: '100%', marginBottom: 20 }}
					// placeholder="Chọn Site"
					defaultValue='Chọn Site'
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
					<Option value="hh">Hoa Hồng</Option>
					<Option value="svh">Sư Vạn Hạnh</Option>
					<Option value="nt">Nha Trang</Option>
				</Select>
				<Row className='menu-list'>
					<MenuList />
					<MenuList />
					<MenuList />
					<MenuList />
					<MenuList />
					<MenuList />
					<MenuList />
					<MenuList />
				</Row>
		</div>
	)
}