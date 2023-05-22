import React, { Component } from "react";
import { Card, Table, Button, Input, DatePicker, message, Form } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import TimeWithDateHelper from "./../../../helper/TimeWithDateHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import IntlMessages from "util/IntlMessages";
import {
  get_employees,
  hideMessage,
  setstatustoinitial,
  get_reportemployee,
} from "./../../../../appRedux/actions/EmployeesActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage, injectIntl } from "react-intl";

var userId = "";
var langName = "";
var employeeLogExport = "";
const FormItem = Form.Item;

class EmployeeWorkLog extends Component {
  get_employeesById(pageNumber = "", sortBy = "-Id", perPage = "10") {
    if (this.props.status === "Initial") {
      this.props.get_employees({
        pageNumber: 1,
        sortBy: "-Id",
        perPage: perPage,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-Id";
      }
      if (this.props.status === "Datareortloaded") {
        this.props.form.validateFieldsAndScroll(
          ["StartDate", "EndDate"],
          (err, values) => {
            if (!err) {
              var dniNumber = this.state.dni;
              var currentReport = this.state.reportType;
              var startingDate = DateForGetReport(this.state.startValue);
              var endingDate = DateForGetReport(this.state.endValue);

              var condition = {
                dniNumber: dniNumber,
                currentReport: currentReport,
                startingDate: startingDate,
                endingDate: endingDate,
                pageNumber: pageNumber,
                sortBy: sortBy,
                perPage: perPage,
              };
              this.props.get_reportemployee(condition);
            }
          }
        );
      } else {
        this.props.get_employees({
          pageNumber: pageNumber,
          sortBy: sortBy,
          perPage: perPage,
        });
      }
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
      startValue: "",
      endValue: "",
      endOpen: false,
    };
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    langName = localStorage.getItem(branchName + "_language");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_export_excel =
        userData.Permission.EmployeeWorkLog.EmployeeWorkLog_ExportExcel;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_export_excel !== undefined
      ) {
        userId = userData["id"];
        employeeLogExport = permit_export_excel;
      }
    }
    this.props.setstatustoinitial();
    this.get_employeesById();
  }

  handleReporttypeChange = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          var dniNumber = this.state.dni;
          var currentReport = this.state.reportType;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

          var pageNumber = 1;
          var perPage = "10";
          var sortBy = "-Id";
          var condition = {
            dniNumber: dniNumber,
            currentReport: currentReport,
            startingDate: startingDate,
            endingDate: endingDate,
            pageNumber: pageNumber,
            sortBy: sortBy,
            perPage: perPage,
          };
          this.props.get_reportemployee(condition);
        }
      }
    );
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    var sortBy = "";
    if (sorter.order === "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.field;
    }
    this.get_employeesById(pagination.current, sortBy, pagination.pageSize);
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
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
    let authBasic = "";
    authBasic = localStorage.getItem("setAuthToken");
    this.props.form.validateFieldsAndScroll(
      ["StartDate", "EndDate"],
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
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

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
            if (this.props.getEmployeesData.TotalCount === 0) {
              message.error(
                this.props.intl.formatMessage({ id: "global.NoData" })
              );
            } else {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
            }
            // window.location.href = response.url;
          });
        }
      }
    );
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;

    console.log("initial--->", this.props.status === "Initial");

    var employeesData = this.props.getEmployeesData;
    var employeeData = "";

    if (!employeesData) {
      // Object is empty (Would return true in this example)
    } else {
      employeeData = employeesData.EmployeeLog;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = employeesData.TotalCount;
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

    const columns = [
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

    const rowSelection = {
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

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        title={<IntlMessages id="employeeworklog.title" />}
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
                {employeeLogExport === true ? (
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
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={employeeData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
        />
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
  get_employees,
  hideMessage,
  setstatustoinitial,
  get_reportemployee,
};

const viewEmployeeReportForm = Form.create()(EmployeeWorkLog);

const mapStateToProps = (state) => {
  return {
    getEmployeesData: state.employeesReducers.get_employees_res,
    loader: state.employeesReducers.loader,
    showSuccessMessage: state.employeesReducers.showSuccessMessage,
    successMessage: state.employeesReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.employeesReducers.showMessage,
    alertMessage: state.employeesReducers.alertMessage,
    status: state.employeesReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewEmployeeReportForm));
