import React, {useEffect} from "react";
import {Button, Form, Input, message} from "antd";
import IntlMessages from "util/IntlMessages";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import CircularProgress from "components/CircularProgress/index";
import {
  showAuthLoader,
  forgotPassword,
  hideMessage
  // userTwitterSignIn
} from "appRedux/actions/Auth";
const FormItem = Form.Item;

const ForgotPassword = (props) => {
  const dispatch = useDispatch();
  const {loader, alertMessage, showMessageForgotSuccess, showMessageForgotError}= useSelector(({auth}) => auth);
  
  useEffect(() => {
    if (showMessageForgotSuccess || showMessageForgotError) {
      setTimeout(() => {
       dispatch(hideMessage());
      }, 100);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        dispatch(showAuthLoader());
        dispatch(forgotPassword(values));
      }
    });
  };


  const {getFieldDecorator} = props.form;

  return (
    <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg">
              </div>
              <div className="gx-app-logo-wid">
                <h1><IntlMessages id="app.userAuth.forgotPassword"/></h1>
                {/* <p><IntlMessages id="app.userAuth.forgot"/></p> */}
                {/*<p><IntlMessages id="app.userAuth.getAccount"/></p> */}
              </div>
              <div className="gx-app-logo custom-app-logo">
                <center><img src={require("assets/images/motum-logo.png")} alt="logo" height="90" width="90"/></center>
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form onSubmit={handleSubmit} className="gx-signin-form gx-form-row0">

                <FormItem>
                  {getFieldDecorator('dni', {
                    rules: [{
                      required: true, message: 'Please input your DNI',
                    }],
                  })(
                    <Input placeholder="DNI"/>
                  )}
                </FormItem>
                {/* <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{required: true, message: 'Please input your Password'}],
                  })(
                    <Input type="password" placeholder="Password"/>
                  )}
                </FormItem> */}
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="button.Submit"/>
                  </Button>
                  <br />
                  <Link className="gx-login-form-forgot" to="signinUser">Back to SignIn</Link>
                </FormItem>
              </Form>
            </div>

            {loader ?
              <div className="gx-loader-view">
                <CircularProgress/>
              </div> : null}
            {showMessageForgotSuccess ?
              message.success(alertMessage.toString()) : null}
            {showMessageForgotError ?
              message.error(alertMessage.toString()) : null}
          </div>
        </div>
      </div>
  );
}

const WrappedForgotPasswordForm = Form.create()(ForgotPassword);

export default (WrappedForgotPasswordForm);
