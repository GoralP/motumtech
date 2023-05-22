import React, { Component } from "react";
import {
  Card,
  Divider,
  Table,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  message,
  Form,
  Modal,
  Select,
} from "antd";
import { connect } from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import IntlMessages from "util/IntlMessages";
import {
  getDepartments,
  setStatusToInitial,
  saveDepartmentData,
  deleteDepartmentData,
  getDropDownData,
} from "./../../../../appRedux/actions/DepartmentActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";
import { FormattedMessage, injectIntl } from "react-intl";
import { branchName } from "util/config";

let userId = "";
let permitAdd = "";
let permitEdit = "";
let permitDelete = "";
let IdentityId = "";

let langName = "";
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = "MM/DD/YYYY";
const { RangePicker } = DatePicker;
const { Search } = Input;
var searchDepartmentTerm = "";

class Department extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      addDepartmentModal: false,
      modalDeleteVisible: false,
      Id: "",
      Department_name: "",
      editDepartmentFlag: "",
      delete_id: "",
      searchedDepartment: "",
      area_name: undefined,
    };
  }

  getDepartmentListbyId(
    pageNumber = "",
    sortBy = "-Id",
    perPage = "10",
    searchDepartmentTerm = ""
  ) {
    if (this.props.status == "Initial") {
      this.props.getDepartments({
        pageNumber: 1,
        sortBy: "-Id",
        perPage: perPage,
        searchDepartmentTerm: searchDepartmentTerm,
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
      this.props.getDepartments({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchDepartmentTerm: searchDepartmentTerm,
      });
    }
  }

  componentDidMount() {
    langName = localStorage.getItem(branchName + "_language");
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata != "" && userdata != null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.Department.Department_Add;
      let permit_edit = userData.Permission.Department.Department_Edit;
      let permit_delete = userData.Permission.Department.Department_Delete;
      if (
        userData != "" &&
        userData != null &&
        userData["IdentityId"] != undefined &&
        userData["id"] != undefined &&
        permit_add != undefined &&
        permit_edit != undefined &&
        permit_delete != undefined
      ) {
        userId = userData["id"];
        permitAdd = permit_add;
        permitEdit = permit_edit;
        permitDelete = permit_delete;
        IdentityId = userData["IdentityId"];
      }
    }
    this.props.setStatusToInitial();
    this.getDepartmentListbyId();
    this.props.getDropDownData();
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
      sortBy = "+" + sorter.columnKey;
    } else if (sorter.order == "descend") {
      sortBy = "-" + sorter.columnKey;
    }
    this.getDepartmentListbyId(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchDepartmentTerm
    );
  };

  handleDepartmentSubmit = (e) => {
    e.preventDefault();
    var departmentData = [];
    this.props.form.validateFieldsAndScroll(
      ["areaName", "departmentName"],
      (err, values) => {
        if (!err) {
          if (this.state.editDepartmentFlag === "edit") {
            departmentData["Id"] = this.state.Id;
            departmentData["Name"] = this.state.department_name;
            departmentData["AreaId"] = this.state.area_name;
            departmentData["userId"] = IdentityId;

            var department_id = this.state.Id;
            var department_name = this.state.department_name;
            var area_name = this.state.area_name;

            if (
              department_id !== "" &&
              department_name !== "" &&
              area_name !== undefined &&
              IdentityId !== ""
            ) {
              this.setState({ addDepartmentModal: false });
              this.props.saveDepartmentData(departmentData);
            } else {
              message.error(
                this.props.intl.formatMessage({ id: "global.TryAgain" })
              );
            }
          } else {
            departmentData["Name"] = this.state.department_name;
            departmentData["AreaId"] = this.state.area_name;
            departmentData["userId"] = IdentityId;

            var department_name = this.state.department_name;
            var area_name = this.state.area_name;

            if (
              department_name !== "" &&
              area_name !== undefined &&
              IdentityId !== ""
            ) {
              this.setState({ addDepartmentModal: false });
              this.props.saveDepartmentData(departmentData);
            } else {
              message.error(
                this.props.intl.formatMessage({ id: "global.TryAgain" })
              );
            }
          }
        }
      }
    );
  };

  onAddDepartment = () => {
    this.setState({ Id: "" });
    this.setState({ department_name: "" });
    this.setState({ area_name: undefined });

    this.setState({ addDepartmentModal: true });
    this.setState({ editDepartmentFlag: "" });
  };

  onEditDepartment = (d_id) => {
    var departmentData = this.props.getDepartmentData.DepartmentList.find(
      (singleDepartment) => {
        return singleDepartment.Id == d_id;
      }
    );

    this.setState({ Id: departmentData.Id });
    this.setState({ department_name: departmentData.Name });
    this.setState({ area_name: departmentData.Area.Id });

    this.setState({ addDepartmentModal: true });
    this.setState({ editDepartmentFlag: "edit" });
  };

  closeAddDepartment = () => {
    this.setState({ addDepartmentModal: false });
  };

  onDeleteDepartment = (deleteId) => {
    this.setState({ modalDeleteVisible: true });
    this.setState({ delete_id: deleteId });
  };

  confirmDelete = () => {
    this.props.deleteDepartmentData({ deleteId: this.state.delete_id });
    this.setState({ modalDeleteVisible: false });
  };

  cancelDelete = (e) => {
    this.setState({ delete_id: "" });
    this.setState({ modalDeleteVisible: false });
  };

  handleChangeDepartmentSearch = (e) => {
    var tempSearchedDepartment = e.target.value;
    this.setState({ searchedDepartment: tempSearchedDepartment });
  };

  handleDepartmentSearch = (value) => {
    searchDepartmentTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.getDepartmentListbyId("", "", pagesize, searchDepartmentTerm);
  };

  render() {
    var departmentsData = this.props.getDepartmentData;
    var departmentData = "";

    if (!departmentsData) {
      // Object is empty (Would return true in this example)
    } else {
      departmentData = departmentsData.DepartmentList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = departmentsData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;

      // var start_record = '';
      var end_record = "";
      if (pagination.current == 1) {
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

    const columns = [
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
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="areaAdd.creationDate" />,
        dataIndex: "CreationDate",
        key: "CreatedDate",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => DateWithoutTimeHelper(text),
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
                  {permitEdit ? (
                    <Button
                      onClick={() => this.onEditDepartment(record.Id)}
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
                  {permitDelete ? (
                    <Button
                      onClick={() => this.onDeleteDepartment(record.Id)}
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
        Name: record.Name,
      }),
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        className="custo_head_wrap"
        title={<IntlMessages id="sidebar.department" />}
        extra={
          <div className="card-extra-form">
            {permitAdd === true ? (
              <Button
                className="gx-mb-0"
                type="primary"
                style={{ float: "right" }}
                onClick={() => this.onAddDepartment()}
              >
                <IntlMessages id="departmentAdd.addDepartment" />
              </Button>
            ) : (
              <Button
                disabled
                className="gx-mb-0"
                type="primary"
                style={{ float: "right" }}
              >
                <IntlMessages id="departmentAdd.addDepartment" />
              </Button>
            )}
          </div>
        }
      >
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={departmentData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          size="middle"
          // scroll={{ y: 500 }}
          // style={{ whiteSpace: "pre" }}
        />
        <Modal
          title={
            this.state.editDepartmentFlag == "edit" ? (
              <IntlMessages id="departmentEdit.editDepartment" />
            ) : (
              <IntlMessages id="departmentAdd.addDepartment" />
            )
          }
          maskClosable={false}
          onCancel={this.closeAddDepartment}
          visible={this.state.addDepartmentModal}
          closable={true}
          okText={<IntlMessages id="additentity.save" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
          onOk={this.handleDepartmentSubmit}
          destroyOnClose={true}
          className="cust-modal-width"
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <Form>
                <div className="gx-form-group">
                  <Row>
                    <Col lg={24} xs={24}>
                      {/* <lable><sup><span style={{color: "red", fontSize: "10px"}}>*</span></sup> <IntlMessages id="planAdd.planName"/> :</lable> */}
                      <FormattedMessage id="placeholder.areaName">
                        {(placeholder) => (
                          <FormItem>
                            {getFieldDecorator("areaName", {
                              initialValue: this.state.area_name,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.areaAdd.areaName" />
                                  ),
                                },
                              ],
                            })(
                              <Select
                                placeholder={placeholder}
                                onChange={(value, event) =>
                                  this.setState({ area_name: `${value}` })
                                }
                              >
                                {this.props.DropDownData.map((item) => {
                                  return (
                                    <Option value={item.Id}>{item.Name}</Option>
                                  );
                                })}
                              </Select>
                            )}
                          </FormItem>
                        )}
                      </FormattedMessage>
                    </Col>
                    <Col lg={24} xs={24}>
                      {/* <lable><sup><span style={{color: "red", fontSize: "10px"}}>*</span></sup> <IntlMessages id="planAdd.planName"/> :</lable> */}
                      <FormattedMessage id="placeholder.departmentName">
                        {(placeholder) => (
                          <FormItem>
                            {getFieldDecorator("departmentName", {
                              initialValue: this.state.department_name,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.departmentAdd.departmentName" />
                                  ),
                                  whitespace: true,
                                },
                              ],
                            })(
                              <Input
                                required
                                placeholder={placeholder}
                                onChange={(event) =>
                                  this.setState({
                                    department_name: event.target.value,
                                  })
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
          title={<IntlMessages id="departmentDelete.title" />}
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
                  <IntlMessages id="departmentDelete.message" />
                </h4>
              </div>
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
  getDepartments,
  setStatusToInitial,
  saveDepartmentData,
  deleteDepartmentData,
  userRolePermissionByUserId,
  getDropDownData,
};

const viewDepartmentReportForm = Form.create()(Department);

const mapStateToProps = (state) => {
  return {
    getDepartmentData: state.departmentReducers.get_department_res,
    loader: state.departmentReducers.loader,
    status: state.departmentReducers.status,
    DropDownData: state.departmentReducers.get_dropdown_res,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewDepartmentReportForm));
