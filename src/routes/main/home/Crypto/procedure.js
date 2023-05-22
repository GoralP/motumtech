import React, { Component } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  DatePicker,
  message,
  Form,
  Modal,
  Row,
  Col,
  Select,
  Checkbox,
  Upload,
  Icon,
  Divider,
  Radio,
} from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import IntlMessages from "util/IntlMessages";
import {
  get_procedures,
  hideMessage,
  setstatustoinitial,
  get_reportprocedure,
  get_procedure_form,
  open_procedure_modal,
  close_procedure_modal,
  getProcedureDetails,
} from "./../../../../appRedux/actions/ProceduresActions";
import xtype from "xtypejs";
import CircularProgress from "./../../../../components/CircularProgress/index";

import ProDocuments from "./prodocuments";
import { FormattedMessage, injectIntl } from "react-intl";

var userId = "";
var langName = "";
var procedureAdd = "";
var procedureDocument = "";
var procedureExport = "";

const { Dragger } = Upload;

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;

var procedure_value = "";
var FormControlsList = [];
var tempDocParticipant = [];
var signerList = [];
var formFieldFile = [];

class Procedure extends Component {
  constructor() {
    super();
    this.state = {
      addProcedureState: false,
      addDocumentsState: false,
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      loading: false,
      showExpedientForm: "",
      dni: "",
      startValue: "",
      endValue: "",
      endOpen: false,
      company_name: "",
      company_address: "",
      cif: "",
      representation_position: "",
      addVisitModal: false,
      procedureDNI: "",
      procedureDNI2: "",
      procedureDNI3: "",
      isSigner2: false,
      isSigner3: false,
      procedureForm: "",
      docParticipant: "",
      docSigner: "",
      loader: false,
      ProcedureUpload: {},
      procedureFieldUpload: "",
      procedureTypeForImport: "",
      supportModeImport: "",
      fileList: [],
      modalProcedureVisible: false,
      selectMode: "",
    };
  }

