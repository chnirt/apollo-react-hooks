import React from 'react'

class NewUserForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      isShowNewUser: false,
      users: [],
      departmentList: []
    }
  }
  render() {
    const NewUserF = Form.create({ name: 'newDoctorForm' })(NewUserForm)
    const { getFieldDecorator } = this.props.form
    const layout = {
      labelCol: { span: 8 }, wrapperCol: { span: 12 }
    }
    const userOptions = this.state.userList.map(d => <Select.Option key={d.username + ' ' + d._id}>{d.username}</Select.Option>)
    const departmentOptions = this.state.departmentList.map((department) => <Option key={department.name + ' ' + department._id}>{department.name}</Option>)
    return (

      <Form {...formItemLayout}>
        <Form.Item label="Name">
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ],
            })(
              <Input placeholder='Nhập tên' />)
          }
        </Form.Item>
        <Form.Item label="Password">
          {
            getFieldDecorator('password', {})(
              <Input placeholder='Nhập password' type='password' />)
          }
        </Form.Item>
        <Form.Item label="Email">
          {
            getFieldDecorator('email', {})(
              <Input placeholder='Nhập email' />)
          }
        </Form.Item>
      </Form>
    )
  }
}

class UserCreateForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }

  saveFormRef = formRef => {
		this.formRef = formRef;
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
  
  render() {
    const NewUserF = Form.create({ name: 'newUserForm' })(NewUserForm)
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        visible={visible}
        title="Thêm user"
        okText="Lưu"
        cancelText="Hủy"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <NewUserF 
          wrappedComponentRef = {(r) => this.saveFormRef(r)}
        />
      </Modal>
    );
  }
}

export default UserCreateForm