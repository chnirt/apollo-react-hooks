import React from 'react'
import { Button } from 'antd';
import { Select, Modal, Form, Input, Checkbox } from 'antd';
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../../components/shared/hocQueryAndMutation';

class Usermodel extends React.Component {
  state = {
    sites: [],
    permissions: []
  }

  componentDidMount() {
    this.props.client.query({
      query: GET_ALL_SITES
    })
      .then(({ data }) => {
        this.setState({
          sites: data.sites
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
    this.props.client.query({
      query: GET_ALL_PERMISSIONS
    })
      .then(({ data }) => {
        this.setState({
          permissions: data.permissions
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const options = this.state.permissions.map(permission => {
      return (
        { label: permission.code, value: permission._id }
      )
    }
    )
    return (
      <Modal
        visible={visible}
        title="Thêm user"
        okText="Lưu"
        cancelText="Hủy"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form {...formItemLayout}>
          <Form.Item>
            {
              getFieldDecorator('fullName', {
                // rules: [
                // 	{
                // 		required: true,
                // 		message: 'Please input your name!',
                // 	},
                // ],
              })(
                <Input placeholder='Nhập tên' />)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('username', {})(
                <Input placeholder='Nhập username' type='text' />)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('password', {})(
                <Input placeholder='Nhập password' type='password' />)
            }
          </Form.Item>
          {
            this.state.sites && this.state.sites.map(site => {
              return (
                <Form.Item>
                  {
                    getFieldDecorator(site.name, {})(
                      <Select
                        placeholder={site.name}
                        dropdownRender={menu => {
                          return (
                            <div>
                              <Checkbox.Group className='cb' options={options} onChange={onChange} />
                            </div>
                          )
                        }}
                      >
                      </Select>
                    )
                  }
                </Form.Item>
              )
            })
          }
        </Form>
      </Modal>
    );
  }
}

export default HOCQueryMutation({

})

UserCreateForm = Form.create({ name: 'user_create' })