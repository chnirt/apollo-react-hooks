import React from 'react'
import { Button, Modal, Input, Form, Checkbox } from 'antd'
import { withTranslation } from 'react-i18next'

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
		const { visible, onCancel, onCreate, form, t } = this.props
		const { getFieldDecorator } = form
		return (
			<Modal
				visible={visible}
				onCancel={onCancel}
				title={t('Note')}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={onCancel}
						name="cancelNote"
					>
						{t('Cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={onCreate} name="addNote">
						{t('Add')}
					</Button>
				]}
			>
				<Form colon={false} ref={this.form}>
					<Form.Item>
						{getFieldDecorator('note', {
							rules: [{ required: false, message: t('Input note') }],
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
								placeholder={t('Input note')}
								autosize={{ minRows: 3, maxRows: 7 }}
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('extraRiceOption', {
							rules: [{ required: false }]
						})(
							<Checkbox id="extraRiceCheckbox" onChange={e => this.onChange(e)}>
								{t('More rice')}
							</Checkbox>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default withTranslation('translations')(NoteForm)
