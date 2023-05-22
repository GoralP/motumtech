import React, { Component } from "react";
import { Card, Icon, Col, Row, message, Form, Upload } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import IntlMessages from "util/IntlMessages";
import { injectIntl } from "react-intl";

let licenseId = "";
const FormItem = Form.Item;
var importConfig = "";
var importDocument = "";

class Setting extends Component {
  constructor() {
    super();
    this.state = {
      fileList: [],
    };
  }

  handleUploadConfigInfo = (info) => {
    if (info.file.status !== "uploading") {
      // console.log("FILE INFO =>", info.file);
    }
    if (info.file.status === "done") {
      var parsed_response = JSON.parse(info.file.xhr.response);
      var response_status = parsed_response.status;
      var response_message = parsed_response.message;
      if (response_status) {
        message.success(response_message);
        // setTimeout(() => {window.location.reload(false);}, 2000);
      } else {
        message.error(response_message);
      }
    } else if (info.file.status === "error") {
      message.error(
        `${info.file.name}` +
          this.props.intl.formatMessage({ id: "global.UploadFail" })
      );
    }
  };

  handleUploadDocumentInfo = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-2);
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    this.setState({ fileList });

    if (info.file.status !== "uploading") {
      // console.log("FILE INFO =>", info.file);
    }
    if (info.file.status === "done") {
      var parsed_response = JSON.parse(info.file.xhr.response);
      var response_status = parsed_response.status;
      var response_message = parsed_response.message;
      if (response_status) {
        message.success(response_message);
        // setTimeout(() => {window.location.reload(false);}, 2000);
      } else {
        message.error(response_message);
      }
    } else if (info.file.status === "error") {
      message.error(
        `${info.file.name}` +
          this.props.intl.formatMessage({ id: "global.UploadFail" })
      );
    }
  };

  render() {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_config =
        userData.Permission.Configuration.Configuration_ImportConfig;
      let permit_document =
        userData.Permission.Configuration.Configuration_ImportDocument;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_config !== undefined &&
        permit_document !== undefined
      ) {
        licenseId = userData["id"];
        importConfig = permit_config;
        importDocument = permit_document;
      }
    }

    const formItemLayoutDrag = {
      labelCol: { xs: 24, sm: 6 },
      wrapperCol: { xs: 24, sm: 24 },
    };

    let authBasic="";
    authBasic = localStorage.getItem("setAuthToken");

    const uploadConfig = {
      name: "File",
      action: baseURL + "UploadConfigExcelByLicenseId?LicenseId=" + licenseId,
       headers:{Authorization: "Basic " + authBasic}

    };
    const uploadDocument = {
      name: "File",
      action: baseURL + "UploadDocuments?LicenseId=" + licenseId,
      headers:{Authorization: "Basic " + authBasic}
    };

    const beforeUpload = (file) => {
      let fileExt = file.name.split(".");
      fileExt = fileExt[fileExt.length - 1];
      const isFileExt =
        fileExt.toLowerCase() === "xls" || fileExt.toLowerCase() === "xlsx";
      const isExcelFile =
        file.type === "xls" ||
        file.type === "xlsx" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcelFile && !isFileExt) {
        message.error(
          this.props.intl.formatMessage({ id: "global.UploadExcel" })
        );
      }
      return isExcelFile;
    };

    const beforeDocumentUpload = (file) => {
      let fileExt = file.name.split(".");
      fileExt = fileExt[fileExt.length - 1];
      const isFileExt =
        fileExt.toLowerCase() === "doc" || fileExt.toLowerCase() === "docx";
      const isExcelFile =
        file.type === "doc" ||
        file.type === "docx" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isExcelFile && !isFileExt) {
        message.error(
          this.props.intl.formatMessage({ id: "global.UploadWord" })
        );
      }
      return isExcelFile;
    };

    return (
      <>
        <Card
          title={<IntlMessages id="sidebar.Setting" />}
          extra={<div className="card-extra-form"></div>}
        >
          <Row>
            <Col lg={6} md={6} sm={24} className="col-upload">
              <h5>
                <IntlMessages id="setting.uploadConfig" /> :
              </h5>
              <FormItem {...formItemLayoutDrag}>
                <div className="dropbox">
                  {importConfig === true ? (
                    <Upload.Dragger
                      name="files"
                      onChange={(info) => this.handleUploadConfigInfo(info)}
                      {...uploadConfig}
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                    >
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-hint">
                        <IntlMessages id="administrative.dragfile" />
                      </p>
                    </Upload.Dragger>
                  ) : (
                    <Upload.Dragger disabled name="files">
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-hint">
                        <IntlMessages id="administrative.dragfile" />
                      </p>
                    </Upload.Dragger>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24} className="col-upload">
              <h5>
                <IntlMessages id="setting.uploadDocument" /> :
              </h5>
              <FormItem {...formItemLayoutDrag}>
                <div className="dropbox">
                  {importDocument === true ? (
                    <Upload.Dragger
                      name="files"
                      onChange={(info) => this.handleUploadDocumentInfo(info)}
                      {...uploadDocument}
                      showUploadList={false}
                      fileList={this.state.fileList}
                      multiple={true}
                      beforeUpload={beforeDocumentUpload}
                    >
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-hint">
                        <IntlMessages id="administrative.dragfile" />
                      </p>
                    </Upload.Dragger>
                  ) : (
                    <Upload.Dragger name="files" disabled>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-hint">
                        <IntlMessages id="administrative.dragfile" />
                      </p>
                    </Upload.Dragger>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  //   userRolePermissionByuserId
};

const viewSettingReportForm = Form.create()(Setting);

const mapStateToProps = (state) => {
  return {};
};

// export default Inspection;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewSettingReportForm));
