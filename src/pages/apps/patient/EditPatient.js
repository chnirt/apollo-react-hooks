import React, { Component } from 'react'
import { Form, Icon, Input, Row, Col, DatePicker, Radio, Select } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
const { Option } = Select
const dateFormat = 'DD/MM/YYYY'

const GET_REFERRAL = gql`
query getReferralsByRegex($regex: String){
  getReferralsByRegex(regex: $regex){
    _id
    name
  }
}
`
const GET_PATIENT_TYPE = gql`
query getPatientTypeByRegex($regex: String){
  getPatientTypeByRegex(regex: $regex){
    _id
    name
  }
}
`
class EditPatientForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // searchReferral: 'name',
      searchedReferrals: [],
      searchedPatientType: [],
      selectedgetReferralsByRegexs: []
    }
    this.handleSearchReferral = this.handleSearchReferral.bind(this)
    this.handleChangeReferral = this.handleChangeReferral.bind(this)
  }
  
  handleChangeReferral (value) {
    this.setState({
      searchReferral: new HandleOptionFilter(value).getName()
    })
    // console.log(value)
  }

  handleSearchReferral (referralName) {
    referralName = referralName.split(' ')[0]
    if (String(referralName).length > 0) {
      this.props.client.query({
        query: GET_REFERRAL,
        variables: {
          regex: String(referralName)
        }
      })
        .then(res => {
          this.setState({
            searchedReferrals: res.data.getReferralsByRegex
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  handleChangePatientType (value) {
    this.setState({
      searchPatientType: new HandleOptionFilter(value).getName()
    })
    // console.log(value)
  }

  handleSearchPatientType (referralName) {
    referralName = referralName.split(' ')[0]
    if (String(referralName).length > 0) {
      this.props.client.query({
        query: GET_PATIENT_TYPE,
        variables: {
          regex: String(referralName)
        }
      })
        .then(res => {
          this.setState({
            searchedPatientType: res.data.getPatientTypeByRegex
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  // componentDidMount () {
  //   console.log(this.props)
  //   this.props.form.setFieldsValue({
  //     referral: this.props.referral
  //   })
  // }
  render () {
    // const initialReferral = this.props.referral
    console.log('this.props. ', this.props)
    const DOB = moment.unix(this.props.dateOfBirth).format('DD-MM-YYYY')
    const { getFieldDecorator } = this.props.form
    const optionsReferral = this.state.searchedReferrals.map(rName => <Option key={rName.name + ' ' + rName._id}>{rName.name}</Option>)
    const optionsPatientType = this.state.searchedPatientType.map(rName => <Option key={rName.name + ' ' + rName._id}>{rName.name}</Option>)
    // console.log(this.props)
    return (
      <Form>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Code'
            >
              {
                getFieldDecorator('code', {
                  rules: [{
                    required: false, message: 'Code of patient can not be blank'
                  },
                  { pattern: /^[A-Za-z0-9]/, message: 'Code of patient can not have space at start' }],
                  initialValue: this.props.code
                })(
                  <Input type='text' disabled />
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Full name'
            >
              {
                getFieldDecorator('fullname', {
                  rules: [{
                    required: true, message: 'Full name of patient can not be blank'
                  },
                  { pattern: /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ0-9]{1,}(?: [a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ0-9]+){0,10}$/, message: 'Full name of patient can not be blank at start and end' }],
                  initialValue: this.props.fullname
                })(
                  <Input type='text' disabled />
                )
              }
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item
              label='Type of patient'
            >
              {
                getFieldDecorator('patientType', {
                  rules: [{
                    required: false, message: 'Patient type of patient can not be blank'
                  }],
                  initialValue: this.state.searchPatientType ? this.state.searchPatientType : (this.props.patientType ? this.props.patientType.name : '')
                })(
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    onSearch={(referralName) => this.handleSearchPatientType(referralName)}
                    onSelect={(value) => this.handleChangePatientType(value)}
                    placeholder='Select patient type'
                  >
                    {optionsPatientType}
                  </Select>
                )
              }
            </Form.Item>
          </Col> */}
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Designation'
            >
              {
                getFieldDecorator('designation', {
                  rules: [{
                    required: false, message: 'Designation of patient can not be blank'
                  },
                  { pattern: /^[A-Za-z0-9]/, message: 'Designation of patient can not be blank at start' }],
                  initialValue: this.props.designation
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Gender'
            >
              {
                getFieldDecorator('gender', {
                  rules: [{
                    required: true, message: 'Gender of patient must be checked'
                  }],
                  initialValue: this.props.gender
                })(
                  <Radio.Group>
                    <Radio value='Female'>Female</Radio>
                    <Radio value='Male'>Male</Radio>
                    <Radio value='Other'>Other</Radio>
                  </Radio.Group>
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Referral'
            >
              {
                getFieldDecorator('referral', {
                  rules: [{
                    required: false, message: 'Referral of patient can not be blank'
                  }],
                  initialValue: this.state.searchReferral ? this.state.searchReferral : (this.props.referral ? this.props.referral.name : '')
                })(
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    onSearch={(referralName) => this.handleSearchReferral(referralName)}
                    onSelect={(value) => this.handleChangeReferral(value)}
                    placeholder='Select referral name'
                  >
                    {optionsReferral}
                  </Select>
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Contact Number'
            >
              {
                getFieldDecorator('contactNumber', {
                  rules: [{
                    required: false, message: 'Contact number of patient can not be blank'
                  },
                  { pattern: /^0\d{9}$/, message: 'Contact number of patient should have 10 numbers and start with 0' }],
                  initialValue: this.props.contactNumber
                })(
                  <Input type='number' />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Alternate Contact'
            >
              {
                getFieldDecorator('alternateContact', {
                  rules: [{
                    required: false, message: 'Alternate contact of patient can not be blank'
                  },
                  { pattern: /^0\d{9}$/, message: 'Alternate contact of patient should have 10 numbers and start with 0' }],
                  initialValue: this.props.alternateContact
                })(
                  <Input type='text' />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Email'
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!'
                }, {
                  required: false, message: 'Please input your E-mail!'
                }],
                initialValue: this.props.email
                // { pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, message: 'Email of patient should format like abc@mail.com' }]
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Date of birth'
            >
              {
                getFieldDecorator('dateOfBirth', {
                  rules: [{
                    required: true, message: 'Date of birth of patient can not be blank'
                  }],
                  initialValue: moment(DOB, dateFormat)
                })(
                  <DatePicker format={dateFormat} disabled style={{ width: '100%' }} />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Height'
            >
              {
                getFieldDecorator('height', {
                  rules: [{
                    required: false, message: 'Height of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'Height of patient should not be negative number' }],
                  initialValue: this.props.height
                })(
                  <Input type='number' />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Weight'
            >
              {
                getFieldDecorator('weight', {
                  rules: [{
                    required: false, message: 'Weight of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'weight of patient should not be negative number' }],
                  initialValue: this.props.weight
                })(
                  <Input type='number' />
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Pin code'
            >
              {
                getFieldDecorator('pinCode', {
                  rules: [{
                    required: false, message: 'Pin code of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'Pincode of patient must be number only and non-negative whole numbers' }],
                  initialValue: this.props.pinCode
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Insurance Number'
            >
              {
                getFieldDecorator('insuranceNumber', {
                  rules: [{
                    required: false, message: 'Insurance Number of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'Insurance Number of patient must be number only and non-negative whole numbers' }],
                  initialValue: this.props.insuranceNumber
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='City'
            >
              {
                getFieldDecorator('city', {
                  rules: [{
                    required: true, message: 'Patient city can not be blank'
                  },
                  { pattern: /^[A-Za-z0-9]/, message: 'Patient city can not be blank at start' }],
                  initialValue: this.props.city
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Identity Code'
            >
              {
                getFieldDecorator('identityCode', {
                  rules: [{
                    required: false, message: 'Identity Code of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'Identuty Code of patient must be number only and non-negative whole numbers' }],
                  initialValue: this.props.identityCode
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Front of Identity card'
            >
              {
                getFieldDecorator('frontOfIdentityCard', {
                  rules: [{
                    required: false, message: 'Front of Identity card of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'Front of Insurance card of patient must be number only and non-negative whole numbers' }],
                  initialValue: this.props.frontOfIdentityCard
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Back of Identity card'
            >
              {
                getFieldDecorator('backOfIdentityCard', {
                  rules: [{
                    required: false, message: 'Back of Identity card of patient can not be blank'
                  },
                  { pattern: /^\d+$/, message: 'Back of Insurance card of patient must be number only and non-negative whole numbers' }],
                  initialValue: this.props.backOfIdentityCard
                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Diseases'
            >
              {
                getFieldDecorator('diseases', {
                  rules: [{
                    required: false, message: 'Diseases of patient can not be blank'
                  },
                  { pattern: /^[A-Za-z0-9]/, message: 'Diseases of patient can not be blank at start' }],
                  initialValue: this.props.diseases
                })(
                  <Input type='text' />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Other Diseases'
            >
              {
                getFieldDecorator('otherDiseases', {
                  rules: [{
                    required: false, message: 'Other Diseases of patient can not be blank'
                  },
                  { pattern: /^[A-Za-z0-9]/, message: 'Other Diseases of patient can not be blank at start' }],
                  initialValue: this.props.otherDiseases
                })(
                  <Input type='text' />
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Clinical History'
            >
              {
                getFieldDecorator('clinicalHistory', {
                  rules: [{
                    required: false, message: 'Clinical History of patient can not be blank'
                  },
                  { pattern: /^[A-Za-z0-9]/, message: 'Clinical History of patient can not be blank at start' }],
                  initialValue: this.props.clinicalHistory
                })(
                  <Input type='text' />
                )
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

const UPDATE_PATIENT = gql`
mutation updatePatient($patientId: ID!, $patientUpdate: PatientUpdate!){
  updatePatient(patientId: $patientId, patientUpdate: $patientUpdate){
    code
    fullname
    gender
    dateOfBirth
    designation
    contactNumber
  }
}`

class EditPatient extends Component {
  saveFRef (formRef) {
    this.formRef = formRef
  }

  handleSave () {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        return null
      }

      const { code, fullname, designation, patientType, referral, contactNumber, city, alternateContact, email, dateOfBirth, gender, pinCode, insuranceNumber, identityCode, clinicalHistory, frontOfIdentityCard, backOfIdentityCard, height, weight, diseases, otherDiseases } = values
      console.log('referral ', referral)
      this.props.client.mutate({
        mutation: UPDATE_PATIENT,
        variables: {
          patientId: this.props.patientId,
          patientUpdate: {
            code,
            fullname,
            referral: new HandleOptionFilter(referral).getId(),
            patientType: new HandleOptionFilter(patientType).getId(),
            gender,
            dateOfBirth: moment(dateOfBirth).unix(),
            designation,
            contactNumber,
            alternateContact,
            email,
            city,
            pinCode,
            insuranceNumber,
            identityCode,
            frontOfIdentityCard,
            backOfIdentityCard,
            height,
            weight,
            diseases,
            otherDiseases,
            clinicalHistory
          }
        }
      })
        .then((result) => {
          this.props.cancel()
          this.props.refreshGrid()
          return new Notify('success', 'Patient edited successfully')
        })
        .catch((err) => {
          console.dir(err)
          return new Notify('error', '')
        })

      form.resetFields()
    })
  }
  render () {
    const EditPatientF = Form.create({ name: 'editPatientForm' })(EditPatientForm)
    return (
      <Modal
        width={950}
        bodyStyle={{ height: window.innerHeight - 200, overflowY: 'auto' }}
        title={<span><Icon type='form' />&nbsp;&nbsp;Edit Patient</span>}
        centered
        visible={this.props.editVisible}
        onCancel={() => this.props.cancel()}
        // footer={[
        //   <Button key='cancel' type='danger' onClick={() => this.props.cancel()} >Cancel</Button>,
        //   <Button key='save' type='primary' onClick={() => this.handleSave()} ><Icon type='save' />Save</Button>
        // ]}
        onOk={() => this.handleSave()}
        okText='Save'
        cancelText='Cancel'
      >
        <EditPatientF
          isEdit
          wrappedComponentRef={(r) => this.saveFRef(r)}
          client={this.props.client}
          {...this.props.rowData}
        />
      </Modal>
    )
  }
}
export default withApollo(EditPatient)
