import React, {useEffect} from "react";
import {Button, Checkbox, Form, Input, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";

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
    if (authUser !== null) {
      history.push('/');
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
                <img src={"https://via.placeholder.com/272x395"} alt='Neature'/>
              </div>
              <div className="gx-app-logo-wid">
                <h1><IntlMessages id="app.userAuth.signIn"/></h1>
                <p><IntlMessages id="app.userAuth.bySigning"/></p>
              </div>
              <div className="gx-app-logo">
                <img alt="example" src={require("assets/images/logo-motum.png")}/>
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form onSubmit={handleSubmit} className="gx-signin-form gx-form-row0">

                <FormItem>
                  {getFieldDecorator('email', {
                    initialValue: "demo@example.com",
                    rules: [{
                      required: true, type: 'email', message: 'The input is not valid E-mail!',
                    }],
                  })(
                    <Input placeholder="Email"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    initialValue: "demo#123",
                    rules: [{required: true, message: 'Please input your Password!'}],
                  })(
                    <Input type="password" placeholder="Password"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox><IntlMessages id="appModule.iAccept"/></Checkbox>
                  )}
                  <span className="gx-signup-form-forgot gx-link"><IntlMessages
                    id="appModule.termAndCondition"/></span>
                </FormItem>
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signIn"/>
                  </Button>
                  <Link className="gx-login-form-forgot" to="forgot-password">Forgot password?</Link>
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
