import React from 'react'
import { Button } from 'antd';
import './index.css'
import { Select, Modal, Form, Input } from 'antd';

import { Link, withRouter } from 'react-router-dom'

const { Option } = Select;

const MenuCreateForm = Form.create({ name: 'menu_create' })(
	// eslint-disable-next-line
	class extends React.Component {
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
					visible={visible}
					title="Thêm menu"
					okText="Lưu"
					cancelText="Hủy"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form>
						<Form.Item>
							{
								getFieldDecorator('menu', {})(
									<Input placeholder='Nhập tên menu' />)
							}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	},
);


class MenuManage extends React.Component {
	state = {
		visible: false,
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

				<label style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>Danh sách Menu</label>

				<div className='wrap-menu'>
					<Button className='menu'>
						<Link to='/🥢/menudetail'>
							Menu Deli 2/4/6
					</Link>
					</Button>
					<Button className='menu'>
						<Link to='/🥢/menudetail'>
							Menu Deli 3/5/7
						</Link>
					</Button>
					<Button className='menu'>
						<Link to='/🥢/menudetail'>
							Menu Cơm nhà
						</Link>
					</Button>
				</div>

				<Button className='add-menu' onClick={this.showModal}>
					Thêm menu
				</Button>
				<MenuCreateForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					onCreate={this.handleCreate}
				/>
			</React.Fragment>
		)
	}
}

export default withRouter(MenuManage)
