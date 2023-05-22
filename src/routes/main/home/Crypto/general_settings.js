import React, { useEffect } from "react";
import IntlMessages from "util/IntlMessages";
import { Card, Button, Form, Input, Col, Spin, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { branchName } from "../../../../util/config";
import {
  getGeneralSettings,
  getDeviceName,
  creategenerealSetting,
} from "./../../../../appRedux/actions/GeneralSettingsAction";
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const GeneralSettings = (props) => {
  let licenseId = "";
  // this.props.getMoreAppFormData({
  //   ApiKey: this.state.moreAPIKey,
  //   ClientId: this.state.moreClientID,
  // });
  let deviceId = "";

  let userdata = localStorage.getItem(branchName + "_data");
  // langName = localStorage.getItem(branchName + "_language");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
      deviceId = userData["deviceId"];
    }
  }
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
        dispatch(creategenerealSetting(data));
        console.log("generalsetting----->", data);
      }
    });
  };

  const { loading, generalData, deviceData } = useSelector((state) => ({
    loading: state.generalSettingsReducers.getGeneralData.loading,
    generalData: state.generalSettingsReducers.getGeneralData.generalData,
    deviceData: state.generalSettingsReducers.getDevice.deviceData,
  }));

  useEffect(() => {
    dispatch(getGeneralSettings());
  }, [dispatch]);

  return (
    <Card
      //   className="custo_head_wrap user-card-head"
      title={<IntlMessages id="sidebar.generalSettings" />}
    >
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={24} xs={24}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("Id", {
                initialValue: generalData !== null ? generalData.Id : "",
              })(<Input hidden />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.id" />}
            >
              {getFieldDecorator("privateID", {
                initialValue: generalData !== null ? generalData.privateID : "",
                rules: [
                  {
                    required: true,
                    message: <IntlMessages id="required.generalsettings.id" />,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <span className="cust-title-step">
            <IntlMessages id="generalsettings.vidsigner" />
          </span>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.type" />}
            >
              {getFieldDecorator("API", {
                initialValue: generalData !== null ? generalData.API : "",
                rules: [
                  {
                    required: true,

                    message: (
                      <IntlMessages id="required.generalsettings.type" />
                    ),
                  },
                ],
              })(
                <Select>
                  <Option key="1" value="Type">
                    Type
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.username" />}
            >
              {getFieldDecorator("Username", {
                initialValue: generalData !== null ? generalData.Username : "",
                rules: [
                  {
                    required: true,

                    message: (
                      <IntlMessages id="required.generalsettings.username" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.password" />}
            >
              {getFieldDecorator("Password", {
                initialValue: generalData !== null ? generalData.Password : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.password" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.devicename" />}
            >
              {getFieldDecorator("DeviceName", {
                initialValue:
                  generalData !== null ? generalData.DeviceName : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.devicename" />
                    ),
                  },
                ],
              })(
                <Select
                  style={{
                    width: 686,
                    marginRight: "10px",
                  }}
                >
                  {deviceData != null &&
                    deviceData.map((list) => (
                      <Option key="1" value={list.DeviceName}>
                        {list.DeviceName}
                      </Option>
                    ))}
                </Select>
              )}
              <Button
                type="primary"
                style={{ width: "190px", marginTop: "10px" }}
                onClick={() => dispatch(getDeviceName())}
              >
                Get Device
              </Button>
            </FormItem>
          </Col>

          <span className="cust-title-step">
            <IntlMessages id="generalsettings.smtpconfig" />
          </span>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.host" />}
            >
              {getFieldDecorator("Host", {
                initialValue: generalData !== null ? generalData.Host : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.host" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.username" />}
            >
              {getFieldDecorator("SmtpUsername", {
                initialValue:
                  generalData !== null ? generalData.SmtpUsername : "",
                rules: [
                  {
                    required: true,

                    message: (
                      <IntlMessages id="required.generalsettings.username" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.password" />}
            >
              {getFieldDecorator("SmtpPassword", {
                initialValue:
                  generalData !== null ? generalData.SmtpPassword : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.password" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.port" />}
            >
              {getFieldDecorator("PORT", {
                initialValue: generalData !== null ? generalData.PORT : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.port" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <span className="cust-title-step">
            <IntlMessages id="generalsettings.moreappConfig" />
          </span>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.apiKey" />}
            >
              {getFieldDecorator("MoreAppKey", {
                initialValue:
                  generalData !== null ? generalData.MoreAppKey : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.apiKey" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.clientId" />}
            >
              {getFieldDecorator("MoreAppClientId", {
                initialValue:
                  generalData !== null ? generalData.MoreAppClientId : "",
                rules: [
                  {
                    required: true,

                    message: (
                      <IntlMessages id="required.generalsettings.clientId" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <span className="cust-title-step">
            <IntlMessages id="generalsettings.custody" />
          </span>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.visit" />}
            >
              {getFieldDecorator("CustodyPeriodVisit", {
                initialValue:
                  generalData !== null ? generalData.CustodyPeriodVisit : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.visit" />
                    ),
                  },
                ],
              })(
                <Select>
                  <Option value="Horas">Horas</Option>
                  <Option value="Dias">Dias</Option>
                  <Option value="Semans">Semans</Option>
                  <Option value="Para siempre">Para siempre</Option>
                  <Option value="Meses">Meses</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.period" />}
            >
              {getFieldDecorator("CustodyValueVisit", {
                initialValue:
                  generalData !== null ? generalData.CustodyValueVisit : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.period" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.procedure" />}
            >
              {getFieldDecorator("CustodyPeriodProcedure", {
                initialValue:
                  generalData !== null
                    ? generalData.CustodyPeriodProcedure
                    : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.procedure" />
                    ),
                  },
                ],
              })(
                <Select>
                  <Option value="Horas">Horas</Option>
                  <Option value="Dias">Dias</Option>
                  <Option value="Semans">Semans</Option>
                  <Option value="Para siempre">Para siempre</Option>
                  <Option value="Meses">Meses</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.period" />}
            >
              {getFieldDecorator("CustodyValueProcedure", {
                initialValue:
                  generalData !== null ? generalData.CustodyValueProcedure : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.period" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.inspection" />}
            >
              {getFieldDecorator("CustodyPeriodInspection", {
                initialValue:
                  generalData !== null
                    ? generalData.CustodyPeriodInspection
                    : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.inspection" />
                    ),
                  },
                ],
              })(
                <Select>
                  <Option value="Horas">Horas</Option>
                  <Option value="Dias">Dias</Option>
                  <Option value="Semans">Semans</Option>
                  <Option value="Para siempre">Para siempre</Option>
                  <Option value="Meses">Meses</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.period" />}
            >
              {getFieldDecorator("CustodyValueInspection", {
                initialValue:
                  generalData !== null
                    ? generalData.CustodyValueInspection
                    : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.period" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.expedient" />}
            >
              {getFieldDecorator("CustodyPeriodExpedient", {
                initialValue:
                  generalData !== null
                    ? generalData.CustodyPeriodExpedient
                    : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.expedient" />
                    ),
                  },
                ],
              })(
                <Select>
                  <Option value="Horas">Horas</Option>
                  <Option value="Dias">Dias</Option>
                  <Option value="Semans">Semans</Option>
                  <Option value="Para siempre">Para siempre</Option>
                  <Option value="Meses">Meses</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="generalsettings.period" />}
            >
              {getFieldDecorator("CustodyValueExpedient", {
                initialValue:
                  generalData !== null ? generalData.CustodyValueExpedient : "",
                rules: [
                  {
                    required: true,
                    message: (
                      <IntlMessages id="required.generalsettings.period" />
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("licenseId", {
                initialValue: licenseId,
              })(<Input hidden />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("deviceId", {
                initialValue: deviceId,
              })(<Input hidden />)}
            </FormItem>
          </Col>

          <Col lg={24} xs={24}>
            <FormItem {...formItemLayout}>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="button.Submit" />
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

const WrappedSimpleForm = Form.create()(GeneralSettings);

export default WrappedSimpleForm;
