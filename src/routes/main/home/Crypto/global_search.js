import React, { Component } from "react";
import { Card, Divider, Table, Button, Tabs } from "antd";
import { connect } from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import TimeWithDateHelper from "./../../../helper/TimeWithDateHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import {
  hideMessage,
  setstatustoinitial,
  openmodal,
} from "./../../../../appRedux/actions/IdentitiesActions";
import AddIdentity from "components/modal/AddIdentity";
import VisDocuments from "./visdocuments";
import ProDocuments from "./prodocuments";
import ExpDocuments from "./expdocuments";
import InsDocuments from "./insdocuments";
import IntlMessages from "util/IntlMessages";
import { branchName } from "util/config";
import { FormattedMessage } from "react-intl";

const { TabPane } = Tabs;
var dataObject = {
  id: "",
  dni: "",
  company_name: "",
  name: "",
  identifier: "",
  surname: "",
  landline: "",
  second_surname: "",
  card_number: "",
  email: "",
  mobile: "",
  type: "",
  radioValue: "",
};

class Globalsearch extends Component {
  componentDidMount() {
    this.props.setstatustoinitial();
  }

  handleReporttypeChange = (e) => {
    var dniNumber = this.state.dni;
    var currentReport = this.state.reportType;
    var startingDate = DateForGetReport(this.state.startValue);
    var endingDate = DateForGetReport(this.state.endValue);
    var condition = {
      dniNumber: dniNumber,
      currentReport: currentReport,
      startingDate: startingDate,
      endingDate: endingDate,
    };
    this.props.get_reportdocument(condition);
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  onAddDocuments = (e) => {
    var visit_id = e.target.value;
    this.setState({ addDocumentsState: true, visit_id: visit_id });
  };
  onDocumentsClose = () => {
    this.setState({ addDocumentsState: false });
  };

  onAddIdentity = () => {
    this.setState({
      contact: {
        id: "",
        dni: "",
        company_name: "",
        name: "",
        identifier: "",
        surname: "",
        landline: "",
        second_surname: "",
        card_number: "",
        email: "",
        mobile: "",
        type: "",
        radioValue: "",
      },
    });
    this.props.openmodal();
    this.setState({ editIdentityFlag: "" });
    this.setState({ addIdentityState: true });
  };
  onIdentityClose = () => {
    this.setState({ addIdentityState: false });
  };

  handleEditIdentity = (e) => {
    var identityData = this.props.globaldata.Identites.find(
      (singleIdentity) => {
        return singleIdentity.id === e.target.value;
      }
    );
    var temprRadioValue = "";
    if (identityData.IS_BlackList) {
      temprRadioValue = "blacklisted";
    } else if (identityData.IS_WhiteList) {
      temprRadioValue = "whitelisted";
    }
    this.setState({ editIdentityFlag: "edit" });
    dataObject = {
      id: identityData.id,
      dni: identityData.DNI,
      company_name: identityData.CompanyName,
      name: identityData.Name,
      identifier: identityData.Identifier,
      surname: identityData.FatherSurname,
      landline: identityData.PhoneNumber,
      second_surname: identityData.MotherSurname,
      card_number: identityData.NICSNo,
      email: identityData.Email,
      mobile: identityData.MobileNumber,
      type: identityData.Type,
      radioValue: temprRadioValue,
    };
    this.props.openmodal();
    this.setState({ contact: dataObject });
    this.setState({ addIdentityState: true });
  };

  constructor() {
    super();
    this.state = {
      addIdentityState: false,
      addDocumentsState: false,
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
      contact: {
        id: "",
        dni: "",
        company_name: "",
        name: "",
        identifier: "",
        surname: "",
        landline: "",
        second_surname: "",
        card_number: "",
        email: "",
        mobile: "",
        type: "",
        radioValue: "",
      },
      editIdentityFlag: "",
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

  render() {
    const { addDocumentsState } = this.state;
    var { addIdentityState } = this.state;
    if (this.props.modalclosecall) {
      addIdentityState = false;
    }

    const columns1 = [
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
        dataIndex: "FatherSurname",
        key: "FatherSurname",
        sorter: true,
        render: (text, record) => (
          <span className="">
            {record.FatherSurname + " " + record.MotherSurname}
          </span>
        ),
      },
      {
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.DNI" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.identifier" />,
        dataIndex: "Identifier",
        key: "Identifier",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "RegisterDate",
        key: "RegisterDate",
        sorter: true,
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.details" />,
        key: "details",
        fixed: "right",
        render: (text, record) => (
          <span>
            {/* <span className="gx-link"><Button onClick={this.handleEditIdentity} value={record.id} className="arrow-btn gx-link">Edit</Button></span> */}
            <span className="gx-link">
              <Button
                onClick={this.handleEditIdentity}
                value={record.id}
                className="arrow-btn gx-link"
              >
                Ver
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

    const columns2 = [
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
        dataIndex: "FullSurName",
        key: "FullSurName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.DNI" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.host" />,
        dataIndex: "HostName",
        key: "HostName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.company" />,
        dataIndex: "CompanyName",
        key: "CompanyName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.VisitTime" />,
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        render: (text) => TimeWithoutDateHelper(text),
      },
      {
        title: <IntlMessages id="column.DepartureTime" />,
        dataIndex: "DepartureTime",
        key: "DepartureTime",
        sorter: true,
        render: (text) => TimeWithoutDateHelper(text),
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

    const columns3 = [
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
        dataIndex: "FullSurName",
        key: "FullSurName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.DNI" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.company" />,
        dataIndex: "CompanyName",
        key: "CompanyName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "procedureDate",
        key: "procedureDate",
        sorter: true,
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.time" />,
        dataIndex: "procedureDate",
        key: "procedureDate",
        sorter: true,
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

    const columns4 = [
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

    const columns5 = [
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
        dataIndex: "FullSurName",
        key: "FullSurName",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.DNI" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "procedureDate",
        key: "procedureDate",
        sorter: true,
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.VisitTime" />,
        dataIndex: "procedureDate",
        key: "procedureDate",
        sorter: true,
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

    const columns6 = [
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

    const columns7 = [
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
                  </span>
                )}
              </FormattedMessage>
              <Divider type="vertical" />
              <FormattedMessage id="actiondocument.Print">
                {(title) => (
                  <span className="gx-link">
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
                  </span>
                )}
              </FormattedMessage>
            </div>
          </div>
        ),
      },
    ];

    const { size } = this.state;

    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);

      return (
        <Card title={<IntlMessages id="placeholder.Search" />}>
          <Tabs defaultActiveKey="1" type="card" size={size}>
            <TabPane tab={<IntlMessages id="identity.title" />} key="1">
              <Table
                className="gx-table-responsive custom-identity-table"
                columns={columns1}
                dataSource={this.props.globaldata.Identites}
                loading={this.state.loading}
              />
            </TabPane>
            {userData.licenceVisit === true ? (
              <TabPane tab={<IntlMessages id="visit.title" />} key="2">
                <Table
                  className="gx-table-responsive custom-identity-table"
                  columns={columns2}
                  dataSource={this.props.globaldata.Visits}
                  loading={this.state.loading}
                  scroll={{ x: 1300 }}
                />
              </TabPane>
            ) : null}
            {userData.licenceProcedure === true ? (
              <TabPane tab={<IntlMessages id="procedure.title" />} key="3">
                <Table
                  className="gx-table-responsive custom-identity-table"
                  columns={columns3}
                  dataSource={this.props.globaldata.Procedures}
                  loading={this.state.loading}
                />
              </TabPane>
            ) : null}
            {userData.licenceExpedient === true ? (
              <TabPane tab={<IntlMessages id="expedient.title" />} key="4">
                <Table
                  className="gx-table-responsive custom-identity-table"
                  columns={columns4}
                  dataSource={this.props.globaldata.Expedients}
                  loading={this.state.loading}
                  scroll={{ x: 1300 }}
                />
              </TabPane>
            ) : null}
            {userData.licenceInspection === true ? (
              <TabPane tab={<IntlMessages id="inspection.title" />} key="5">
                <Table
                  className="gx-table-responsive custom-identity-table"
                  columns={columns5}
                  dataSource={""}
                  loading={this.state.loading}
                />
              </TabPane>
            ) : null}
            <TabPane tab={<IntlMessages id="employeeworklog.title" />} key="6">
              <Table
                className="gx-table-responsive custom-identity-table"
                columns={columns6}
                dataSource={this.props.globaldata.EmployeeLog}
                loading={this.state.loading}
              />
            </TabPane>
            <TabPane tab={<IntlMessages id="document.title" />} key="7">
              <Table
                className="gx-table-responsive custom-identity-table"
                columns={columns7}
                dataSource={""}
                loading={this.state.loading}
                scroll={{ x: 1300 }}
              />
            </TabPane>
          </Tabs>
          <AddIdentity
            open={addIdentityState}
            editIdentityFlag={this.state.editIdentityFlag}
            contact={this.state.contact}
            onSaveIdentity={this.onSaveIdentity}
            onIdentityClose={this.onIdentityClose}
          />
          <VisDocuments
            open={addDocumentsState}
            visit_id={this.state.visit_id}
            onDocumentsClose={this.onDocumentsClose}
          />
          <ProDocuments
            open={addDocumentsState}
            visit_id={this.state.visit_id}
            onDocumentsClose={this.onDocumentsClose}
          />
          <ExpDocuments
            open={addDocumentsState}
            visit_id={this.state.visit_id}
            onDocumentsClose={this.onDocumentsClose}
          />
          <InsDocuments
            open={addDocumentsState}
            visit_id={this.state.visit_id}
            onDocumentsClose={this.onDocumentsClose}
          />
        </Card>
      );
    }
  }
}

// Object of action creators

const mapDispatchToProps = {
  hideMessage,
  setstatustoinitial,
  openmodal,
};

const mapStateToProps = (state) => {
  return {
    loader: state.identitiesReducers.loader,
    showSuccessMessage: state.identitiesReducers.showSuccessMessage,
    successMessage: state.identitiesReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.identitiesReducers.showMessage,
    alertMessage: state.identitiesReducers.alertMessage,
    status: state.identitiesReducers.status,
    modalclosecall: state.identitiesReducers.modalclosecall,
    globaldata: state.visitsReducers.globaldata,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Globalsearch);
