import React, { Component } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Modal,
  Tag,
  Row,
  Col,
  Form,
  Select,
  Checkbox,
  DatePicker,
} from "antd";
import { connect } from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import IntlMessages from "util/IntlMessages";
import { getProcedures } from "./../../../../appRedux/actions/BusinessProceduresActions";
import { getLogManagement } from "./../../../../appRedux/actions/LogManagementActions";
import {
  // getLicenseDropdown,
  setStatusToInitial,
} from "./../../../../appRedux/actions/VisitProcedureAction";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";
// import {
//   getLicenseDetails,
//   getAllModule,
//   createNewLicense,
// } from "./../../../../appRedux/actions/LicenseManagementAction";
import { Link } from "react-router-dom";

import { webURL, branchName } from "./../../../../util/config";

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const CheckboxGroup = Checkbox.Group;

let langName = "";
// let licenseId = "";
// let permitAdd = "";
// let permitEdit = "";
// let permitDelete = "";
let IdentityId = "";
let currentData = "";
let currentlogValue = "";
let previousData = "";
let previouslogValue = "";
let licenseId = "";

langName = localStorage.getItem(branchName + "_language");
const { Search } = Input;
var searchProcedureTerm = "";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

// const plainOptions = [
//   "Department",
//   "Service",
//   "Area",
//   "Procedure",
//   "Identities",
//   "User Management",
//   "Configuration",
// ];

