import React, { Component } from "react";
import {
  Card,
  Icon,
  Table,
  Button,
  Col,
  Row,
  Input,
  message,
  Modal,
  Form,
  Select,
  Tabs,
  Upload,
} from "antd";
import { connect } from "react-redux";
import { baseURL, webURL, branchName } from "./../../../../util/config";
import IntlMessages from "util/IntlMessages";
import {
  getProcessWorkInstructionData,
  saveProcedureLaunchData,
  deleteProcessData,
  processNamesForDropDownList,
  setStatusToInitial,
} from "./../../../../appRedux/actions/ProcessActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage, injectIntl } from "react-intl";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";

const Option = Select.Option;
const FormItem = Form.Item;
const { Search } = Input;

let langName = "";
let userId = "";
let identityId = "";

var searchProcessTerm = "";
var searchedColumn = "";
var filterByData = "";
var verificationSerch = "";
var businessProcessId = "";

let timeout;
let currentValue;
var columnNo = [];

function fetchList(keyword, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = keyword;

  function fake() {
    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    };

    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["IdentityId"] !== undefined &&
        userData["IdentityId"] !== undefined
      ) {
        userId = userData["id"];
        identityId = userData["IdentityId"];
      }
    }

    fetch(
      baseURL +
        "GetIdentites?licenseId=" +
        userId +
        "&IdentityId=" +
        identityId +
        "&PageNumber=1&Sort=-id&PerPage=25&FilterTag=&searchTerm=" +
        keyword,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (currentValue === keyword) {
          if (res) {
            callback(res.data.identites);
            console.log("res--->", res.data);
          } else {
            // Do nothing
            // console.log("RESULT BLANK =>", res);
          }
        }
      });
  }
  timeout = setTimeout(fake, 300);
}

