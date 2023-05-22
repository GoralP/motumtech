import React, { Component } from "react";
import { Card, Divider, Table, Button, Input, Modal, Row, Col } from "antd";
import { connect } from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import IntlMessages from "util/IntlMessages";

import {
  getProcedures,
  deleteProcedureData,
} from "./../../../../appRedux/actions/BusinessProceduresActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";
import {
  getProcedureConfig,
  getProcedureConfigById,
  setStatusToInitial,
  deleteProcedure,
} from "./../../../../appRedux/actions/VisitProcedureAction";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { webURL, branchName } from "./../../../../util/config";

let langName = "";
let licenseId = "";
let permitAdd = "";
let permitEdit = "";
let permitDelete = "";
let IdentityId = "";
let processDataByID = "";

var searchTerm = "";

langName = localStorage.getItem(branchName + "_language");
const { Search } = Input;
var searchProcedureTerm = "";

class ProcedureManagement extends Component {
  constructor() {
    searchTerm = "";
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      addAreaModal: false,
      modalDeleteVisible: false,
      Id: "",
      area_name: "",
      editAreaFlag: "",
      delete_id: "",
      searchedArea: "",

      passProcedureData: [],
      passProcedureDetailData: [],
      passProcedureLaunchData: [],
      passProcessId: "",
      actionFlag: "",

      searchTerm: "",
      visitButton: "default",
      inspectionButton: "default",
      expedientButton: "default",
      allButton: "primary",
      searchedValue: "",
      modalProcedureVisible: false,
    };
  }

  getProcedureListById(
    pageNumber = "",
    sortBy = "-ProcedureId",
    perPage = "10",
    searchProcedureTerm = ""
  ) {
    if (this.props.loading == "Initial") {
      this.props.getProcedureConfig({
        pageNumber: 1,
        sortBy: "-ProcedureId",
        perPage: perPage,
        searchProcedureTerm: searchProcedureTerm,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-ProcedureId";
      }
      this.props.getProcedureConfig({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchProcedureTerm: searchProcedureTerm,
      });
    }
  }

  handleProcedureStatus = (e) => {
    var status_value = e.target.value;
    //this.setState({'filterTag': status_value});
    //this.get_identitiesById();
    if (status_value === "Visit") {
      this.setState({
        visitButton: "primary",
        inspectionButton: "default",
        expedientButton: "default",
        allButton: "default",
      });
    } else if (status_value === "Inspection") {
      this.setState({
        visitButton: "default",
        inspectionButton: "primary",
        expedientButton: "default",
        allButton: "default",
      });
    } else if (status_value === "Expedient") {
      this.setState({
        visitButton: "default",
        inspectionButton: "default",
        expedientButton: "primary",
        allButton: "default",
      });
    } else {
      this.setState({
        visitButton: "default",
        inspectionButton: "default",
        expedientButton: "default",
        allButton: "primary",
        searchedValue: "",
      });
    }
    searchTerm = status_value;
    // if (status_value === "") {
    //   searchTerm = "";
    // }
    var pagination_new = this.state.pagination;
    var pagesize = this.state.pagination.pageSize;
    pagination_new.current = 1;
    this.setState({ pagination: pagination_new });
    this.getProcedureListById("", "", pagesize, searchTerm);
  };

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_add =
        userData.Permission.BusinessProcedure.BusinessProcedure_Add;
      let permit_edit =
        userData.Permission.BusinessProcedure.BusinessProcedure_Edit;
      let permit_delete =
        userData.Permission.BusinessProcedure.BusinessProcedure_Delete;
      if (
        userData !== "" &&
        userData !== null &&
        userData["IdentityId"] !== undefined &&
        userData["id"] !== undefined &&
        permit_add !== undefined &&
        permit_edit !== undefined &&
        permit_delete !== undefined
      ) {
        licenseId = userData["id"];
        permitAdd = permit_add;
        permitEdit = permit_edit;
        permitDelete = permit_delete;
        IdentityId = userData["IdentityId"];
      }
    }
    this.props.setStatusToInitial();
    this.getProcedureListById();
    this.props.userRolePermissionByUserId(IdentityId);
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    var sortBy = "";
    if (sorter.order === "ascend") {
      sortBy = "+" + sorter.columnKey;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.columnKey;
    }
    this.getProcedureListById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchProcedureTerm
    );
  };

  onDeleteProcedure = (deleteId) => {
    this.setState({ modalDeleteVisible: true });
    this.setState({ delete_id: deleteId });
  };

  confirmDelete = () => {
    this.props.deleteProcedure({ deleteId: this.state.delete_id });
    // console.log("deleteid------>", deleteId);
    console.log("deleteid state------>", this.state.delete_id);
    this.setState({ modalDeleteVisible: false });
  };

  cancelDelete = (e) => {
    this.setState({ delete_id: "" });
    this.setState({ modalDeleteVisible: false });
  };

  handleChangeProcedureSearch = (e) => {
    var tempSearchedProcedure = e.target.value;
    this.setState({ searchedProcedure: tempSearchedProcedure });
  };

  handleProcedureSearch = (value) => {
    searchProcedureTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.getProcedureListById("", "", pagesize, searchProcedureTerm);
  };

  onEditProcedure = (pid) => {
    this.props.getProcedureConfigById(pid);
    this.setState({ actionFlag: "edit" });

    this.props.history.push({
      pathname: "/" + webURL + "main/home/add-visit-procedure",
      state: { actionFlag: "edit" },
    });
  };

  openProcedureViewModal = (id) => {
    this.props.getProcedureConfigById(id);
    this.setState({ modalProcedureVisible: true });
  };

  closeProcedureViewModal = () => {
    this.setState({ modalProcedureVisible: false });
  };

  render() {
    var proceduresData = this.props.getProcessConfigList;
    var procedureData = "";

    var singleProcedure = this.props.getProcedureById;
    var singleProcedureConfigDTO =
      singleProcedure != null && singleProcedure.ProcedureConfigDTO;

    var singleFormControlConfigDTO =
      singleProcedure != null && singleProcedure.FormControlConfigDTO;

    if (!proceduresData) {
      // Object is empty (Would return true in this example)
    } else {
      procedureData = proceduresData.ProcedureConfigList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = proceduresData.TotalCount;
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
        title: <IntlMessages id="procedures.processName" />,
        dataIndex: "ProcedureName",
        key: "ProcedureName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visit.processtype" />,
        dataIndex: "ProcedureType",
        key: "ProcedureType",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visit.participate" />,
        dataIndex: "NoOfParticipant",
        key: "NoOfParticipant",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.signerno" />,
        dataIndex: "NoOfSigner",
        key: "NoOfSigner",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="visitmanagement.signtype" />,
        dataIndex: "SignType",
        key: "SignType",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visit.identity" />,
        dataIndex: "CheckList",
        key: "CheckList",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        // render: (text) => <span className="">{text}</span>,
        render: (CheckList) => (CheckList === "" ? "None" : CheckList),
      },
      {
        title: <IntlMessages id="visit.copyemail" />,
        dataIndex: "CopyByEmail",
        key: "CopyByEmail",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        // render: (text) => <span className="">{text}</span>,
        render: (CopyByEmail) => (CopyByEmail === true ? "Yes" : "No"),
      },
      {
        title: <IntlMessages id="visitmanagement.smsalert" />,
        dataIndex: "SmsAlert",
        key: "SmsAlert",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        // render: (text) => <span className="">{text}</span>,
        render: (SmsAlert) => (SmsAlert === true ? "Yes" : "No"),
      },

      {
        title: <IntlMessages id="column.Action" />,
        key: "action",
        align: "center",
        fixed: "right",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.edit">
              {(title) => (
                <span className="gx-link">
                  {permitEdit === true ? (
                    <Button
                      onClick={() => this.onEditProcedure(record.ProcedureId)}
                      value={record.ProcedureId}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/edit.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      value={record.ProcedureId}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/edit.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  )}
                </span>
              )}
            </FormattedMessage>
            <Divider type="vertical" />
            <FormattedMessage id="columnlabel.delete">
              {(title) => (
                <span className="gx-link">
                  {permitDelete === true ? (
                    <Button
                      onClick={() => this.onDeleteProcedure(record.ProcedureId)}
                      value={record.ProcedureId}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/trash.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      value={record.ProcedureId}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/trash.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  )}
                </span>
              )}
            </FormattedMessage>
            <Divider type="vertical" />
            <FormattedMessage id="columnlabel.see">
              {(title) => (
                <span className="gx-link">
                  <Button
                    onClick={() =>
                      this.openProcedureViewModal(record.ProcedureId)
                    }
                    value={record.ProcedureId}
                    className="arrow-btn gx-link"
                  >
                    <img
                      src={require("assets/images/visibility.png")}
                      className="document-icons"
                      title={title}
                    />
                  </Button>
                </span>
              )}
            </FormattedMessage>
          </div>
        ),
      },
    ];

    const vidSignerColumns = [
      {
        title: <IntlMessages id="procedureDetails.page" />,
        dataIndex: "page",
        key: "page",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="procedureDetails.positionX" />,
        dataIndex: "doc_sig_posX",
        key: "doc_sig_posX",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="procedureDetails.positionY" />,
        dataIndex: "doc_sig_posY",
        key: "doc_sig_posY",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedureDetails.WidthX" />,
        dataIndex: "doc_sig_sizeX",
        key: "doc_sig_sizeX",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedureDetails.widthY" />,
        dataIndex: "doc_sig_sizeY",
        key: "doc_sig_sizeY",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
    ];

    const customFieldColumns = [
      {
        title: <IntlMessages id="visitmanagement.name" />,
        dataIndex: "DisplayName",
        key: "DisplayName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="visitmanagement.type" />,
        dataIndex: "Type",
        key: "Type",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="visitmanagement.defaultvalues" />,
        dataIndex: "DefaultValue",
        key: "DefaultValue",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.tags" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
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

    return (
      <Card
        className="custo_head_wrap"
        title={<IntlMessages id="sidebar.procedure" />}
        extra={
          <div className="card-extra-form">
            <FormattedMessage id="placeholder.Search">
              {(placeholder) => (
                <Search
                  placeholder={placeholder}
                  value={this.state.searchedProcedure}
                  onChange={this.handleChangeProcedureSearch}
                  onSearch={this.handleProcedureSearch}
                  style={{ marginRight: "10px", marginBottom: "0px" }}
                />
              )}
            </FormattedMessage>

            <Button
              type={this.state.visitButton}
              className="identity_button"
              onClick={this.handleProcedureStatus}
              value="Visit"
            >
              <IntlMessages id="generalsettings.visit" />
            </Button>

            <Button
              type={this.state.inspectionButton}
              className="identity_button"
              onClick={this.handleProcedureStatus}
              value="Inspection"
            >
              <IntlMessages id="generalsettings.inspection" />
            </Button>

            <Button
              type={this.state.expedientButton}
              className="identity_button"
              onClick={this.handleProcedureStatus}
              value="Expedient"
            >
              <IntlMessages id="generalsettings.expedient" />
            </Button>

            <Button
              type={this.state.allButton}
              className="identity_button"
              onClick={this.handleProcedureStatus}
              value=""
            >
              <IntlMessages id="button.ALL" />
            </Button>

            <Link
              to={{
                pathname: "add-visit-procedure",
                state: { passProcedureData: [] },
              }}
            >
              {permitAdd === true ? (
                <Button type="primary" className="gx-mb-0">
                  <IntlMessages id="procedureAdd.addProcedure" />
                </Button>
              ) : (
                <Button disabled type="primary" className="gx-mb-0">
                  <IntlMessages id="procedureAdd.addProcedure" />
                </Button>
              )}
            </Link>
          </div>
        }
      >
        <Table
          className="gx-table-responsive"
          rowKey="ProcedureId"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={procedureData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          // scroll={{ x: 2500, y: 450 }}
          // style={{ whiteSpace: "pre" }}
          scroll={{ x: true }}
        />
        <Modal
          className=""
          title={<IntlMessages id="procedureDelete.title" />}
          visible={this.state.modalDeleteVisible}
          destroyOnClose={true}
          onCancel={() => this.cancelDelete()}
          onOk={() => this.confirmDelete()}
          okText={<IntlMessages id="button.delete" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <div className="mail-successbox">
                <h4 className="err-text">
                  <IntlMessages id="procedureDelete.message" />
                </h4>
                <h4 style={{ color: "red" }}>
                  <IntlMessages id="procedureDelete.message.note" />
                </h4>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          className="detail-modal"
          title={<IntlMessages id="procedureDetails.title" />}
          visible={this.state.modalProcedureVisible}
          destroyOnClose={true}
          onCancel={this.closeProcedureViewModal}
          footer={null}
        >
          <Row className="detail-row">
            <Col lg={24}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="procedures.processName" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.procedureName : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visit.processtype" /> :
                </lable>
                <p>{singleProcedure != null ? singleProcedure.doc_type : ""}</p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visit.participate" /> :
                </lable>
                <p>
                  {singleProcedure != null
                    ? singleProcedure.doc_participants
                    : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.signerno" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.doc_signers : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.signtype" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.doc_sig_type : ""}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="detail-row">
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visit.identity" /> :
                </lable>
                <p>
                  {singleProcedure != null
                    ? singleProcedure.identity_checklist
                    : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.externallink" /> :
                </lable>
                <p>
                  {singleProcedure != null
                    ? singleProcedure.external_check
                    : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visit.copyemail" /> :
                </lable>
                <p>
                  {singleProcedure != null
                    ? singleProcedure.doc_copyByEmail
                    : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.emaillist" /> :
                </lable>
                <p>
                  {singleProcedure != null
                    ? singleProcedure.doc_listEmails
                    : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.fontfamily" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.FontFamily : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.fontsize" /> :
                </lable>
                <p>{singleProcedure != null ? singleProcedure.FontSize : ""}</p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.coustodyperiod" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.CustodyPeriod : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.periodvalue" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.CustodyValue : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.smsalert" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.SMS_Alert : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.smsprocess" /> :
                </lable>
                <p>
                  {singleProcedure != null ? singleProcedure.SMS_Process : ""}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.smstext" /> :
                </lable>
                <p>{singleProcedure != null ? singleProcedure.SMS_Text : ""}</p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="visitmanagement.senderlist" /> :
                </lable>
                <p>
                  {singleProcedure != null
                    ? singleProcedure.SMS_Senderlist
                    : ""}
                </p>
              </div>
            </Col>
            <Col lg={24}>
              <div style={{ marginBottom: "20px" }}>
                <lable className="vidsigner-det-row">
                  <IntlMessages id="visitmanagement.vidsignerconfiguration" /> :
                </lable>
                <br></br>
                <Table
                  className="gx-table-responsive"
                  rowKey="ProcedureId"
                  width="100%"
                  columns={vidSignerColumns}
                  dataSource={singleProcedureConfigDTO}
                  scroll={{ x: true }}
                  pagination={false}
                />
              </div>
            </Col>

            <Col lg={24}>
              <div>
                <lable className="vidsigner-det-row">
                  <IntlMessages id="procedureDetails.customField" /> :
                </lable>
                <br></br>
                <Table
                  className="gx-table-responsive"
                  rowKey="ProcedureId"
                  width="100%"
                  columns={customFieldColumns}
                  dataSource={singleFormControlConfigDTO}
                  scroll={{ x: true }}
                  pagination={false}
                />
              </div>
            </Col>
          </Row>
        </Modal>
        {/* {this.state.loader || this.props.loader ? (
          <div className="gx-loader-view">
            <CircularProgress />
          </div>
        ) : null} */}
      </Card>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  getProcedures,
  setStatusToInitial,
  deleteProcedureData,
  userRolePermissionByUserId,
  getProcedureConfig,
  getProcedureConfigById,
  deleteProcedure,
};

// const viewProcedureReportForm = Form.create()(Procedure);

const mapStateToProps = (state) => {
  return {
    getProcedureData: state.businessProceduresReducers.get_procedure_res,
    loader: state.visitProcedureReducers.loader,
    status: state.businessProceduresReducers.status,
    getProcessConfigList:
      state.visitProcedureReducers.procedureConfig.procedureconfigData,
    loading: state.visitProcedureReducers.procedureConfig.loading,
    getProcedureById:
      state.visitProcedureReducers.procedureById.procedureconfigByID,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcedureManagement);
