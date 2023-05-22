import React, {Component} from "react";
import {Card, Button, Col, Row, Input, Form} from "antd";
import {connect} from "react-redux";
import IntlMessages from "util/IntlMessages";
import {branchName} from './../../../../util/config';
import {changePassword} from "../../../../appRedux/actions/Auth";

let identityId = '';
const FormItem = Form.Item;

let userdata = localStorage.getItem(branchName+'_data');
    if (userdata !== '' && userdata !== null)
    {
        let userData = JSON.parse(userdata);
        if((userData !== '' && userData !== null) && userData['IdentityId'] !== undefined)
        {
            identityId = userData['IdentityId'];
        }    
    }


class ChangePassword extends Component {

  constructor() {
    super();
    this.state = {
      currentPassword : '',
      password : '',
      confirmPassword : '',
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.changePassword({identityId: identityId, currentPassword: this.state.currentPassword, newPassword: this.state.confirmPassword});
        // dispatch(showAuthLoader());
        // dispatch(userSignInWithDNI(values));
      }
    });
  };
  checkPassword = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue('newPassword')) {
      callback("The passwords don't match");
    } else {
      callback();
    }
  };
  render() {

    // console.log('asplform',this.props);
    // console.log('asplform',this.props.form);
    const {getFieldDecorator} = this.props.form;

    const formItemLayoutDrag = {
      labelCol: {
        xs: {span: 24, offset: 24},
      },
      wrapperCol: {
        xs: {span: 24, offset: 24},
        sm: {span: 24, offset: 24},
      },
    };
    
    return (
      <Card title={<IntlMessages id="confirmPassword.title"/>} extra={<div className="card-extra-form">
        </div>}>

        <Row>
          <Form  onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0" {...formItemLayoutDrag}>
            <div className="gx-form-group">
              <Row>
                <Col lg={12} xs={24}>
                  {/* <lable> <IntlMessages id="confirmPassword.currentPassword"/> </lable> */}
                  <FormItem label={<IntlMessages id="confirmPassword.currentPassword"/>}>
                    {getFieldDecorator('currentPassword', {
                      initialValue:this.state.currentPassword,
                      rules: [{
                        required: true, 
                        message: <IntlMessages id="required.confirmPassword.currentPassword"/>,
                        whitespace: true
                      }],
                    })(
                      <Input
                      type="password"
                      onChange={(event) => this.setState({currentPassword: event.target.value})}
                      margin="none"/>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} xs={24}>
                  {/* <lable> <IntlMessages id="confirmPassword.newPassword"/> </lable> */}
                  <FormItem label={<IntlMessages id="confirmPassword.newPassword"/>}>
                    {getFieldDecorator('newPassword', {
                      initialValue:this.state.password,
                      rules: [{
                        required: true, 
                        message: <IntlMessages id="required.confirmPassword.newPassword"/>,
                        whitespace: true
                      }],
                    })(
                      <Input
                      type="password"
                      onChange={(event) => this.setState({password: event.target.value})}
                      margin="none"/>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} xs={24}>
                  {/* <lable> <IntlMessages id="confirmPassword.confirmPassword"/> </lable> */}
                  <FormItem label={<IntlMessages id="confirmPassword.confirmPassword"/>}>
                    {getFieldDecorator('confirmPassword', {
                      initialValue:this.state.confirmPassword,
                      rules: [{
                        required: true, 
                        message: <IntlMessages id="required.confirmPassword.confirmPassword"/>,
                        whitespace: true
                      },
                      { validator: this.checkPassword }
                      ],
                    })(
                      <Input
                      type="password"
                      onChange={(event) => this.setState({confirmPassword: event.target.value})}
                      margin="none"/>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem {...formItemLayoutDrag}>
                    <Button type="primary" className="gx-mb-0" htmlType="submit"><IntlMessages id="globalButton.submit"/></Button>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Form>
        </Row>
      </Card>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  changePassword
}

const viewAdministrativeReportForm = Form.create()(ChangePassword);

const mapStateToProps =  state => {
return { 
  }; 
};

// export default Inspection;
export default connect(mapStateToProps,mapDispatchToProps)(viewAdministrativeReportForm);
