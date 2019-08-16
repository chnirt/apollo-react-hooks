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
					(noted && `${t('src.pages.order.moreRice')}, ${noted}`) ||
					t('src.pages.order.moreRice')
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
				title={t('src.pages.order.note')}
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={onCancel}
						name="cancelNote"
					>
						{t('src.pages.common.cancel')}
					</Button>,
					<Button key="save" type="primary" onClick={onCreate} name="addNote">
						{t('src.pages.common.add')}
					</Button>
				]}
			>
				<Form colon={false} ref={this.form}>
					<Form.Item>
						{getFieldDecorator('note', {
							rules: [
								{ required: false, message: t('src.pages.order.inputNote') }
							],
							// eslint-disable-next-line react/destructuring-assignment
							initialValue:
								this.state.extraRice !== ''
									? this.state.extraRice
									: this.props.noted
						})(
							<Input.TextArea
								id="orderNoteInput"
								placeholder={t('src.pages.order.inputNote')}
								autosize={{ minRows: 3, maxRows: 7 }}
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('extraRiceOption', {
							rules: [{ required: false }]
						})(
							<Checkbox id="extraRiceCheckbox" onChange={e => this.onChange(e)}>
								{t('src.pages.order.moreRice')}
							</Checkbox>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default NoteForm
