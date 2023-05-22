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
  Radio,
  Switch,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import IntlMessages from "util/IntlMessages";
import {
  getProcessData,
  saveProcessData,
  deleteProcessData,
  processNamesForDropDownList,
  setStatusToInitial,
  getSynchronize,
} from "./../../../../appRedux/actions/ProcessActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage, injectIntl } from "react-intl";
import { userRolePermissionByUserId } from "./../../../../appRedux/actions/Auth";
import _ from "lodash";

// const Option = Select.Option;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { Search } = Input;

let langName = "";
let userId = "";
let permitAdd = "";
let permitEdit = "";
let identityId = "";
let processList = "";

var searchProcessTerm = "";
var searchedColumn = "";
var processId = "";
var filterByData = "";
var columnNo = [];

class Process extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      addProcessModal: false,
      editProcessFlag: "",
      ProcessUpload: {},
      process_id: "",
      process_name: "",
      process_type: "",
      addDataModal: false,
      editDataFlag: "",
      modalDeleteVisible: false,
      delete_id: "",
      columnLists: "",
      formData: {},
      actionType: "",
      editConfirmModal: false,
      APIPoint: "",
      updatedProcessObj: "",
      columnSearch: "",
      searchedProcess: "",
      loader: false,
      exportProcessId: "",
      exportProcessName: "",
      syncValue: "",
      radioValue: "BulkUpload",
      syncRadioValue: false,
      frequencyVal: "",
      synchronizebtn: "disabled",
      entityCode: "",
      filterVal: "Validation",
      modalDetailsVisible: false,
      fixedTop: false,
      singleBasicProcess: [],
      sync: "off",
    };
  }

  getProcessById(
    pageNumber = "",
    sortBy = "-RowId",
    perPage = "10",
    searchedColumn = "",
    searchProcessTerm = "",
    processId = "",
    filterByData = ""
  ) {
    if (this.props.status == "Initial") {
      this.props.getProcessData({
        pageNumber: 1,
        sortBy: "-RowId",
        perPage: perPage,
        searchedColumn: searchedColumn,
        searchProcessTerm: searchProcessTerm,
        ProcessId: processId,
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
      // if (filterByData == "") {
      //   filterByData = this.state.filterVal;
      // }
      this.props.getProcessData({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        searchedColumn: searchedColumn,
        searchProcessTerm: searchProcessTerm,
        ProcessId: processId,
        filterByData: filterByData,
      });
    }
  }

  handleVerificationSearch = (value) => {
    console.log("value---->", value);
    filterByData = value;
    this.setState({ filterVal: value });

    var pagesize = this.state.pagination.pageSize;
    this.getProcessById(
      "",
      "",
      pagesize,
      searchedColumn,
      searchProcessTerm,
      processId,
      filterByData
    );
  };

  componentDidMount() {
    langName = localStorage.getItem(branchName + "_language");
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata != "" && userdata != null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.ProcessData.Process_Add;
      let permit_edit = userData.Permission.ProcessData.Process_Edit;
      let process_list = userData.Permission.ProcessData.Process_List;
      if (
        userData != "" &&
        userData != null &&
        userData["id"] != undefined &&
        userData["IdentityId"] != undefined &&
        permit_add !== undefined &&
        permit_edit !== undefined &&
        process_list != undefined
      ) {
        userId = userData["id"];
        identityId = userData["IdentityId"];
        permitAdd = permit_add;
        permitEdit = permit_edit;
        processList = process_list;
      }
    }
    this.props.userRolePermissionByUserId(identityId);
    this.props.processNamesForDropDownList();
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
      processId,
      filterByData
    );
  };

  openDetailViewModal = (id) => {
    var singleDetails = this.props.getProcessDataList.ProcessList.find(
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

  onSynchronize = () => {
    // console.log("test1");
    this.setState({ sync: "on" });
    this.props.getSynchronize({ ProcessId: this.state.process_id });

    // if (this.props.loader) {
    //   console.log("test");
    //   message.success("Synchronization in progress");
    // }
  };

  handleProcessChange = (value) => {
    var singleProcessData = this.props.processDropDownList.find(
      (singleProcess) => {
        return singleProcess.ProcessData.find((list) => {
          return list.Id === value;
        });
      }
    );

    var singleData = singleProcessData.ProcessData.find((item) => {
      return item.Id === value;
    });

    processId = singleData.Id;
    this.setState({ process_id: processId });
    this.setState({ exportProcessId: singleData.Id });
    this.setState({ exportProcessName: singleData.Name });
    this.setState({ synchronizebtn: singleData.ProcessType });
    this.setState({ process_type: singleData.ProcessType });
    var pagesize = this.state.pagination.pageSize;
    filterByData =
      singleData.ProcessType == "GIA"
        ? this.state.filterVal
        : this.setState({ filterVal: "Validation" });

    this.getProcessById(
      "",
      "",
      pagesize,
      (searchedColumn = ""),
      (searchProcessTerm = ""),
      processId,
      filterByData
    );
    this.props.setStatusToInitial();
  };

  onAddProcess = () => {
    this.setState({ process_name: "" });
    this.setState({ radioValue: "BulkUpload" });
    this.setState({ syncRadioValue: "false" });
    this.setState({ frequencyVal: "" });
    this.setState({ ProcessUpload: null });
    this.setState({ APIPoint: "ImportProcess" });
    this.setState({ addProcessModal: true });
  };

  closeAddProcess = () => {
    this.setState({ APIPoint: "" });
    this.setState({ editProcessFlag: "" });
    this.setState({ ProcessUpload: null });
    this.setState({ addProcessModal: false });
  };

  onEditProcess = () => {
    var singleProcessData = this.props.processDropDownList.find(
      (singleProcess) => {
        return singleProcess.ProcessData.find((list) => {
          return list.Id === this.state.process_id;
        });
      }
    );

    var singleData = singleProcessData.ProcessData.find((item) => {
      return item.Id === this.state.process_id;
    });

    this.setState({ process_name: singleData.Name });
    this.setState({ radioValue: singleData.ProcessType });
    this.setState({ syncRadioValue: singleData.IsSyncronize });
    this.setState({ frequencyVal: singleData.FrequencyInHours });
    this.setState({ ProcessUpload: null });
    this.setState({ addProcessModal: true });
    this.setState({ editProcessFlag: "edit" });
    if (singleData.ProcessType === "BulkUpload") {
      this.setState({ APIPoint: "ValidateProcessExcel" });
    }
    if (singleData.ProcessType === "GIA") {
      this.setState({ APIPoint: "UpdateProcessExcel" });
    }
  };

  handleImportEdit = () => {
    if (this.state.radioValue === "BulkUpload") {
      if (this.state.ProcessUpload !== null) {
        this.setState({ editConfirmModal: true });
        if (this.state.APIPoint === "ValidateProcessExcel") {
          this.handleProcessUpload();
        }
      } else {
        message.destroy();
        message.config({
          maxCount: 1,
        });
        message.error(
          this.props.intl.formatMessage({ id: "global.UploadRequired" })
        );
        return false;
      }
    }
    if (this.state.radioValue == "GIA") {
      // this.setState({ editConfirmModal: true });
      this.setState({ editConfirmModal: false });
      this.handleProcessUpload();
    }
  };

  confirmImportEdit = () => {
    this.setState({ addProcessModal: false });
    this.setState({ editConfirmModal: false });
    this.handleProcessUpload();
  };

  cancelImportEdit = (e) => {
    this.setState({ APIPoint: "" });
    this.setState({ addProcessModal: false });
    this.setState({ editConfirmModal: false });
  };

  handleProcessUpload = () => {
    this.setState({ loader: true });
    var processObj = {};
    if (this.state.radioValue === "BulkUpload") {
      if (this.state.APIPoint === "UpdateProcessExcel") {
        processObj = this.state.updatedProcessObj;
      } else {
        processObj = {
          Id: this.state.process_id ? this.state.process_id : 0,
          ProcessName: this.state.process_name,
          ProcessType: this.state.radioValue,
          IsSyncronize: this.state.syncRadioValue,
          FrequencyInHours: this.state.frequencyVal,
          UserId: identityId,
        };
      }
    }

    if (this.state.radioValue === "GIA") {
      processObj = this.state.updatedProcessObj;
      processObj = {
        Id: this.state.process_id ? this.state.process_id : 0,
        ProcessName: this.state.process_name,
        ProcessType: this.state.radioValue,
        IsSyncronize: this.state.syncRadioValue,
        FrequencyInHours: this.state.frequencyVal,
        UserId: identityId,
      };
      console.log("process1111---->", processObj);
    }

    const ProcessDataForm = new FormData();
    ProcessDataForm.append("ProcessData", JSON.stringify(processObj));

    if (this.state.process_name === "") {
      message.destroy();
      message.config({
        maxCount: 1,
      });
      message.error(
        this.props.intl.formatMessage({ id: "process.ProcessName" })
      );
      this.setState({ loader: false });
      return false;
    }

    if (this.state.radioValue === "GIA") {
      if (this.state.syncRadioValue === "") {
        message.destroy();
        message.config({
          maxCount: 1,
        });
        message.error(
          this.props.intl.formatMessage({ id: "process.SynchronizeData" })
        );
        this.setState({ loader: false });
        return false;
      }
    }
    if (this.state.radioValue === "BulkUpload") {
      //
      if (
        this.state.ProcessUpload !== undefined &&
        this.state.ProcessUpload !== null
      ) {
        if (Object.entries(this.state.ProcessUpload).length !== 0) {
          ProcessDataForm.append("ExcelFile", this.state.ProcessUpload);
        } else {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error(
            this.props.intl.formatMessage({ id: "global.UploadRequired" })
          );
          this.setState({ loader: false });
          return false;
        }
      } else {
        message.destroy();
        message.config({
          maxCount: 1,
        });
        message.error(
          this.props.intl.formatMessage({ id: "global.UploadRequired" })
        );
        this.setState({ loader: false });
        return false;
      }
    }
    if (this.state.radioValue === "BulkUpload") {
      if (
        this.state.process_name !== "" &&
        this.state.ProcessUpload !== undefined &&
        this.state.ProcessUpload !== null
      ) {
        var submitUrl = "";

        let authBasic = "";
        authBasic = localStorage.getItem("setAuthToken");
        if (this.state.APIPoint === "ImportProcess") {
          submitUrl = baseURL + this.state.APIPoint + "?lang=" + langName;
        } else if (this.state.APIPoint === "ValidateProcessExcel") {
          submitUrl = baseURL + this.state.APIPoint + "?lang=" + langName;
        } else if (this.state.APIPoint === "UpdateProcessExcel") {
          submitUrl = baseURL + this.state.APIPoint + "?lang=" + langName;
        }

        const requestOptions = {
          method: "POST",
          headers: {
            //'Content-Type': 'multipart/form-data'
            Authorization: "Basic " + authBasic,
          },
          mimeType: "multipart/form-data",
          body: ProcessDataForm,
        };

        fetch(submitUrl, requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            var parsed_response = data;
            var response_status = parsed_response.status;
            var response_message = parsed_response.message;
            if (data !== undefined) {
              if (response_status) {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                if (this.state.APIPoint === "ImportProcess") {
                  message.success(response_message);
                  this.setState({ ProcessUpload: null });
                  this.setState({ addProcessModal: false });
                  this.props.processNamesForDropDownList();
                } else if (this.state.APIPoint === "ValidateProcessExcel") {
                  this.setState({ updatedProcessObj: parsed_response.data });
                  this.setState({ APIPoint: "UpdateProcessExcel" });
                } else if (this.state.APIPoint === "UpdateProcessExcel") {
                  message.success(response_message);
                  this.setState({ updatedProcessObj: "" });
                  this.setState({ ProcessUpload: null });
                  this.setState({ editProcessFlag: "" });
                  this.setState({ editConfirmModal: false });
                  this.setState({ addProcessModal: false });
                  this.handleProcessChange(this.state.process_id);
                }
                this.setState({ loader: false });
              } else {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                message.error(response_message);
                this.setState({ loader: false });
              }
            } else {
              message.destroy();
              message.config({
                maxCount: 1,
              });
              message.error(response_message);
              this.setState({ loader: false });
            }
          })
          .catch((error) => {
            message.destroy();
            message.config({
              maxCount: 1,
            });
            message.error(error);
            this.setState({ loader: false });
          });
      } else {
        message.error(
          this.props.intl.formatMessage({ id: "global.AllRequired" })
        );
      }
    }

    if (this.state.radioValue === "GIA") {
      if (this.state.process_name !== "" && this.state.syncRadioValue !== "") {
        var submitUrl = "";
        if (this.state.APIPoint === "ImportProcess") {
          submitUrl = baseURL + this.state.APIPoint + "?lang=" + langName;
        } else if (this.state.APIPoint === "ValidateProcessExcel") {
          submitUrl = baseURL + this.state.APIPoint + "?lang=" + langName;
        } else if (this.state.APIPoint === "UpdateProcessExcel") {
          submitUrl = baseURL + this.state.APIPoint + "?lang=" + langName;
        }

        let authBasic = "";
        authBasic = localStorage.getItem("setAuthToken");

        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: "Basic " + authBasic,
            //'Content-Type': 'multipart/form-data'
          },
          mimeType: "multipart/form-data",
          body: ProcessDataForm,
        };

        fetch(submitUrl, requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            var parsed_response = data;
            var response_status = parsed_response.status;
            var response_message = parsed_response.message;
            if (data !== undefined) {
              if (response_status) {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                if (this.state.APIPoint === "ImportProcess") {
                  message.success(response_message);
                  this.setState({ ProcessUpload: null });
                  this.setState({ addProcessModal: false });
                  this.props.processNamesForDropDownList();
                } else if (this.state.APIPoint === "ValidateProcessExcel") {
                  this.setState({ updatedProcessObj: parsed_response.data });
                  this.setState({ APIPoint: "UpdateProcessExcel" });
                  this.props.processNamesForDropDownList();
                } else if (this.state.APIPoint === "UpdateProcessExcel") {
                  message.success(response_message);
                  this.setState({ updatedProcessObj: "" });
                  this.setState({ ProcessUpload: null });
                  this.setState({ editProcessFlag: "" });
                  this.setState({ editConfirmModal: false });
                  this.setState({ addProcessModal: false });
                  this.handleProcessChange(this.state.process_id);
                  this.props.processNamesForDropDownList();
                }
                this.setState({ loader: false });
              } else {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                message.error(response_message);
                this.setState({ loader: false });
              }
            } else {
              message.destroy();
              message.config({
                maxCount: 1,
              });
              message.error(response_message);
              this.setState({ loader: false });
            }
          })
          .catch((error) => {
            message.destroy();
            message.config({
              maxCount: 1,
            });
            message.error(error);
            this.setState({ loader: false });
          });
      } else {
        message.error(
          this.props.intl.formatMessage({ id: "global.AllRequired" })
        );
      }
    }
  };

  handleChangeProcessSearch = (e) => {
    var tempSearchedProcess = e.target.value;
    this.setState({ searchedProcess: tempSearchedProcess });
  };

  handleProcessSearch = (value) => {
    searchProcessTerm = value;
    searchedColumn = this.state.columnSearch;

    var pagesize = this.state.pagination.pageSize;
    this.getProcessById(
      "",
      "",
      pagesize,
      searchedColumn,
      searchProcessTerm,
      processId
    );

    // this.setState({ columnSearch: "" });
  };

  onAddData = (columnList) => {
    var columnListing = columnList.slice(0, -1);
    this.setState({ columnLists: columnListing });
    this.setState({ actionType: "InsertProcessByRowId" });
    this.setState({ addDataModal: true });
    this.setState({ editDataFlag: "" });
  };

  onEditData = (row_id) => {
    var processData = this.props.getProcessDataList.ProcessList.find(
      (singleProcess) => {
        return singleProcess.RowId === row_id;
      }
    );
    const processArr = Object.keys(processData).map((process) => {
      return { title: process, value: processData[process] };
    });
    this.setState({ formData: processData });
    this.setState({ columnLists: processArr });
    this.setState({ actionType: "UpdateProcessByRowId" });
    this.setState({ addDataModal: true });
    this.setState({ editDataFlag: "edit" });
  };

  closeAddData = () => {
    this.setState({ addDataModal: false });
  };

  handlePushSaveData = (title, event) => {
    var formData = this.state.formData;
    formData[title] = event.target.value;
    this.setState({ formData: formData });
  };

  handleDataSubmit = () => {
    if (this.state.formData !== "") {
      this.props.saveProcessData({
        APIName: this.state.actionType,
        processId: processId,
        rowData: this.state.formData,
      });
      this.setState({ addDataModal: false });
    }
  };

  onDeleteProcessByRowId = (deleteId) => {
    this.setState({ modalDeleteVisible: true });
    this.setState({ delete_id: deleteId });
  };

  confirmDelete = () => {
    this.props.deleteProcessData({
      processId: processId,
      rowId: this.state.delete_id,
    });
    this.setState({ modalDeleteVisible: false });
  };

  cancelDelete = (e) => {
    this.setState({ delete_id: "" });
    this.setState({ modalDeleteVisible: false });
  };

  handleRemoveFile = (e) => {
    this.setState({ ProcessUpload: null });
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleExportProcess = (e) => {
    e.preventDefault();

    let authBasic = "";
    authBasic = localStorage.getItem("setAuthToken");
    this.props.form.validateFieldsAndScroll(["StartDate"], (err, values) => {
      if (!err) {
        var pId = this.state.exportProcessId;
        var pName = this.state.exportProcessName;

        fetch(
          baseURL +
            "ExportProcedureReport?UserId=" +
            identityId +
            "&ProcessId=" +
            pId,
          { headers: { Authorization: "Basic " + authBasic } }
        ).then((response) => {
          console.log("response---->", response);
          if (this.props.getProcessDataList.TotalCount === 0) {
            message.error(
              this.props.intl.formatMessage({ id: "global.NoData" })
            );
          } else {
            response.blob().then((blob) => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = url;
              a.download = pName + "_" + pId + ".csv";
              a.click();
            });
          }
          // window.location.href = response.url;
        });
      }
    });
  };

  render() {
    const RadioGroup = Radio.Group;

    // console.log("status----->", this.props.status);

    // console.log("loader----->", this.props.loader);

    // console.log("state loader--->", this.state.loader);

    console.log("sync----->", this.state.sync);

    const plainOptions = [
      { label: "GIA", value: "gia" },
      { label: "Bulk Upload", value: "bulkupload" },
    ];
    const { Option } = Select;
    var processDataListing = this.props.getProcessDataList;
    var processDataList = "";
    var processDataColumn = "";
    columnNo = [];

    console.log("process type====>", this.state.process_type);
    console.log("filter value---->", this.state.filterVal);

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

    // var columnNoArray = [];

    if (this.state.process_type === "GIA") {
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
                    render: (text) => <span className="">{text}</span>,
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
                  render: (text) => <span className="">{text}</span>,
                });
              });
            }
            columnsAddEdit = columns;
          }
        });
      }
    }

    // if (processDataList.length > 0) {
    //   console.log("COLUMN NO =>", columnNo);
    //   var columnNoArray = processDataList.map((item, index) => {
    //     let select = (columnNo, item) =>
    //       columnNo.reduce((r, e) => Object.assign(r, { [e]: item[e] }), {});
    //     var output = select(columnNo, item);
    //     return output;
    //   });
    //   console.log("colarray====>", columnNoArray);
    // }

    if (processDataList.length > 0) {
      columns.push({
        title: <IntlMessages id="column.Action" />,
        key: "printReport",
        fixed: "right",
        align: "center",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.edit">
              {(title) => (
                <span className="gx-link">
                  {this.state.process_type === "GIA" ? (
                    <Button
                      disabled
                      onClick={() => this.onEditData(record.RowId)}
                      className="arrow-btn gx-link"
                      value={record.Id}
                    >
                      <img
                        src={require("assets/images/edit.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => this.onEditData(record.RowId)}
                      className="arrow-btn gx-link"
                      value={record.Id}
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
            <FormattedMessage id="columnlabel.delete">
              {(title) => (
                <span className="gx-link">
                  {this.state.process_type === "GIA" ? (
                    <Button
                      disabled
                      onClick={() => this.onDeleteProcessByRowId(record.RowId)}
                      className="arrow-btn gx-link"
                      value={record.Id}
                    >
                      <img
                        src={require("assets/images/trash.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => this.onDeleteProcessByRowId(record.RowId)}
                      className="arrow-btn gx-link"
                      value={record.Id}
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

            <FormattedMessage id="columnlabel.see">
              {(title) => (
                <span className="gx-link">
                  {this.state.process_type === "GIA" ? (
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
                    ""
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

    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
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
      <div>
        <Card title={<IntlMessages id="sidebar.process" />}>
          <Row>
            <Col lg={16} xs={24}>
              <FormItem className="gx-mb-0" {...formItemLayoutNew}>
                <Select
                  placeholder=""
                  style={{ width: "100%" }}
                  onChange={(value) => this.handleProcessChange(value)}
                >
                  {this.props.processDropDownList.length > 0
                    ? this.props.processDropDownList.map((item) => {
                        return (
                          <OptGroup label={item.ProcessType}>
                            {item.ProcessData.map((list) => (
                              <Option value={list.Id}>{list.Name}</Option>
                            ))}
                          </OptGroup>
                        );
                      })
                    : null}
                </Select>
              </FormItem>
            </Col>
            <Col lg={8} xs={24}>
              <div
                className="btn-cont process-btn"
                style={{ textAlign: "left" }}
              >
                {permitEdit === true && this.state.process_id ? (
                  <Button
                    className="gx-mb-0 add-role-btn"
                    type="primary"
                    onClick={() => this.onEditProcess()}
                  >
                    <i className="icon icon-edit"></i>{" "}
                    <IntlMessages id="columnlabel.edit" />
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="gx-mb-0 add-role-btn"
                    type="primary"
                  >
                    <i className="icon icon-edit"></i>{" "}
                    <IntlMessages id="columnlabel.edit" />
                  </Button>
                )}
                {permitAdd === true ? (
                  <Button
                    className="gx-mb-0 add-role-btn"
                    type="primary"
                    onClick={() => this.onAddProcess()}
                  >
                    <i className="icon icon-add"></i>{" "}
                    <IntlMessages id="global.add" />
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="gx-mb-0 add-role-btn"
                    type="primary"
                  >
                    <i className="icon icon-add"></i>{" "}
                    <IntlMessages id="global.add" />
                  </Button>
                )}

                {this.state.synchronizebtn == "GIA" ? (
                  <Button
                    className="gx-mb-0 add-role-btn"
                    type="primary"
                    onClick={this.onSynchronize}
                  >
                    <IntlMessages id="btn.synchronize" />
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="gx-mb-0 add-role-btn"
                    type="primary"
                  >
                    <IntlMessages id="btn.synchronize" />
                  </Button>
                )}
              </div>
            </Col>
          </Row>

          {/* Add process modal start-------------------->by goral*/}

          <Modal
            title={
              this.state.editProcessFlag == "edit" ? (
                <IntlMessages id="processEdit.editProcess" />
              ) : (
                <IntlMessages id="processAdd.addProcess" />
              )
            }
            maskClosable={false}
            onCancel={this.closeAddProcess}
            visible={this.state.addProcessModal}
            closable={true}
            okText={<IntlMessages id="additentity.save" />}
            cancelText={<IntlMessages id="globalButton.cancel" />}
            onOk={
              this.state.editProcessFlag == "edit"
                ? this.handleImportEdit
                : this.handleProcessUpload
            }
            destroyOnClose={true}
            className="cust-modal-width role_modal"
          >
            <div className="gx-modal-box-row">
              <div className="gx-modal-box-form-item">
                <Form>
                  <div className="gx-form-group">
                    <Row>
                      <Col lg={24} xs={24}>
                        <FormItem>
                          <Radio.Group
                            name="processType"
                            defaultValue={this.state.radioValue}
                            onChange={(event) =>
                              this.setState({
                                radioValue: event.target.value,
                              })
                            }
                          >
                            <Radio value="BulkUpload">
                              <IntlMessages id="process.bulkupload" />
                            </Radio>
                            <Radio value="GIA">
                              <IntlMessages id="process.gia" />
                            </Radio>
                          </Radio.Group>
                        </FormItem>
                      </Col>

                      {/* for gia  */}

                      {this.state.radioValue === "GIA" && (
                        <>
                          <Col lg={24} xs={24}>
                            <label>
                              <IntlMessages id="process.elementName" />:
                            </label>
                            <FormattedMessage id="placeholder.elementName">
                              {(placeholder) => (
                                <FormItem>
                                  {getFieldDecorator("processName", {
                                    initialValue: this.state.process_name,
                                    rules: [
                                      {
                                        required: true,
                                        message: (
                                          <IntlMessages id="required.processAdd.elementName" />
                                        ),
                                        whitespace: true,
                                      },
                                    ],
                                  })(
                                    this.state.editProcessFlag == "edit" ? (
                                      <Input
                                        disabled
                                        required
                                        placeholder={placeholder}
                                        margin="none"
                                      />
                                    ) : (
                                      <Input
                                        required
                                        placeholder={placeholder}
                                        onChange={(event) =>
                                          this.setState({
                                            process_name: event.target.value,
                                          })
                                        }
                                        margin="none"
                                      />
                                    )
                                  )}
                                </FormItem>
                              )}
                            </FormattedMessage>
                          </Col>

                          {/* <Col lg={24} xs={24}> */}

                          <Col lg={10} xs={24} style={{ paddingTop: "17px" }}>
                            <label>
                              <IntlMessages id="process.syncdata" />:
                            </label>
                          </Col>
                          <Col lg={14} xs={24} style={{ paddingTop: "11px" }}>
                            <FormItem>
                              <Radio.Group
                                name="isSynchronize"
                                defaultValue={this.state.syncRadioValue}
                                onChange={(event) =>
                                  this.setState({
                                    syncRadioValue: event.target.value,
                                  })
                                }
                              >
                                <Radio value={true}>
                                  <IntlMessages id="process.yes" />
                                </Radio>
                                <Radio value={false}>
                                  <IntlMessages id="process.no" />
                                </Radio>
                              </Radio.Group>
                            </FormItem>
                          </Col>

                          {/* </Col> */}

                          {this.state.syncRadioValue === true && (
                            <>
                              <Col
                                lg={10}
                                xs={24}
                                style={{ paddingTop: "10px" }}
                              >
                                <label>
                                  <IntlMessages id="process.frequency" />:
                                </label>
                              </Col>
                              <Col lg={14} xs={24}>
                                <Select
                                  style={{
                                    width: 120,
                                    marginRight: "3px",
                                  }}
                                  defaultValue={this.state.frequencyVal}
                                  onChange={(value) =>
                                    this.setState({
                                      frequencyVal: value,
                                    })
                                  }
                                >
                                  <Option value="1">1</Option>
                                  <Option value="2">2</Option>
                                  <Option value="3">3</Option>
                                  <Option value="4">4</Option>
                                  <Option value="5">5</Option>
                                  <Option value="6">6</Option>
                                  <Option value="7">7</Option>
                                  <Option value="8">8</Option>
                                  <Option value="9">9</Option>
                                  <Option value="10">10</Option>
                                  <Option value="11">11</Option>
                                  <Option value="12">12</Option>
                                  <Option value="13">13</Option>
                                  <Option value="14">14</Option>
                                  <Option value="15">15</Option>
                                  <Option value="16">16</Option>
                                  <Option value="17">17</Option>
                                  <Option value="18">18</Option>
                                  <Option value="19">19</Option>
                                  <Option value="20">20</Option>
                                  <Option value="21">21</Option>
                                  <Option value="22">22</Option>
                                  <Option value="23">23</Option>
                                  <Option value="24">24</Option>
                                </Select>
                                Hrs
                              </Col>
                            </>
                          )}
                        </>
                      )}

                      {this.state.radioValue === "BulkUpload" && (
                        <>
                          <Col lg={24} xs={24}>
                            <FormattedMessage id="placeholder.processName">
                              {(placeholder) => (
                                <FormItem>
                                  {getFieldDecorator("processName", {
                                    initialValue: this.state.process_name,
                                    rules: [
                                      {
                                        required: true,
                                        message: (
                                          <IntlMessages id="required.processAdd.processName" />
                                        ),
                                        whitespace: true,
                                      },
                                    ],
                                  })(
                                    this.state.editProcessFlag == "edit" ? (
                                      <Input
                                        disabled
                                        required
                                        placeholder={placeholder}
                                        margin="none"
                                      />
                                    ) : (
                                      <Input
                                        required
                                        placeholder={placeholder}
                                        onChange={(event) =>
                                          this.setState({
                                            process_name: event.target.value,
                                          })
                                        }
                                        margin="none"
                                      />
                                    )
                                  )}
                                </FormItem>
                              )}
                            </FormattedMessage>
                          </Col>

                          <Col lg={5} xs={24} style={{ paddingTop: "20px" }}>
                            <label>
                              <IntlMessages id="sidebar.dataEntry.upload" />:
                            </label>
                          </Col>
                          <Col lg={16} xs={24} style={{ paddingTop: "13px" }}>
                            <FormItem
                              className="upload_item"
                              //  extra=".xls,.csv"
                            >
                              <Upload
                                {...processprops}
                                onRemove={this.handleRemoveFile}
                                showUploadList={true}
                                multiple={false}
                              >
                                <Button>
                                  <Icon type="upload" />
                                  <IntlMessages id="bulksignature.ClicktoUpload" />
                                </Button>
                              </Upload>
                            </FormItem>
                          </Col>
                        </>
                      )}
                    </Row>
                  </div>
                </Form>
              </div>
            </div>
          </Modal>

          {/* add process modal end---------------------->by goral*/}

          <Modal
            title={<IntlMessages id="processImport.title" />}
            visible={this.state.editConfirmModal}
            destroyOnClose={true}
            onCancel={() => this.cancelImportEdit()}
            onOk={() => this.confirmImportEdit()}
            okText={<IntlMessages id="button.yes" />}
            cancelText={<IntlMessages id="button.no" />}
            className="cust-modal-width cust-session-modal detail-modal"
          >
            <div className="gx-modal-box-row">
              <div className="gx-modal-box-form-item">
                <div className="mail-successbox">
                  <h3 className="err-text">
                    <IntlMessages id="processConfirm.message" />
                  </h3>
                </div>
                <div>
                  <h4 className="err-text">
                    <IntlMessages id="processColumn.currentColumn" />:
                  </h4>
                  {this.state.updatedProcessObj
                    ? this.state.updatedProcessObj.CurrentColumns.map(
                        (item, index) => {
                          return (
                            <p className="err-text-p">{item.ColumnName}</p>
                          );
                        }
                      )
                    : null}
                  <h4 className="err-text">
                    <IntlMessages id="processColumn.newColumn" />:
                  </h4>
                  {this.state.updatedProcessObj
                    ? this.state.updatedProcessObj.NewColumns.map(
                        (item, index) => {
                          return (
                            <p className="err-text-p">{item.ColumnName}</p>
                          );
                        }
                      )
                    : null}
                  <h4 className="err-text">
                    <IntlMessages id="processColumn.removedColumn" />:
                  </h4>
                  {this.state.updatedProcessObj
                    ? this.state.updatedProcessObj.RemovedColumns.map(
                        (item, index) => {
                          return (
                            <p className="err-text-p">{item.ColumnName}</p>
                          );
                        }
                      )
                    : null}
                </div>
              </div>
            </div>
          </Modal>
        </Card>
        {this.state.process_id !== "" ? (
          <Card
            title={<IntlMessages id="sidebar.data" />}
            extra={
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
                {this.state.process_type === "GIA" ? (
                  <Select
                    defaultValue={this.state.filterVal}
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

                {this.state.process_type === "GIA" ? (
                  <Button
                    disabled
                    type="primary"
                    className="gx-mb-0"
                    onClick={() => this.onAddData(columnsAddEdit)}
                  >
                    <IntlMessages id="dataAdd.addData" />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="gx-mb-0"
                    onClick={() => this.onAddData(columnsAddEdit)}
                  >
                    <IntlMessages id="dataAdd.addData" />
                  </Button>
                )}

                <Button
                  type="primary"
                  className="gx-mb-0"
                  onClick={this.handleExportProcess}
                >
                  <IntlMessages id="process.exportProcess" />
                </Button>
              </div>
            }
          >
            <Table
              className="gx-table-responsive cust-table-height cust-data-table cust-dynamic-columns"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={processDataList}
              onChange={this.handleTableChange}
              pagination={this.state.pagination}
              loading={this.state.loading}
              scroll={{ x: true }}
              footer={() => (
                <Button className="total-count-btn">
                  TotalCount :{" "}
                  {processDataListing != null
                    ? processDataListing.TotalCount
                    : ""}
                </Button>
              )}
              // scroll={{ x: 20000, y: 400 }}
              // style={{ whiteSpace: "pre" }}
              // bordered
            />
            <Modal
              title={
                this.state.editDataFlag === "edit" ? (
                  <IntlMessages id="dataEdit.editData" />
                ) : (
                  <IntlMessages id="dataAdd.addData" />
                )
              }
              maskClosable={false}
              onCancel={this.closeAddData}
              visible={this.state.addDataModal}
              closable={true}
              okText={<IntlMessages id="additentity.save" />}
              cancelText={<IntlMessages id="globalButton.cancel" />}
              onOk={this.handleDataSubmit}
              destroyOnClose={true}
              className="cust-modal-width cust-session-modal detail-modal"
            >
              <div className="gx-modal-box-row">
                <div className="gx-modal-box-form-item">
                  <Form>
                    {this.state.columnLists
                      ? this.state.columnLists.map((item, index) => {
                          return (
                            <div className="gx-form-group">
                              <Row>
                                <Col lg={24} xs={24}>
                                  <label>{item.title} :</label>
                                  <FormItem>
                                    {getFieldDecorator("field" + index, {
                                      initialValue: item.value
                                        ? item.value
                                        : "",
                                      rules: [
                                        {
                                          required: false,
                                        },
                                      ],
                                    })(
                                      this.state.editDataFlag === "edit" &&
                                        item.title === "RowId" ? (
                                        <Input
                                          disabled
                                          onChange={(event) =>
                                            this.handlePushSaveData(
                                              item.title,
                                              event
                                            )
                                          }
                                          margin="none"
                                        />
                                      ) : (
                                        <Input
                                          onChange={(event) =>
                                            this.handlePushSaveData(
                                              item.title,
                                              event
                                            )
                                          }
                                          margin="none"
                                        />
                                      )
                                    )}
                                  </FormItem>
                                </Col>
                              </Row>
                            </div>
                          );
                        })
                      : null}
                  </Form>
                </div>
              </div>
            </Modal>
            <Modal
              className=""
              title={<IntlMessages id="dataDelete.title" />}
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
                    <h3 className="err-text">
                      <IntlMessages id="dataDelete.message" />
                    </h3>
                  </div>
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
          </Card>
        ) : null}

        {/* {(this.state.loader || this.props.loader) &&
        this.state.sync === "off" ? (
          <div className="gx-loader-view">
            <CircularProgress />
          </div>
        ) : (this.state.loader || this.props.loader) &&
          this.state.sync === "on" ? (
          <div>{message.success("Synchronization in progress")}</div>
        ) : null} */}

        {(this.state.loader || this.props.loader) &&
        this.state.sync === "off" ? (
          <div className="gx-loader-view">
            <CircularProgress />
          </div>
        ) : null}
      </div>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  getProcessData,
  saveProcessData,
  deleteProcessData,
  userRolePermissionByUserId,
  processNamesForDropDownList,
  setStatusToInitial,
  getSynchronize,
};

const viewProcessReportForm = Form.create()(Process);

const mapStateToProps = (state) => {
  return {
    getProcessDataList: state.processReducers.get_process_res,
    processDropDownList: state.processReducers.get_process_dropdown,
    loader: state.processReducers.loader,
    status: state.processReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewProcessReportForm));
