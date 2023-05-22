import React, { Component } from "react";
import { Card, Table, Button, Select, Input, DatePicker, Form } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import TimeWithDateHelper from "./../../../helper/TimeWithDateHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import IntlMessages from "util/IntlMessages";
import { get_reports } from "./../../../../appRedux/actions/ReportsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import RepDocuments from "./repdocuments";
import ExpDocuments from "./expdocuments";
import { FormattedMessage } from "react-intl";

let userId = "";
let langName = "";
const FormItem = Form.Item;

class Report extends Component {
  get_reportsById(
    pageNumber = "",
    sortBy = "",
    dni = "",
    reportBy = "",
    startValue = "",
    endValue = "",
    perPage = "10"
  ) {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" &&
        sortBy === "" &&
        dni !== "" &&
        reportBy !== "" &&
        startValue !== "")
    ) {
      this.props.get_reports({
        pageNumber: 1,
        sortBy: sortBy,
        dni: dni,
        reportBy: reportBy,
        startValue: startValue,
        endValue: endValue,
        perPage: perPage,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      this.props.get_reports({
        pageNumber: pageNumber,
        sortBy: sortBy,
        dni: dni,
        reportBy: reportBy,
        startValue: startValue,
        endValue: endValue,
        perPage: perPage,
      });
    }
  }

  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      loading: false,
      dni: "",
      reportType: "",
      startValue: "",
      endValue: "",
      endOpen: false,
    };
    this.years = Array.from(new Array(21), (val, index) => index + 2010);
    this.months = Array.from(new Array(12), (val, index) => index + 1);
  }

  handleReporttypeChange = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["GetReport", "StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          var dniNumber = this.state.dni;
          var currentReport = this.state.reportType;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

          this.get_reportsById(
            "",
            "",
            dniNumber,
            currentReport,
            startingDate,
            endingDate
          );
        }
      }
    );
  };

  onAddDocuments = (e) => {
    var visit_id = e.target.value;
    this.setState({ addDocumentsState: true, visit_id: visit_id });
  };
  onDocumentsClose = () => {
    this.setState({ addDocumentsState: false });
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  handleReportChange = (value) => {
    var report_value = `${value}`;
    this.setState({ reportType: report_value });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    var sortBy = "";
    var dniNumber = this.state.dni;
    var currentReport = this.state.reportType;
    var startingDate = DateForGetReport(this.state.startValue);
    var endingDate = DateForGetReport(this.state.endValue);

    if (sorter.order === "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.field;
    }
    this.get_reportsById(
      pagination.current,
      sortBy,
      dniNumber,
      currentReport,
      startingDate,
      endingDate,
      pagination.pageSize
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

  //Export Excel in csv file format
  handleExportExcel = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["GetReport", "StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          let userdata = localStorage.getItem(branchName + "_data");
          langName = localStorage.getItem(branchName + "_language");
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

          var dniNumber = this.state.dni;
          var currentReport = this.state.reportType;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);
          let authBasic = "";
          authBasic = localStorage.getItem("setAuthToken");

          if (currentReport === "GetVisitReport") {
            fetch(
              baseURL +
                "ExportVisitExcel?licenseId=" +
                userId +
                "&Startdate=" +
                startingDate +
                "&Enddate=" +
                endingDate +
                "&DNI=" +
                dniNumber +
                "&lang=" +
                langName,
              { headers: { Authorization: "Basic " + authBasic } }
            ).then((response) => {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
              // window.location.href = response.url;
            });
          } else if (currentReport === "GetProcedureReport") {
            fetch(
              baseURL +
                "ExportProcedurExcel?licenseId=" +
                userId +
                "&Startdate=" +
                startingDate +
                "&Enddate=" +
                endingDate +
                "&DNI=" +
                dniNumber +
                "&lang=" +
                langName,
              { headers: { Authorization: "Basic " + authBasic } }
            ).then((response) => {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
              // window.location.href = response.url;
            });
          } else if (currentReport === "GetExpedientReport") {
            fetch(
              baseURL +
                "ExportExpedientExcel?licenseId=" +
                userId +
                "&Startdate=" +
                startingDate +
                "&Enddate=" +
                endingDate +
                "&DNI=" +
                dniNumber +
                "&lang=" +
                langName,
              { headers: { Authorization: "Basic " + authBasic } }
            ).then((response) => {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
              // window.location.href = response.url;
            });
          } else if (currentReport === "GetEmployeeReport") {
            fetch(
              baseURL +
                "ExportEmployeeLogExcel?licenseId=" +
                userId +
                "&Startdate=" +
                startingDate +
                "&Enddate=" +
                endingDate +
                "&DNI=" +
                dniNumber +
                "&lang=" +
                langName,
              { headers: { Authorization: "Basic " + authBasic } }
            ).then((response) => {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
              // window.location.href = response.url;
            });
          } else if (currentReport === "GetInspectionReport") {
            fetch(
              baseURL +
                "ExportInspectionExcel?licenseId=" +
                userId +
                "&Startdate=" +
                startingDate +
                "&Enddate=" +
                endingDate +
                "&DNI=" +
                dniNumber +
                "&lang=" +
                langName,
              { headers: { Authorization: "Basic " + authBasic } }
            ).then((response) => {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
              // window.location.href = response.url;
            });
          }
        }
      }
    );
  };

  render() {
    const { addDocumentsState, startValue, endValue, endOpen } = this.state;

    var reportsData = this.props.getReportsData;
    var reportData = "";

    if (!reportsData) {
      // Object is empty (Would return true in this example)
    } else {
      if (this.state.reportType === "GetVisitReport") {
        reportData = reportsData.visitList;
      } else if (this.state.reportType === "GetProcedureReport") {
        reportData = reportsData.procedureList;
      } else if (this.state.reportType === "GetExpedientReport") {
        reportData = reportsData.expedientList;
      } else if (this.state.reportType === "GetEmployeeReport") {
        reportData = reportsData.EmployeeLog;
      } else if (this.state.reportType === "GetInspectionReport") {
        reportData = reportsData.InspectionList;
      }

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = reportsData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;

      // var start_record = '';
      var end_record = "";
      if (pagination.current === 1) {
        // start_record = 1;
        end_record = pagination.pageSize;
      } else {
        // start_record = ((pagination.current -1) * pagination.pageSize) + 1;
        end_record = pagination.current * pagination.pageSize;
        if (end_record > pagination.total) {
          end_record = pagination.total;
        }
      }

      if (
        pagination.current !== "" &&
        this.state.pagination.current === undefined
      ) {
        this.setState({
          pagination,
        });
      } else if (
        pagination.total !== "" &&
        pagination.total !== old_pagination_total
      ) {
        pagination.current = 1;
        this.setState({
          pagination,
        });
      } else if (
        (pagination.total === "" || pagination.total === 0) &&
        pagination.total !== old_pagination_total
      ) {
        this.setState({
          pagination,
        });
      }
    }

    const Option = Select.Option;
    if (this.state.reportType === "GetVisitReport") {
      var columns = [
        {
          title: <IntlMessages id="column.name" />,
          dataIndex: "Name",
          key: "Name",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text, record) => (
            <span className="">{record.Name + " " + record.FullSurName}</span>
          ),
        },
        {
          title: <IntlMessages id="column.email" />,
          dataIndex: "Email",
          key: "Email",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.DNI" />,
          dataIndex: "DNI",
          key: "DNI",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.host" />,
          dataIndex: "HostName",
          key: "HostName",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.company" />,
          dataIndex: "CompanyName",
          key: "CompanyName",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.date" />,
          dataIndex: "Date",
          key: "Date",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => DateWithoutTimeHelper(text),
        },
        {
          title: <IntlMessages id="column.document" />,
          key: "document",
          fixed: "right",
          render: (text, record) => (
            <span>
              <span className="gx-link">
                <Button
                  onClick={this.onAddDocuments}
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
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
    } else if (this.state.reportType === "GetProcedureReport") {
      var columns1 = [
        {
          title: <IntlMessages id="column.name" />,
          dataIndex: "Name",
          key: "Name",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text, record) => (
            <span className="">{record.Name + " " + record.FullSurName}</span>
          ),
        },
        {
          title: <IntlMessages id="column.email" />,
          dataIndex: "Email",
          key: "Email",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.DNI" />,
          dataIndex: "DNI",
          key: "DNI",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.company" />,
          dataIndex: "CompanyName",
          key: "CompanyName",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.type" />,
          dataIndex: "procedureType",
          key: "procedureType",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.date" />,
          dataIndex: "procedureDate",
          key: "procedureDate",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => DateWithoutTimeHelper(text),
        },
        {
          title: <IntlMessages id="column.document" />,
          key: "document",
          fixed: "right",
          render: (text, record) => (
            <span>
              <span className="gx-link">
                <Button
                  onClick={this.onAddDocuments}
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
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
    } else if (this.state.reportType === "GetExpedientReport") {
      var columns2 = [
        {
          title: <IntlMessages id="addexpedient.ExpedientName" />,
          dataIndex: "ExpedientName",
          key: "ExpedientName",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="addexpedient.ExpedientType" />,
          dataIndex: "ExpedientType",
          key: "ExpedientType",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.startdate" />,
          dataIndex: "Date",
          key: "Date",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => DateWithoutTimeHelper(text),
        },
        {
          title: <IntlMessages id="column.Status" />,
          dataIndex: "Status",
          key: "Status",
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.CloseDate" />,
          dataIndex: "closeDate",
          key: "closeDate",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => DateWithoutTimeHelper(text),
        },
        {
          title: <IntlMessages id="column.TotalSession" />,
          dataIndex: "TotalSession",
          key: "TotalSession",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.TotalSign" />,
          dataIndex: "TotalExpident",
          key: "TotalExpident",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },

        {
          title: <IntlMessages id="column.document" />,
          key: "document",
          fixed: "right",
          render: (text, record) => (
            <span>
              <span className="gx-link">
                <Button
                  onClick={this.onAddDocuments}
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
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
    } else if (this.state.reportType === "GetEmployeeReport") {
      var columns3 = [
        {
          title: <IntlMessages id="column.name" />,
          dataIndex: "FullName",
          key: "FullName",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.email" />,
          dataIndex: "Email",
          key: "Email",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.DNI" />,
          dataIndex: "DNI",
          key: "DNI",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.Checkin" />,
          dataIndex: "checkInTime",
          key: "checkInTime",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => TimeWithDateHelper(text),
        },
        {
          title: <IntlMessages id="column.Checkout" />,
          dataIndex: "checkoutTime",
          key: "checkoutTime",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => TimeWithDateHelper(text),
        },
      ];
    } else if (this.state.reportType === "GetInspectionReport") {
      var columns4 = [
        {
          title: <IntlMessages id="column.name" />,
          dataIndex: "Name",
          key: "Name",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.surname" />,
          dataIndex: "FullSurName",
          key: "FullSurName",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.email" />,
          dataIndex: "Email",
          key: "Email",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.DNI" />,
          dataIndex: "DNI",
          key: "DNI",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => <span className="">{text}</span>,
        },
        {
          title: <IntlMessages id="column.date" />,
          dataIndex: "procedureDate",
          key: "procedureDate",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => DateWithoutTimeHelper(text),
        },
        {
          title: <IntlMessages id="column.VisitTime" />,
          dataIndex: "procedureDate",
          key: "procedureDate",
          sorter: true,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (text) => TimeWithoutDateHelper(text),
        },
        {
          title: <IntlMessages id="column.document" />,
          key: "document",
          render: (text, record) => (
            <span>
              <span className="gx-link">
                <Button
                  onClick={this.onAddDocuments}
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
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
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        Name: record.Name,
      }),
    };

    const rowSelection1 = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        Name: record.Name,
      }),
    };

    const rowSelection2 = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        FullName: record.FullName,
      }),
    };

    const rowSelection3 = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        FullName: record.FullName,
      }),
    };

    const rowSelection4 = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        Name: record.Name,
      }),
    };

    const { getFieldDecorator } = this.props.form;

    let tableData;
    let documentData;
    if (this.state.reportType === "GetVisitReport") {
      tableData = (
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={reportData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 1300, y: 400 }}
          scroll={{ x: true }}
        />
      );
      documentData = (
        <RepDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
        />
      );
    } else if (this.state.reportType === "GetProcedureReport") {
      tableData = (
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection1}
          columns={columns1}
          dataSource={reportData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 1300, y: 400 }}
          scroll={{ x: true }}
        />
      );
      documentData = (
        <RepDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
        />
      );
    } else if (this.state.reportType === "GetExpedientReport") {
      tableData = (
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection2}
          columns={columns2}
          dataSource={reportData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 1300, y: 400 }}
          scroll={{ x: true }}
        />
      );
      documentData = (
        <ExpDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
        />
      );
    } else if (this.state.reportType === "GetEmployeeReport") {
      tableData = (
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection3}
          columns={columns3}
          dataSource={reportData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ y: 400 }}
        />
      );
    } else if (this.state.reportType === "GetInspectionReport") {
      tableData = (
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection4}
          columns={columns4}
          dataSource={reportData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ y: 400 }}
          // style={{ whiteSpace: "pre" }}
        />
      );
    }

    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);

      return (
        <div>
          <Card
            title={<IntlMessages id="report.title" />}
            className="custom-static-design custo_head_wrap"
            extra={
              <div className="card-extra-form">
                <Form className="custom-form">
                  <FormattedMessage id="placeholder.EnterDNINumber">
                    {(placeholder) => (
                      <FormItem>
                        <Input
                          className="inline-inputs"
                          value={this.state.dni}
                          onChange={(e) => this.onDNIChange(e.target.value)}
                          placeholder={placeholder}
                        />
                      </FormItem>
                    )}
                  </FormattedMessage>
                  <FormattedMessage id="placeholder.SelectReport">
                    {(placeholder) => (
                      <FormItem>
                        {getFieldDecorator("GetReport", {
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.SelectReport" />
                              ),
                              whitespace: true,
                            },
                          ],
                        })(
                          <Select
                            onChange={this.handleReportChange}
                            placeholder={placeholder}
                            className="inline-inputs-down"
                          >
                            {userData.Permission.Visit.Visit_List === true ? (
                              <Option value="GetVisitReport">
                                <IntlMessages id="report.VisitReport" />
                              </Option>
                            ) : null}
                            {userData.Permission.Procedure.Procedure_List ===
                            true ? (
                              <Option value="GetProcedureReport">
                                <IntlMessages id="report.ProcedureReport" />
                              </Option>
                            ) : null}
                            {userData.Permission.Expedient.Expedient_List ===
                            true ? (
                              <Option value="GetExpedientReport">
                                <IntlMessages id="report.ExpedientReport" />
                              </Option>
                            ) : null}
                            {userData.Permission.EmployeeWorkLog
                              .EmployeeWorkLog_List === true ? (
                              <Option value="GetEmployeeReport">
                                <IntlMessages id="report.EmployeeReport" />
                              </Option>
                            ) : null}
                            {userData.Permission.Inspection.Inspection_List ===
                            true ? (
                              <Option value="GetInspectionReport">
                                <IntlMessages id="report.InspectionReport" />
                              </Option>
                            ) : null}
                          </Select>
                        )}
                      </FormItem>
                    )}
                  </FormattedMessage>
                  <FormattedMessage id="placeholder.StartDate">
                    {(placeholder) => (
                      <FormItem>
                        {getFieldDecorator("StartDate", {
                          rules: [
                            {
                              type: "object",
                              required: true,
                              message: (
                                <IntlMessages id="required.StartDateRequired" />
                              ),
                              whitespace: true,
                            },
                          ],
                        })(
                          <DatePicker
                            className="inline-inputs"
                            disabledDate={this.disabledStartDate}
                            format="DD/MM/YYYY"
                            value={startValue}
                            placeholder={placeholder}
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                          />
                        )}
                      </FormItem>
                    )}
                  </FormattedMessage>
                  <FormattedMessage id="placeholder.EndDate">
                    {(placeholder) => (
                      <FormItem>
                        {getFieldDecorator("EndDate", {
                          rules: [
                            {
                              type: "object",
                              required: true,
                              message: (
                                <IntlMessages id="required.EndDateRequired" />
                              ),
                              whitespace: true,
                            },
                          ],
                        })(
                          <DatePicker
                            className="inline-inputs"
                            disabledDate={this.disabledEndDate}
                            format="DD/MM/YYYY"
                            value={endValue}
                            placeholder={placeholder}
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                          />
                        )}
                      </FormItem>
                    )}
                  </FormattedMessage>
                  <FormItem>
                    <Button
                      className="inline-btn"
                      type="primary"
                      onClick={this.handleReporttypeChange}
                    >
                      <IntlMessages id="button.getReport" />
                    </Button>
                  </FormItem>
                  <FormItem>
                    {userData.Permission.UserReport.UserReport_List === true ? (
                      <Button
                        className="inline-btn"
                        type="primary"
                        onClick={this.handleExportExcel}
                      >
                        <IntlMessages id="button.exportExcel" />
                      </Button>
                    ) : (
                      <Button className="inline-btn" type="primary" disabled>
                        <IntlMessages id="button.exportExcel" />
                      </Button>
                    )}
                  </FormItem>
                </Form>
              </div>
            }
          >
            {tableData}
            {documentData}
            {this.props.loader ? (
              <div className="gx-loader-view">
                <CircularProgress />
              </div>
            ) : null}
          </Card>
        </div>
      );
    }
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_reports,
};

const viewReportForm = Form.create()(Report);

const mapStateToProps = (state) => {
  return {
    getReportsData: state.reportsReducers.get_reports_res,
    loader: state.reportsReducers.loader,
    showSuccessMessage: state.reportsReducers.showSuccessMessage,
    successMessage: state.reportsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.reportsReducers.showMessage,
    alertMessage: state.reportsReducers.alertMessage,
    status: state.reportsReducers.status,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(viewReportForm);
