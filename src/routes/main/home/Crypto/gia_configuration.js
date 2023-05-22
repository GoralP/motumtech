import React, { useEffect } from "react";
import IntlMessages from "util/IntlMessages";
import { Card, Button, Form, Input, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addGiaData,
  getGiaDataByLicenseId,
} from "./../../../../appRedux/actions/RolePermissionActions";
const FormItem = Form.Item;

const GiaConfiguration = (props) => {
  const dispatch = useDispatch();
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, data) => {
      if (!err) {
        dispatch(addGiaData(data));
      }
    });
  };

  const { loading, getGiaData } = useSelector((state) => ({
    loading: state.rolePermissionReducers.getGiaConfig.loading,
    getGiaData: state.rolePermissionReducers.getGiaConfig.getGiaData,
  }));

  console.log("data----->", getGiaData !== null && getGiaData.UserName);

  useEffect(() => {
    dispatch(getGiaDataByLicenseId());
  }, [dispatch]);

  return (
    <Card
      //   className="custo_head_wrap user-card-head"
      title={<IntlMessages id="sidebar.giaconfig" />}
    >
      <Form onSubmit={handleSubmit}>
        <Col lg={24} xs={24}>
          <FormItem
            {...formItemLayout}
            label={<IntlMessages id="settings.username" />}
          >
            {getFieldDecorator("userName", {
              initialValue:
                getGiaData !== null && getGiaData.UserName
                  ? getGiaData !== null && getGiaData.UserName
                  : "",
              rules: [
                {
                  required: true,
                  message: "Please input your User Name!",
                },
              ],
            })(<Input placeholder="User Name" />)}
          </FormItem>
        </Col>

        <Col lg={24} xs={24}>
          <FormItem
            {...formItemLayout}
            label={<IntlMessages id="settings.password" />}
          >
            {getFieldDecorator("password", {
              initialValue:
                getGiaData !== null && getGiaData.Password
                  ? getGiaData !== null && getGiaData.Password
                  : "",
              rules: [
                {
                  required: true,

                  message: "Please input password!",
                },
              ],
            })(<Input placeholder="Password" type="password" />)}
          </FormItem>
        </Col>
        <Col lg={24} xs={24}>
          <FormItem
            {...formItemLayout}
            label={<IntlMessages id="settings.entitycode" />}
          >
            {getFieldDecorator("entityCode", {
              initialValue:
                getGiaData !== null && getGiaData.EntityCode
                  ? getGiaData !== null && getGiaData.EntityCode
                  : "",
              rules: [
                {
                  required: true,

                  message: "Please input entity code!",
                },
              ],
            })(<Input placeholder="Entity Code" />)}
          </FormItem>
        </Col>
        <Col lg={24} xs={24}>
          <FormItem
            {...formItemLayout}
            label={<IntlMessages id="settings.datamastertoken" />}
          >
            {getFieldDecorator("dataMasterToken", {
              initialValue:
                getGiaData !== null && getGiaData.DataMasterToken
                  ? getGiaData !== null && getGiaData.DataMasterToken
                  : "",
              rules: [
                {
                  required: true,
                  message: "Please input Data Master Token!",
                },
              ],
            })(<Input placeholder="Data Master Token" />)}
          </FormItem>
        </Col>
        <Col lg={24} xs={24}>
          <FormItem {...formItemLayout}>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="button.Submit" />
            </Button>
          </FormItem>
        </Col>
      </Form>
    </Card>
  );
};

const WrappedSimpleForm = Form.create()(GiaConfiguration);

export default WrappedSimpleForm;
