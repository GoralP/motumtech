import React, { Component } from "react";
import {
  Card,
  Divider,
  Icon,
  Table,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  message,
  Form,
  Upload,
  Checkbox,
  Modal,
  Select,
  Popconfirm,
  Tabs,
  Collapse,
} from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import IntlMessages from "util/IntlMessages";
import {
  getRole,
  setStatusToInitial,
  saveRoleData,
  deleteRoleData,
  getPermission,
  savePermissionData,
} from "./../../../../appRedux/actions/RolePermissionActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";

// import InsDocuments from "./insdocuments";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";

let licenseId = "";
let permitRoleAdd = "";
let permitRoleEdit = "";
let permitRoleDelete = "";
let permitRoleList = "";
let permitPermissionAdd = "";
let permitPermissionList = "";
let IdentityId = "";

let langName = localStorage.getItem(branchName + "_language");
const FormItem = Form.Item;
const dateFormat = "MM/DD/YYYY";
const { RangePicker } = DatePicker;
const { Search } = Input;
const Panel = Collapse.Panel;
var searchPlanTerm = "";
var permissionArr = [];

class RoleAndPermission extends Component {
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
      addRoleModal: false,
      modalDeleteVisible: false,
      Id: "",
      role: "",
      editRoleFlag: "",
      delete_id: "",
      selectedRole: "",
      loadRender: false,
      searchedPlan: "",
    };
  }

  get_training_planById(
    pageNumber = "",
    sortBy = "-Id",
    perPage = "10",
    searchPlanTerm = ""
  ) {
    if (this.props.status === "Initial") {
      this.props.get_plans({
        pageNumber: 1,
        sortBy: "-Id",
        perPage: perPage,
        searchPlanTerm: searchPlanTerm,
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
      this.props.get_plans({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchPlanTerm: searchPlanTerm,
      });
    }
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_role_add = userData.Permission.Role.Role_Add;
      let permit_role_edit = userData.Permission.Role.Role_Edit;
      let permit_role_delete = userData.Permission.Role.Role_Delete;
      let permit_role_list = userData.Permission.Role.Role_List;
      let permit_permission_add = userData.Permission.Permission.Permission_Add;
      let permit_permission_list =
        userData.Permission.Permission.Permission_List;
      if (
        userData !== "" &&
        userData !== null &&
        userData["IdentityId"] !== undefined &&
        userData["id"] !== undefined &&
        permit_role_add !== undefined &&
        permit_role_edit !== undefined &&
        permit_role_delete !== undefined &&
        permit_role_list !== undefined &&
        permit_permission_add !== undefined &&
        permit_permission_list !== undefined
      ) {
        licenseId = userData["id"];
        permitRoleAdd = permit_role_add;
        permitRoleEdit = permit_role_edit;
        permitRoleDelete = permit_role_delete;
        permitRoleList = permit_role_list;
        permitPermissionAdd = permit_permission_add;
        permitPermissionList = permit_permission_list;
        IdentityId = userData["IdentityId"];
      }
    }
    this.props.setStatusToInitial();
    // this.get_training_planById();
    this.props.getRole();
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
    if (sorter.order == "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order == "descend") {
      sortBy = "-" + sorter.field;
    }
    this.get_training_planById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchPlanTerm
    );
  };

  handleRoleSubmit = (e) => {
    e.preventDefault();
    var roleData = [];
    this.props.form.validateFieldsAndScroll(["role"], (err, values) => {
      if (!err) {
        if (this.state.editRoleFlag === "edit") {
          roleData["Id"] = this.state.Id;
        } else {
          roleData["Id"] = "";
        }
        roleData["RoleName"] = this.state.role;
        roleData["UserId"] = IdentityId;
        roleData["LicenseId"] = licenseId;

        var role_name = this.state.role;
        if (role_name != "") {
          this.setState({ addRoleModal: false });
          this.props.saveRoleData(roleData);
        } else {
          message.error(
            this.props.intl.formatMessage({ id: "global.TryAgain" })
          );
        }
      }
    });
  };

  onAddRole = () => {
    this.setState({ role: "" });

    this.setState({ addRoleModal: true });
    this.setState({ editRoleFlag: "" });
  };

  onEditRole = (r_id) => {
    var roleData = this.props.getRolesData.find((singleRole) => {
      return singleRole.Id == r_id;
    });

    this.setState({ Id: roleData.Id });
    this.setState({ role: roleData.Name });

    this.setState({ addRoleModal: true });
    this.setState({ editRoleFlag: "edit" });
  };

  closeAddRole = () => {
    this.setState({ addRoleModal: false });
  };

  onDeleteRole = (deleteId) => {
    this.setState({ modalDeleteVisible: true });
    this.setState({ delete_id: deleteId });
  };

  confirmDelete = () => {
    this.props.deleteRoleData({ deleteId: this.state.delete_id });
    this.setState({ modalDeleteVisible: false });
  };

  cancelDelete = (e) => {
    this.setState({ delete_id: "" });
    this.setState({ modalDeleteVisible: false });
  };

  handleChangePlanSearch = (e) => {
    var tempSearchedPlan = e.target.value;
    this.setState({ searchedPlan: tempSearchedPlan });
  };

  handlePlanSearch = (value) => {
    searchPlanTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.get_training_planById("", "", pagesize, searchPlanTerm);
  };

  handleRoleChange = (value) => {
    this.setState({ selectedRole: value });
    this.props.getPermission({ RoleId: value });
  };

  handleSubmit = (e, permissionsArr) => {
    e.preventDefault();
    const roleId = this.state.selectedRole;
    this.props.savePermissionData({ RoleId: roleId, data: permissionsArr });
  };

  render() {
    if (this.props.getSavedPermissionData !== "") {
      this.props.userRolePermissionByUserId(IdentityId);
      var roleData = this.props.getSavedPermissionData;
      permitRoleAdd = roleData.ModuleUrls[0].Ischecked;
      permitRoleEdit = roleData.ModuleUrls[1].Ischecked;
      permitRoleDelete = roleData.ModuleUrls[2].Ischecked;
      permitRoleList = roleData.ModuleUrls[3].Ischecked;
    }
    permissionArr = this.props.getPermissionData
      ? this.props.getPermissionData
      : [];
    const Option = Select.Option;
    var rolesData = [];
    rolesData = this.props.getRolesData;

    const columns = [
      {
        title: <IntlMessages id="role.Role" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.Action" />,
        key: "action",
        align: "center",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.edit">
              {(title) => (
                <span className="gx-link">
                  {permitRoleEdit ? (
                    <Button
                      onClick={() => this.onEditRole(record.Id)}
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
                  {permitRoleDelete ? (
                    <Button
                      onClick={() => this.onDeleteRole(record.Id)}
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
          </div>
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

    const formItemLayoutDrag = {
      labelCol: { xs: 24, sm: 24 },
      wrapperCol: { xs: 24, sm: 24 },
    };
    const formItemLayoutNew = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };
    const formItemLayoutNewRole = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const TabPane = Tabs.TabPane;
    return (
      <Card
        className="custo_head_wrap user-card-head"
        title={<IntlMessages id="sidebar.userManagement" />}
      >
        <Tabs defaultActiveKey="1">
          {permitRoleList === true ? (
            <TabPane tab={<IntlMessages id="role.Role" />} key="1">
              <Card
                className="custo_head_wrap tab_inner_card"
                extra={
                  <div className="card-extra-form">
                    {permitRoleAdd ? (
                      <Button
                        className="gx-mb-0 add-role-btn"
                        type="primary"
                        onClick={() => this.onAddRole()}
                      >
                        <i className="icon icon-add"></i>
                        <IntlMessages id="global.add" />
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="gx-mb-0 add-role-btn"
                        type="primary"
                      >
                        <i className="icon icon-add"></i>
                        <IntlMessages id="global.add" />
                      </Button>
                    )}
                  </div>
                }
              >
                <Table
                  rowKey={(record) => record.Id}
                  className="gx-table-responsive"
                  columns={columns}
                  dataSource={rolesData}
                  onChange={this.handleTableChange}
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  size="middle"
                />
              </Card>
            </TabPane>
          ) : null}
          {permitPermissionList === true ? (
            <TabPane tab={<IntlMessages id="permission.Permission" />} key="2">
              <Row className="permission_cust new_cust_role">
                <Col lg={14} xs={24} className="role_selcust">
                  <FormItem
                    {...formItemLayoutNewRole}
                    label={<IntlMessages id="permission.roleSelection" />}
                  >
                    <Select placeholder="" style={{ width: "100%" }}>
                      {this.props.getRolesData
                        ? this.props.getRolesData.map((item) => {
                            return (
                              <Option
                                value={item.Id}
                                onClick={(e) => this.handleRoleChange(item.Id)}
                                key={item.Id}
                              >
                                {item.Name}
                              </Option>
                            );
                          })
                        : null}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              {this.state.selectedRole !== "" ? (
                <>
                  <div className="Permission_data">
                    {permissionArr ? (
                      <Row className="cust-checkboxes">
                        <Col span={2}></Col>
                        <Col span={22}>
                          <Collapse accordion>
                            {permissionArr.map((item, index) => {
                              return (
                                <Panel header={item.ModuleName} key={index}>
                                  <Row>
                                    {item.ModuleUrls.map((moduleName) => {
                                      return (
                                        <Col span={4}>
                                          <strong>{moduleName.Title}</strong>
                                        </Col>
                                      );
                                    })}
                                  </Row>
                                  <Row>
                                    {item.ModuleUrls.map((permission) => {
                                      return (
                                        <Col span={4}>
                                          {permission.Ischecked === true ? (
                                            <Checkbox
                                              className="gx-mb-3"
                                              checked={permission.Ischecked}
                                              key={permission.UrlId}
                                              value={permission.Ischecked}
                                              onChange={(e) => {
                                                if (e.target.value === true) {
                                                  this.setState({
                                                    loadRender: true,
                                                  });
                                                  permission.Ischecked = false;
                                                }
                                              }}
                                            ></Checkbox>
                                          ) : (
                                            <Checkbox
                                              className="gx-mb-3"
                                              checked={permission.Ischecked}
                                              key={permission.UrlId}
                                              value={permission.Ischecked}
                                              onChange={(e) => {
                                                if (e.target.value === false) {
                                                  this.setState({
                                                    loadRender: true,
                                                  });
                                                  permission.Ischecked = true;
                                                }
                                              }}
                                            ></Checkbox>
                                          )}
                                        </Col>
                                      );
                                    })}
                                  </Row>
                                </Panel>
                              );
                            })}
                          </Collapse>
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                  <div className="ant-modal-footer">
                    <div>
                      {permitPermissionAdd == true ? (
                        <Button
                          onClick={(e) => this.handleSubmit(e, permissionArr)}
                          type="button"
                          className="ant-btn ant-btn-primary"
                        >
                          <IntlMessages id="additentity.save" />
                        </Button>
                      ) : (
                        <Button
                          disabled
                          type="button"
                          className="ant-btn ant-btn-primary"
                        >
                          <IntlMessages id="additentity.save" />
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </TabPane>
          ) : null}
        </Tabs>
        <Modal
          title={
            this.state.editRoleFlag == "edit" ? (
              <IntlMessages id="roleEdit.editRole" />
            ) : (
              <IntlMessages id="roleAdd.addRole" />
            )
          }
          maskClosable={false}
          onCancel={this.closeAddRole}
          visible={this.state.addRoleModal}
          closable={true}
          okText={<IntlMessages id="additentity.save" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
          onOk={this.handleRoleSubmit}
          destroyOnClose={true}
          className="cust-modal-width role_modal"
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <Form>
                <div className="gx-form-group">
                  <Row>
                    <Col lg={24} xs={24}>
                      {/* <lable><sup><span style={{color: "red", fontSize: "10px"}}>*</span></sup> <IntlMessages id="planAdd.planName"/> :</lable> */}
                      <FormattedMessage id="placeholder.roleName">
                        {(placeholder) => (
                          <FormItem>
                            {getFieldDecorator("role", {
                              initialValue: this.state.role,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.roleAdd.roleName" />
                                  ),
                                  whitespace: true,
                                },
                              ],
                            })(
                              <Input
                                required
                                placeholder={placeholder}
                                onChange={(event) =>
                                  this.setState({ role: event.target.value })
                                }
                                margin="none"
                              />
                            )}
                          </FormItem>
                        )}
                      </FormattedMessage>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
        <Modal
          className=""
          title={<IntlMessages id="roleDelete.title" />}
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
                  <IntlMessages id="roleDelete.message" />
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
  getRole,
  saveRoleData,
  deleteRoleData,
  getPermission,
  savePermissionData,
  setStatusToInitial,
  userRolePermissionByUserId,
};

const viewRoleAndPermissionForm = Form.create()(RoleAndPermission);

const mapStateToProps = (state) => {
  return {
    getRolesData: state.rolePermissionReducers.get_role_res,
    getPermissionData: state.rolePermissionReducers.get_permission_res,
    getSavedPermissionData:
      state.rolePermissionReducers.changed_permission_data,
    loader: state.rolePermissionReducers.loader,
    status: state.rolePermissionReducers.status,
  };
};

// export default trainingPlan;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewRoleAndPermissionForm));
