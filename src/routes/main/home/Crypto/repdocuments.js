import React from "react";
import { Modal, Table, Button } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import {
  get_alldocuments,
  hideMessage,
  setstatustoinitial,
} from "./../../../../appRedux/actions/AlldocumentsActions";

let userId = "";

class RepDocuments extends React.Component {
  get_alldocumentsById(pageNumber = "", visit_id = "") {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && visit_id !== "")
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
    // this.get_prodocumentsById()
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
    const { onDocumentsClose, open } = this.props;

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
        title: "Document Name",
        dataIndex: "DocumentName",
        key: "DocumentName",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Owner Name",
        dataIndex: "OwnerName",
        key: "OwnerName",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Owner NIF",
        dataIndex: "OwnerNIF",
        key: "OwnerNIF",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Owner Email",
        dataIndex: "OwnerEmail",
        key: "OwnerEmail",
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Creation Date",
        dataIndex: "CreationDate",
        key: "CreationDate",
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: "Document Type",
        dataIndex: "DocumentType",
        key: "DocumentType",
      },
      {
        title: "Procedure Type",
        dataIndex: "ProcedureType",
        key: "ProcedureType",
      },
      {
        title: "Signed Date",
        dataIndex: "SignedDate",
        key: "SignedDate",
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: "Download",
        key: "download",
        render: (text, record) => (
          <span>
            <span className="gx-link">
              <Button
                className="gx-link"
                onClick={this.downloadDocumentData}
                value={record.DocumentID}
              >
                Download
              </Button>
            </span>
            {/*<span className="gx-link">Action 一 {record.name}</span>
          <Divider type="vertical"/>
          <span className="gx-link">Delete</span>
          <Divider type="vertical"/>
          <span className="gx-link ant-dropdown-link">
            More actions <Icon type="down"/>
          </span>*/}
          </span>
        ),
      },
    ];

    return (
      <Modal
        className="cust-doc-modal"
        title="Document List"
        toggle={onDocumentsClose}
        visible={open}
        closable={true}
        onOk={() => {
          // if (name === '')
          //   return;
          onDocumentsClose();
        }}
        onCancel={onDocumentsClose}
        footer={null}
      >
        <Table
          className="gx-table-responsive"
          columns={columns}
          dataSource={AlldocumentData}
        />
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
export default connect(mapStateToProps, mapDispatchToProps)(RepDocuments);
