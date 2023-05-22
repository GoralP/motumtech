import React, { Component } from "react";
import { Card, Table, Button, Input, DatePicker, message, Form } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import IntlMessages from "util/IntlMessages";
import {
  get_inspections,
  hideMessage,
  setstatustoinitial,
  get_reportinspection,
} from "./../../../../appRedux/actions/InspectionsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import InsDocuments from "./insdocuments";
import { FormattedMessage, injectIntl } from "react-intl";

let userId = "";
let langName = "";
var inspectionDocument = "";
var inspectionExport = "";
const FormItem = Form.Item;

class Inspection extends Component {
  get_inspectionsById(pageNumber = "", sortBy = "-VisitId", perPage = "10") {
    if (this.props.status === "Initial") {
      this.props.get_inspections({
        pageNumber: 1,
        sortBy: "-VisitId",
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
        sortBy = "-VisitId";
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
              this.props.get_reportinspection(condition);
            }
          }
        );
      } else {
        this.props.get_inspections({
          pageNumber: pageNumber,
          sortBy: sortBy,
          perPage: perPage,
        });
      }
    }
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    langName = localStorage.getItem(branchName + "_language");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_document = userData.Permission.Inspection.Inspection_Document;
      let permit_export_excel =
        userData.Permission.Inspection.Inspection_ExportExcel;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_document !== undefined &&
        permit_export_excel !== undefined
      ) {
        userId = userData["id"];
        inspectionDocument = permit_document;
        inspectionExport = permit_export_excel;
      }
    }
    this.props.setstatustoinitial();
    this.get_inspectionsById();
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
          var sortBy = "-VisitId";
          var condition = {
            dniNumber: dniNumber,
            currentReport: currentReport,
            startingDate: startingDate,
            endingDate: endingDate,
            pageNumber: pageNumber,
            sortBy: sortBy,
            perPage: perPage,
          };
          this.props.get_reportinspection(condition);
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
    this.get_inspectionsById(pagination.current, sortBy, pagination.pageSize);
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

  constructor() {
    super();
    this.state = {
      addDocumentsState: false,
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
            if (this.props.getInspectionsData.TotalCount === 0) {
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
    const { addDocumentsState, startValue, endValue, endOpen } = this.state;

    var inspectionsData = this.props.getInspectionsData;
    var inspectionData = "";

    if (!inspectionsData) {
      // Object is empty (Would return true in this example)
    } else {
      inspectionData = inspectionsData.InspectionList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = inspectionsData.TotalCount;
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
              {inspectionDocument === true ? (
                <Button
                  onClick={this.onAddDocuments}
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
                </Button>
              ) : (
                <Button
                  disabled
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
                </Button>
              )}
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
        FullName: record.FullName,
      }),
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        title={<IntlMessages id="inspection.title" />}
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
                {inspectionExport === true ? (
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
          dataSource={inspectionData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
        />
        <InsDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
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
  get_inspections,
  hideMessage,
  setstatustoinitial,
  get_reportinspection,
};

const viewInspectionReportForm = Form.create()(Inspection);

const mapStateToProps = (state) => {
  return {
    getInspectionsData: state.inspectionsReducers.get_inspections_res,
    loader: state.inspectionsReducers.loader,
    showSuccessMessage: state.inspectionsReducers.showSuccessMessage,
    successMessage: state.inspectionsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.inspectionsReducers.showMessage,
    alertMessage: state.inspectionsReducers.alertMessage,
    status: state.inspectionsReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewInspectionReportForm));
