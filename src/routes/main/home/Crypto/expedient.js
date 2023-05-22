import React, { Component } from "react";
import { Card, Table, Button, Input, DatePicker, message, Form } from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import IntlMessages from "util/IntlMessages";
import {
  get_expedients,
  hideMessage,
  setstatustoinitial,
  get_reportexpedient,
  open_expedient_modal,
  close_expedient_modal,
} from "./../../../../appRedux/actions/ExpedientsActions";
import ExpDocuments from "./expdocuments";
import AddExpedient from "components/modal/AddExpedient";
import { FormattedMessage, injectIntl } from "react-intl";
import CircularProgress from "./../../../../components/CircularProgress/index";

var closeExpedientIds = [];

let userId = "";
let langName = "";
var expedientAdd = "";
var expedientClose = "";
var expedientDocument = "";
var expedientExport = "";
const FormItem = Form.Item;

class Expedient extends Component {
  constructor() {
    super();
    this.state = {
      addExpedientState: false,
      addDocumentsState: false,
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      loading: false,
      showExpedientForm: "",
      dni: "",
      startValue: "",
      endValue: "",
      endOpen: false,
      openButton: "default",
      manuallyClosedButton: "default",
      finishedOkButton: "default",
      periodOutButton: "default",
      allButton: "primary",
    };
  }

