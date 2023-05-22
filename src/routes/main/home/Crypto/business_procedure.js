import React, { Component } from "react";
import {
  Card,
  Divider,
  Table,
  Button,
  Col,
  Row,
  Input,
  message,
  Form,
  Modal,
} from "antd";
import { connect } from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import IntlMessages from "util/IntlMessages";

import {
  getProcedures,
  setStatusToInitial,
  deleteProcedureData,
  getCountData,
} from "./../../../../appRedux/actions/BusinessProceduresActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { webURL, branchName } from "./../../../../util/config";

let langName = "";
let licenseId = "";
let permitAdd = "";
let permitEdit = "";
let permitDelete = "";
let IdentityId = "";

langName = localStorage.getItem(branchName + "_language");
const { Search } = Input;
var searchProcedureTerm = "";

class BusinessProcedure extends Component {
  constructor() {
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
      passCountData: [],
      passProcessId: "",
    };
  }

  getProcedureListById(
    pageNumber = "",
    sortBy = "-Id",
    perPage = "10",
    searchProcedureTerm = ""
  ) {
    if (this.props.status == "Initial") {
      this.props.getProcedures({
        pageNumber: 1,
        sortBy: "-Id",
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
        sortBy = "-Id";
      }
      this.props.getProcedures({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchProcedureTerm: searchProcedureTerm,
      });
    }
  }

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
    this.props.deleteProcedureData({ deleteId: this.state.delete_id });
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
    var procedureData = this.props.getProcedureData.BusinessProcedureList.find(
      (singleProcedure) => {
        return singleProcedure.Id === pid;
      }
    );

    this.props.history.push({
      pathname: "/" + webURL + "main/home/add-procedure",
      state: { passProcedureData: procedureData },
    });
    console.log("state data------>", this.state.passProcedureData);
  };

  handleGetDetailedView = (p_id) => {
    var procedureDetailData =
      this.props.getProcedureData.BusinessProcedureList.find(
        (singleProcedure) => {
          return singleProcedure.Id === p_id;
        }
      );

    this.props.getCountData({ ProcedureId: p_id });
    this.props.history.push({
      pathname: "/" + webURL + "main/home/procedure-detail",
      state: {
        passProcedureDetailData: procedureDetailData,
        passCountData: this.props.getcounterData,
      },
    });
  };

  handleGetProcessData = (b_P_id) => {
    var processConfigData =
      this.props.getProcedureData.BusinessProcedureList.find(
        (singleProcedure) => {
          return singleProcedure.Id === b_P_id;
        }
      );

    // console.log("test----->", processConfigData.ProcessConfig.ProcessType);
    this.props.history.push({
      pathname: "/" + webURL + "main/home/procedure-launch",
      state: { passProcedureLaunchData: processConfigData },
    });
  };

  render() {
    var proceduresData = this.props.getProcedureData;
    var procedureData = "";

    // var test = this.props.getcounterData;

    // console.log("counter data--->", test);

    if (!proceduresData) {
      // Object is empty (Would return true in this example)
    } else {
      procedureData = proceduresData.BusinessProcedureList;

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
        dataIndex: "Name",
        key: "MuncipaltyProcess.ProcessName",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="areaAdd.areaName" />,
        dataIndex: "Area.Name",
        key: "MuncipaltyArea.Name",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="departmentAdd.departmentName" />,
        dataIndex: "Department.Name",
        key: "MuncipaltyDepartment.Name",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="serviceAdd.serviceName" />,
        dataIndex: "Service.Name",
        key: "MuncipaltyService.Name",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.processConfig" />,
        dataIndex: "ProcessConfig.Name",
        key: "ProcessConfig.Name",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.instructionEmail" />,
        dataIndex: "WorkInstructionEmail.Email",
        key: "WorkInstructionEmail.Email",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.moreAPIKey" />,
        dataIndex: "MoreAppApiKey",
        key: "MoreAppApiKey",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.moreClientID" />,
        dataIndex: "MoreAppClientId",
        key: "MoreAppClientId",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.dataCaptureForm" />,
        dataIndex: "DataCaptureFormId",
        key: "DataCaptureFormId",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.inspectionValidation" />,
        dataIndex: "InspectionValidationFiled",
        key: "InspectionValidationFiled",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.inspectionForm" />,
        dataIndex: "InspectionFormId",
        key: "InspectionFormId",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="areaAdd.creationDate" />,
        dataIndex: "CreationDate",
        key: "CreationDate",
        sorter: true,

        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => DateWithoutTimeHelper(text),
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
                      onClick={() => this.onEditProcedure(record.Id)}
                      value={record.Id}
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
                      value={record.Id}
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
                      onClick={() => this.onDeleteProcedure(record.Id)}
                      value={record.Id}
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
                      value={record.Id}
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
                    onClick={() => this.handleGetDetailedView(record.Id)}
                    value={record.Id}
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
            <Divider type="vertical" />
            <FormattedMessage id="columnlabel.launch">
              {(title) => (
                <span className="gx-link">
                  {record.Type === "oneFormWorkInstruction" ? (
                    <Button
                      onClick={() => this.handleGetProcessData(record.Id)}
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/rocket-launch.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/rocket-launch.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  )}
                </span>
              )}
            </FormattedMessage>
          </div>
        ),
      },
    ];

    console.log("columns--->", columns);

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
        title={<IntlMessages id="sidebar.procedures" />}
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
            <Link
              to={{
                pathname: "add-procedure",
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
          rowKey="Id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={procedureData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          // style={{ whiteSpace: "pre" }}
          // scroll={{ x: 3050, y: 450 }}
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
              </div>
            </div>
          </div>
        </Modal>
        {this.state.loader || this.props.loader ? (
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
  getProcedures,
  setStatusToInitial,
  deleteProcedureData,
  userRolePermissionByUserId,
  getCountData,
};

// const viewProcedureReportForm = Form.create()(Procedure);

const mapStateToProps = (state) => {
  return {
    getProcedureData: state.businessProceduresReducers.get_procedure_res,
    getcounterData: state.businessProceduresReducers.getCounter.data,
    loader: state.businessProceduresReducers.loader,
    status: state.businessProceduresReducers.status,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessProcedure);
