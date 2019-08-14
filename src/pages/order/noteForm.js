/* eslint-disable react/destructuring-assignment */
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
		if (this.props.refForm) {
			this.props.refForm(this.props.form)
		}
	}

	onChange = e => {
		const { noted, t } = this.props
		if (e.target.checked) {
			this.setState({
				extraRice:
					(noted && `${t('order.More rice')}, ${noted}`) || t('order.More rice')
			})
		} else if (!e.target.checked) {
			this.setState({
				extraRice: ''
			})
		}
	}

	render() {
		const { visible, onCancel, onCreate, form, t } = this.props
		const { getFieldDecorator } = form
		return (
			<Modal
				visible={visible}
				onCancel={onCancel}
				title={t('order.Note')}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={onCancel}
						name="cancelNote"
					>
						{t('common.Cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={onCreate} name="addNote">
						{t('common.Add')}
					</Button>
				]}
			>
				<Form colon={false} ref={this.form}>
					<Form.Item>
						{getFieldDecorator('note', {
							rules: [{ required: false, message: t('order.Input note') }],
							// eslint-disable-next-line react/destructuring-assignment
							initialValue:
								this.state.extraRice !== ''
									? this.state.extraRice
									: this.props.noted
						})(
							<Input.TextArea
								id="orderNoteInput"
								placeholder={t('order.Input note')}
								autosize={{ minRows: 3, maxRows: 7 }}
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('extraRiceOption', {
							rules: [{ required: false }]
						})(
							<Checkbox id="extraRiceCheckbox" onChange={e => this.onChange(e)}>
								{t('order.More rice')}
							</Checkbox>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default NoteForm
