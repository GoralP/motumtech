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
import { branchName } from "util/config";

import {
  getAreas,
  setStatusToInitial,
  saveAreaData,
  deleteAreaData,
} from "./../../../../appRedux/actions/AreaActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";

import { FormattedMessage, injectIntl } from "react-intl";

let licenseId = "";
let permitAdd = "";
let permitEdit = "";
let permitDelete = "";
let IdentityId = "";

let langName = "";
const FormItem = Form.Item;
var searchAreaTerm = "";

class Area extends Component {
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
    };
  }

  getAreaListById(
    pageNumber = "",
    sortBy = "-Id",
    perPage = "10",
    searchAreaTerm = ""
  ) {
    if (this.props.status == "Initial") {
      this.props.getAreas({
        pageNumber: 1,
        sortBy: "-Id",
        perPage: perPage,
        searchAreaTerm: searchAreaTerm,
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
      this.props.getAreas({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchAreaTerm: searchAreaTerm,
      });
    }
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    langName = localStorage.getItem(branchName + "_language");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.Area.Area_Add;
      let permit_edit = userData.Permission.Area.Area_Edit;
      let permit_delete = userData.Permission.Area.Area_Delete;
      if (
        userData !== "" &&
        userData !== null &&
        userData["IdentityId"] !== undefined &&
        userData["id"] !== undefined &&
        permit_add != undefined &&
        permit_edit != undefined &&
        permit_delete != undefined
      ) {
        licenseId = userData["id"];
        IdentityId = userData["IdentityId"];
        permitAdd = permit_add;
        permitEdit = permit_edit;
        permitDelete = permit_delete;
      }
    }
    this.props.setStatusToInitial();
    this.getAreaListById();
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
      sortBy = "+" + sorter.field;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.field;
    }
    this.getAreaListById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      searchAreaTerm
    );
  };

  handleAreaSubmit = (e) => {
    e.preventDefault();
    var areaData = [];
    this.props.form.validateFieldsAndScroll(["areaName"], (err, values) => {
      if (!err) {
        if (this.state.editAreaFlag === "edit") {
          areaData["Id"] = this.state.Id;
          areaData["Name"] = this.state.area_name;
          areaData["UserId"] = IdentityId;

          var area_id = this.state.Id;
          var area_name = this.state.area_name;

          if (area_id !== "" && area_name !== "" && IdentityId !== "") {
            this.setState({ addAreaModal: false });
            this.props.saveAreaData(areaData);
          } else {
            message.error(
              this.props.intl.formatMessage({ id: "global.TryAgain" })
            );
          }
        } else {
          areaData["Name"] = this.state.area_name;
          areaData["UserId"] = IdentityId;

          var area_name = this.state.area_name;

          if (area_name !== "" && IdentityId !== "") {
            this.setState({ addAreaModal: false });
            this.props.saveAreaData(areaData);
          } else {
            message.error(
              this.props.intl.formatMessage({ id: "global.TryAgain" })
            );
          }
        }
      }
    });
  };

  onAddArea = () => {
    this.setState({ area_name: "" });

    this.setState({ addAreaModal: true });
    this.setState({ editAreaFlag: "" });
  };

  onEditArea = (a_id) => {
    var areaData = this.props.getAreaData.AreaList.find((singleArea) => {
      return singleArea.Id === a_id;
    });

    this.setState({ Id: areaData.Id });
    this.setState({ area_name: areaData.Name });

    this.setState({ addAreaModal: true });
    this.setState({ editAreaFlag: "edit" });
  };

  closeAddArea = () => {
    this.setState({ addAreaModal: false });
  };

  onDeleteArea = (deleteId) => {
    this.setState({ modalDeleteVisible: true });
    this.setState({ delete_id: deleteId });
  };

  confirmDelete = () => {
    this.props.deleteAreaData({ deleteId: this.state.delete_id });
    this.setState({ modalDeleteVisible: false });
  };

  cancelDelete = (e) => {
    this.setState({ delete_id: "" });
    this.setState({ modalDeleteVisible: false });
  };

  handleChangeAreaSearch = (e) => {
    var tempSearchedArea = e.target.value;
    this.setState({ searchedArea: tempSearchedArea });
  };

  handleAreaSearch = (value) => {
    searchAreaTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.getAreaListById("", "", pagesize, searchAreaTerm);
  };

  render() {
    var areasData = this.props.getAreaData;
    var areaData = "";

    if (!areasData) {
      // Object is empty (Would return true in this example)
    } else {
      areaData = areasData.AreaList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = areasData.TotalCount;
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
        title: <IntlMessages id="areaAdd.areaName" />,
        dataIndex: "Name",
        key: "Name",
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
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.edit">
              {(title) => (
                <span className="gx-link">
                  {permitEdit ? (
                    <Button
                      onClick={() => this.onEditArea(record.Id)}
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
                      onClick={() => this.onDeleteArea(record.Id)}
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

    return (
      <Card
        className="custo_head_wrap"
        title={<IntlMessages id="sidebar.area" />}
        extra={
          <div className="card-extra-form">
            {permitAdd ? (
              <Button
                className="gx-mb-0"
                type="primary"
                style={{ float: "right" }}
                onClick={() => this.onAddArea()}
              >
                <IntlMessages id="areaAdd.addArea" />
              </Button>
            ) : (
              <Button
                disabled
                className="gx-mb-0"
                type="primary"
                style={{ float: "right" }}
              >
                <IntlMessages id="areaAdd.addArea" />
              </Button>
            )}
          </div>
        }
      >
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={areaData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          size="middle"
          // scroll={{ y: 500 }}
          // style={{ whiteSpace: "pre" }}
        />
        <Modal
          title={
            this.state.editAreaFlag === "edit" ? (
              <IntlMessages id="areaEdit.editArea" />
            ) : (
              <IntlMessages id="areaAdd.addArea" />
            )
          }
          maskClosable={false}
          onCancel={this.closeAddArea}
          visible={this.state.addAreaModal}
          closable={true}
          okText={<IntlMessages id="additentity.save" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
          onOk={this.handleAreaSubmit}
          destroyOnClose={true}
          className="cust-modal-width"
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <Form>
                <div className="gx-form-group">
                  <Row>
                    <Col lg={24} xs={24}>
                      {/* <lable><sup><span style={{color: "red", fontSize: "10px"}}>*</span></sup> <IntlMessages id="areaAdd.areaName"/> :</lable> */}
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
                                  whitespace: true,
                                },
                              ],
                            })(
                              <Input
                                required
                                placeholder={placeholder}
                                onChange={(event) =>
                                  this.setState({
                                    area_name: event.target.value,
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
          title={<IntlMessages id="areaDelete.title" />}
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
                  <IntlMessages id="areaDelete.message" />
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
  getAreas,
  setStatusToInitial,
  saveAreaData,
  deleteAreaData,
  userRolePermissionByUserId,
};

const viewAreaReportForm = Form.create()(Area);

const mapStateToProps = (state) => {
  return {
    getAreaData: state.areaReducers.get_area_res,
    loader: state.areaReducers.loader,
    status: state.areaReducers.status,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewAreaReportForm));
