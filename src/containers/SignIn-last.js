import React, {useEffect} from "react";
import {Button, Form, Input, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {
  hideMessage,
  showAuthLoader,
  // userFacebookSignIn,
  // userGithubSignIn,
  // userGoogleSignIn,
  userSignIn,
  // userTwitterSignIn
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";

const FormItem = Form.Item;

const SignIn =(props)=> {

  const dispatch = useDispatch();
  const {loader, alertMessage, showMessage,authUser}= useSelector(({auth}) => auth);
  const history = useHistory();

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
       dispatch(hideMessage());
      }, 100);
    }
    console.log("authUser123 =>", authUser);
    if (authUser !== null) {
      history.push('/main/home/crypto');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        dispatch(showAuthLoader());
        dispatch(userSignIn(values));
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
              <h1><IntlMessages id="app.userAuth.signIn"/></h1>
              <p><IntlMessages id="app.userAuth.bySigning"/></p>
              <p><IntlMessages id="app.userAuth.getAccount"/></p>
            </div>
            <div className="gx-app-logo custom-app-logo">
              <center><img src={require("assets/images/motum-logo.png")} alt="logo" height="90" width="90"/></center>
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form onSubmit={handleSubmit} className="gx-signin-form gx-form-row0">

              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{
                    required: true, message: 'Please input your License Key!',
                  }],
                })(
                  <Input placeholder="License Key"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: 'Please input your License Code!'}],
                })(
                  <Input type="password" placeholder="License Code"/>
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  SIGN IN
                </Button>
              </FormItem>
            </Form>
          </div>

          {loader ?
            <div className="gx-loader-view">
              <CircularProgress/>
            </div> : null}
          {showMessage ?
            message.error(alertMessage.toString()) : null}
        </div>
      </div>
    </div>
  );
};

const WrappedNormalLoginForm = Form.create()(SignIn);

export default WrappedNormalLoginForm;
