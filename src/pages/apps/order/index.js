import React from 'react'
import { Button } from 'antd';
import './index.css'
import { Select, Modal, Form, Input } from 'antd';

const { Option } = Select;

function onChange(value) {
}

function onBlur() {
}

function onFocus() {
}

function onSearch(val) {
}

class Order extends React.Component {
	state = {
		visible: false,
		isPublish: false
	};

	showModal = () => {
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

	isPublish = () => {
		this.setState({
			isPublish: !this.state.isPublish
		})
	}

	render() {
		return (
			<React.Fragment>
				<Select
					showSearch
					className='select-site'
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

				<label className='title'>
					Danh sách món
				</label>

				<div className='dish-detail'>
					<Button className='dish-name' disabled>Canh chua cá lóc x0</Button>
					<Button className='minus'>-</Button>
					<Button className='plus'>+</Button>
				</div>

				<div className='dish-detail'>
					<Button className='dish-name' disabled>Tôm hoàng kim x5</Button>
					<Button className='minus'>-</Button>
					<Button className='plus'>+</Button>
				</div>

				<div className='dish-detail'>
					<Button className='dish-name' disabled>Bánh canh cua x2</Button>
					<Button className='minus'>-</Button>
					<Button className='plus'>+</Button>
				</div>

			</React.Fragment>
		)
	}
}

export default Order
