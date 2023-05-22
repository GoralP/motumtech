import React, { Component } from "react";
import {
  Card,
  Input,
  message,
  Select,
  Form,
  Row,
  Col,
  Button,
  Progress,
} from "antd";
import { connect } from "react-redux";
import {
  baseURL,
  webURL,
  hostURL,
  branchName,
} from "./../../../../util/config";
import IntlMessages from "util/IntlMessages";
import {
  getCalendar,
  setstatustoinitial,
  saveCalendarData,
  getInitialSigninStatus,
} from "./../../../../appRedux/actions/InspectionsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage } from "react-intl";

var licenseId = "";
var code = "";
var CalendarList = [];
var defaultCalendar = "";
var visitHours = "";

class OutlookSetting extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticate: false,
      visitHours: "",
      calendarId: "",
    };
  }

  componentDidMount() {
    this.props.setstatustoinitial();
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined
      ) {
        licenseId = userData["id"];
      }
    }
    let pageURL = window.location.href;
    let codeSegment = pageURL.split("code=");
    if (codeSegment.length > 1) {
      let codeArr = codeSegment[1].split("&state=");
      code = codeArr[0];
      var redirect_url = hostURL + "/" + webURL + "main/home/out-look-setting";
      if (code != "") {
        this.props.getCalendar({ code: code, redirectURL: redirect_url });
        this.setState({ isAuthenticate: true });
      }
    }
    this.props.getInitialSigninStatus();
  }

  // componentDidUpdate(prevProps){
  //   if ( this.props.getSigninStatus !== prevProps.getSigninStatus ) {
  //     if (this.props.getSigninStatus.status === true){
  //       this.props.getCalendar();
  //     }
  //   }
  // }

  handleOpenOutlook = () => {
    window.location.href =
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=b3141104-dd20-428c-82f8-0223bd1cfc0e&response_type=code&redirect_uri=" +
      hostURL +
      "/" +
      webURL +
      "main/home/out-look-setting&response_mode=query&scope=calendars.read%20user.read%20offline_access%20Directory.Read.All%20User.Read.All&state=" +
      licenseId;
  };

  handleCalendarSubmit = (e) => {
    e.preventDefault();
    var calendarData = [];
    this.props.form.validateFieldsAndScroll(
      ["GetCelender, VisitHours"],
      (err, values) => {
        if (!err) {
          if (
            (this.state.calendarId !== "" && this.state.visitHours !== "") ||
            (visitHours !== "" && defaultCalendar !== "")
          ) {
            calendarData["LicenseId"] = licenseId;
            calendarData["CalendarId"] = this.state.calendarId
              ? this.state.calendarId
              : defaultCalendar;
            calendarData["ScheduleVisitHour"] = this.state.visitHours
              ? this.state.visitHours
              : visitHours;
            this.props.saveCalendarData(calendarData);
          }
        }
      }
    );
  };

  render() {
    if (this.props.getSigninStatus.CalendarList) {
      CalendarList = this.props.getSigninStatus.CalendarList;
      defaultCalendar = this.props.getSigninStatus.DefualtCalendarId;
      visitHours = this.props.getSigninStatus.ScheduleVisitHour;
    }

    const Option = Select.Option;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={<IntlMessages id="sidebar.outLookSetting" />}>
        <Row>
          <Col lg={24}>
            <div className="cust-outlook-signin">
              <a href onClick={() => this.handleOpenOutlook()}>
                <img
                  src={require("assets/images/ms-desko.svg")}
                  height="100"
                  width="200"
                  alt="Logo"
                />
              </a>
              {this.props.getSigninStatus.CalendarList ||
              this.props.getCalendarData !== "" ? (
                <span className="cust-progress-signin">
                  <Progress type="circle" percent={100} width={47} />
                </span>
              ) : (
                <span className="cust-progress-signin">
                  <Progress
                    type="circle"
                    percent={100}
                    width={47}
                    status="exception"
                  />
                </span>
              )}
            </div>
            <Col lg={24} xs={24}>
              <FormattedMessage id="placeholder.VisitHours">
                {(placeholder) => (
                  <FormItem>
                    {getFieldDecorator("visitHours", {
                      initialValue: visitHours,
                      rules: [
                        {
                          required: true,
                          message: <IntlMessages id="required.visitHours" />,
                          whitespace: true,
                          pattern: new RegExp(/^[0-9]+\.?[0-9]*$/),
                        },
                      ],
                    })(
                      <Input
                        required
                        type="number"
                        min={0}
                        placeholder={placeholder}
                        onChange={(event) =>
                          this.setState({ visitHours: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </FormItem>
                )}
              </FormattedMessage>
            </Col>
            <div className="cust-outlook-setting">
              <FormattedMessage id="placeholder.SelectCalender">
                {(placeholder) => (
                  <FormItem>
                    {getFieldDecorator("GetCelender", {
                      initialValue: defaultCalendar,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.SelectCalender" />
                          ),
                        },
                      ],
                    })(
                      this.props.getSigninStatus.CalendarList ||
                        this.props.getCalendarData !== "" ? (
                        <Select
                          onChange={(value, event) =>
                            this.setState({ calendarId: `${value}` })
                          }
                          placeholder={placeholder}
                          className="inline-inputs-down"
                        >
                          {this.props.getSigninStatus.CalendarList
                            ? CalendarList.map((item) => {
                                return (
                                  <Option value={item.CalendarId}>
                                    {item.CalendarName}
                                  </Option>
                                );
                              })
                            : this.props.getCalendarData.map((item) => {
                                return (
                                  <Option value={item.CalendarId}>
                                    {item.CalendarName}
                                  </Option>
                                );
                              })}
                        </Select>
                      ) : (
                        <Select
                          disabled
                          placeholder={placeholder}
                          className="inline-inputs-down"
                        ></Select>
                      )
                    )}
                    {this.props.getSigninStatus.CalendarList ||
                    this.props.getCalendarData !== "" ? (
                      <Button
                        className="inline-btn"
                        type="primary"
                        onClick={this.handleCalendarSubmit}
                      >
                        <IntlMessages id="globalButton.submit" />
                      </Button>
                    ) : (
                      <Button disabled className="inline-btn" type="primary">
                        <IntlMessages id="globalButton.submit" />
                      </Button>
                    )}
                  </FormItem>
                )}
              </FormattedMessage>
            </div>
          </Col>
        </Row>
        {this.props.loader ? (
          <div className="gx-loader-view">
            <CircularProgress />
          </div>
        ) : null}
      </Card>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  getCalendar,
  setstatustoinitial,
  saveCalendarData,
  getInitialSigninStatus,
};

const viewOutlookSettingReportForm = Form.create()(OutlookSetting);

const mapStateToProps = (state) => {
  return {
    getCalendarData: state.inspectionsReducers.get_calendar_res,
    getSigninStatus: state.inspectionsReducers.get_signin_status,
    loader: state.inspectionsReducers.loader,
    status: state.inspectionsReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(viewOutlookSettingReportForm);