  get_expedientsById(
    pageNumber = "",
    sortBy = "",
    status = "",
    perPage = "10"
  ) {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && sortBy === "" && status !== "" && perPage !== "")
    ) {
      this.props.get_expedients({
        pageNumber: 1,
        sortBy: "-VisitId",
        status: status,
        perPage: perPage,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
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
              this.props.get_reportexpedient(condition);
            }
          }
        );
      } else {
        this.props.get_expedients({
          pageNumber: pageNumber,
          sortBy: sortBy,
          status: status,
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
      let permit_add = userData.Permission.Expedient.Expedient_Add;
      let permit_close_expedient =
        userData.Permission.Expedient.Expedient_CloseExpedient;
      let permit_document = userData.Permission.Expedient.Expedient_Document;
      let permit_export_excel =
        userData.Permission.Expedient.Expedient_ExportExcel;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_add !== undefined &&
        permit_close_expedient !== undefined &&
        permit_document !== undefined &&
        permit_export_excel !== undefined
      ) {
        userId = userData["id"];
        expedientAdd = permit_add;
        expedientClose = permit_close_expedient;
        expedientDocument = permit_document;
        expedientExport = permit_export_excel;
      }
    }
    this.props.setstatustoinitial();
    this.get_expedientsById();
  }

  componentDidUpdate() {
    if (this.props.expedientmodalclosecall === 2) {
      this.setState({ addExpedientState: false });
      this.props.close_expedient_modal(0);
    }
  }

  handleExpedientStatus = (e) => {
    var status_value = e.target.value;
    var pagesize = this.state.pagination.pageSize;
    if (status_value === "OPEN") {
      this.setState({
        openButton: "primary",
        manuallyClosedButton: "default",
        finishedOkButton: "default",
        periodOutButton: "default",
        allButton: "default",
      });
    } else if (status_value === "MANUALLY_CLOSED") {
      this.setState({
        openButton: "default",
        manuallyClosedButton: "primary",
        finishedOkButton: "default",
        periodOutButton: "default",
        allButton: "default",
      });
    } else if (status_value === "FINISHED_OK") {
      this.setState({
        openButton: "default",
        manuallyClosedButton: "default",
        finishedOkButton: "primary",
        periodOutButton: "default",
        allButton: "default",
      });
    } else if (status_value === "PERIOD_OUT") {
      this.setState({
        openButton: "default",
        manuallyClosedButton: "default",
        finishedOkButton: "default",
        periodOutButton: "primary",
        allButton: "default",
      });
    } else {
      this.setState({
        openButton: "default",
        manuallyClosedButton: "default",
        finishedOkButton: "default",
        periodOutButton: "default",
        allButton: "primary",
      });
    }
    this.get_expedientsById("", "", status_value, pagesize);
  };

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
          this.props.get_reportexpedient(condition);
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
    this.get_expedientsById(
      pagination.current,
      sortBy,
      "",
      pagination.pageSize
    );
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  onAddExpedient = () => {
    this.props.open_expedient_modal();
    this.setState({ addExpedientState: true });
  };
  onExpedientClose = () => {
    this.props.close_expedient_modal(1);
    this.setState({ addExpedientState: false });
  };

  onAddDocuments = (e) => {
    var visit_id = e.target.value;
    this.setState({ addDocumentsState: true, visit_id: visit_id });
  };
  onDocumentsClose = () => {
    this.setState({ addDocumentsState: false });
  };

  closeSelectedExpedient = () => {
    var finalClosesdExpedientIds = "";
    langName = localStorage.getItem(branchName + "_language");
    finalClosesdExpedientIds = closeExpedientIds.map((value, key) => {
      return value.VisitId;
    });
    if (finalClosesdExpedientIds.length <= 0) {
      message.error(
        this.props.intl.formatMessage({ id: "expedient.ExpedientSelect" })
      );
      return false;
    }
    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
      body: JSON.stringify(finalClosesdExpedientIds),
    };
    fetch(baseURL + "CloseExpedient?lang=" + langName, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json(); //then consume it again, the error happens
        }
      })
      .then((data) => {
        var parsed_response = data;
        var response_status = parsed_response.status;
        var response_message = parsed_response.message;
        if (response_status) {
          message.success(response_message);
        } else {
          message.error(response_message);
        }
      });
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
            if (this.props.getExpedientsData.TotalCount === 0) {
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
    var {
      addExpedientState,
      addDocumentsState,
      startValue,
      endValue,
      endOpen,
    } = this.state;

    if (this.props.expedientmodalclosecall) {
      addExpedientState = false;
    }

    var expedientsData = this.props.getExpedientsData;
    var expedientData = "";

    if (!expedientsData) {
      // Object is empty (Would return true in this example)
    } else {
      // Object is NOT empty
      expedientData = expedientsData.expedientList;
      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = expedientsData.TotalCount;
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
              {expedientDocument === true ? (
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
        closeExpedientIds = selectedRows;
      },
      getCheckboxProps: (record) => ({
        FullName: record.FullName,
      }),
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        title={<IntlMessages id="expedient.title" />}
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
                {expedientExport === true ? (
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
        <Button
          type={this.state.openButton}
          className="identity_button"
          onClick={this.handleExpedientStatus}
          value="OPEN"
        >
          <IntlMessages id="button.open" />
        </Button>
        <Button
          type={this.state.manuallyClosedButton}
          className="identity_button"
          onClick={this.handleExpedientStatus}
          value="MANUALLY_CLOSED"
        >
          <IntlMessages id="button.manuallyclosed" />
        </Button>
        <Button
          type={this.state.finishedOkButton}
          className="identity_button"
          onClick={this.handleExpedientStatus}
          value="FINISHED_OK"
        >
          <IntlMessages id="button.finishedok" />
        </Button>
        <Button
          type={this.state.periodOutButton}
          className="identity_button"
          onClick={this.handleExpedientStatus}
          value="PERIOD_OUT"
        >
          <IntlMessages id="button.periodout" />
        </Button>
        <Button
          type={this.state.allButton}
          className="identity_button"
          onClick={this.handleExpedientStatus}
          value=""
        >
          <IntlMessages id="button.ALL" />
        </Button>
        {expedientAdd === true ? (
          <Button
            className="float-btn-right cust-last-btns"
            type="primary"
            onClick={this.onAddExpedient}
          >
            <IntlMessages id="expedient.newExpedient" />
          </Button>
        ) : (
          <Button
            className="float-btn-right cust-last-btns"
            type="primary"
            disabled
          >
            <IntlMessages id="expedient.newExpedient" />
          </Button>
        )}
        {expedientClose === true ? (
          <Button
            className="float-btn-right cust-last-btns"
            type="primary"
            onClick={this.closeSelectedExpedient}
          >
            <IntlMessages id="expedient.closeSelectedExpedient" />{" "}
          </Button>
        ) : (
          <Button
            className="float-btn-right cust-last-btns"
            type="primary"
            disabled
          >
            <IntlMessages id="expedient.closeSelectedExpedient" />{" "}
          </Button>
        )}
        <hr />
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={expedientData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 1300, y: 400 }}
          // style={{ whiteSpace: "pre" }}
          scroll={{ x: true }}
        />
        <ExpDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
        />
        <AddExpedient
          open={addExpedientState}
          contact={{
            id: 1,
            name: "",
            thumb: "",
            email: "",
            phone: "",
            designation: "",
            selected: false,
            starred: false,
            frequently: false,
          }}
          onExpedientClose={this.onExpedientClose}
        />

        {/* {this.props.loader ?
          <div className="gx-loader-view">
            <CircularProgress/>
          </div> :
          null
        } */}
      </Card>
    );
  }
}

const viewExpedientReportForm = Form.create()(Expedient);

// Object of action creators
const mapDispatchToProps = {
  get_expedients,
  hideMessage,
  setstatustoinitial,
  get_reportexpedient,
  open_expedient_modal,
  close_expedient_modal,
};

const mapStateToProps = (state) => {
  return {
    getExpedientsData: state.expedientsReducers.get_expedients_res,
    loader: state.expedientsReducers.loader,
    showSuccessMessage: state.expedientsReducers.showSuccessMessage,
    successMessage: state.expedientsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.expedientsReducers.showMessage,
    alertMessage: state.expedientsReducers.alertMessage,
    status: state.expedientsReducers.status,
    expedientmodalclosecall: state.expedientsReducers.expedientmodalclosecall,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewExpedientReportForm));
