import React from 'react'
import { Button } from 'antd';
import './index.css'
import { Select, Modal, Form, Input } from 'antd';

const { Option } = Select;

class MenuDetail extends React.Component {
	state = {
		isLock: false
	};

	isLock = () => {
		this.setState({
			isLock: !this.state.isLock
		})
	}

	render() {
		return (
			<React.Fragment>
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

				<label style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>
					Menu
				</label>

				<Select
					style={{marginBottom: 10, display:'block'}}
					defaultValue='jack'
					dropdownRender={menu => {
						return (
							<div className='dish-detail'>
								<Button className='user-name' disabled>Nam</Button>
								<Button className='minus'>-</Button>
								<Button className='plus'>+</Button>
							</div>
						)
					}}
				>
					<Option value="jack">Canh chua x0</Option>
				</Select>

				<Select
					style={{marginBottom: 10, display:'block'}}
					defaultValue='jack'
					dropdownRender={menu => {
						return (
							<div className='dish-detail'>
								<Button className='user-name' disabled>Huy</Button>
								<Button className='minus'>-</Button>
								<Button className='plus'>+</Button>
							</div>
						)
					}}
				>
					<Option value="jack">Canh chua x0</Option>
				</Select>

				<Select
					style={{marginBottom: 10, display:'block'}}
					defaultValue='jack'
					dropdownRender={menu => {
						return (
							<div className='dish-detail'>
								<Button className='user-name' disabled>Chung</Button>
								<Button className='minus'>-</Button>
								<Button className='plus'>+</Button>
							</div>
						)
					}}
				>
					<Option value="jack">Canh chua x0</Option>
				</Select>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button className='publish' onClick={this.isLock}>
						{this.state.isLock ? 'Lock' : 'Un Lock'}
					</Button>
					<Button className='request-delivery' >
						Request 1st delivery
					</Button>
				</div>
			</React.Fragment>
		)
	}
}

export default MenuDetail
