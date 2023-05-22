import React, { Component } from "react";
import {
  Card,
  Divider,
  Icon,
  Table,
  Button,
  Col,
  Row,
  Select,
  Input,
  DatePicker,
} from "antd";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { baseURL } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";

import {
  get_getreports,
  hideMessage,
  setstatustoinitial,
  showGetreportsLoader,
} from "./../../../../appRedux/actions/GetreportsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";

class Getreport extends Component {
  get_getreportsById(
    pageNumber = "",
    sortBy = "",
    filterBy = "",
    perPage = "10"
  ) {
    if (
      this.props.status == "Initial" ||
      (pageNumber == "" && sortBy == "" && filterBy != "" && perPage != "")
    ) {
      this.props.get_getreports({
        pageNumber: 1,
        sortBy: "+DocumentID",
        filterBy: filterBy,
        perPage: perPage,
      });
    } else {
      if (pageNumber == "") {
        pageNumber = 1;
      }
      this.props.get_getreports({
        pageNumber: pageNumber,
        sortBy: sortBy,
        filterBy: filterBy,
        perPage: perPage,
      });
    }
  }

  componentDidMount() {
    this.props.setstatustoinitial();
    this.get_getreportsById();
  }

  handleReporttypeChange = (e) => {
    var dniNumber = this.state.dni;
    var currentReport = this.state.reportType;
    var startingDate = DateWithoutTimeHelper(this.state.startValue);
    var endingDate = DateWithoutTimeHelper(this.state.endValue);
    var condition = {
      dniNumber: dniNumber,
      currentReport: currentReport,
      startingDate: startingDate,
      endingDate: endingDate,
    };
    this.props.get_getreports(condition);
  };

  handleFilterChange = (e) => {
    var currentDocument = this.state.documentType;
    this.get_getreportsById("", "", currentDocument);
  };

  handleDocumentChange = (value) => {
    var selected_value = `${value}`;
    this.setState({ documentType: selected_value });
    console.log(selected_value);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    var sortBy = "";
    var currentDocument = this.state.documentType;
    if (sorter.order == "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order == "descend") {
      sortBy = "-" + sorter.field;
    }
    this.get_getreportsById(
      pagination.current,
      sortBy,
      currentDocument,
      pagination.pageSize
    );
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      loading: false,
      documentType: "",
      dni: "",
      startValue: "",
      endValue: "",
      endOpen: false,
    };
  }

  //Downloading Document in pdf file format
  downloadDocumentData = (e) => {
    var documentData = this.props.getDocumentsData.DocumentList.find(
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
    fetch(baseURL + "DownloadDocument?licenceId=2", requestOptions).then(
      (response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
        });
        // window.location.href = response.url;
      }
    );
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange("startValue", value);
  };

  onEndChange = (value) => {
    this.onChange("endValue", value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;
    var getreportsData = this.props.getGetreportsData;
    console.log("Getreport =>", getreportsData);
    var getreportData = "";

    if (!getreportsData) {
      // Object is empty (Would return true in this example)
    } else {
      getreportData = getreportsData.DocumentList;
      console.log("getreportData => ", getreportData);

      const pagination = { ...this.state.pagination };

      pagination.total = getreportsData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;

      var start_record = "";
      var end_record = "";
      if (pagination.current == 1) {
        start_record = 1;
        end_record = pagination.pageSize;
      } else {
        start_record = (pagination.current - 1) * pagination.pageSize + 1;
        end_record = pagination.current * pagination.pageSize;
        if (end_record > pagination.total) {
          end_record = pagination.total;
        }
      }

      if (
        pagination.current != "" &&
        this.state.pagination.current == undefined
      ) {
        this.setState({
          pagination,
        });
      }
    }

    const Option = Select.Option;
    const columns = [
      {
        title: "Document Name",
        dataIndex: "DocumentName",
        key: "DocumentName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Owner Name",
        dataIndex: "OwnerName",
        key: "OwnerName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Owner NIF",
        dataIndex: "OwnerNIF",
        key: "OwnerNIF",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Owner Email",
        dataIndex: "OwnerEmail",
        key: "OwnerEmail",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Creation Date",
        dataIndex: "CreationDate",
        key: "CreationDate",
        sorter: true,
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: "Document Type",
        dataIndex: "DocumentType",
        key: "DocumentType",
        sorter: true,
      },
      {
        title: "Download",
        key: "download",
        fixed: "right",
        render: (text, record) => (
          <span>
            <span className="gx-link">
              <Button
                className="arrow-btn gx-link"
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

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        DocumentName: record.DocumentName,
      }),
    };

    return (
      <Card
        title="Document List"
        extra={
          <div className="card-extra-form">
            <Input
              className="inline-inputs"
              value={this.state.dni}
              onChange={(e) => this.onDNIChange(e.target.value)}
              placeholder="Enter DNI Number"
            />
            <DatePicker
              className="inline-inputs"
              disabledDate={this.disabledStartDate}
              showTime
              format="MM/DD/YYYY"
              value={startValue}
              placeholder="Start Date"
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
            />
            <DatePicker
              className="inline-inputs"
              disabledDate={this.disabledEndDate}
              showTime
              format="MM/DD/YYYY"
              value={endValue}
              placeholder="End Date"
              onChange={this.onEndChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
            />
            <Button
              className="inline-btn"
              type="primary"
              onClick={this.handleReporttypeChange}
            >
              Get Report
            </Button>
            <Button className="inline-btn" type="primary">
              Export Excel
            </Button>
          </div>
        }
      >
        <div className="document-filter-form">
          <Button className="inline-btn" type="primary">
            Print
          </Button>
          <Button
            className="inline-btn"
            type="primary"
            onClick={this.handleFilterChange}
          >
            Filter
          </Button>
          <Select
            onChange={this.handleDocumentChange}
            placeholder="None"
            className="gx-mr-3 gx-mb-3 inline-inputs"
          >
            <Option value="VISIT">VISIT</Option>
            <Option value="GENERAL">GENERAL</Option>
            <Option value="INSPECTION">INSPECTION</Option>
          </Select>
        </div>
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={getreportData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 1300, y: 400 }}
          // style={{ whiteSpace: "pre" }}
          scroll={{ x: true }}
        />
      </Card>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_getreports,
  hideMessage,
  setstatustoinitial,
};

const mapStateToProps = (state) => {
  return {
    getGetreportsData: state.getreportsReducers.get_getreports_res,
    loader: state.getreportsReducers.loader,
    showSuccessMessage: state.getreportsReducers.showSuccessMessage,
    successMessage: state.getreportsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.getreportsReducers.showMessage,
    alertMessage: state.getreportsReducers.alertMessage,
    status: state.getreportsReducers.status,
  };
};

// export default Procedure;
export default connect(mapStateToProps, mapDispatchToProps)(Getreport);