class ProcedureLaunch extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      columnSearch: "",
      verificationColumn: "",
      searchedProcess: "",
      procedureName: "",
      procedureType: "",
      viewIdentityModal: false,
      selectIdentity: "",
      identityList: [],
      selectedIdentities: [],
      giaFilterType: "",
      filterValue: "Validation",
      singleBasicProcess: [],
    };
  }

  getProcessById(
    pageNumber = "",
    sortBy = "-RowId",
    perPage = "10",
    searchedColumn = "",
    searchProcessTerm = "",
    businessProcessId = "",
    filterByData = ""
  ) {
    if (this.props.location.state) {
      businessProcessId = this.props.location.state.passProcedureLaunchData.Id;
      if (this.props.status == "Initial") {
        this.props.getProcessWorkInstructionData({
          pageNumber: 1,
          sortBy: "-RowId",
          perPage: perPage,
          searchedColumn: searchedColumn,
          searchProcessTerm: searchProcessTerm,
          ProcessId: businessProcessId,
          filterByData: filterByData,
        });
      } else {
        if (pageNumber == "") {
          pageNumber = 1;
        }
        if (perPage == "") {
          perPage = "10";
        }
        if (sortBy == "") {
          sortBy = "-RowId";
        }

        this.props.getProcessWorkInstructionData({
          pageNumber: pageNumber,
          sortBy: sortBy,
          perPage: perPage,
          searchedColumn: searchedColumn,
          searchProcessTerm: searchProcessTerm,
          ProcessId: businessProcessId,
          filterByData: filterByData,
        });
      }
    }
  }

  componentDidMount() {
    langName = localStorage.getItem(branchName + "_language");
    if (this.props.location.state) {
      const procedureDataArray =
        this.props.location.state.passProcedureLaunchData;
      if (procedureDataArray.length !== 0) {
        this.setState({ procedureName: procedureDataArray.Name });
        this.setState({
          procedureType: procedureDataArray.ProcessConfig.ProcessType,
        });
        this.setState({
          giaFilterType: procedureDataArray.GiaFilterType,
        });
        this.setState({ filterValue: procedureDataArray.GiaFilterType });
        var pagesize = this.state.pagination.pageSize;

        filterByData =
          procedureDataArray.ProcessConfig.ProcessType == "GIA" &&
          procedureDataArray.GiaFilterType == "Inspection"
            ? "Inspection"
            : procedureDataArray.ProcessConfig.ProcessType == "GIA" &&
              procedureDataArray.GiaFilterType == "Validation"
            ? "Validation"
            : procedureDataArray.ProcessConfig.ProcessType == "GIA" &&
              procedureDataArray.GiaFilterType == "Both"
            ? "Validation"
            : procedureDataArray.ProcessConfig.ProcessType == "BulkUpload"
            ? ""
            : "";

        this.getProcessById(
          "",
          "",
          pagesize,
          (searchedColumn = ""),
          (searchProcessTerm = ""),
          businessProcessId,
          filterByData
        );
      }
      let userdata = localStorage.getItem(branchName + "_data");
      if (userdata != "" && userdata != null) {
        let userData = JSON.parse(userdata);
        if (
          userData != "" &&
          userData != null &&
          userData["id"] != undefined &&
          userData["IdentityId"] != undefined
        ) {
          userId = userData["id"];
          identityId = userData["IdentityId"];
        }
      }
      this.props.userRolePermissionByUserId(identityId);
    } else {
      this.props.history.push({
        pathname: "/" + webURL + "main/home/procedure",
      });
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    var sortBy = "";
    if (sorter.order == "ascend") {
      sortBy = "%2B" + sorter.field;
    } else if (sorter.order == "descend") {
      sortBy = "-" + sorter.field;
    }
    this.getProcessById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchedColumn,
      searchProcessTerm,
      businessProcessId,
      filterByData
    );
  };

  handleChangeProcessSearch = (e) => {
    var tempSearchedProcess = e.target.value;
    this.setState({ searchedProcess: tempSearchedProcess });
  };

  handleProcessSearch = (value) => {
    searchProcessTerm = value;
    searchedColumn = this.state.columnSearch;
    filterByData = this.state.filterValue;
    var pagesize = this.state.pagination.pageSize;
    this.getProcessById(
      "",
      "",
      pagesize,
      searchedColumn,
      searchProcessTerm,
      businessProcessId,
      filterByData
    );
  };

  handleVerificationSearch = (value) => {
    console.log("value---->", value);
    filterByData = value;
    this.setState({ filterValue: value });
    var pagesize = this.state.pagination.pageSize;
    this.getProcessById(
      "",
      "",
      pagesize,
      searchedColumn,
      searchProcessTerm,
      businessProcessId,
      filterByData
    );
  };

  handleGoBack = () => {
    this.props.history.push({
      pathname: "/" + webURL + "main/home/business-procedure",
    });
  };

  onSelectIdentity = () => {
    this.setState({ viewIdentityModal: true });
  };

  closeSelectIdentityModal = () => {
    this.setState({
      viewIdentityModal: false,
      identityList: [],
      selectIdentity: "",
    });
  };

  handleSearchUser = (search) => {
    var keyword = search.trim();
    if (keyword && keyword.length >= 3) {
      fetchList(keyword, (data) => {
        this.setState({ identityList: data });
      });
    }
  };

  openDetailViewModal = (id) => {
    var singleDetails =
      this.props.getProcessWorkInstructionDataList.ProcessList.find(
        (singleProcedure) => {
          return singleProcedure.RowId === id;
        }
      );
    // var columnNoArray = singleDetails.map((item, index) => {
    let select = (columnNo, singleDetails) =>
      columnNo.reduce(
        (r, e) => Object.assign(r, { [e]: singleDetails[e] }),
        {}
      );
    var output = select(columnNo, singleDetails);
    // return output;
    console.log("OUTPUT=>", output);
    // });

    this.setState({ singleBasicProcess: output });
    this.setState({ modalDetailsVisible: true });
  };

  closeDetailViewModal = () => {
    this.setState({ modalDetailsVisible: false });
  };

  handleProcedureLaunch = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["selectIdentity"],
      (err, values) => {
        if (!err) {
          if (this.state.selectIdentity !== "") {
            var procedureId =
              this.props.location.state.passProcedureLaunchData.Id;
            this.props.saveProcedureLaunchData({
              BusinessProcedureId: procedureId,
              IdentityId: this.state.selectIdentity,
              data: this.state.selectedIdentities,
              filterType:
                this.state.giaFilterType === "Both"
                  ? this.state.filterValue
                  : this.state.giaFilterType,
            });

            var filterType =
              this.state.giaFilterType === "Both"
                ? this.state.filterValue
                : this.state.giaFilterType;

            console.log("filtertype---->", filterType);
            this.setState({
              viewIdentityModal: false,
              identityList: [],
              selectedIdentities: [],
              selectIdentity: "",
            });
            this.props.history.push({
              pathname: "/" + webURL + "main/home/procedure-launch",
              state: {
                passProcedureLaunchData:
                  this.props.location.state.passProcedureLaunchData,
              },
            });
          } else {
            message.error(
              this.props.intl.formatMessage({
                id: "required.procedureLaunch.selectIdentity",
              })
            );
          }
        }
      }
    );
  };

  render() {
    var processDataListing = this.props.getProcessWorkInstructionDataList;
    var processDataList = "";
    columnNo = [];
    var processDataColumn = "";
    // console.log("procedure name---->", this.state.procedureType);
    console.log("gia filter type--->", this.state.giaFilterType);
    console.log("process type--->", this.state.procedureType);

    console.log("process data lit----->", processDataListing);

    //Training Course Data
    if (!processDataListing) {
      // Object is empty (Would return true in this example)
    } else {
      processDataList = processDataListing.ProcessList;
      processDataColumn = processDataListing.ColumnList;
      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = processDataListing.TotalCount;
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
      } else if (
        pagination.total != "" &&
        pagination.total != old_pagination_total
      ) {
        pagination.current = 1;
        this.setState({
          pagination,
        });
      } else if (
        (pagination.total == "" || pagination.total == 0) &&
        pagination.total != old_pagination_total
      ) {
        this.setState({
          pagination,
        });
      }
    }

    var columns = [];
    var columnsAddEdit = [];
    var columnDropDown = [];
    var columnYes = [];

    if (this.state.procedureType === "GIA") {
      if (processDataColumn.length > 0) {
        processDataColumn.map((item, index) => {
          if (index === 0) {
            {
              Object.keys(item).filter((key) => {
                if (item[key] === "YES") {
                  columnYes.push(key);

                  columns.push({
                    title: key,
                    dataIndex: key,
                    key: key,
                    sorter: true,
                    sortDirections: ["ascend", "descend", "ascend"],
                    render(text, record) {
                      if (
                        record.WorkInstructionCreated === "Si" &&
                        record.DocumentCreated === "Si" &&
                        record.Giasubmitted === "Si"
                      ) {
                        return {
                          props: {
                            style: { color: "green" },
                          },
                          children: <div>{text}</div>,
                        };
                      } else if (
                        record.WorkInstructionCreated === "Si" &&
                        record.DocumentCreated === "NO" &&
                        record.Giasubmitted === "NO"
                      ) {
                        return {
                          props: {
                            style: { color: "orange" },
                          },
                          children: <div>{text}</div>,
                        };
                      } else if (
                        record.WorkInstructionCreated === "NO" &&
                        record.DocumentCreated === "NO" &&
                        record.Giasubmitted === "NO"
                      ) {
                        return {
                          props: {
                            style: { color: "red" },
                          },
                          children: <div>{text}</div>,
                        };
                      } else if (
                        record.WorkInstructionCreated === "Si" &&
                        record.DocumentCreated === "Si" &&
                        record.Giasubmitted === "NO"
                      ) {
                        return {
                          props: {
                            style: { color: "#8B0000" }, // dark red
                          },
                          children: <div>{text}</div>,
                        };
                      }
                    },
                  });
                }
                if (item[key] === "NO") {
                  columnNo.push(key);
                }
              });
            }
            columnsAddEdit = columns;
          }
        });
      }
    } else {
      if (processDataList.length > 0) {
        processDataList.map((item, index) => {
          if (index === 0) {
            {
              Object.keys(item).map((key) => {
                columns.push({
                  title: key,
                  dataIndex: key,
                  key: key,
                  sorter: true,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render(text, record) {
                    if (
                      record.WorkInstructionCreated === "Si" &&
                      record.DocumentCreated === "Si"
                    ) {
                      return {
                        props: {
                          style: { color: "green" },
                        },
                        children: <div>{text}</div>,
                      };
                    } else if (
                      record.WorkInstructionCreated === "Si" &&
                      record.DocumentCreated === "NO"
                    ) {
                      return {
                        props: {
                          style: { color: "orange" },
                        },
                        children: <div>{text}</div>,
                      };
                    } else if (
                      record.WorkInstructionCreated === "NO" &&
                      record.DocumentCreated === "NO"
                    ) {
                      return {
                        props: {
                          style: { color: "black" },
                        },
                        children: <div>{text}</div>,
                      };
                    }
                  },
                  // render: text => <span className="">{text}</span>,
                });
              });
            }
            columnsAddEdit = columns;
          }
        });
        columnDropDown = columnsAddEdit.slice(0, -1);
      }
    }

    if (processDataList.length > 0) {
      columns.push({
        title: <IntlMessages id="column.Action" />,
        key: "printReport",
        fixed: "right",
        align: "center",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.see">
              {(title) => (
                <span className="gx-link">
                  {this.state.procedureType === "GIA" ? (
                    <Button
                      onClick={() => this.openDetailViewModal(record.RowId)}
                      className="arrow-btn gx-link"
                      value={record.Id}
                    >
                      <img
                        src={require("assets/images/visibility.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      onClick={() => this.openDetailViewModal(record.RowId)}
                      className="arrow-btn gx-link"
                      value={record.Id}
                    >
                      <img
                        src={require("assets/images/visibility.png")}
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
      });
      columnDropDown = columnsAddEdit.slice(0, -1);
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedIdentities: selectedRows });
      },
      getCheckboxProps: (record) => ({
        Name: record.Name,
      }),
    };

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    const formItemLayoutNew = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const processprops = {
      beforeUpload: (file) => {
        let fileExt = file.name.split(".");
        fileExt = fileExt[fileExt.length - 1];
        const isFileExt =
          fileExt.toLowerCase() === "xls" || fileExt.toLowerCase() === "xlsx";
        const isExcelFile =
          file.type === "xls" ||
          file.type === "xlsx" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel";

        if (!isExcelFile && !isFileExt) {
          message.error(
            this.props.intl.formatMessage({ id: "global.UploadExcel" })
          );
        } else {
          this.setState({ ProcessUpload: file });
        }
        return false;
      },
    };

    return (
      <div className="ant-card gx-card ant-card-bordered custo_head_wrap">
        <div className="ant-card-head">
          <div className="ant-card-head-wrapper">
            <span
              className="gx-text-primary gx-fs-md gx-pointer gx-d-block"
              onClick={() => this.handleGoBack()}
            >
              <i
                className={`icon icon-long-arrow-left cust-gx-fs-xxl gx-d-inline-flex gx-vertical-align-middle`}
              />
            </span>
            <div className="ant-card-head-title cust-card-head-title">
              {this.state.procedureName}
            </div>
            <div className="ant-card-extra">
              <div className="card-extra-form cust-process-form">
                <FormattedMessage id="processColumn.selectColumn">
                  {(placeholder) => (
                    <Select
                      style={{
                        marginRight: "10px",
                        marginBottom: "0px",
                        width: "250px",
                      }}
                      onChange={(value, event) =>
                        this.setState({ columnSearch: `${value}` })
                      }
                      placeholder={placeholder}
                    >
                      {columnDropDown.map((item) => {
                        return <Option value={item.title}>{item.title}</Option>;
                      })}
                    </Select>
                  )}
                </FormattedMessage>
                <FormattedMessage id="placeholder.Search">
                  {(placeholder) => (
                    <Search
                      placeholder={placeholder}
                      value={this.state.searchedProcess}
                      onChange={this.handleChangeProcessSearch}
                      onSearch={this.handleProcessSearch}
                      style={{
                        marginRight: "10px",
                        marginBottom: "0px",
                        width: "230px",
                      }}
                    />
                  )}
                </FormattedMessage>
                {this.state.giaFilterType === "Both" &&
                this.state.procedureType === "GIA" ? (
                  <Select
                    defaultValue="Validation"
                    style={{
                      marginRight: "10px",
                      marginBottom: "0px",
                      width: "250px",
                    }}
                    onChange={(value) => this.handleVerificationSearch(value)}
                  >
                    <Option value="Validation">
                      <IntlMessages id="procedureLaunch.verificationPlan" />
                    </Option>
                    <Option value="Inspection">
                      <IntlMessages id="procedureLaunch.all" />
                    </Option>
                  </Select>
                ) : (
                  ""
                )}

                {this.state.selectedIdentities.length > 0 ? (
                  <Button
                    type="primary"
                    className="gx-mb-0"
                    onClick={() => this.onSelectIdentity()}
                  >
                    <IntlMessages id="button.Next" />
                  </Button>
                ) : (
                  <Button disabled type="primary" className="gx-mb-0">
                    <IntlMessages id="button.Next" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="ant-card-body">
          <Table
            className="gx-table-responsive cust-table-height cust-data-table cust-dynamic-columns"
            rowKey={(record) => record.RowId}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={processDataList}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            loading={this.state.loading}
            // scroll={{ x: true, y: 400 }}
            // style={{ whiteSpace: "pre" }}
            scroll={{ x: true }}
            // summary={() => (
            //   <Table.Summary>
            //     <Table.Summary.Row>
            //       <Table.Summary.Cell index={0} colSpan={2}>
            //         <Button>hello</Button>
            //       </Table.Summary.Cell>
            //       <Table.Summary.Cell index={2} colSpan={8}>
            //         Scroll Context
            //       </Table.Summary.Cell>
            //     </Table.Summary.Row>
            //   </Table.Summary>
            // )}
            footer={() => (
              <Button className="total-count-btn">
                TotalCount :{" "}
                {processDataListing != null
                  ? processDataListing.TotalCount
                  : ""}
              </Button>
            )}
          />
          <Modal
            maskClosable={false}
            onCancel={this.closeSelectIdentityModal}
            visible={this.state.viewIdentityModal}
            closable={true}
            okText={<IntlMessages id="additentity.save" />}
            cancelText={<IntlMessages id="globalButton.cancel" />}
            onOk={this.handleProcedureLaunch}
            destroyOnClose={true}
            className="cust-modal-width cust-session-modal"
          >
            <div className="gx-modal-box-row">
              <div className="gx-modal-box-form-item">
                <Form>
                  <div className="gx-form-group" style={{ paddingTop: "10px" }}>
                    <Row>
                      <Col lg={24} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label={
                            <IntlMessages id="procedureLaunch.selectIdentity" />
                          }
                        >
                          {getFieldDecorator("selectIdentity", {
                            initialValue: this.state.selectIdentity,
                            rules: [
                              {
                                required: true,
                                message: (
                                  <IntlMessages id="required.procedureLaunch.selectIdentity" />
                                ),
                              },
                            ],
                          })(
                            <Select
                              showSearch
                              defaultActiveFirstOption={false}
                              showArrow={true}
                              filterOption={false}
                              onSearch={this.handleSearchUser}
                              onChange={(value, event) =>
                                this.setState({ selectIdentity: `${value}` })
                              }
                              notFoundContent={null}
                            >
                              {Object.keys(this.state.identityList).length > 0
                                ? this.state.identityList.map((item) => {
                                    return (
                                      <Option value={item.id}>
                                        {item.Name} {item.FatherSurname} (
                                        {item.DNI})
                                      </Option>
                                    );
                                  })
                                : null}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </div>
          </Modal>

          <Modal
            className="detail-modal"
            title={<IntlMessages id="basicProcessView.title" />}
            visible={this.state.modalDetailsVisible}
            destroyOnClose={true}
            onCancel={this.closeDetailViewModal}
            footer={null}
          >
            <Row className="detail-row">
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="addidentity.Name" /> : */}
                    codiens
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.codiens
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    nomens
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.nomens
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    implantada
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.implantada
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    annexid
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.annexid
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    sectoreconomic
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.sectoreconomic
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    titularmunicipal
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.titularmunicipal
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    abocaments
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.abocaments
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    dataabocaments
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.dataabocaments
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    tipuscomercial
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.tipuscomercial
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    comercialnivell1
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.comercialnivell1
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    comercialnivell2
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.comercialnivell2
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    comercialcodidiba
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.comercialcodidiba
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    serveinivell1
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.serveinivell1
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    serveinivell2
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.serveinivell2
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    serveicodidiba
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.serveicodidiba
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    piscinaid
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.piscinaid
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    piscinadescripcio
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.piscinadescripcio
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    risclegionelaid
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.risclegionelaid
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    risclegioneladescripcio
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.risclegioneladescripcios
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    torrescondensadores
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.torrescondensadores
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    centralshumidificadores
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.centralshumidificadores
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    aiguacalenta
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.aiguacalenta
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    instaltermals
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.instaltermals
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    jacuzzi
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.jacuzzi
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    humectadors
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.humectadors
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    fonts
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.fonts
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    reg
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.reg
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    aiguaincendis
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.aiguaincendis
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    altresaparells
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.altresaparells
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    nombreplantilla
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.nombreplantilla
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    requereixpau
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.requereixpau
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    competenciapauid
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.competenciapauid
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    datahomologacipau
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.datahomologacipau
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    relmunicipi
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.relmunicipi
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    relcomarca
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.relcomarca
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    codinace
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.codinace
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    descripcionace
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.descripcionace
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    inspire
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.inspire
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    classifcomercial
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.classifcomercial
                      : ""}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    ine10
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.ine10
                      : ""}
                  </p>
                </div>
              </Col>
              {/* <Col lg={12}>
                <div className="det-row">
                  <lable>
                  
                    adreca
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.adreca
                      : ""}
                  </p>
                </div>
              </Col> */}
              <Col lg={12}>
                <div className="det-row">
                  <lable>
                    {/* <IntlMessages id="identityDetail.FatherSurname" /> : */}
                    adrecacompleta
                  </lable>
                  <p>
                    {this.state.singleBasicProcess !== null
                      ? this.state.singleBasicProcess.adrecacompleta
                      : ""}
                  </p>
                </div>
              </Col>
            </Row>
          </Modal>

          {this.props.loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  getProcessWorkInstructionData,
  saveProcedureLaunchData,
  deleteProcessData,
  userRolePermissionByUserId,
  processNamesForDropDownList,
  setStatusToInitial,
};

const viewProcedureLaunchReportForm = Form.create()(ProcedureLaunch);

const mapStateToProps = (state) => {
  return {
    getProcessWorkInstructionDataList:
      state.processReducers.get_process_Work_res,
    processDropDownList: state.processReducers.get_process_dropdown,
    loader: state.processReducers.loader,
    status: state.processReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewProcedureLaunchReportForm));
