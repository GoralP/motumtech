import React, { Component } from "react";
import {
  Card,
  Divider,
  Table,
  Button,
  Select,
  Input,
  DatePicker,
  message,
  Form,
  Modal,
  Radio,
} from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import IntlMessages from "util/IntlMessages";
import {
  get_documents,
  hideDocumentMessage,
  setstatustoinitial,
  get_reportdocument,
} from "./../../../../appRedux/actions/DocumentsActions";
import DocDocuments from "./docdocuments";
import { FormattedMessage, injectIntl } from "react-intl";
import CircularProgress from "./../../../../components/CircularProgress/index";

// var printDocumentIds = [];
var filterBy = "";
var filterClick = false;
let userId = "";
let langName = "";
var documentDelete = "";
var documentDownload = "";
var documentPrint = "";
var documentExport = "";
var documentResend = "";

const FormItem = Form.Item;
const { confirm } = Modal;

class Document extends Component {
  get_documentsById(
    pageNumber = "",
    sortBy = "-DocumentID",
    filterBy = "",
    perPage = "10"
  ) {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && sortBy === "" && filterBy !== "" && perPage !== "")
    ) {
      this.props.get_documents({
        pageNumber: 1,
        sortBy: "-DocumentID",
        filterBy: filterBy,
        perPage: perPage,
      });
    } else {
      this.props.hideDocumentMessage();
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-DocumentID";
      }

      if (!filterClick) {
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
                this.props.get_reportdocument(condition);
              }
            }
          );
        }
      } else {
        this.props.get_documents({
          pageNumber: pageNumber,
          sortBy: sortBy,
          filterBy: filterBy,
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
      documentType: "",
      dni: "",
      startValue: "",
      endValue: "",
      endOpen: false,
      resendDocumentState: false,
      resendDocumentId: "",
      radioValue: "",
      detailDocumentState: false,
    };
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    langName = localStorage.getItem(branchName + "_language");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_delete = userData.Permission.Document.Document_CancelDocument;
      let permit_download =
        userData.Permission.Document.Document_DownloadDocument;
      let permit_export_excel =
        userData.Permission.Document.Document_ExportExcel;
      let permit_print = userData.Permission.Document.Document_PrintDocument;
      let permit_resend = userData.Permission.Document.Document_ResendDocument;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_delete !== undefined &&
        permit_download !== undefined &&
        permit_export_excel !== undefined &&
        permit_print !== undefined &&
        permit_resend !== undefined
      ) {
        userId = userData["id"];
        documentDelete = permit_delete;
        documentDownload = permit_download;
        documentExport = permit_export_excel;
        documentPrint = permit_print;
        documentResend = permit_resend;
      }
    }
    this.props.setstatustoinitial();
    this.get_documentsById();
  }

  handleReporttypeChange = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          filterClick = false;
          var dniNumber = this.state.dni;
          var currentReport = this.state.reportType;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

          var pageNumber = 1;
          var perPage = "10";
          var sortBy = "-DocumentID";
          // const pager = { ...this.state.pagination };
          // pager.perPage = perPage;
          // this.setState({pagination: pager});
          var condition = {
            dniNumber: dniNumber,
            currentReport: currentReport,
            startingDate: startingDate,
            endingDate: endingDate,
            pageNumber: pageNumber,
            sortBy: sortBy,
            perPage: perPage,
          };
          this.setState({ documentType: "" });
          this.props.get_reportdocument(condition);
        }
      }
    );
  };

  handleFilterChange = (e) => {
    // var currentDocument = this.state.documentType;
    filterClick = true;
    this.setState({ dni: "" });
    this.setState({
      startValue: "",
      endValue: "",
    });

    const form = this.props.form;
    form.setFieldsValue({ ["StartDate"]: "", ["EndDate"]: "" });

    var pagesize = this.state.pagination.pageSize;
    if (this.state.documentType === "" && filterBy !== "") {
      filterBy = "";
    }
    if (filterBy === "") {
      this.get_documentsById();
    } else {
      this.get_documentsById("", "", filterBy, pagesize);
    }
  };

  handleDocumentChange = (value) => {
    var selected_value = `${value}`;
    filterBy = selected_value;
    this.setState({ documentType: selected_value });
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
    if (sorter.order === "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.field;
    }
    filterClick = true;
    this.get_documentsById(
      pagination.current,
      sortBy,
      currentDocument,
      pagination.pageSize
    );
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  //Downloading Document in pdf file format
  downloadDocumentData = (docid) => {
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

    var documentData = this.props.getDocumentsData.DocumentList.find(
      (singleDocument) => {
        return singleDocument.DocumentID === docid;
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
      // this.props.get_documents();
      this.get_documentsById();
    });
  };

  //Print document
  handlePrint = (docid) => {
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

    var documentData = this.props.getDocumentsData.DocumentList.find(
      (singleDocument) => {
        return singleDocument.DocumentID === docid;
      }
    );

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

    fetch(
      baseURL + "DownloadDocument?licenceId=" + userId,
      requestOptions
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        var docOpen = window.open(url);
        docOpen.focus();
        docOpen.print();
      });
    });
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
          var dniNumber = this.state.dni;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);
          langName = localStorage.getItem(branchName + "_language");

          fetch(
            baseURL +
              "ExportDocumentExcel?licenseId=" +
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
            if (this.props.getDocumentsData.TotalCount === 0) {
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

  //open detail document popup
  onDetailDocumentOpen = (document_id) => {
    this.setState({ detailDocumentState: true, document_id: document_id });
  };
  onDetailDocumentClose = () => {
    this.setState({ detailDocumentState: false });
  };

  handleCancelDocument = (docid) => {
    confirm({
      title: "Are you sure cancel signature for this document?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        let authBasic = "";

        authBasic = localStorage.getItem("setAuthToken");
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + authBasic,
          },
          //body: JSON.stringify(documentData)
        };

        langName = localStorage.getItem(branchName + "_language");

        fetch(
          baseURL +
            "DeleteDocumentFromVidSigner?documentId=" +
            docid +
            "&lang=" +
            langName,
          requestOptions
        )
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            message.success(result.message);
            // this.props.get_documents();
            this.get_documentsById();
          });
      },
      onCancel() {
        //message.error('Abort cancel document signature.');
      },
    });
  };

  onResendDocument = (docid) => {
    this.setState({ resendDocumentId: docid, resendDocumentState: true });
  };

  onResendDocClose = () => {
    this.setState({ resendDocumentState: false });
  };

  handleResendDocument = (e) => {
    langName = localStorage.getItem(branchName + "_language");
    if (this.state.radioValue === "") {
      message.error(
        this.props.intl.formatMessage({ id: "document.DocumentSelect" })
      );
    } else {
      let authBasic = "";

      authBasic = localStorage.getItem("setAuthToken");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
        // body: JSON.stringify(documentData)
      };

      fetch(
        baseURL +
          "ResendDocumentToVidsigner?documentId=" +
          this.state.resendDocumentId +
          "&Mode=" +
          this.state.radioValue +
          "&lang=" +
          langName,
        requestOptions
      )
        .then((response) => {
          if (response.ok) {
            return response.json(); //then consume it again, the error happens
          }
        })
        .then((data) => {
          message.success(data.message);
          this.setState({
            resendDocumentState: false,
            resendDocumentId: "",
            radioValue: "",
          });
          // this.props.get_documents();
          this.get_documentsById();
        });
    }
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
    const {
      startValue,
      endValue,
      endOpen,
      resendDocumentState,
      detailDocumentState,
    } = this.state;
    const RadioGroup = Radio.Group;
    var documentsData = this.props.getDocumentsData;
    var documentData = "";

    if (!documentsData) {
      // Object is empty (Would return true in this example)
    } else {
      documentData = documentsData.DocumentList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = documentsData.TotalCount;
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
    const columns = [
      {
        title: <IntlMessages id="column.DocumentName" />,
        dataIndex: "DocumentName",
        key: "DocumentName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render(text, record) {
          return {
            props: {
              style: { color: record.Color },
            },
            children: <div>{text}</div>,
          };
        },
      },
      {
        title: <IntlMessages id="column.OwnerName" />,
        dataIndex: "OwnerName",
        key: "OwnerName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.OwnerNIF" />,
        dataIndex: "OwnerNIF",
        key: "OwnerNIF",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.OwnerEmail" />,
        dataIndex: "OwnerEmail",
        key: "OwnerEmail",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.CreateDate" />,
        dataIndex: "CreationDate",
        key: "CreationDate",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.SignCompleted" />,
        dataIndex: "SignedParticipant",
        key: "SignedParticipant",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
      },
      {
        title: <IntlMessages id="column.SignRequested" />,
        dataIndex: "DocParticipant",
        key: "DocParticipant",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
      },
      {
        title: <IntlMessages id="column.DocumentType" />,
        dataIndex: "DocumentType",
        key: "DocumentType",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
      },
      {
        title: <IntlMessages id="column.Action" />,
        key: "download",
        fixed: "right",
        align: "center",
        render: (text, record) => (
          <div>
            <div className="cust-doc-icons">
              <FormattedMessage id="actiondocument.Download">
                {(title) => (
                  <span className="gx-link">
                    {documentDownload === true ? (
                      <Button
                        className="arrow-btn gx-link"
                        onClick={() =>
                          this.downloadDocumentData(record.DocumentID)
                        }
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/download-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    ) : (
                      <Button
                        className="arrow-btn gx-link"
                        disabled
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/download-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    )}
                  </span>
                )}
              </FormattedMessage>
              <Divider type="vertical" />
              <FormattedMessage id="actiondocument.Print">
                {(title) => (
                  <span className="gx-link">
                    {documentPrint === true ? (
                      <Button
                        className="arrow-btn gx-link"
                        onClick={() => this.handlePrint(record.DocumentID)}
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/print-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    ) : (
                      <Button
                        className="arrow-btn gx-link"
                        disabled
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/print-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    )}
                  </span>
                )}
              </FormattedMessage>
              <Divider type="vertical" />
              {record.DocGuid !== "" ||
              record.DocParticipant !== record.SignedParticipant ||
              record.Color !== "red" ? (
                <FormattedMessage id="actiondocument.Cancel">
                  {(title) => (
                    <span className="gx-link">
                      {documentDelete === true ? (
                        <Button
                          className="arrow-btn gx-link"
                          onClick={() =>
                            this.handleCancelDocument(record.DocumentID)
                          }
                          value={record.DocumentID}
                        >
                          <img
                            src={require("assets/images/document/cancel-doc.png")}
                            className="document-icons"
                            alt={title}
                            title={title}
                          />
                        </Button>
                      ) : (
                        <Button
                          className="arrow-btn gx-link"
                          disabled
                          value={record.DocumentID}
                        >
                          <img
                            src={require("assets/images/document/cancel-doc.png")}
                            className="document-icons"
                            alt={title}
                            title={title}
                          />
                        </Button>
                      )}
                    </span>
                  )}
                </FormattedMessage>
              ) : null}
            </div>
            <div className="cust-doc-icons">
              {record.DocParticipant !== 0 ? (
                <FormattedMessage id="actiondocument.Detail">
                  {(title) => (
                    <span className="gx-link">
                      <Button
                        className="arrow-btn gx-link"
                        onClick={() =>
                          this.onDetailDocumentOpen(record.DocumentID)
                        }
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/detail-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    </span>
                  )}
                </FormattedMessage>
              ) : null}
              <Divider type="vertical" />
              <FormattedMessage id="actiondocument.ResendDocument">
                {(title) => (
                  <span className="gx-link">
                    {documentResend === true ? (
                      <Button
                        className="arrow-btn gx-link"
                        onClick={() => this.onResendDocument(record.DocumentID)}
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/resend-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    ) : (
                      <Button
                        className="arrow-btn gx-link"
                        disabled
                        value={record.DocumentID}
                      >
                        <img
                          src={require("assets/images/document/resend-doc.png")}
                          className="document-icons"
                          alt={title}
                          title={title}
                        />
                      </Button>
                    )}
                  </span>
                )}
              </FormattedMessage>
            </div>
          </div>
        ),
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // printDocumentIds = selectedRows;
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

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        className="custo_head_wrap"
        title={<IntlMessages id="document.title" />}
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
                      setFieldsValue: { startValue },
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
                      setFieldsValue: { endValue },
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
                {documentExport === true ? (
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
        <div className="document-filter-form">
          <Button
            className="inline-btn last-btn-css"
            type="primary"
            onClick={this.handleFilterChange}
          >
            <IntlMessages id="todo.filters" />
          </Button>
          <Select
            onChange={this.handleDocumentChange}
            value={this.state.documentType ? this.state.documentType : ""}
            placeholder="None"
            className="gx-mr-3 gx-mb-3 inline-inputs"
          >
            <Option value="">
              <IntlMessages id="option.ALL" />
            </Option>
            <Option value="VISIT">
              <IntlMessages id="visit.title" />
            </Option>
            <Option value="GENERAL">
              <IntlMessages id="general.title" />
            </Option>
            <Option value="INSPECTION">
              <IntlMessages id="inspection.title" />
            </Option>
            <Option value="CustomProcedureTemplate">
              <IntlMessages id="option.CustomProcedureTemplate" />
            </Option>
          </Select>
        </div>
        <Table
          className="gx-table-responsive cust-fixed-table"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={documentData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 2000, y: 400 }}
          // style={{ whiteSpace: "pre" }}
          scroll={{ x: true }}
        />

        <DocDocuments
          open={detailDocumentState}
          document_id={this.state.document_id}
          onDetailDocumentClose={this.onDetailDocumentClose}
        />

        <Modal
          title={<IntlMessages id="actiondocument.ResendDocument" />}
          visible={resendDocumentState}
          destroyOnClose={true}
          onOk={this.handleResendDocument}
          onCancel={this.onResendDocClose}
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <Form onSubmit={this.handleResendDocument}>
                <div className="gx-form-group">
                  <FormItem>
                    {getFieldDecorator("radioValue", {
                      initialValue: this.state.radioValue,
                      rules: [
                        {
                          required: true,
                          message: "Please Choose your option!",
                        },
                      ],
                    })(
                      <RadioGroup
                        name={"radioValue"}
                        onChange={(event) =>
                          this.setState({ radioValue: event.target.value })
                        }
                        value={this.state.radioValue}
                      >
                        <Radio value={"LastUpdatedStatus"}>
                          <IntlMessages id="resendsign.lastupdatestatus" />
                        </Radio>
                        <Radio value={"Fresh"}>
                          <IntlMessages id="resendsign.fresh" />
                        </Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
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
  get_documents,
  hideDocumentMessage,
  setstatustoinitial,
  get_reportdocument,
};

const viewDocumentReportForm = Form.create()(Document);

const mapStateToProps = (state) => {
  return {
    getDocumentsData: state.documentsReducers.get_documents_res,
    loader: state.documentsReducers.loader,
    showSuccessMessage: state.documentsReducers.showSuccessMessage,
    successMessage: state.documentsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.documentsReducers.showMessage,
    alertMessage: state.documentsReducers.alertMessage,
    status: state.documentsReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewDocumentReportForm));
