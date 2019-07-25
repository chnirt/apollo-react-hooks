import React from 'react'
import { Button, Modal, Input, Form, Checkbox } from 'antd'

class NoteForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			extraRice: ''
		}
		this.form = React.createRef()
	}

	componentDidMount() {
		// eslint-disable-next-line react/destructuring-assignment
		if (this.props.refForm) {
			// eslint-disable-next-line react/destructuring-assignment
			this.props.refForm(this.props.form)
		}
	}

	onChange = e => {
		if (e.target.checked) {
			this.setState({
				extraRice:
					// eslint-disable-next-line react/destructuring-assignment
					(this.props.noted && `Cơm thêm, ${this.props.noted}`) || 'Cơm thêm'
			})
		} else if (!e.target.checked) {
			this.setState({
				extraRice: ''
			})
		}
	}

	render() {
		const { visible, onCancel, onCreate, form } = this.props
		const { getFieldDecorator } = form
		return (
			<Modal
				visible={visible}
				onCancel={onCancel}
				title="Thêm ghi chú"
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={onCancel}
						name="cancelNote"
					>
						Đóng
					</Button>,
					<Button key="save" type="primary" onClick={onCreate} name="addNote">
						Thêm
					</Button>
				]}
			>
				<Form colon={false} ref={this.form}>
					<Form.Item>
						{getFieldDecorator('note', {
							rules: [{ required: false, message: 'Hãy thêm ghi chú!' }],
							// eslint-disable-next-line react/destructuring-assignment
							initialValue:
								// eslint-disable-next-line react/destructuring-assignment
								this.state.extraRice !== ''
									? // eslint-disable-next-line react/destructuring-assignment
									  this.state.extraRice
									: // eslint-disable-next-line react/destructuring-assignment
									  this.props.noted
						})(
							<Input.TextArea
								id="orderNoteInput"
								placeholder="nhập ghi chú"
								autosize={{ minRows: 3, maxRows: 7 }}
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('extraRiceOption', {
							rules: [{ required: false }]
						})(
							<Checkbox id="extraRiceCheckbox" onChange={e => this.onChange(e)}>
								Cơm thêm
							</Checkbox>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default NoteForm