class LogManagement extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      addAreaModal: false,
      Id: "",
      searchedArea: "",
      modalLicenseVisible: "",
      licenceKey: "",
      licenceCode: "",
      adminCompanyName: "",
      adminUsername: "",
      expiryDate: "",
      ModuleAccess: [],
      logDni: "",
      logModule: "",
      logType: "",
      logStartDate: "",
      logEndDate: "",
      modalCurrentValue: false,
    };
  }

  getLogListById(
    pageNumber = "",
    sortBy = "-Id",
    perPage = "10",
    searchProcedureTerm = "",
    // licenseId = "",
    data = ""
  ) {
    if (this.props.loading == "Initial") {
      this.props.getLogManagement({
        pageNumber: 1,
        sortBy: "-Id",
        perPage: perPage,
        searchProcedureTerm: searchProcedureTerm,
        // licenseId: licenseId,
        data: "",
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
      this.props.getLogManagement({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchProcedureTerm: searchProcedureTerm,
        // licenseId: licenseId,
        data: data,
      });
    }
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      // let permit_add =
      //   userData.Permission.BusinessProcedure.BusinessProcedure_Add;
      // let permit_edit =
      //   userData.Permission.BusinessProcedure.BusinessProcedure_Edit;
      // let permit_delete =
      //   userData.Permission.BusinessProcedure.BusinessProcedure_Delete;
      if (
        userData !== "" &&
        userData !== null &&
        // userData["IdentityId"] !== undefined &&
        userData["id"] !== undefined
        // permit_add !== undefined &&
        // permit_edit !== undefined &&
        // permit_delete !== undefined
      ) {
        licenseId = userData["id"];
        // permitAdd = permit_add;
        // permitEdit = permit_edit;
        // permitDelete = permit_delete;
        // IdentityId = userData["IdentityId"];
      }
    }
    // this.props.getLicenseDetails();
    // this.props.getAllModule();
    this.props.setStatusToInitial();
    // this.props.getLicenseDropdown();

    var logFilterData = {
      LicenseId: licenseId,
    };

    this.getLogListById("", "", "", "", logFilterData);
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

    var logFilterData = {
      LicenseId: licenseId,
      DNI: this.state.logDni,
      Module: this.state.logModule,
      Type: this.state.logType,
      StartDate: this.state.logStartDate,
      EndDate: this.state.logEndDate,
    };
    this.getLogListById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchProcedureTerm,
      logFilterData
      // this.state.licenseId
    );
  };

  handleFilterChange = (e) => {
    e.preventDefault();

    var logFilterData = {
      LicenseId: licenseId,
      DNI: this.state.logDni,
      Module: this.state.logModule,
      Type: this.state.logType,
      StartDate: this.state.logStartDate,
      EndDate: this.state.logEndDate,
    };
    this.props.form.validateFieldsAndScroll(["EndDate"], (err, values) => {
      if (!err) {
        console.log("logfilter-->", logFilterData);
        this.getLogListById(
          "",
          "",
          "",
          "",
          // this.state.licenseId,
          logFilterData
        );
      }
    });
  };

  handleFilterAll = (e) => {
    e.preventDefault();

    var logFilterData = {
      LicenseId: licenseId,
      DNI: "",
      Module: "",
      Type: "",
      StartDate: "",
      EndDate: "",
    };

    this.getLogListById(
      "",
      "",
      "",
      "",
      // this.state.licenseId,
      logFilterData
    );
    // this.props.form.validateFieldsAndScroll(["EndDate"], (err, values) => {
    //   if (!err) {
    //     console.log("logfilter-->", logFilterData);
    //     this.getLogListById(
    //       "",
    //       "",
    //       "",
    //       "",
    //       // this.state.licenseId,
    //       logFilterData
    //     );
    //   }
    // });
  };

  handleChangeProcedureSearch = (e) => {
    var tempSearchedProcedure = e.target.value;
    this.setState({ searchedProcedure: tempSearchedProcedure });
  };

  handleProcedureSearch = (value) => {
    searchProcedureTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.getLogListById("", "", "", "", pagesize, searchProcedureTerm);
  };

  openAddLicenseModal = (id) => {
    this.setState({ modalLicenseVisible: true });
  };

  closeAddLicenseModal = () => {
    this.setState({ modalLicenseVisible: false });
  };

  openCurrentValueModal = (Id) => {
    currentData = this.props.getLogDataList.LogData.find((singleData) => {
      return singleData.Id === Id;
    });

    currentlogValue = JSON.stringify(
      JSON.parse(currentData.CurrentValue),
      null,
      2
    );

    this.setState({ modalCurrentValue: true });
  };

  closeCurrentValueModal = () => {
    this.setState({ modalCurrentValue: false });
  };

  openPreviousValueModal = (Id) => {
    previousData = this.props.getLogDataList.LogData.find((singleData) => {
      return singleData.Id === Id;
    });

    previouslogValue = JSON.stringify(
      JSON.parse(previousData.PreviousValue),
      null,
      2
    );

    this.setState({ modalPreviousValue: true });
  };

  closePreviousValueModal = () => {
    this.setState({ modalPreviousValue: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var str = this.state.ModuleAccess;
    var moduleString = str.toString();
    var moduleArray = moduleString.split(",");

    // var licenseData = {
    //   licenceKey: this.state.licenceKey,
    //   licenceCode: this.state.licenceCode,
    //   AdminCompanyName: this.state.adminCompanyName,
    //   AdminUsername: this.state.adminUsername,
    //   expiryDate: this.state.expiryDate,
    //   ModuleAccess: moduleArray,
    // };

    this.props.form.validateFields((err, data) => {
      if (!err) {
        this.props.createNewLicense(data);
        console.log("license data----->", data);
      }
    });

    // this.props.createNewLicense(JSON.stringify(licenseData));
    // console.log("license---->", JSON.stringify(licenseData));
    // this.setState({ modalLicenseVisible: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    var dropdownList = this.props.getLicenseList;
    var proceduresData = this.props.getProcedureData;
    var procedureData = "";
    // var licenseData = this.props.getLicenseData;
    var plainOptions = this.props.getModules;

    var logDatasList = this.props.getLogDataList;
    var logDataList = "";

    // const plainOptions = [
    //   "Department",
    //   "Service",
    //   "Area",
    //   "Procedure",
    //   "Identities",
    //   "User Management",
    //   "Configuration",
    // ];

    if (!logDatasList) {
      // Object is empty (Would return true in this example)
    } else {
      logDataList = logDatasList.LogData;
      console.log("logdata--->", logDataList);

      // if (this.state.licenseId === "" || this.state.licenseId == undefined) {
      //   logDataList = [];
      // }
      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = logDatasList.TotalCount;
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
        title: <IntlMessages id="logmanagement.dni" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="logmanagement.module" />,
        dataIndex: "Module",
        key: "Module",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="logmanagement.type" />,
        dataIndex: "Type",
        key: "Type",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="logmanagement.visitId" />,
        dataIndex: "VisitId",
        key: "VisitId",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="logmanagement.description" />,
        dataIndex: "Description",
        key: "Description",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="logmanagement.currentValue" />,
        // dataIndex: "CurrentValue",
        // key: "CurrentValue",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (record, text) => (
          <span className="">
            <a
              href
              onClick={() => this.openCurrentValueModal(record.Id)}
              className="arrow-btn gx-link"
              value={record.Id}
            >
              <IntlMessages id="logManagement.viewDetail" />
            </a>
          </span>
        ),
      },
      {
        title: <IntlMessages id="logmanagement.previousValue" />,
        // dataIndex: "PreviousValue",
        // key: "PreviousValue",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (record, text) => (
          <span className="">
            {/* <pre>{JSON.stringify(JSON.parse(text), null, 2)}</pre> */}
            <a
              href
              onClick={() => this.openPreviousValueModal(record.Id)}
              className="arrow-btn gx-link"
              value={record.Id}
            >
              <IntlMessages id="logManagement.viewDetail" />
            </a>
          </span>
        ),
      },

      {
        title: <IntlMessages id="logmanagement.createdDate" />,
        dataIndex: "CreatedDate",
        key: "CreatedDate",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => (
          <span className="">{moment(text).format("YYYY-MM-DD")}</span>
        ),
      },
      {
        title: <IntlMessages id="logmanagement.errorMessage" />,
        dataIndex: "ErrorMessage",
        key: "ErrorMessage",
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
      <>
        {/* <Card className="custo_head_wrap">
          <Row style={{ marginLeft: "15px" }}>
            <Col lg={24} xs={24}>
              <FormItem
                {...formItemLayout}
                label={<IntlMessages id="config.selectLicenseId" />}
              >
                <Select
                  defaultValue={this.state.licenseId}
                  style={{ width: "100%" }}
                  onChange={(value, event) =>
                    this.setState({ licenceKey: `${value}` })
                  }
                >
                  {dropdownList
                    ? dropdownList.map((list) => {
                        return (
                          <Option
                            onClick={(e) =>
                              this.handleLicenseChange(list.LicenseId)
                            }
                            key={list.LicenseId}
                            value={list.LicenseId}
                          >
                            {list.LicenseName}
                          </Option>
                        );
                      })
                    : ""}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Card> */}

        <Card
          className="custo_head_wrap"
          title={<IntlMessages id="logmanagement.title" />}
          extra={
            // <div className="card-extra-form">
            //   {/* <FormattedMessage id="placeholder.Search">
            //     {(placeholder) => (
            //       <Search
            //         placeholder={placeholder}
            //         value={this.state.searchedProcedure}
            //         onChange={this.handleChangeProcedureSearch}
            //         onSearch={this.handleProcedureSearch}
            //         style={{
            //           marginRight: "10px",
            //           marginBottom: "0px",
            //           width: "200px",
            //         }}
            //       />
            //     )}
            //   </FormattedMessage> */}

            //   {/* <Button
            //     style={{ width: "110px" }}
            //     type="primary"
            //     className="gx-mb-0"
            //     //   onClick={() => this.openAddLicenseModal()}
            //   >
            //     <IntlMessages id="logmanagement.addbtn" />
            //   </Button> */}
            // </div>
            <div className="card-extra-form">
              <Form className="custom-form">
                <FormattedMessage id="logmanagement.dni">
                  {(placeholder) => (
                    <FormItem>
                      <Input
                        className="inline-inputs"
                        value={this.state.logDni}
                        onChange={(event) =>
                          this.setState({ logDni: event.target.value })
                        }
                        placeholder={placeholder}
                      />
                    </FormItem>
                  )}
                </FormattedMessage>
                <FormattedMessage id="logmanagement.module">
                  {(placeholder) => (
                    <FormItem>
                      <Input
                        className="inline-inputs"
                        value={this.state.logModule}
                        onChange={(event) =>
                          this.setState({ logModule: event.target.value })
                        }
                        placeholder={placeholder}
                      />
                    </FormItem>
                  )}
                </FormattedMessage>

                <FormattedMessage id="logmanagement.type">
                  {(placeholder) => (
                    <FormItem>
                      <Input
                        className="inline-inputs"
                        value={this.state.logType}
                        onChange={(event) =>
                          this.setState({ logType: event.target.value })
                        }
                        placeholder={placeholder}
                      />
                    </FormItem>
                  )}
                </FormattedMessage>

                <FormattedMessage id="logmanagement.startdate">
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
                          // disabledDate={this.disabledStartDate}
                          format="YYYY-MM-DD"
                          // value={startValue}
                          placeholder={placeholder}
                          onChange={(date, dateString) =>
                            this.setState({ logStartDate: dateString })
                          }
                          // onOpenChange={this.handleStartOpenChange}
                        />
                      )}
                    </FormItem>
                  )}
                </FormattedMessage>
                <FormattedMessage id="logmanagement.enddate">
                  {(placeholder) => (
                    <FormItem>
                      {getFieldDecorator("EndDate", {
                        rules: [
                          {
                            type: "object",
                            required:
                              this.state.logStartDate != "" ? true : false,
                            message: (
                              <IntlMessages id="required.EndDateRequired" />
                            ),
                            whitespace: true,
                          },
                        ],
                      })(
                        <DatePicker
                          className="inline-inputs"
                          // disabledDate={this.disabledEndDate}
                          format="YYYY-MM-DD"
                          // value={endValue}
                          placeholder={placeholder}
                          onChange={(date, dateString) =>
                            this.setState({ logEndDate: dateString })
                          }
                          // open={endOpen}
                          // onOpenChange={this.handleEndOpenChange}
                        />
                      )}
                    </FormItem>
                  )}
                </FormattedMessage>
                <FormItem>
                  <Button type="primary" onClick={this.handleFilterAll}>
                    <IntlMessages id="procedureLaunch.all" />
                  </Button>
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.handleFilterChange}>
                    <IntlMessages id="logmanagement.filterbtn" />
                  </Button>
                </FormItem>
              </Form>
            </div>
          }
        >
          {/* <Row style={{ marginBottom: "15px" }}>
            <Col lg={4} xs={4}>
              <FormattedMessage id="logmanagement.dni">
                {(placeholder) => (
                  <Input
                    className="log-inline-inputs"
                    placeholder={placeholder}
                    onChange={(event) =>
                      this.setState({ logDni: event.target.value })
                    }
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col lg={4} xs={4}>
              <FormattedMessage id="logmanagement.module">
                {(placeholder) => (
                  <Input
                    className="log-inline-inputs"
                    placeholder={placeholder}
                    onChange={(event) =>
                      this.setState({ logModule: event.target.value })
                    }
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col lg={4} xs={4}>
              <FormattedMessage id="logmanagement.type">
                {(placeholder) => (
                  <Input
                    className="log-inline-inputs"
                    placeholder={placeholder}
                    onChange={(event) =>
                      this.setState({ logType: event.target.value })
                    }
                  />
                )}
              </FormattedMessage>
            </Col>

            <Col lg={4} xs={4}>
              <FormattedMessage id="logmanagement.startdate">
                {(placeholder) => (
                  <DatePicker
                    className="log-inline-inputs"
                    format="DD/MM/YYYY"
                    // value={startValue}
                    placeholder={placeholder}
                    onChange={(event) =>
                      this.setState({ logStartDate: event.target.value })
                    }
                    // onOpenChange={this.handleStartOpenChange}
                  />
                )}
              </FormattedMessage>
            </Col>

            <Col lg={4} xs={4}>
              <FormattedMessage id="logmanagement.enddate">
                {(placeholder) => (
                  <DatePicker
                    className="log-inline-inputs"
                    format="DD/MM/YYYY"
                    // value={startValue}
                    placeholder={placeholder}
                    onChange={(event) =>
                      this.setState({ logEndDate: event.target.value })
                    }
                    validationErrors={{
                      isDefaultRequiredValue: "Field is required",
                    }}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col lg={2} xs={2} className="border-danger">
              <Button type="primary">
                <IntlMessages id="procedureLaunch.all" />
              </Button>
            </Col>
            <Col lg={2} xs={2}>
              <Button type="primary" onClick={this.handleFilterChange}>
                <IntlMessages id="logmanagement.filterbtn" />
              </Button>
            </Col>
          </Row> */}

          <Table
            className="gx-table-responsive"
            rowKey="Id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={logDataList}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            scroll={{ x: true }}
          />

          {/* <Modal
            className="detail-modal"
            maskClosable={false}
            closable={true}
            title={<IntlMessages id="sidebar.licensemanagement" />}
            visible={this.state.modalLicenseVisible}
            destroyOClose={true}
            onOk={this.handleSubmit}
            onCancel={this.closeAddLicenseModal}
            okText={<IntlMessages id="licensemanagement.save" />}
          >
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col lg={12} xs={24}>
                  <lable>
                    <sup>
                      <span style={{ color: "red", fontSize: "10px" }}>*</span>
                    </sup>{" "}
                    <IntlMessages id="licensemanagement.selectLicenseId" /> :
                  </lable>
                  <FormItem>
                    {getFieldDecorator("licenceKey", {
                      initialValue: this.state.licenceKey,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.selectLicenseId" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ licenceKey: `${value}` })
                        }
                      >
                        <Option value="Motum101">Motum101</Option>
                        <Option value="Motum102">Motum102</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    label={
                      <IntlMessages id="licensemanagement.selectLicenseId" />
                    }
                  >
                    {getFieldDecorator("licenceKey", {
                      initialValue: this.state.licenceKey,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.selectLicenseId" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ licenceKey: `${value}` })
                        }
                      >
                        <Option value="Motum101">Motum101</Option>
                        <Option value="Motum102">Motum102</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    label={<IntlMessages id="licensemanagement.licenseCode" />}
                  >
                    {getFieldDecorator("licenceCode", {
                      initialValue: this.state.licenceCode,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.licenseCode" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ licenceCode: event.target.value })
                        }
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="licensemanagement.companyName" />}
                  >
                    {getFieldDecorator("AdminCompanyName", {
                      initialValue: this.state.adminCompanyName,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.companyName" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({
                            adminCompanyName: event.target.value,
                          })
                        }
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <IntlMessages id="licensemanagement.adminUsername" />
                    }
                  >
                    {getFieldDecorator("AdminUsername", {
                      initialValue: this.state.adminUsername,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.adminUsername" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ adminUsername: event.target.value })
                        }
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="licensemanagement.expireDate" />}
                  >
                    {getFieldDecorator("expiryDate", {
                      initialValue: this.state.expiryDate,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.expireDate" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ expiryDate: event.target.value })
                        }
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="licensemanagement.module" />}
                  >
                    {getFieldDecorator("ModuleAccess", {
                      initialValue: this.state.ModuleAccess,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.licensemanagement.expireDate" />
                          ),
                        },
                      ],
                    })(
                      <CheckboxGroup
                        style={{ marginTop: "5px", width: "100%" }}
                        options={plainOptions}
                        onChange={(value) =>
                          this.setState({ ModuleAccess: `${value}` })
                        }
                      ></CheckboxGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal> */}

          <Modal
            className="detail-modal"
            title={<IntlMessages id="currentValue.title" />}
            visible={this.state.modalCurrentValue}
            destroyOnClose={true}
            onCancel={this.closeCurrentValueModal}
            footer={null}
          >
            <Row className="detail-row">
              <Col lg={24}>
                <div className="det-row">
                  <pre>{currentlogValue}</pre>
                </div>
              </Col>
            </Row>
          </Modal>

          <Modal
            className="detail-modal"
            title={<IntlMessages id="previoudValue.title" />}
            visible={this.state.modalPreviousValue}
            destroyOnClose={true}
            onCancel={this.closePreviousValueModal}
            footer={null}
          >
            <Row className="detail-row">
              <Col lg={24}>
                <div className="det-row">
                  <pre>{previouslogValue}</pre>
                </div>
              </Col>
            </Row>
          </Modal>

          {this.state.loader || this.props.loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
        </Card>
      </>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  getProcedures,
  // getLicenseDetails,
  // getAllModule,
  // createNewLicense,
  // getLicenseDropdown,
  setStatusToInitial,
  getLogManagement,
};

const logManagementForm = Form.create()(LogManagement);

const mapStateToProps = (state) => {
  return {
    getLogDataList: state.logManagementReducers.logData.data,

    status: state.businessProceduresReducers.status,
    // getLicenseList: state.visitProcedureReducers.getAllLicense.licenseData,
    // getLicenseData:
    //   state.licenseManagementReducers.getLicenseInfo.getLicenseRes,
    // getModules: state.licenseManagementReducers.getModulesInfo.getModulesRes,
    // loading: state.licenseManagementReducers.loading,
    loader: state.logManagementReducers.loader,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(logManagementForm));