  get_proceduresById(pageNumber = "", sortBy = "-VisitId", perPage = "10") {
    if (this.props.status === "Initial") {
      this.props.get_procedures({
        pageNumber: 1,
        sortBy: "-VisitId",
        perPage: perPage,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-VisitId";
      }
      if (this.props.status === "Datareortloaded") {
        this.props.form.validateFieldsAndScroll(
          ["StartDate", "EndDate"],
          (err, values) => {
            if (!err) {
              var dniNumber = this.state.dni;
              var currentReport = this.state.reportType;
              var startingDate = DateForGetReport(this.state.startValue);
              var endingDate = DateForGetReport(this.state.endValue);

              var condition = {
                dniNumber: dniNumber,
                currentReport: currentReport,
                startingDate: startingDate,
                endingDate: endingDate,
                pageNumber: pageNumber,
                sortBy: sortBy,
                perPage: perPage,
              };
              this.props.get_reportprocedure(condition);
            }
          }
        );
      } else {
        this.props.get_procedures({
          pageNumber: pageNumber,
          sortBy: sortBy,
          perPage: perPage,
        });
      }
    }
  }

  componentDidMount() {
    let userdata = localStorage.getItem(branchName + "_data");
    langName = localStorage.getItem(branchName + "_language");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.Procedure.Procedure_Add;
      let permit_prcedure_document =
        userData.Permission.Procedure.Procedure_Document;
      let permit_export_excel =
        userData.Permission.Procedure.Procedure_ExportExcel;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_add !== undefined &&
        permit_prcedure_document !== undefined &&
        permit_export_excel !== undefined
      ) {
        userId = userData["id"];
        procedureAdd = permit_add;
        procedureDocument = permit_prcedure_document;
        procedureExport = permit_export_excel;
      }
    }
    this.props.setstatustoinitial();
    this.get_proceduresById();
    this.props.get_procedure_form();
  }

  handleReporttypeChange = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          var dniNumber = this.state.dni;
          var currentReport = this.state.reportType;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

          var pageNumber = 1;
          var perPage = "10";
          var sortBy = "-VisitId";
          var condition = {
            dniNumber: dniNumber,
            currentReport: currentReport,
            startingDate: startingDate,
            endingDate: endingDate,
            pageNumber: pageNumber,
            sortBy: sortBy,
            perPage: perPage,
          };
          this.props.get_reportprocedure(condition);
        }
      }
    );
  };

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
    this.get_proceduresById(pagination.current, sortBy, pagination.pageSize);
  };

  onAddDocuments = (id) => {
    // var visit_id = e.target.value;
    this.setState({ addDocumentsState: true, visit_id: id });
    console.log("visit id---->", id);
  };
  onDocumentsClose = () => {
    this.setState({ addDocumentsState: false });
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  openProcedureViewModal = (id) => {
    this.props.getProcedureDetails(id);
    this.setState({ modalProcedureVisible: true });
  };

  closeProcedureViewModal = () => {
    this.setState({ modalProcedureVisible: false });
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange("startValue", value);
  };

  onEndChange = (value) => {
    this.onChange("endValue", value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  //Export Excel in csv file format
  handleExportExcel = (e) => {
    e.preventDefault();
    let authBasic = "";
    authBasic = localStorage.getItem("setAuthToken");
    this.props.form.validateFieldsAndScroll(
      ["StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          let userdata = localStorage.getItem(branchName + "_data");
          langName = localStorage.getItem(branchName + "_language");
          if (userdata !== "" && userdata !== null) {
            let userData = JSON.parse(userdata);
            if (
              userData !== "" &&
              userData !== null &&
              userData["id"] !== undefined
            ) {
              userId = userData["id"];
            }
          }

          var dniNumber = this.state.dni;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

          fetch(
            baseURL +
              "ExportProcedurExcel?licenseId=" +
              userId +
              "&Startdate=" +
              startingDate +
              "&Enddate=" +
              endingDate +
              "&DNI=" +
              dniNumber +
              "&lang=" +
              langName,
            { headers: { Authorization: "Basic " + authBasic } }
          ).then((response) => {
            if (this.props.getProceduresData.TotalCount === 0) {
              message.error(
                this.props.intl.formatMessage({ id: "global.NoData" })
              );
            } else {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download =
                  dniNumber + "_" + startingDate + "_" + endingDate + ".csv";
                a.click();
              });
            }
            // window.location.href = response.url;
          });
        }
      }
    );
  };

  onAddProcedure = () => {
    this.setState({
      procedureDNI: "",
      procedureDNI2: "",
      procedureDNI3: "",
      isSigner2: false,
      isSigner3: false,
      procedureForm: "",
      docParticipant: "",
    });
    this.setState({ addProcedureState: true });
    this.setState({ ProcedureUpload: null });
    this.setState({ procedureTypeForImport: "" });
    this.setState({ supportModeImport: "" });
    this.setState({ procedureFieldUpload: null });
  };

  onProcedureClose = () => {
    this.setState({
      procedureDNI: "",
      procedureDNI2: "",
      procedureDNI3: "",
      isSigner2: false,
      isSigner3: false,
      procedureForm: "",
      docParticipant: "",
    });
    this.setState({ addProcedureState: false });
    this.setState({ ProcedureUpload: null });
    this.setState({ procedureTypeForImport: "" });
    this.setState({ supportModeImport: "" });
    this.setState({ procedureFieldUpload: null });
  };

  handleSaveProcedureData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["DNI, DNI2, DNI3"],
      (err, values) => {
        if (!err) {
          this.setState({ loader: true });
          let userdata = localStorage.getItem(branchName + "_data");
          langName = localStorage.getItem(branchName + "_language");
          if (userdata !== "" && userdata !== null) {
            let userData = JSON.parse(userdata);
            if (
              userData !== "" &&
              userData !== null &&
              userData["id"] !== undefined
            ) {
              userId = userData["id"];
            }
          }

          if (procedure_value === "") {
            message.destroy();
            message.config({
              maxCount: 1,
            });
            message.error(
              this.props.intl.formatMessage({
                id: "required.visitAdd.ProcedureType",
              })
            );
            this.setState({ loader: false });
            return false;
          }

          var submitProcedureFormData = {
            DNI: this.state.procedureDNI,
            procedureType: procedure_value,
            licenseId: userId,
            deviceId: "Web",
            SignerList: signerList,
            FormControls: FormControlsList,
            SupportMode:
              this.state.supportModeImport === "FormSendingLink" ||
              this.state.supportModeImport === "WorkInstruction"
                ? this.state.supportModeImport
                : this.state.selectMode,
          };

          const procedureDataForm = new FormData();
          procedureDataForm.append(
            "ProcedureDetail",
            JSON.stringify(submitProcedureFormData)
          );

          // console.log("test--->", submitProcedureFormData);

          if (
            this.state.procedureFieldUpload !== undefined &&
            this.state.procedureFieldUpload !== null
          ) {
            if (this.state.procedureFieldUpload.length !== 0) {
              for (let i = 0; i < this.state.procedureFieldUpload.length; i++) {
                // formData.append("images", images[i]);
                procedureDataForm.append(
                  "FormFiledFile",
                  this.state.procedureFieldUpload[i]
                );
              }
              // procedureDataForm.append(
              //   "FormFiledFile",
              //   this.state.procedureFieldUpload
              // );
            }
          }

          // if (
          //   this.state.ProcedureUpload !== undefined &&
          //   this.state.ProcedureUpload !== null
          // ) {
          //   if (Object.entries(this.state.ProcedureUpload).length !== 0) {
          //     procedureDataForm.append(
          //       "ProcedureTemplate",
          //       this.state.ProcedureUpload
          //     );
          //   } else {
          //     message.destroy();
          //     message.config({
          //       maxCount: 1,
          //     });
          //     message.error(
          //       this.props.intl.formatMessage({ id: "global.UploadRequired" })
          //     );
          //     this.setState({ loader: false });
          //     return false;
          //   }
          // } else {
          //   message.destroy();
          //   message.config({
          //     maxCount: 1,
          //   });
          //   message.error(
          //     this.props.intl.formatMessage({ id: "global.UploadRequired" })
          //   );
          //   this.setState({ loader: false });
          //   return false;
          // }

          if (this.state.procedureTypeForImport.toLowerCase() === "generalv2") {
            if (
              this.state.ProcedureUpload !== undefined &&
              this.state.ProcedureUpload !== null
            ) {
              if (Object.entries(this.state.ProcedureUpload).length !== 0) {
                procedureDataForm.append(
                  "ProcedureTemplate",
                  this.state.ProcedureUpload
                );
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

          console.log("form data--->", procedureDataForm);

          signerList = [
            {
              DNI: this.state.procedureDNI2,
              isSigner: this.state.isSigner2,
            },
            {
              DNI: this.state.procedureDNI3,
              isSigner: this.state.isSigner3,
            },
          ];

          var submitUrl = baseURL + "SaveProcedure?lang=" + langName;

          const requestOptions = {
            method: "POST",
            headers: {
              //'Content-Type': 'multipart/form-data'
            },
            mimeType: "multipart/form-data",
            body: procedureDataForm,
          };

          fetch(submitUrl, requestOptions)
            .then((response) => {
              if (response.ok) {
                return response.json(); //then consume it again, the error happens
              }
            })
            .then((data) => {
              if (data !== undefined) {
                var parsed_response = data;
                var response_status = parsed_response.status;
                var response_message = parsed_response.message;
                if (response_status) {
                  message.destroy();
                  message.config({
                    maxCount: 1,
                  });
                  message.success(response_message);
                  this.setState({ loader: false });
                  FormControlsList = [];
                  signerList = [];
                  this.setState({
                    procedureDNI: "",
                    procedureDNI2: "",
                    procedureDNI3: "",
                    isSigner2: false,
                    isSigner3: false,
                    procedureForm: "",
                    docParticipant: "",
                    addProcedureState: false,
                    procedureTypeForImport: "",
                    supportModeImport: "",
                  });
                  this.get_proceduresById();
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
                message.error(
                  this.props.intl.formatMessage({ id: "global.TryAgain" })
                );
                this.setState({ loader: false });
              }
            });
        }
      }
    );
  };

  // dummyRequest({ file, onSuccess }) {
  //   setTimeout(() => {
  //     onSuccess("Ok");
  //   }, 0);
  // }

  // normFile(e) {
  //   var test = [];
  //   test.push(e);
  //   console.log("upload file---", test);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   if (e.fileList.length > 1) {
  //     e.fileList.shift();
  //   }
  //   return e && e.fileList;
  // }

  // handleChange = (info) => {
  //   // let fileList = info.fileList;
  //   // console.log("file--->", fileList);
  //   // // 1. Limit the number of uploaded files
  //   // // Only to show two recent uploaded files, and old ones will be replaced by the new
  //   // fileList = fileList.slice();

  //   // // 2. read from response and show file link
  //   // fileList = fileList.map((file) => {
  //   //   if (file.response) {
  //   //     // Component will show file.url as link
  //   //     file.url = file.response.url;
  //   //   }

  //   //   return file;
  //   // });

  //   // // 3. filter successfully uploaded files according to response from server
  //   // fileList = fileList.filter((file) => {
  //   //   if (file.response) {
  //   //     return file.response.status === "success";
  //   //   }
  //   //   return true;
  //   // });

  //   // var test = [];
  //   // test.push(fileList);
  //   // console.log("test file array---->", test);
  //   // this.setState({ fileList });

  //   // this.setState({ procedureFieldUpload: fileList });

  //   let fileList = [...info.fileList];
  //   fileList = fileList.slice(-2);
  //   fileList = fileList.map((file) => {
  //     if (file.response) {
  //       // Component will show file.url as link
  //       file.url = file.response.url;
  //     }
  //     return file;
  //   });
  //   this.setState({ fileList });
  //   // console.log("filelist--->", this.state.fileList);
  // };

  // handleChange = (info) => {
  //   console.log(info);

  //   //把fileList拿出来
  //   let { fileList } = info;

  //   const status = info.file.status;
  //   if (status !== "uploading") {
  //     console.log("file info", info.fileList);
  //   }
  //   if (status === "done") {
  //     console.log("file info", info.fileList);
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === "error") {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }

  //   //重新设置state
  //   this.setState({ fileList });
  // };

  handleProcedureChange = (value) => {
    procedure_value = `${value}`;
    const procedureData = this.props.get_procedureFormData.find(
      (singleProcedure) => {
        return singleProcedure.ProcedureId == procedure_value;
      }
    );

    const { getFieldDecorator } = this.props.form;

    const procedureFile1 = {
      beforeUpload: (file, fileList) => {
        console.log("filelist--->", fileList);

        // let fileExt = "";
        // // fileList.map((item) => (fileExt = item.name.split(".")));
        // fileExt = file.name.split(".");

        // fileExt = fileExt[fileExt.length - 1];
        // const isFileExt =
        //   fileExt.toLowerCase() === "doc" || fileExt.toLowerCase() === "docx";
        // const isExcelFile =
        //   fileExt.toLowerCase() === "xls" ||
        //   fileExt.toLowerCase() === "xlsx" ||
        //   file.type ===
        //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        // if (!isExcelFile && !isFileExt) {
        //   message.error(
        //     this.props.intl.formatMessage({ id: "global.UploadExcel" })
        //   );
        // } else {
        //   this.setState({ procedureFieldUpload: fileList });
        // }
        this.setState({ procedureFieldUpload: fileList });
        return false;
      },
    };

    this.setState({ procedureTypeForImport: procedureData.ProcedureType });
    this.setState({ supportModeImport: procedureData.SupportMode });

    tempDocParticipant = [];
    for (var i = 0; i < procedureData.DocParticipant - 1; i++) {
      tempDocParticipant.push({
        DNI: null,
        isSigner: false,
      });
    }

    var tempDocSigner = [];
    for (var i = 0; i < procedureData.DocSigner; i++) {
      // tempDocParticipant[i].isSigner = false;
      tempDocSigner.push(i);
    }

    var tempParticipantForm = "";
    tempParticipantForm = tempDocParticipant.map((value, key) => {
      return (
        <Row style={{ marginBottom: "10px" }}>
          <Col lg={16}>
            <label>DNI{key + 2}</label>
            <Input
              className="ant-input"
              // placeholder={value.DisplayName}
              onChange={(e) =>
                this.handleSetFieldValue(
                  e,
                  procedure_value,
                  key,
                  "textbox",
                  false
                )
              }
              margin="none"
            />
          </Col>
          {tempDocSigner.length - 1 > key ? (
            <Col lg={8}>
              <Checkbox
                style={{ paddingTop: "30px" }}
                onChange={(e) =>
                  this.handleSetFieldValue(
                    e,
                    procedure_value,
                    key,
                    "checkBox",
                    false
                  )
                }
              >
                <IntlMessages id="addprocedure.isSigner" />
              </Checkbox>
            </Col>
          ) : (
            <Col lg={8}>
              <Checkbox disabled style={{ paddingTop: "30px" }}>
                <IntlMessages id="addprocedure.isSigner" />
              </Checkbox>
            </Col>
          )}
        </Row>
      );
    });
    this.setState({ docParticipant: tempParticipantForm });

    // var tempSignerForm = '';
    // tempSignerForm = tempDocSigner.map((value,key)=>{
    //   return (
    //     <>
    //       <Checkbox onChange={(e) => this.handleSetFieldValue(e, procedure_value, key, "checkBox", false)}><IntlMessages id="addprocedure.isSigner"/></Checkbox>
    //     </>
    //   )
    // })
    // this.setState({docSigner: tempSignerForm});
    // console.log("tempSignerForm =>", tempSignerForm);

    var tempProcedureForm = "";
    tempProcedureForm = procedureData.FormControls.map((value, key) => {
      if (value.Type.toLowerCase() == "textbox") {
        return (
          <div className="gx-form-group">
            <Row>
              <Col lg={24}>
                <label>{value.DisplayName}</label>
                <Input
                  className="ant-input"
                  // placeholder={value.DisplayName}
                  onChange={(e) =>
                    this.handleSetFieldValue(
                      e,
                      procedure_value,
                      key,
                      value.Type,
                      true
                    )
                  }
                  margin="none"
                />
              </Col>
            </Row>
          </div>
        );
      } else if (value.Type.toLowerCase() == "textarea") {
        return (
          <div className="gx-form-group">
            <Row>
              <Col lg={24}>
                <label>{value.DisplayName}</label>
                <TextArea
                  rows={4}
                  className="ant-input"
                  // placeholder={value.DisplayName}
                  onChange={(e) =>
                    this.handleSetFieldValue(
                      e,
                      procedure_value,
                      key,
                      value.Type,
                      true
                    )
                  }
                  margin="none"
                />
              </Col>
            </Row>
          </div>
        );
      } else if (value.Type.toLowerCase() == "combobox") {
        var optionValues = "";
        optionValues = value.DefaultValue.split(";");
        var optionsData = optionValues.map((value, key) => {
          return (
            <Option key={key} value={value}>
              {value}
            </Option>
          );
        });

        return (
          <div className="gx-form-group">
            <Row>
              <Col lg={24}>
                <label>{value.DisplayName}</label>
                <Select
                  className="ant-input"
                  onChange={(e) =>
                    this.handleSetFieldValue(
                      e,
                      procedure_value,
                      key,
                      value.Type,
                      true
                    )
                  }
                  defaultValue={value.DisplayName}
                  margin="none"
                >
                  {optionsData}
                </Select>
              </Col>
            </Row>
          </div>
        );
      } else if (value.Type.toLowerCase() == "fileupload") {
        return (
          <div className="gx-form-group">
            <Row>
              <Col lg={12}>
                <label>{value.DisplayName}</label>
                <br />
                <Upload
                  {...procedureFile1}
                  onRemove={this.handleRemoveFileUpload}
                  showUploadList={true}
                  multiple={true}
                  // fileList={this.state.fileList}
                >
                  <Button>
                    <Icon type="upload" />{" "}
                    <IntlMessages id="bulksignature.ClicktoUpload" />
                  </Button>
                </Upload>
                {/* <Dragger {...props}>
                  <p className="ant-upload-drag-icon"></p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                  </p>
                </Dragger> */}

                {/* <FormItem>
                  {getFieldDecorator("file", {
                    initialValue:
                      this.props.dataset && this.props.dataset.filename
                        ? this.props.dataset.filename
                        : [],
                    valuePropName: "fileList",
                    getValueFromEvent: this.normFile,
                  })(
                    <Upload
                      name="file"
                      onRemove={this.handleRemoveFileUpload}
                      showUploadList={true}
                      customRequest={this.dummyRequest}
                      multiple={true}
                    >
                      <Button>
                        <Icon type="upload" />{" "}
                        <IntlMessages id="bulksignature.ClicktoUpload" />
                      </Button>
                    </Upload>
                  )}
                </FormItem> */}
              </Col>
            </Row>
          </div>
        );
      }
    });
    this.setState({ procedureForm: tempProcedureForm });
  };

  handleSetFieldValue = (e, procedure_id, key, type, access) => {
    var procedureData = this.props.get_procedureFormData.find((procedureId) => {
      return procedureId.ProcedureId == procedure_id;
    });

    // Set value to DocParticipants SignerList
    // var tempSignerList = '';
    if (procedureData && access === false) {
      // tempSignerList = tempDocParticipant[key];
      if (type === "textbox") {
        tempDocParticipant[key].DNI = e.target.value;
      } else if (type === "checkBox") {
        if (e.target.checked === true) {
          tempDocParticipant[key].isSigner = true;
        } else {
          tempDocParticipant[key].isSigner = false;
        }
      }
      // tempDocParticipant[key] = tempSignerList;
      signerList = tempDocParticipant;
    }

    // Set values to formcontrol list
    var tempFormControl = "";
    if (procedureData && access) {
      tempFormControl = procedureData.FormControls[key];
      if (type === "combobox") {
        tempFormControl.UserValue = e;
      } else {
        tempFormControl.UserValue = e.target.value;
      }
      procedureData.FormControls[key] = tempFormControl;
      FormControlsList = procedureData.FormControls;
    }
  };

  handleChangeSigner2 = (e) => {
    if (e.target.checked === true) {
      this.setState({ isSigner2: true });
    }
  };

  handleChangeSigner3 = (e) => {
    if (e.target.checked === true) {
      this.setState({ isSigner3: true });
    }
  };

  handleRemoveFile = (e) => {
    this.setState({ ProcedureUpload: null });
  };

  handleRemoveFileUpload = (e) => {
    this.setState({ procedureFieldUpload: null });
  };

  render() {
    const {
      addProcedureState,
      addDocumentsState,
      startValue,
      endValue,
      endOpen,
    } = this.state;

    var proceduresData = this.props.getProceduresData;
    var procedureData = "";

    console.log("loader--->", this.props.loader);

    var singleProcedureData = this.props.getSingleProcedure;

    console.log("single--->", singleProcedureData);

    // console.log(Object.keys(this.props.getSingleProcedure));

    // console.log(Object.keys(singleProcedureData));

    // console.log("key--->", test);

    if (!proceduresData) {
      // Object is empty (Would return true in this example)
    } else {
      procedureData = proceduresData.procedureList;

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
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
        dataIndex: "FullSurName",
        key: "FullSurName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        sorter: true,
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
        title: <IntlMessages id="column.company" />,
        dataIndex: "CompanyName",
        key: "CompanyName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "procedureDate",
        key: "procedureDate",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.time" />,
        dataIndex: "procedureDate",
        key: "procedureTime",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => TimeWithoutDateHelper(text),
      },
      {
        title: <IntlMessages id="column.Action" />,

        key: "action",
        align: "center",
        fixed: "right",
        render: (text, record) => (
          // <span>
          //   <span className="gx-link">
          //     {procedureDocument === true ? (
          //       <Button
          //         onClick={() => this.onAddDocuments(record.VisitId)}
          //         value={record.VisitId}
          //         className="arrow-btn gx-link"
          //       >
          //         {/* <IntlMessages id="column.document" /> */}
          //         <img
          //           src={require("assets/images/document/detail-doc.png")}
          //           className="document-icons"
          //           // alt={title}
          //           // title={title}
          //         />
          //       </Button>
          //     ) : (
          //       <Button
          //         onClick={() => this.onAddDocuments(record.VisitId)}
          //         value={record.VisitId}
          //         className="arrow-btn gx-link"
          //       >
          //         {/* <IntlMessages id="column.document" /> */}
          //         <img
          //           src={require("assets/images/document/detail-doc.png")}
          //           className="document-icons"
          //           // alt={title}
          //           // title={title}
          //         />
          //       </Button>
          //     )}
          //     <Divider type="vertical" />
          //     <Button
          //       onClick={this.onAddDocuments}
          //       value={record.VisitId}
          //       className="arrow-btn gx-link"
          //     >
          //       <img
          //         src={require("assets/images/visibility.png")}
          //         className="document-icons "
          //         // alt={title}
          //         // title={title}
          //       />
          //     </Button>
          //   </span>
          // </span>

          <div>
            <FormattedMessage id="column.document">
              {(title) => (
                <span className="gx-link">
                  {procedureDocument === true ? (
                    <Button
                      onClick={() => this.onAddDocuments(record.VisitId)}
                      value={record.VisitId}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/document/detail-doc.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      value={record.VisitId}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/document/detail-doc.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  )}
                </span>
              )}
            </FormattedMessage>
            <Divider type="vertical" />
            <FormattedMessage id="column.details">
              {(title) => (
                <span className="gx-link">
                  {procedureDocument === true ? (
                    <Button
                      // onClick={() => this.onAddDocuments(record.VisitId)}
                      onClick={() =>
                        this.openProcedureViewModal(record.VisitId)
                      }
                      value={record.VisitId}
                      className="arrow-btn gx-link"
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
                      value={record.VisitId}
                      className="arrow-btn gx-link"
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

    const procedureprops = {
      beforeUpload: (file) => {
        let fileExt = file.name.split(".");
        fileExt = fileExt[fileExt.length - 1];
        const isFileExt =
          fileExt.toLowerCase() === "doc" || fileExt.toLowerCase() === "docx";
        const isExcelFile =
          fileExt.toLowerCase() === "xls" ||
          fileExt.toLowerCase() === "xlsx" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        if (!isExcelFile && !isFileExt) {
          message.error(
            this.props.intl.formatMessage({ id: "global.UploadExcel" })
          );
        } else {
          this.setState({ ProcedureUpload: file });
        }
        return false;
      },
    };

    return (
      <Card
        title={<IntlMessages id="procedure.title" />}
        extra={
          <div className="card-extra-form">
            <Form className="custom-form">
              <FormattedMessage id="placeholder.EnterDNINumber">
                {(placeholder) => (
                  <FormItem>
                    <Input
                      className="inline-inputs"
                      value={this.state.dni}
                      onChange={(e) => this.onDNIChange(e.target.value)}
                      placeholder={placeholder}
                    />
                  </FormItem>
                )}
              </FormattedMessage>
              <FormattedMessage id="placeholder.StartDate">
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
                        disabledDate={this.disabledStartDate}
                        format="DD/MM/YYYY"
                        value={startValue}
                        placeholder={placeholder}
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                      />
                    )}
                  </FormItem>
                )}
              </FormattedMessage>
              <FormattedMessage id="placeholder.EndDate">
                {(placeholder) => (
                  <FormItem>
                    {getFieldDecorator("EndDate", {
                      rules: [
                        {
                          type: "object",
                          required: true,
                          message: (
                            <IntlMessages id="required.EndDateRequired" />
                          ),
                          whitespace: true,
                        },
                      ],
                    })(
                      <DatePicker
                        className="inline-inputs"
                        disabledDate={this.disabledEndDate}
                        format="DD/MM/YYYY"
                        value={endValue}
                        placeholder={placeholder}
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                      />
                    )}
                  </FormItem>
                )}
              </FormattedMessage>
              <FormItem>
                <Button
                  className="inline-btn"
                  type="primary"
                  onClick={this.handleReporttypeChange}
                >
                  <IntlMessages id="button.getReport" />
                </Button>
              </FormItem>
              <FormItem>
                {procedureExport === true ? (
                  <Button
                    className="inline-btn"
                    type="primary"
                    onClick={this.handleExportExcel}
                  >
                    <IntlMessages id="button.exportExcel" />
                  </Button>
                ) : (
                  <Button className="inline-btn" type="primary" disabled>
                    <IntlMessages id="button.exportExcel" />
                  </Button>
                )}
              </FormItem>
              <FormItem>
                {procedureAdd === true ? (
                  <Button
                    className="inline-btn"
                    type="primary"
                    onClick={this.onAddProcedure}
                  >
                    <IntlMessages id="button.newProcedure" />
                  </Button>
                ) : (
                  <Button className="inline-btn" type="primary" disabled>
                    <IntlMessages id="button.newProcedure" />
                  </Button>
                )}
              </FormItem>
            </Form>
          </div>
        }
      >
        <Table
          className="gx-table-responsive"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={procedureData}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          loading={this.state.loading}
          scroll={{ x: 1050 }}
        />
        <ProDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
        />
        {/* <AddProcedure open={addProcedureState} contact={{
          'id': 1,
          'name': '',
          'thumb': '',
          'email': '',
          'phone': '',
          'designation': '',
          'selected': false,
          'starred': false,
          'frequently': false,
        }} onProcedureClose={this.onProcedureClose}/> */}

        <Modal
          title={<IntlMessages id="addprocedure.title" />}
          visible={addProcedureState}
          toggle={this.onProcedureClose}
          maskClosable={false}
          closable={true}
          destroyOnClose={true}
          okText={<IntlMessages id="additentity.save" />}
          onOk={this.handleSaveProcedureData}
          onCancel={this.onProcedureClose}
          width="500px"
        >
          <Form preserve={false}>
            <div className="gx-modal-box-row cust-dni">
              <div className="gx-modal-box-form-item">
                <div className="gx-form-group">
                  <Row>
                    <Col lg={24}>
                      <label>
                        <IntlMessages id="DNI" />
                      </label>
                      {getFieldDecorator("DNI", {
                        initialValue: this.state.procedureDNI,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.DNIIsRequired" />
                            ),
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          className="ant-input"
                          // required
                          // placeholder="Expedient Name"
                          onChange={(event) =>
                            this.setState({ procedureDNI: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </Col>
                  </Row>
                </div>
                <div className="gx-form-group">
                  <Row>
                    <Col lg={24}>
                      <label>
                        <IntlMessages id="addprocedure.ProcedureType" />
                      </label>
                      <Select
                        className="ant-input"
                        onChange={this.handleProcedureChange}
                        defaultValue={
                          <IntlMessages id="addprocedure.ProcedureType" />
                        }
                        margin="none"
                      >
                        {/* {expedientList} */}
                        {this.props.get_procedureFormData.length &&
                          this.props.get_procedureFormData.map((value, key) => {
                            return (
                              <Option key={key} value={value.ProcedureId}>
                                {value.ProcedureName}
                              </Option>
                            );
                          })}
                      </Select>
                    </Col>
                  </Row>
                </div>

                <div className="gx-form-group">
                  <Row>
                    <Col lg={24}>
                      {this.state.supportModeImport.toLowerCase() === "both" ? (
                        <Row>
                          <Col lg={6} xs={24} style={{ paddingTop: "17px" }}>
                            <label>
                              <IntlMessages id="procedure.supportModeType" />:
                            </label>
                          </Col>
                          <Col lg={18} xs={24} style={{ paddingTop: "11px" }}>
                            <FormItem>
                              <Radio.Group
                                name="isSelectMode"
                                defaultValue={this.state.selectMode}
                                onChange={(event) =>
                                  this.setState({
                                    selectMode: event.target.value,
                                  })
                                }
                              >
                                <Radio value="FormSendingLink">
                                  <IntlMessages id="procedure.formSendingLink" />
                                </Radio>
                                <Radio value="WorkInstruction">
                                  <IntlMessages id="procedure.workInstruction" />
                                </Radio>
                              </Radio.Group>
                            </FormItem>
                          </Col>
                        </Row>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                </div>

                {this.state.procedureTypeForImport.toLowerCase() ===
                "generalv2" ? (
                  <div className="gx-form-group">
                    <Row>
                      <Col lg={12}>
                        <label>
                          <IntlMessages id="sidebar.dataEntry.upload" />
                        </label>
                        <br />
                        <Upload
                          {...procedureprops}
                          onRemove={this.handleRemoveFile}
                          showUploadList={true}
                          multiple={false}
                        >
                          <Button>
                            <Icon type="upload" />{" "}
                            <IntlMessages id="bulksignature.ClicktoUpload" />
                          </Button>
                        </Upload>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <></>
                )}

                <div className="gx-form-group">
                  {/* <Row>
                    <Col lg={16}> */}
                  {this.state.docParticipant}
                  {/* </Col>
                    <Col lg={8}>
                      {this.state.docSigner}
                    </Col> */}
                  {/* <Col lg={8}>
                      <Checkbox onChange={(event) => this.handleChangeSigner3(event)}><IntlMessages id="addprocedure.isSigner"/></Checkbox>
                    </Col> */}
                  {/* </Row> */}
                </div>
                {this.state.procedureForm}
                <div id="display_expedient_form"></div>
              </div>
            </div>
          </Form>
        </Modal>

        <Modal
          className="detail-modal"
          title={<IntlMessages id="procedureDetails.title" />}
          visible={this.state.modalProcedureVisible}
          destroyOnClose={true}
          onCancel={this.closeProcedureViewModal}
          footer={null}
          width={"50%"}
        >
          <Row className="detail-row">
            <Col lg={7}>
              <div className="det-row">
                <ul type="none" style={{ marginLeft: 0, paddingLeft: 0 }}>
                  {singleProcedureData != null &&
                    Object.keys(singleProcedureData).map((key) => (
                      <li style={{ fontWeight: "700", marginBottom: "10px" }}>
                        {key}:
                      </li>
                    ))}
                </ul>
              </div>
            </Col>
            <Col lg={16}>
              <div className="det-row">
                <ul type="none" style={{ marginLeft: 0, paddingLeft: 0 }}>
                  {singleProcedureData != null &&
                    Object.values(singleProcedureData).map((value) => (
                      <label>
                        <li style={{ marginBottom: "10px" }}>
                          {xtype(value) === "single_elem_array" ||
                          xtype(value) === "multi_elem_array"
                            ? value.map((list) => (
                                <>
                                  <a href={list} target="_blank">
                                    {new URL(list).pathname
                                      .split("/")
                                      .pop()
                                      .replace(/%20/g, " ")}
                                  </a>
                                  <br />
                                </>
                              ))
                            : value}
                        </li>
                      </label>
                    ))}
                </ul>
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
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_procedures,
  hideMessage,
  setstatustoinitial,
  get_reportprocedure,
  get_procedure_form,
  open_procedure_modal,
  close_procedure_modal,
  getProcedureDetails,
};

const viewProcedureReportForm = Form.create()(Procedure);

const mapStateToProps = (state) => {
  return {
    getProceduresData: state.proceduresReducers.get_procedures_res,
    loader: state.proceduresReducers.loader,
    showSuccessMessage: state.proceduresReducers.showSuccessMessage,
    successMessage: state.proceduresReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.proceduresReducers.showMessage,
    alertMessage: state.proceduresReducers.alertMessage,
    status: state.proceduresReducers.status,
    get_procedureFormData: state.proceduresReducers.get_procedure_form_res,
    getSingleProcedure: state.proceduresReducers.singleProcedureById.viewData,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewProcedureReportForm));
