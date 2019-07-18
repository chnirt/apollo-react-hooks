import React from 'react'
import { Modal, Form, Select } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

const { Option } = Select

function onChange(value) {
	console.log(`selected ${value}`)
}

function onBlur() {
	console.log('blur')
}

function onFocus() {
	console.log('focus')
}

function onSearch(val) {
	console.log('search:', val)
}

const AddUserModal = Form.create({ name: 'add_user' })(
	// eslint-disable-next-line
	class extends React.Component {
		render() {
			const { visible, onCancel, onCreate, form, data } = this.props
			const { getFieldDecorator } = form
			console.log(this.props)
			return (
				<Modal
					visible={visible}
					title="Thêm user"
					okText="Thêm"
					cancelText="Hủy"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form layout="vertical">
						<Form.Item label="Full Name">
							{getFieldDecorator('title', {
								rules: [
									{
										required: true,
										message: 'Please input the title of collection!'
									}
								]
							})(
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="Select a person"
									optionFilterProp="children"
									onChange={onChange}
									onFocus={onFocus}
									onBlur={onBlur}
									onSearch={onSearch}
									filterOption={(input, option) => {
										console.log(input, option)
										return (
											option.props.children
												.toLowerCase()
												.indexOf(input.toLowerCase()) >= 0
										)
									}}
								>
									{data.users.map(user => {
										return (
											<Option key={user._id} value={user.fullNam}>
												{user.fullName}
											</Option>
										)
									})}
								</Select>
							)}
						</Form.Item>
					</Form>
				</Modal>
			)
		}
	}
)

const GET_ALL_USERS = gql`
	query($offset: Int!, $limit: Int!) {
		users(offset: $offset, limit: $limit) {
			_id
			username
			fullName
			isActive
			isLocked
		}
	}
`

export default HOCQueryMutation([
	{
		query: GET_ALL_USERS,
		options: {
			variables: {
				offset: 0,
				limit: 100
			}
		}
	}
])(AddUserModal)
