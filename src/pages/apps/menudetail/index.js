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

const DishCreateForm = Form.create({ name: 'dish_create' })(
	// eslint-disable-next-line
	class extends React.Component {
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
					visible={visible}
					title="Thêm món"
					okText="Lưu"
					cancelText="Hủy"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form>
						<Form.Item label=" ">
							{
								getFieldDecorator('dish', {})(
									<Input placeholder='Nhập tên món' />)
							}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	},
);


class MenuDetail extends React.Component {
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

				<label style={{ textAlign: 'center', display: 'block', marginBottom: 20 }}>
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

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button className='add-dish' onClick={this.showModal}>
						Thêm món
					</Button>
					<Button className='publish' onClick={this.isPublish}>
						{this.state.isPublish ? 'Công khai' : 'Hủy công khai'}
					</Button>
				</div>

				<DishCreateForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					onCreate={this.handleCreate}
				/>
			</React.Fragment>
		)
	}
}

export default MenuDetail
