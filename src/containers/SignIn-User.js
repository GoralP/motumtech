import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { baseURL, branchName } from "../util/config";
import {
  hideMessage,
  showAuthLoader,
  // userFacebookSignIn,
  // userGithubSignIn,
  // userGoogleSignIn,
  // userSignIn,
  userSignInWithDNI,
  // userTwitterSignIn
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";
import { webURL } from "util/config";
import { auth } from "firebase";

const FormItem = Form.Item;

const SignInWithDNI = (props) => {
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessageLogin, authUser } = useSelector(
    ({ auth }) => auth
  );
  const history = useHistory();

  console.log("loader", loader);

  useEffect(() => {
    if (showMessageLogin) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      let licenseId = "";
      let userdata = localStorage.getItem(branchName + "_data");
      if (userdata !== "" && userdata !== null) {
        let userData = JSON.parse(userdata);
        if (
          userData !== "" &&
          userData !== null &&
          userData["id"] !== undefined &&
          userData["IdentityId"] !== undefined
        ) {
          licenseId = userData["id"];
        }
      }
      let userAuth = JSON.parse(localStorage.getItem("userAuth"));
      if (userAuth != "" && userAuth != null) {
        let authToken = window.btoa(
          userAuth.Username + "-" + licenseId + ":" + userAuth.Password
        );
        localStorage.setItem("setAuthToken", authToken);

        console.log("submit token--->", authToken);
      }

      history.push("/" + webURL + "main/home/crypto");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        localStorage.setItem("userAuth", JSON.stringify(values));
        dispatch(showAuthLoader());
        dispatch(userSignInWithDNI(values));
        // console.log(values);
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg"></div>
            <div className="gx-app-logo-wid">
              <h1>
                <IntlMessages id="app.userAuth.signIn" />
              </h1>
              <p>
                <IntlMessages id="app.userAuth.bySigning" />
              </p>
              <p>
                <IntlMessages id="app.userAuth.getAccount" />
              </p>
            </div>
            <div className="gx-app-logo custom-app-logo">
              <center>
                <img
                  src={require("assets/images/motum-logo.png")}
                  alt="logo"
                  height="90"
                  width="90"
                />
              </center>
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              onSubmit={handleSubmit}
              className="gx-signin-form gx-form-row0"
            >
              <FormItem>
                {getFieldDecorator("Username", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your DNI",
                    },
                  ],
                })(<Input placeholder="DNI" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator("Password", {
                  rules: [
                    { required: true, message: "Please input your Password" },
                  ],
                })(<Input type="password" placeholder="Password" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  SIGN IN
                </Button>
                <br />
                <Link className="gx-login-form-forgot" to="forgot-password">
                  Forgot password?
                </Link>
              </FormItem>
            </Form>
          </div>

          {loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
          {showMessageLogin ? message.error(alertMessage.toString()) : null}
        </div>
      </div>
      {/* <button onClick={signIn} className="button">
        <img src="icons/google.svg" alt="google login" className="icon"></img>
        <span className="buttonText">Sign in with Google</span>
      </button> */}
    </div>
  );
};

const WrappedNormalLoginDNIForm = Form.create()(SignInWithDNI);

export default WrappedNormalLoginDNIForm;
