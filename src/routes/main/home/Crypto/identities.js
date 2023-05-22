import React, { Component } from "react";
import {
  Input,
  Card,
  Table,
  Button,
  Col,
  Row,
  Upload,
  message,
  Divider,
  Modal,
} from "antd";
import { connect } from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import { baseURL, branchName } from "./../../../../util/config";
import {
  get_identities,
  get_singleidentity,
  hideMessage,
  setstatustoinitial,
  openmodal,
  close_bulksignature_modal,
} from "./../../../../appRedux/actions/IdentitiesActions";
import {
  open_selidentity_modal,
  close_selidentity_modal,
} from "./../../../../appRedux/actions/SelidentitiesActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import IntlMessages from "util/IntlMessages";
import AddIdentity from "components/modal/AddIdentity";
import SelectIdentity from "./selectidentity";
import BulkSingature from "./bulksignature";
import { FormattedMessage, injectIntl } from "react-intl";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";

var sortBy = "";

const { Search } = Input;

var userId = "";
var identityAdd = "";
var identityBulkSignature = "";
var identityEdit = "";
var identityImportCheckList = "";
var identityImportIdentity = "";

var filterTag = "";
var searchTerm = "";
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
  extType: "",
  birthDate: "",
  parentId: "",
  isMinor: "",
  parentName: "",
  radioValue: "",
};
class Identity extends Component {
  constructor() {
    filterTag = "";
    searchTerm = "";
    super();
    this.state = {
      addIdentityState: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        //showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      },
      loading: false,
      filterTag: "ALL",
      searchTerm: "",
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
        extType: "",
        birthDate: "",
        parentId: "",
        isMinor: "",
        parentName: "",
        radioValue: "",
      },
      editIdentityFlag: "",
      isMinority: "",
      internalButton: "default",
      externalButton: "default",
      whitelistButton: "default",
      blacklistButton: "default",
      allButton: "primary",
      searchedValue: "",
      addDocumentsState: false,
      addBulkSignatureState: false,
      SelectedList: [],
      modalIdentityVisible: false,
    };
  }
  get_identitiesById(
    pageNumber = "",
    sortBy = "-id",
    perPage = "10",
    filterTag = "",
    searchTerm = ""
    // licenseId = ""
  ) {
    if (this.props.status === "Initial") {
      this.props.get_identities({
        pageNumber: 1,
        sortBy: "-id",
        perPage: perPage,
        filterTag: filterTag,
        searchTerm: searchTerm,
        // licenseId: userId,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-id";
      }
      this.props.get_identities({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        filterTag: filterTag,
        searchTerm: searchTerm,
        // licenseId: userId,
      });
    }
  }

  componentDidMount() {
    this.props.setstatustoinitial();
    this.get_identitiesById();

    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.Employees.Identity_Add;
      let permit_edit = userData.Permission.Employees.Identity_Edit;
      let permit_bulk_signature =
        userData.Permission.Employees.Identity_BulkSignature;
      let permit_import_checklist =
        userData.Permission.Employees.Identity_ImportCheckList;
      let permit_import_identity =
        userData.Permission.Employees.Identity_ImportIdentity;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_add !== undefined &&
        permit_edit !== undefined &&
        permit_bulk_signature !== undefined &&
        permit_import_checklist !== undefined &&
        permit_import_identity !== undefined
      ) {
        userId = userData["id"];
        identityAdd = permit_add;
        identityEdit = permit_edit;
        identityBulkSignature = permit_bulk_signature;
        identityImportCheckList = permit_import_checklist;
        identityImportIdentity = permit_import_identity;
        // IdentityId = userData['IdentityId'];
      }
    }
    // this.props.userRolePermissionByUserId(IdentityId);
  }

  componentDidUpdate() {
    if (this.props.bulksignaturemodalclosecall === 1) {
      this.setState({
        addBulkSignatureState: false,
        SelectedList: [],
        selectedRowKeys: [],
      });
      this.props.close_bulksignature_modal(2);
    }
  }

  handleIdentityStatus = (e) => {
    var status_value = e.target.value;
    //this.setState({'filterTag': status_value});
    //this.get_identitiesById();
    if (status_value === "Internal") {
      this.setState({
        internalButton: "primary",
        externalButton: "default",
        whitelistButton: "default",
        blacklistButton: "default",
        allButton: "default",
      });
    } else if (status_value === "External") {
      this.setState({
        internalButton: "default",
        externalButton: "primary",
        whitelistButton: "default",
        blacklistButton: "default",
        allButton: "default",
      });
    } else if (status_value === "Whitelist") {
      this.setState({
        internalButton: "default",
        externalButton: "default",
        whitelistButton: "primary",
        blacklistButton: "default",
        allButton: "default",
      });
    } else if (status_value === "Blacklist") {
      this.setState({
        internalButton: "default",
        externalButton: "default",
        whitelistButton: "default",
        blacklistButton: "primary",
        allButton: "default",
      });
    } else {
      this.setState({
        internalButton: "default",
        externalButton: "default",
        whitelistButton: "default",
        blacklistButton: "default",
        allButton: "primary",
        searchedValue: "",
      });
    }
    filterTag = status_value;
    if (status_value === "") {
      searchTerm = "";
    }
    var pagination_new = this.state.pagination;
    var pagesize = this.state.pagination.pageSize;
    pagination_new.current = 1;
    this.setState({ pagination: pagination_new });
    this.get_identitiesById("", "", pagesize, filterTag, searchTerm);
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
        extType: "",
        birthDate: "",
        parentId: "",
        isMinor: "",
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

  onAddDocuments = (e) => {
    this.props.open_selidentity_modal();
    this.setState({ addDocumentsState: true, addBulkSignatureState: false });
  };

  onAddBulkSignature = (SelectedList) => {
    console.log("selected", SelectedList);
    this.props.open_selidentity_modal();
    if (SelectedList.length > 0) {
      this.setState({
        addDocumentsState: false,
        addBulkSignatureState: true,
        SelectedList: SelectedList,
      });
    } else {
      message.error(
        this.props.intl.formatMessage({ id: "identities.SelectOne" })
      );
    }
  };

  onDocumentsClose = () => {
    this.props.close_bulksignature_modal(2);
    this.props.close_selidentity_modal();
    this.setState({ addDocumentsState: false });
  };

  onSignatureClose = () => {
    this.setState({ addBulkSignatureState: false });
    this.props.close_bulksignature_modal(3);
  };

  handleIdentitySearch = (value) => {
    searchTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.get_identitiesById("", "", pagesize, filterTag, searchTerm);
  };

  handleEditIdentity = (iid) => {
    var identityData = this.props.getIdentitiesData.identites.find(
      (singleIdentity) => {
        return singleIdentity.id === iid;
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
      extType: identityData.Type,
      birthDate: identityData.BirthDate,
      parentId: identityData.ParentId,
      isMinor: identityData.IsMinore,
      parentName: identityData.ParentName,
      radioValue: temprRadioValue,
    };
    this.props.openmodal();
    this.setState({ contact: dataObject });
    this.setState({ isMinority: identityData.IsMinore });
    this.setState({ addIdentityState: true });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    if (sorter.order === "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.field;
    }
    this.get_identitiesById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      filterTag,
      searchTerm
    );
  };

  handleImportIdentityInfo = (info) => {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
      var parsed_response = JSON.parse(info.file.xhr.response);
      var response_status = parsed_response.status;
      var response_message = parsed_response.message;
      if (response_status) {
        message.success(response_message);
        this.get_identitiesById();
      } else {
        message.error(response_message);
      }
    } else if (info.file.status === "error") {
      message.error(
        `${info.file.name}` +
          this.props.intl.formatMessage({ id: "global.UploadFail" })
      );
    }
  };

  handleImportChecklistInfo = (info) => {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
      var parsed_response = JSON.parse(info.file.xhr.response);
      var response_status = parsed_response.status;
      var response_message = parsed_response.message;
      if (response_status) {
        message.success(response_message);
        this.get_identitiesById();
      } else {
        message.error(response_message);
      }
    } else if (info.file.status === "error") {
      message.error(
        `${info.file.name}` +
          this.props.intl.formatMessage({ id: "global.UploadFail" })
      );
    }
  };

  handleChangeSearch = (e) => {
    var tempSearchedValue = e.target.value;
    this.setState({ searchedValue: tempSearchedValue });
  };

  openIdentityViewModal = (id) => {
    this.props.get_singleidentity({ IdentityID: id });
    this.setState({ modalIdentityVisible: true });
  };

  closeIdentityViewModal = () => {
    this.setState({ modalIdentityVisible: false });
  };

  render() {
    var { addIdentityState, addDocumentsState, addBulkSignatureState } =
      this.state;

    if (this.props.modalclosecall) {
      addIdentityState = false;
    }

    var identitiesData = this.props.getIdentitiesData;
    var identityData = "";

    var singleIdentityView = this.props.getSingleIdentityData;

    if (!identitiesData) {
    } else {
      identityData = identitiesData.identites;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = identitiesData.TotalCount;
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
        // fixed: "top",
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
        dataIndex: "FatherSurname",
        key: "FatherSurname",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
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
        width: 300,
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
        title: <IntlMessages id="column.identifier" />,
        dataIndex: "Identifier",
        key: "Identifier",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "RegisterDate",
        key: "RegisterDate",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.Action" />,
        key: "action",
        fixed: "right",
        align: "center",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.edit">
              {(title) => (
                <span className="gx-link">
                  {identityEdit === true ? (
                    <Button
                      onClick={() => this.handleEditIdentity(record.id)}
                      value={record.id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/edit.png")}
                        className="document-icons"
                        alt={title}
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button disabled className="arrow-btn gx-link">
                      <img
                        src={require("assets/images/edit.png")}
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
            <FormattedMessage id="columnlabel.see">
              {(title) => (
                <span className="gx-link">
                  <Button
                    onClick={() => this.openIdentityViewModal(record.id)}
                    value={record.id}
                    className="arrow-btn gx-link"
                  >
                    <img
                      src={require("assets/images/visibility.png")}
                      className="document-icons"
                      alt={title}
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

    let authBasic = "";
    authBasic = localStorage.getItem("setAuthToken");

    const importIdentity = {
      name: "File",
      action: baseURL + "ImportIdentity?licenseId=" + userId,
      headers: { Authorization: "Basic " + authBasic },
    };

    const importChecklist = {
      name: "File",
      action: baseURL + "ImportCheckList?licenseId=" + userId,
      headers: { Authorization: "Basic " + authBasic },
    };

    const beforeUpload = (file) => {
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
      }
      return isExcelFile;
    };

    return (
      <Card
        className="custo_head_wrap iden_cust"
        extra={
          <div>
            <div
              class="ant-card-head-title"
              style={{ display: "block", fontSize: "large" }}
            >
              <IntlMessages id="identity.title" />
            </div>
            <FormattedMessage id="placeholder.Search">
              {(placeholder) => (
                <Search
                  placeholder={placeholder}
                  value={this.state.searchedValue}
                  onChange={this.handleChangeSearch}
                  onSearch={this.handleIdentitySearch}
                  style={{ marginRight: "10px" }}
                />
              )}
            </FormattedMessage>
            <Button
              type={this.state.internalButton}
              className="identity_button"
              onClick={this.handleIdentityStatus}
              value="Internal"
            >
              <IntlMessages id="button.internal" />
            </Button>
            <Button
              type={this.state.externalButton}
              className="identity_button"
              onClick={this.handleIdentityStatus}
              value="External"
            >
              <IntlMessages id="button.external" />
            </Button>
            <Button
              type={this.state.whitelistButton}
              className="identity_button"
              onClick={this.handleIdentityStatus}
              value="Whitelist"
            >
              <IntlMessages id="button.whitelist" />
            </Button>
            <Button
              type={this.state.blacklistButton}
              className="identity_button"
              onClick={this.handleIdentityStatus}
              value="Blacklist"
            >
              <IntlMessages id="button.blacklist" />
            </Button>
            <Button
              type={this.state.allButton}
              className="identity_button"
              onClick={this.handleIdentityStatus}
              value=""
            >
              <IntlMessages id="button.ALL" />
            </Button>
            {identityAdd === true ? (
              <Button type="primary" onClick={this.onAddIdentity}>
                <IntlMessages id="identity.addidentity" />
              </Button>
            ) : (
              <Button type="primary" disabled>
                <IntlMessages id="identity.addidentity" />
              </Button>
            )}

            {identityImportCheckList === true ? (
              <Upload
                className="cust-import-checklist"
                onChange={(info) => this.handleImportChecklistInfo(info)}
                {...importChecklist}
                beforeUpload={beforeUpload}
              >
                <Button type="primary">
                  <IntlMessages id="identity.importCheckList" />
                </Button>
              </Upload>
            ) : (
              <Upload className="cust-import-checklist">
                <Button type="primary" disabled>
                  <IntlMessages id="identity.importCheckList" />
                </Button>
              </Upload>
            )}
            {identityImportIdentity === true ? (
              <Upload
                className="custom-identity"
                onChange={(info) => this.handleImportIdentityInfo(info)}
                {...importIdentity}
                beforeUpload={beforeUpload}
              >
                <Button type="primary">
                  <IntlMessages id="identity.importIdentity" />
                </Button>
              </Upload>
            ) : (
              <Upload className="custom-identity">
                <Button type="primary" disabled>
                  <IntlMessages id="identity.importIdentity" />
                </Button>
              </Upload>
            )}
            {identityBulkSignature === true ? (
              <Button
                className="custom-identity"
                type="primary"
                onClick={this.onAddDocuments}
              >
                <IntlMessages id="identity.bulkSignature" />
              </Button>
            ) : (
              <Button className="custom-identity" type="primary" disabled>
                <IntlMessages id="identity.bulkSignature" />
              </Button>
            )}
          </div>
        }
      >
        <Table
          className="gx-table-responsive custom-identity-table"
          columns={columns}
          dataSource={identityData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          // scroll={{ x: 1100, y: 400 }}
          // style={{ whiteSpace: "pre" }}
          scroll={{ x: true }}
        />
        <AddIdentity
          open={addIdentityState}
          editIdentityFlag={this.state.editIdentityFlag}
          isMinority={this.state.isMinority}
          contact={this.state.contact}
          editFilterSorting={{
            pageNumber: { ...this.state.pagination },
            sortBy: sortBy,
            filterTag: filterTag,
            searchTerm: searchTerm,
          }}
          onSaveIdentity={this.onSaveIdentity}
          onIdentityClose={this.onIdentityClose}
        />
        <SelectIdentity
          open={addDocumentsState}
          onAddBulkSignature={this.onAddBulkSignature}
          identity_data={this.props.getSelidentitiesData}
          onDocumentsClose={this.onDocumentsClose}
        />
        <BulkSingature
          SelectedList={this.state.SelectedList}
          open={addBulkSignatureState}
          onAddDocuments={this.onAddDocuments}
          onSignatureClose={this.onSignatureClose}
        />
        <Modal
          className="detail-modal"
          title={<IntlMessages id="identitydetails.title" />}
          visible={this.state.modalIdentityVisible}
          destroyOnClose={true}
          onCancel={this.closeIdentityViewModal}
          footer={null}
        >
          <Row className="detail-row">
            <Col lg={24}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="column.DNI" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.DNI}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="addidentity.Name" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.Name}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="identityDetail.FatherSurname" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.FatherSurname}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="identityDetail.MotherSurname" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.MotherSurname}
                </p>
              </div>
            </Col>
            <Col lg={8}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="identityDetail.PhoneNumber" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.PhoneNumber}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="detail-row">
            <Col lg={24}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="column.email" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.Email}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="addidentity.CompanyName" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.CompanyName}
                </p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="det-row">
                <lable>
                  <IntlMessages id="column.type" /> :
                </lable>
                <p>
                  {singleIdentityView.length === 0
                    ? null
                    : singleIdentityView.Type}
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
      </Card>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_identities,
  get_singleidentity,
  hideMessage,
  setstatustoinitial,
  openmodal,
  close_bulksignature_modal,
  open_selidentity_modal,
  close_selidentity_modal,
  userRolePermissionByUserId,
};

const mapStateToProps = (state) => {
  return {
    getIdentitiesData: state.identitiesReducers.get_identities_res,
    getSingleIdentityData: state.identitiesReducers.get_singleidentity_res,
    loader: state.identitiesReducers.loader,
    showSuccessMessage: state.identitiesReducers.showSuccessMessage,
    successMessage: state.identitiesReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.identitiesReducers.showMessage,
    alertMessage: state.identitiesReducers.alertMessage,
    status: state.identitiesReducers.status,
    modalclosecall: state.identitiesReducers.modalclosecall,
    bulksignaturemodalclosecall:
      state.identitiesReducers.bulksignaturemodalclosecall,
    selidentitymodalclosecall:
      state.selidentitiesReducers.selidentitymodalclosecall,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Identity));
