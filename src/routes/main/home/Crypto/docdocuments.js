import React from "react";
import { Modal, Table } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import {
  get_docdocuments,
  hideMessage,
  setstatustoinitial,
} from "./../../../../appRedux/actions/DocdocumentsActions";
import IntlMessages from "util/IntlMessages";

let userId = "";

class DocDocuments extends React.Component {
  get_docdocumentsById(pageNumber = "", document_id = "") {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && document_id !== "")
    ) {
      this.props.get_docdocuments({ pageNumber: 1, document_id: document_id });
    } else {
      this.props.get_docdocuments({
        pageNumber: pageNumber,
        document_id: document_id,
      });
    }
  }

  componentDidMount() {
    this.props.setstatustoinitial();
    // this.get_expdocumentsById()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open) {
      if (
        prevProps.document_id !== undefined ||
        prevProps.document_id !== this.props.document_id
      ) {
        this.get_docdocumentsById(1, this.props.document_id);
      }
    }
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.get_docdocumentsById(pagination.current, this.props.document_id);
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
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined
      ) {
        userId = userData["id"];
      }
    }

    var documentData = this.props.getExpdocumentsData.DocumentList.find(
      (singleDocument) => {
        return singleDocument.DocumentID === e.target.value;
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
    const { onDetailDocumentClose, open } = this.props;

    var DocdocumentsData = this.props.getDocdocumentsData;
    // var DocdocumentData = '';

    if (!DocdocumentsData) {
      // Object is empty (Would return true in this example)
    } else {
      // Object is NOT empty
      //DocdocumentData = DocdocumentsData.data;
      const pagination = { ...this.state.pagination };

      pagination.total = DocdocumentsData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;
      if (
        pagination.current !== "" &&
        this.state.pagination.current === undefined
      ) {
        this.setState({
          pagination,
        });
      }
    }

    const columns = [
      {
        title: <IntlMessages id="column.DNI" />,
        dataIndex: "DNI",
        key: "DNI",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="addidentity.Mobile" />,
        dataIndex: "MobileNo",
        key: "MobileNo",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.type" />,
        dataIndex: "Mode",
        key: "Mode",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.Status" />,
        dataIndex: "Status",
        key: "Status",
        render: (text) => <span className="">{text}</span>,
      },
    ];

    return (
      <Modal
        className="cust-doc-modal"
        title={<IntlMessages id="title.ParticipantList" />}
        toggle={onDetailDocumentClose}
        visible={open}
        closable={true}
        onOk={() => {
          // if (name === '')
          //   return;
          onDetailDocumentClose();
        }}
        onCancel={onDetailDocumentClose}
        footer={null}
      >
        <Table
          className="gx-table-responsive"
          columns={columns}
          dataSource={DocdocumentsData}
        />
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_docdocuments,
  hideMessage,
  setstatustoinitial,
};

const mapStateToProps = (state) => {
  return {
    getDocdocumentsData: state.docdocumentsReducers.get_docdocuments_res,
    loader: state.docdocumentsReducers.loader,
    showSuccessMessage: state.docdocumentsReducers.showSuccessMessage,
    successMessage: state.docdocumentsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.docdocumentsReducers.showMessage,
    alertMessage: state.docdocumentsReducers.alertMessage,
    status: state.docdocumentsReducers.status,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DocDocuments);
