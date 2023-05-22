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
  setstatustoinitial,
  validateInitialDirectory,
  setDirectoryToken,
} from "./../../../../appRedux/actions/InspectionsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";

var licenseId = "";
var code = "";

class OutlookSetting extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticate: false,
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
      var redirect_url =
        hostURL + "/" + webURL + "main/home/active-directory-setting";
      if (code !== "") {
        this.props.setDirectoryToken({ code: code, redirectURL: redirect_url });
      }
    }
    this.props.validateInitialDirectory();
  }

  handleOpenOutlook = () => {
    window.location.href =
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=fed16f07-e65b-4db1-b020-76085bae9b7e&response_type=code&redirect_uri=" +
      hostURL +
      "/" +
      webURL +
      "main/home/active-directory-setting&response_mode=query&scope=user.read%20offline_access%20Directory.Read.All%20User.Read.All&state=" +
      licenseId;
  };

  render() {
    return (
      <Card title={<IntlMessages id="sidebar.activeDirectorySetting" />}>
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
              {this.props.getDirectoryStatus || this.props.directoryToken ? (
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
  setstatustoinitial,
  validateInitialDirectory,
  setDirectoryToken,
};

const viewOutlookSettingReportForm = Form.create()(OutlookSetting);

const mapStateToProps = (state) => {
  return {
    getDirectoryStatus: state.inspectionsReducers.get_directory_status,
    directoryToken: state.inspectionsReducers.set_directory_token,
    loader: state.inspectionsReducers.loader,
    status: state.inspectionsReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(viewOutlookSettingReportForm);
