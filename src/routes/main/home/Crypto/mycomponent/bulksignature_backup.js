import React from "react";
import {
  Row,
  Col,
  Avatar,
  Input,
  Modal,
  Select,
  Radio,
  Table,
  Button,
  Upload,
  message,
  Icon,
  Form,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { baseURL } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";

import {
  get_alldocuments,
  hideMessage,
  setstatustoinitial,
  showAlldocumentorsLoader,
} from "./../../../../appRedux/actions/AlldocumentsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";

import IntlMessages from "util/IntlMessages";
// const RadioGroup = Radio.Group;

let userId = "";
var SelectedList_content = "";
class BulkSignature extends React.Component {
  get_alldocumentsById(pageNumber = "", visit_id = "") {
    if (
      this.props.status == "Initial" ||
      (pageNumber == "" && visit_id != "")
    ) {
      this.props.get_alldocuments({ pageNumber: 1, visit_id: visit_id });
    } else {
      this.props.get_alldocuments({
        pageNumber: pageNumber,
        visit_id: visit_id,
      });
    }
  }

  componentDidMount() {
    this.props.setstatustoinitial();
    // this.get_visdocumentsById()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open) {
      if (
        prevProps.visit_id !== undefined ||
        prevProps.visit_id !== this.props.visit_id
      ) {
        this.get_alldocumentsById(1, this.props.visit_id);
      }
    }
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.get_alldocumentsById(pagination.current, this.props.visit_id);
  };

  constructor(props) {
    super(props);

    this.state = {
      pagination: {},
      loading: false,
    };
  }

  //Downloading Document in pdf file format
  downloadDocumentData = (e) => {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata != "" && userdata != null) {
      let userData = JSON.parse(userdata);
      if (userData != "" && userData != null && userData["id"] != undefined) {
        userId = userData["id"];
      }
    }

    var documentData = this.props.getAlldocumentsData.DocumentList.find(
      (singleDocument) => {
        return singleDocument.DocumentID == e.target.value;
      }
    );

    var filename = documentData.DocumentName;
    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
      body: JSON.stringify(documentData),
    };
    /*const response = await fetch('https://jsonplaceholder.typicode.com/posts', requestOptions);
      const data = await response.json();*/
    fetch(
      baseURL + "DownloadDocument?licenceId=" + userId,
      requestOptions
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
      // window.location.href = response.url;
    });
  };

  render() {
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    const plainOptions = [
      { label: "Black Listed", value: "blacklisted" },
      { label: "White Listed", value: "whitelisted" },
    ];
    const plainOptions1 = [
      { label: "Remote", value: "Remote" },
      { label: "Bio", value: "Bio" },
    ];
    const { onSignatureClose, open, contact, SelectedList } = this.props;

    const props = {
      name: "file",
      action: "//jsonplaceholder.typicode.com/posts/",
      headers: {
        authorization: "authorization-text",
      },
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    var AlldocumentsData = this.props.getAlldocumentsData;
    var AlldocumentData = "";

    if (!AlldocumentsData) {
      // Object is empty (Would return true in this example)
    } else {
      // Object is NOT empty
      AlldocumentData = AlldocumentsData.DocumentList;

      const pagination = { ...this.state.pagination };

      pagination.total = AlldocumentsData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;
      if (
        pagination.current != "" &&
        this.state.pagination.current == undefined
      ) {
        this.setState({
          pagination,
        });
      }
    }
    if (SelectedList.length > 0) {
      SelectedList_content = SelectedList.map((item, i) => {
        return (
          <Row>
            <Col lg={12}>
              {item.Name} ({item.DNI})
            </Col>
            <Col lg={12}>
              <label>Signature Mode</label>
              <RadioGroup
                options={plainOptions1}
                onChange={this.handleautoselect}
              />
            </Col>
          </Row>
        );
      });
    }
    return (
      <Modal
        title="Send Bulk Singature"
        className="cust-doc-modal identity_select_modal"
        toggle={onSignatureClose}
        visible={open}
        closable={true}
        onCancel={onSignatureClose}
        footer={[
          <Button key="back" type="primary" onClick={this.props.onAddDocuments}>
            Previous
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form labelCol={{ span: 10 }}>
          <Row>
            <Col lg={12}>{SelectedList_content}</Col>
            <Col lg={12}>
              <Form.Item label="Upload Signature" name="upload">
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
              <Card></Card>
              <Form.Item label="Upload Signature" name="upload">
                <RadioGroup options={plainOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_alldocuments,
  hideMessage,
  setstatustoinitial,
};

const mapStateToProps = (state) => {
  return {
    getAlldocumentsData: state.alldocumentsReducers.get_alldocuments_res,
    loader: state.alldocumentsReducers.loader,
    showSuccessMessage: state.alldocumentsReducers.showSuccessMessage,
    successMessage: state.alldocumentsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.alldocumentsReducers.showMessage,
    alertMessage: state.alldocumentsReducers.alertMessage,
    status: state.alldocumentsReducers.status,
  };
};

// export default AllDocuments;
export default connect(mapStateToProps, mapDispatchToProps)(BulkSignature);
