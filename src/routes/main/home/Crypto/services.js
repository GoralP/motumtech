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
  getServices,
  setStatusToInitial,
  saveServiceData,
  deleteServiceData,
} from "./../../../../appRedux/actions/ServiceActions";
import { getDropDownData } from "./../../../../appRedux/actions/DepartmentActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";
import { FormattedMessage, injectIntl } from "react-intl";
import { branchName } from "util/config";

let userId = "";
let permitAdd = "";
let permitEdit = "";
let permitDelete = "";
let IdentityId = "";

let langName = localStorage.getItem(branchName + "_language");
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = "MM/DD/YYYY";
const { RangePicker } = DatePicker;
const { Search } = Input;
var searchServiceTerm = "";

class Service extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      addServiceModal: false,
      modalDeleteVisible: false,
      Id: "",
      Service_name: "",
      editServiceFlag: "",
      delete_id: "",
      searchedService: "",
      area_name: undefined,
      department_name: undefined,
      departmentArr: [],
    };
  }

  getServiceListbyId(
    pageNumber = "",
    sortBy = "-Id",
    perPage = "10",
    searchServiceTerm = ""
  ) {
    if (this.props.status == "Initial") {
      this.props.getServices({
        pageNumber: 1,
        sortBy: "-Id",
        perPage: perPage,
        searchServiceTerm: searchServiceTerm,
      });
    } else {
      if (pageNumber == "") {
        pageNumber = 1;
      }
      if (perPage == "") {
        perPage = "10";
      }
      if (sortBy == "") {
        sortBy = "-Id";
      }
      this.props.getServices({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchServiceTerm: searchServiceTerm,
      });
    }
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata != "" && userdata != null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.Services.Service_Add;
      let permit_edit = userData.Permission.Services.Service_Edit;
      let permit_delete = userData.Permission.Services.Service_Delete;
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
    this.getServiceListbyId();
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
    this.getServiceListbyId(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchServiceTerm
    );
  };

  handleServiceSubmit = (e) => {
    e.preventDefault();
    var serviceData = [];
    this.props.form.validateFieldsAndScroll(
      ["areaName", "departmentName", "serviceName"],
      (err, values) => {
        if (!err) {
          if (this.state.editServiceFlag === "edit") {
            serviceData["Id"] = this.state.Id;
            serviceData["Name"] = this.state.service_name;
            serviceData["AreaId"] = this.state.area_name;
            serviceData["DepartmentId"] = this.state.department_name;
            serviceData["userId"] = IdentityId;

            var service_id = this.state.Id;
            var service_name = this.state.service_name;
            var area_name = this.state.area_name;
            var department_name = this.state.department_name;

            if (
              service_id !== "" &&
              service_name !== "" &&
              area_name !== undefined &&
              department_name !== undefined &&
              IdentityId !== ""
            ) {
              this.setState({ addServiceModal: false });
              this.props.saveServiceData(serviceData);
            } else {
              message.error(
                this.props.intl.formatMessage({ id: "global.TryAgain" })
              );
            }
          } else {
            serviceData["Name"] = this.state.service_name;
            serviceData["AreaId"] = this.state.area_name;
            serviceData["DepartmentId"] = this.state.department_name;
            serviceData["userId"] = IdentityId;

            var service_name = this.state.service_name;
            var area_name = this.state.area_name;
            var department_name = this.state.department_name;

            if (
              service_name !== "" &&
              area_name !== undefined &&
              department_name !== undefined &&
              IdentityId !== ""
            ) {
              this.setState({ addServiceModal: false });
              this.props.saveServiceData(serviceData);
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

  onAddService = () => {
    this.setState({ Id: "" });
    this.setState({ service_name: "" });
    this.setState({ area_name: undefined });
    this.setState({ department_name: undefined });

    this.setState({ addServiceModal: true });
    this.setState({ editServiceFlag: "" });
  };

  onEditService = (d_id) => {
    var serviceData = this.props.getServiceData.ServiceList.find(
      (singleService) => {
        return singleService.Id == d_id;
      }
    );

    if (serviceData.Area.Id !== 0) {
      var departmentArray = this.props.DropDownData.find((areaId) => {
        return areaId.Id === serviceData.Area.Id;
      });
    }
    if (
      this.state.departmentArr.length === 0 &&
      departmentArray !== undefined
    ) {
      this.setState({ departmentArr: departmentArray.Department });
    }

    this.setState({ Id: serviceData.Id });
    this.setState({ service_name: serviceData.Name });
    this.setState({ area_name: serviceData.Area.Id });
    this.setState({ department_name: serviceData.Department.Id });

    this.setState({ addServiceModal: true });
    this.setState({ editServiceFlag: "edit" });
  };

  closeAddService = () => {
    this.setState({ addServiceModal: false });
  };

  onDeleteService = (deleteId) => {
    this.setState({ modalDeleteVisible: true });
    this.setState({ delete_id: deleteId });
  };

  confirmDelete = () => {
    this.props.deleteServiceData({ deleteId: this.state.delete_id });
    this.setState({ modalDeleteVisible: false });
  };

  cancelDelete = (e) => {
    this.setState({ delete_id: "" });
    this.setState({ modalDeleteVisible: false });
  };

  handleChangeServiceSearch = (e) => {
    var tempSearchedService = e.target.value;
    this.setState({ searchedService: tempSearchedService });
  };

  handleServiceSearch = (value) => {
    searchServiceTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.getServiceListbyId("", "", pagesize, searchServiceTerm);
  };

  handleAreaChange = (department) => {
    this.setState({ departmentArr: department });
    this.props.form.setFieldsValue({ departmentName: undefined });
    this.setState({ department_name: undefined });
  };

  render() {
    var servicesData = this.props.getServiceData;
    var serviceData = "";

    if (!servicesData) {
      // Object is empty (Would return true in this example)
    } else {
      serviceData = servicesData.ServiceList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = servicesData.TotalCount;
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
        dataIndex: "Department.Name",
        key: "MuncipaltyDepartment.Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="serviceAdd.serviceName" />,
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
                      onClick={() => this.onEditService(record.Id)}
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
                      onClick={() => this.onDeleteService(record.Id)}
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
        title={<IntlMessages id="sidebar.services" />}
        extra={
          <div className="card-extra-form">
            {permitAdd === true ? (
              <Button
                className="gx-mb-0"
                type="primary"
                style={{ float: "right" }}
                onClick={() => this.onAddService()}
              >
                <IntlMessages id="serviceAdd.addService" />
              </Button>
            ) : (
              <Button
                disabled
                className="gx-mb-0"
                type="primary"
                style={{ float: "right" }}
              >
                <IntlMessages id="serviceAdd.addService" />
              </Button>
            )}
          </div>
        }
      >
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={serviceData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          size="middle"
          // scroll={{ y: 400 }}
          // style={{ whiteSpace: "pre" }}
        />
        <Modal
          title={
            this.state.editServiceFlag == "edit" ? (
              <IntlMessages id="serviceEdit.editService" />
            ) : (
              <IntlMessages id="serviceAdd.addService" />
            )
          }
          maskClosable={false}
          onCancel={this.closeAddService}
          visible={this.state.addServiceModal}
          closable={true}
          okText={<IntlMessages id="additentity.save" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
          onOk={this.handleServiceSubmit}
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
                                    <Option
                                      onClick={(e) =>
                                        this.handleAreaChange(item.Department)
                                      }
                                      key={item.Id}
                                      value={item.Id}
                                    >
                                      {item.Name}
                                    </Option>
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
                                },
                              ],
                            })(
                              <Select
                                placeholder={placeholder}
                                onChange={(value, event) =>
                                  this.setState({ department_name: `${value}` })
                                }
                              >
                                {this.state.departmentArr.map((item) => {
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
                      <FormattedMessage id="placeholder.serviceName">
                        {(placeholder) => (
                          <FormItem>
                            {getFieldDecorator("serviceName", {
                              initialValue: this.state.service_name,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.serviceAdd.serviceName" />
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
                                    service_name: event.target.value,
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
          title={<IntlMessages id="serviceDelete.title" />}
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
                  <IntlMessages id="serviceDelete.message" />
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
  getServices,
  setStatusToInitial,
  saveServiceData,
  deleteServiceData,
  userRolePermissionByUserId,
  getDropDownData,
};

const viewServiceReportForm = Form.create()(Service);

const mapStateToProps = (state) => {
  return {
    getServiceData: state.serviceReducers.get_service_res,
    loader: state.serviceReducers.loader,
    status: state.serviceReducers.status,
    DropDownData: state.departmentReducers.get_dropdown_res,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewServiceReportForm));
