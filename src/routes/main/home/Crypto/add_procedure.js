import React, { Component } from "react";
import {
  Card,
  Divider,
  Icon,
  Table,
  Radio,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  message,
  Form,
  Steps,
  Upload,
  Select,
  textarea,
  Modal,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { baseURL, webURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import IntlMessages from "util/IntlMessages";
import {
  getMoreAppFormData,
  getDeviceData,
  saveProcedureData,
  updateProcedureData,
  getMoreAppFormDataFail,
} from "./../../../../appRedux/actions/BusinessProceduresActions";
import { getDropDownData } from "./../../../../appRedux/actions/DepartmentActions";
import {
  getProcessData,
  processNamesForDropDownList,
} from "./../../../../appRedux/actions/ProcessActions";
import CircularProgress from "./../../../../components/CircularProgress/index";
import CKEditor from "react-ckeditor-component";
import moment from "moment";
import { FormattedMessage, injectIntl } from "react-intl";
import { ActaLogo } from "../../../../assets/images/Acta-logo.jpeg";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
let userId = "";
let langName = "";
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Step = Steps.Step;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayoutdiff = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const formItemLayoutdiff2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const formItemLayoutdiff1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};

// var signerData = [];
var fullNameOr = "";
var signerDNIOr = "";
var signerPhoneOr = "";
var signerEmailOr = "";
var processColumns = [];
var dynamicSignerData = [];
var dataLables1 = [];
// var pdfURL = null;

let identityId = "";

let timeout;
let currentValue;

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
      headers: { "Content-Type": "application/json" },
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
          } else {
            // Do nothing
            // console.log("RESULT BLANK =>", res);
          }
        }
      });
  }
  timeout = setTimeout(fake, 300);
}

class AddProcedure extends Component {
  constructor() {
    super();
    this.state = {
      current: 0,
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      procedureId: "",
      processName: "",
      areaName: "",
      departmentName: "",
      serviceName: "",
      processConfig: "",
      processType: "",
      instructionEmail: "",
      moreAPIKey: "",
      moreClientID: "",
      userName: "",
      configVidsigner: true,
      password: "",
      vidsignerType: "",
      sendMailby: "Vidsigner",
      dataCaptureForm: "",
      configEmail: "",
      configEmailSubject: "",
      configEmailBody: "",
      inspectionValidation: "",
      inspectionForm: "",
      processConfigType: "",
      signatureType: "bio",
      fullName: "",
      signerDNI: "",
      signerDevice: null,
      signerPhone: null,
      signerEmail: "",
      positionX: "",
      positionY: "",
      widthX: "",
      signerEmailSubject: "",
      signerEmailBody: "",
      widthY: "",
      pageNumber: "",
      departmentArr: [],
      serviceArr: [],
      booleanFieldsArr: [],
      inspectionFieldsArr: [],
      configFieldsArr: [],
      datacaptureLabelsArr: [],
      inspectorLabelsArr: [],
      mappingValue: [{ InspectionField: "", DataConfig: "" }],
      signerData: [],
      signerId: "",
      signerDeleteModal: false,
      uploadfile: [],
      identityList: [],
      DocURL: "",
      editProcedure: false,
      instructionEmailId: "",
      editFlag: "",
      processUserId: "",
      dataLables: [],
      startingDoc:
        '<!DOCTYPE html><html><head><title></title></head><body><div style="box-sizing:border-box; margin-bottom:0; margin-left:auto; margin-right:auto; margin-top:0; padding:50px; width:850px;font-family: arial;">',
      finalDoc:
        '<table border="0" cellpadding="0" cellspacing="0" style="width:750px"><tbody><tr><td><img alt="logo-img" src="https://initzero.tech/axe-images/Acta-logo.jpg" style="float:left; height:80px; width:auto" /></td><td style="text-align:right"><p>AREA DE DESENVOLUPAMENT I PROMOCIO ECONOMICA</p><p>Placa del Mercat, 5-6</p><p>Tel. 93 680 03 70</p></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" style="width:750px"><tbody><tr><td style="width:500px">&nbsp;</td><td style="width:250px"><table border="1" cellpadding="5" cellspacing="0" style="width:250px"><tbody><tr><td colspan="2" style="text-align:left">Expedient:<br />&nbsp;</td></tr><tr><td style="text-align:left">Full<br /> &nbsp;</td><td style="text-align:left">de<br /> &nbsp;</td></tr></tbody></table></td></tr></tbody></table><h3>ACTA D&#39;INSPECCIO</h3><table border="1" cellpadding="15" cellspacing="0" style="width:750px"><tbody><tr><td><p>A Violins de Rei, a les&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; hores del dia&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; de/d&#39;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; de 20 ,<br /> s&#39;ha presentat el/la funcionari/a municipal&nbsp;Violins&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;a :<br /> Nom comercial:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;<br /> Nom/ rao social:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;NIF:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br /> Carrer:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;num&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;local&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<br /> Es present en/na:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br /> amb DNI num.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; en qualitat de:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br /> a qui se li demana que faciliti el servei i el presencil.<br /> El/la funcionarila municipal constata que es desenvolupa I&#39;activitat de&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>Per la/les quails es disposa de Ilicencia, permis municipal o comunicaciO previa de l&#39;activitat&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p></td></tr><tr><td>Observations:<br /><br /><br /><br /> &nbsp;</td></tr><tr> <td>En aquest acte es confereix audiencia per un termini de <strong>deu dies hateiis</strong>, de conformitat amb allo establert en l&#39;article 84 de la Llei 30/1992, de 26 de novembre, de regim juridic de les administracions publiques i del procediment administratiu comu, <strong>com a tramit previ a l&#39;adopcio, d&#39;ordre de cessament</strong>.durant el qual pot al-legar el que cregui oportu i presentar els documents i justificacions que estimi pertinents. De conformitat amb les Llei 20/2009 i 11/2009 aprovades per la Generalitat de Catalunya i de l&#39;Ordenanca municipal d&#39;activitats, no es-podra exercir l&#39;activitat mentre no disposi de l&#39;autoritzacia, Ilicencia o comunicacio previa corresponent.<br /><br /> Corn a comprovant de les actuations realitzades, s&#39;aixeca aquesta acta, per duplicat, que signen el/lafuncionari/a i la persona fieressada, a la qual es Iliura un exemplar.<br /><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<strong>El/la&nbsp;furApnari/a&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;La&nbsp;persona interessada</strong><br /><br /> &nbsp;</td></tr></tbody></table><p>&nbsp;</p>',
      endingDoc: "</div></body></html>",
    };
  }

  componentDidMount() {
    langName = localStorage.getItem(branchName + "_language");
    if (this.props.location.state) {
      const procedureDataArray = this.props.location.state.passProcedureData;
      // console.log("array------>", procedureDataArray.DatacaptureLabels);
      console.log("procedure------>", procedureDataArray);
      if (procedureDataArray.length !== 0) {
        this.setState({
          procedureId: procedureDataArray.Id,

          instructionEmailId: procedureDataArray.WorkInstructionEmail.Id,
          processName: procedureDataArray.Name,
          areaName: procedureDataArray.Area.Id,
          departmentName: procedureDataArray.Department.Id,
          serviceName: procedureDataArray.Service.Id,
          processConfig: procedureDataArray.ProcessConfig.Id,
          processConfigType: procedureDataArray.ProcessConfig.ProcessType,
          inspectionType: procedureDataArray.GiaFilterType,
          processType: procedureDataArray.Type,
          configVidsigner: procedureDataArray.IsVidsignerConfig,
          sendMailby: procedureDataArray.SentMailBy,
          instructionEmail:
            procedureDataArray.WorkInstructionEmail.Name +
            " (" +
            procedureDataArray.WorkInstructionEmail.Email +
            ")",
          moreAPIKey: procedureDataArray.MoreAppApiKey,
          moreClientID: procedureDataArray.MoreAppClientId,
          configEmail: procedureDataArray.ToEmail,
          configEmailSubject: procedureDataArray.EmailSubject,
          configEmailBody: procedureDataArray.EmailBody,

          userName: procedureDataArray.Username,
          password: procedureDataArray.Password,
          vidsignerType: procedureDataArray.UrlType,
          dataCaptureForm: procedureDataArray.DataCaptureFormId,
          datacaptureLabelsArr: procedureDataArray.DataCaptureLables,
          inspectorLabelsArr: procedureDataArray.InspectionLables,
          inspectionValidation: procedureDataArray.InspectionValidationFiled,
          inspectionForm: procedureDataArray.InspectionFormId,
          mappingValue: procedureDataArray.DatasourceMapping,
          signerData: procedureDataArray.VidsginerConfig,
          finalDoc: procedureDataArray.DocumentTemplate,
          DocURL: procedureDataArray.DocumentTemplate,
          editProcedure: true,
        });

        if (procedureDataArray.Type === "oneFormWorkInstruction") {
          this.props.getProcessData({
            pageNumber: 1,
            sortBy: "-RowId",
            perPage: 10,
            searchedColumn: "",
            searchProcessTerm: "",
            ProcessId: procedureDataArray.ProcessConfig.Id,
          });
        }
      }
    }
    this.props.getDropDownData();
    this.props.processNamesForDropDownList();
  }

  handleSearchUser = (search) => {
    var keyword = search.trim();
    if (keyword && keyword.length >= 3) {
      fetchList(keyword, (data) => {
        this.setState({ identityList: data });
      });
    }
  };

  handleProcedureChnage = (value) => {
    this.setState({ dataCaptureForm: `${value}` });
    console.log("value--->", value);
  };

  handleGiaFilter = (value) => {
    // console.log("value", value);

    var procedureData = this.props.processDropDownList.find(
      (singleProcedure) => {
        return singleProcedure.ProcessData.find((list) => {
          console.log("typecheck--->", list.Id);
          return list.Id === value;
        });
      }
    );

    console.log("type---->", procedureData.ProcessType);
    this.setState({ processConfig: `${value}` });
    this.setState({ processConfigType: procedureData.ProcessType });
  };

  onAddDocuments = (e) => {
    var visit_id = e.target.value;
    this.setState({ addDocumentsState: true, visit_id: visit_id });
  };

  onDocumentsClose = () => {
    this.setState({ addDocumentsState: false });
  };

  onDNIChange = (value) => {
    this.setState({ dni: value });
  };

  onEditorChange = (evt) => {
    var newContent = evt.editor.getData();
    this.setState({
      configEmailBody: newContent,
    });
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

  onChange1 = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange1("startValue", value);
  };

  onEndChange = (value) => {
    this.onChange1("endValue", value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  next1 = () => {
    if (this.state.current === 0) {
      this.props.form.validateFieldsAndScroll(
        [
          "processName",
          "areaName",
          "departmentName",
          "serviceName",
          "processConfig",
          "processType",
          "configVidsigner",
          "sendMailby",
          "instructionEmail",
          "moreAPIKey",
          "moreClientID",
          "userName",
          "password",
          "vidsignerType",
        ],
        (err, values) => {
          console.log("values--->", values);
          if (!err) {
            const current = this.state.current + 1;
            this.setState({ current });
            if (this.state.configVidsigner === true) {
              this.props.getDeviceData({
                Username: this.state.userName,
                Password: this.state.password,
                UrlType: this.state.vidsignerType,
              });
            }
            this.props.getMoreAppFormData({
              ApiKey: this.state.moreAPIKey,
              ClientId: this.state.moreClientID,
            });

            if (this.state.processType === "oneFormWorkInstruction") {
              if (this.props.getProcessDataList.ProcessList.length > 0) {
                this.props.getProcessDataList.ProcessList.map((item, index) => {
                  if (index === 0) {
                    {
                      Object.keys(item).map((key) => {
                        processColumns.push(key);
                      });
                    }
                  }
                });
              }
              this.setState({ configFieldsArr: processColumns });
            }
          }
        }
      );
    } else if (this.state.current === 1) {
      this.props.form.validateFieldsAndScroll(
        [
          "dataCaptureForm",
          "inspectionValidation",
          "inspectionForm",
          "InspectionField[0]",
          "DataConfig[0]",
        ],
        (err, values) => {
          if (!err) {
            const current = this.state.current + 1;
            this.setState({ current });
          }
        }
      );
    } else if (this.state.current === 2) {
      dynamicSignerData = [];

      if (this.state.configVidsigner === true) {
        if (this.state.signerData.length !== 0) {
          this.state.signerData.map((item) => {
            if (
              item.DynamicSigner !== undefined &&
              item.DynamicSigner !== null
            ) {
              dynamicSignerData.push(item.DynamicSigner);
            }
          });
          const current = this.state.current + 1;
          this.setState({ current });
        } else {
          message.error(
            this.props.intl.formatMessage({ id: "addProcedure.SignerRequired" })
          );
        }
      } else {
        const current = this.state.current + 1;
        this.setState({ current });
      }
    } else if (this.state.current === 3) {
      // this.props.form.validateFieldsAndScroll(
      //   ["configEmail", "configEmailSubject", "configEmailBody"],
      //   (err, values) => {
      //     if (!err) {
      //       const current = this.state.current + 1;
      //       this.setState({ current });
      //     }
      //   }
      // );
      const current = this.state.current + 1;
      this.setState({ current });
    }
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
    this.setState({
      areaName: parseInt(this.state.areaName),
      departmentName: parseInt(this.state.departmentName),
      serviceName: parseInt(this.state.serviceName),
      processConfig: parseInt(this.state.processConfig),
      instructionEmail: parseInt(this.state.instructionEmail),
    });
    processColumns = [];
    dynamicSignerData = [];
  };

  handleGoBack = () => {
    this.props.history.push({
      pathname: "/" + webURL + "main/home/business-procedure",
    });
  };

  onDateChange = (dates, dateStrings) => {
    const sd = dateStrings[0];
    const ed = dateStrings[1];
    const [sday, smonth, syear] = sd.split("/");
    const [eday, emonth, eyear] = ed.split("/");

    const sdate = `${smonth}/${sday}/${syear}`;
    const edate = `${emonth}/${eday}/${eyear}`;
    this.setState({ startDate: sdate, endDate: edate });
  };

  countryChange = (id, businessUnit) => {
    this.setState({ businessUnitArray: businessUnit });
  };

  onContentChange = (evt) => {
    const newContent = evt.editor.getData();
    var completeDoc =
      this.state.startingDoc + newContent + this.state.endingDoc;
    this.setState({
      finalDoc: completeDoc,
    });
  };

  handleAreaChange = (department) => {
    this.setState({ departmentArr: department });
    this.props.form.setFieldsValue({ departmentName: "", servicediyeName: "" });
    this.setState({ departmentName: "", serviceArr: [], serviceName: "" });
  };

  handleDepartmentChange = (service) => {
    this.setState({ serviceArr: service });
    this.props.form.setFieldsValue({ serviceName: "" });
    this.setState({ serviceName: "" });
  };

  handleDataFormChange = (booleanField, configField, lablesField) => {
    this.setState({ mappingValue: [{ InspectionField: "", DataConfig: "" }] });
    this.props.form.setFieldsValue({
      inspectionValidation: "",
      "DataConfig[0]": "",
    });
    this.setState({ inspectionValidation: "" });
    if (this.state.processType === "twoFormProcess") {
      this.setState({ booleanFieldsArr: booleanField });
      this.setState({ configFieldsArr: configField });
      this.setState({ datacaptureLabelsArr: lablesField });
      this.setState({ inspectorLabelsArr: lablesField });
    } else {
      this.setState({ inspectionFieldsArr: configField });
      this.props.form.setFieldsValue({ "InspectionField[0]": "" });
      this.setState({ datacaptureLabelsArr: lablesField });
      this.setState({ inspectorLabelsArr: [] });
    }
    console.log("booleanField-->", booleanField);
    console.log("boolean", configField);
  };

  handleInspectionFormChange = (inspectionField) => {
    this.setState({ inspectionFieldsArr: inspectionField });
    this.props.form.setFieldsValue({ "InspectionField[0]": "" });
    this.setState({ mappingValue: [{ InspectionField: "", DataConfig: "" }] });
  };

  handleProcessTypeChange = (value) => {
    this.props.form.validateFieldsAndScroll(
      ["processConfig"],
      (err, values) => {
        if (!err) {
          if (value === "oneFormWorkInstruction") {
            this.props.getProcessData({
              pageNumber: 1,
              sortBy: "-RowId",
              perPage: 10,
              searchedColumn: "",
              searchProcessTerm: "",
              ProcessId: this.state.processConfig,
            });
          }
          this.setState({ processType: value });
        }
      }
    );
  };

  handleVidsignerConfig = (value) => {
    console.log("value-->", value);
    this.setState({ configVidsigner: value });
  };

  addClick() {
    var mappingValue1 = this.state.mappingValue;
    mappingValue1.push({ InspectionField: null, DataConfig: null });
    this.setState({ mappingValue: mappingValue1 });
  }

  removeOnClick = (index) => {
    var mappingValue2 = this.state.mappingValue;
    mappingValue2.splice(index, 1);
    this.setState({ mappingValue: mappingValue2 });
  };

  handleChange(value, name, i) {
    let mappingValue = [...this.state.mappingValue];
    mappingValue[i][name] = value;
    this.setState({ mappingValue });
  }

  handleOrDropDown(value, name) {
    if (name === "fullNameOr") {
      fullNameOr = value;
      this.setState({ fullName: fullNameOr });
      this.props.form.setFieldsValue({ fullName: fullNameOr });
    } else if (name === "signerDNIOr") {
      signerDNIOr = value;
      this.setState({ signerDNI: signerDNIOr });
      this.props.form.setFieldsValue({ signerDNI: signerDNIOr });
    } else if (name === "signerPhoneOr") {
      signerPhoneOr = value;
      this.setState({ signerPhone: signerPhoneOr });
      this.props.form.setFieldsValue({ signerPhone: signerPhoneOr });
    } else if (name === "signerEmailOr") {
      signerEmailOr = value;
      this.setState({ signerEmail: signerEmailOr });
      this.props.form.setFieldsValue({ signerEmail: signerEmailOr });
    }
  }

  addSignerData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      [
        "fullName",
        "signerDNI",
        "signerDevice",
        "signerPhone",
        "signerEmail",
        "positionX",
        "positionY",
        "widthX",
        "widthY",
        "pageNumber",
      ],
      (err, values) => {
        if (!err) {
          var newSignerData = this.state.signerData;
          if (this.state.positionX !== "" && this.state.positionY !== "") {
            newSignerData.push({
              Id: newSignerData.length + 1,
              DNI: this.state.signerDNI,
              FullName: this.state.fullName,
              Email: this.state.signerEmail,
              PhoneNumber: this.state.signerPhone,
              DeviceName: this.state.signerDevice,
              SignType: this.state.signatureType,
              EmailSubject: this.state.signerEmailSubject,
              EmailBody: this.state.signerEmailBody,
              SignPosition: {
                Page: this.state.pageNumber,
                PosX: this.state.positionX,
                PosY: this.state.positionY,
                SizeX: this.state.widthX,
                SizeY: this.state.widthY,
              },
              SignStatus: "Unsigned",
            });
          } else {
            let count = 0;
            this.state.signerData.map((item) => {
              if (
                item.DynamicSigner !== undefined &&
                item.DynamicSigner !== null
              ) {
                count++;
              }
            });
            var signCount = count + 1;
            var dynamicSign = "[Sign" + signCount + "]";
            newSignerData.push({
              Id: newSignerData.length + 1,
              DNI: this.state.signerDNI,
              FullName: this.state.fullName,
              Email: this.state.signerEmail,
              PhoneNumber: this.state.signerPhone,
              DeviceName: this.state.signerDevice,
              SignType: this.state.signatureType,
              EmailSubject: this.state.signerEmailSubject,
              EmailBody: this.state.signerEmailBody,
              SignPosition: {
                Page: this.state.pageNumber,
                PosX: null,
                PosY: null,
                SizeX: this.state.widthX,
                SizeY: this.state.widthY,
              },
              SignStatus: "Unsigned",
              DynamicSigner: dynamicSign,
            });

            console.log("new signer data---->", newSignerData);
          }
          this.setState({
            signerData: newSignerData,
            fullName: "",
            signerDNI: "",
            signerEmail: "",
            signerPhone: null,
            signerDevice: null,
            signatureType: "bio",
            signerEmailSubject: "",
            signerEmailBody: "",
            pageNumber: "",
            positionX: "",
            positionY: "",
            widthX: "",
            widthY: "",
          });
          this.props.form.setFieldsValue({
            fullName: "",
            signerDNI: "",
            signerDevice: null,
            signerPhone: null,
            signerEmail: "",
            signatureType: "bio",
            signerEmailSubject: "",
            signerEmailBody: "",
            positionX: "",
            positionY: "",
            widthX: "",
            widthY: "",
            pageNumber: "",
            fullNameOr: "",
            signerDNIOr: "",
            signerPhoneOr: null,
            signerEmailOr: "",
          });
          fullNameOr = "";
          signerDNIOr = "";
          signerPhoneOr = "";
          signerEmailOr = "";
        }
      }
    );
  };

  onDeleteSigner = (signer_id) => {
    this.setState({ signerDeleteModal: true });
    this.setState({ signerId: signer_id });
  };

  confirmDeleteSigner = () => {
    var deleteSignerData = this.state.signerData;
    if (deleteSignerData.length > 0) {
      var signerLength = deleteSignerData.length;
      var signerArr = deleteSignerData.findIndex((singleSigner) => {
        return singleSigner.Id === this.state.signerId;
      });
      if (signerArr !== -1) deleteSignerData.splice(signerArr, 1);
      if (signerLength !== deleteSignerData.length) {
        message.error(
          this.props.intl.formatMessage({ id: "addProcedure.SignerDelete" })
        );
      }
      this.setState({ signerData: deleteSignerData, signerDeleteModal: false });
    }
  };

  cancelDeleteSigner = (e) => {
    this.setState({ signerId: "" });
    this.setState({ signerDeleteModal: false });
  };

  onEditField = (a_id) => {
    var fieldData = this.state.signerData.find((singleField) => {
      // console.log("singleField--->", singleField.id);
      return singleField.Id === a_id;
    });
    console.log("fieldata--->", fieldData);
    this.setState({ editId: fieldData.Id });

    this.props.form.setFieldsValue({
      signerDNI: fieldData.DNI,
      fullName: fieldData.FullName,
      signerEmail: fieldData.Email,
      signerPhone: fieldData.PhoneNumber,
      signerDevice: fieldData.DeviceName,
      signatureType: fieldData.SignType,
      signerEmailSubject: fieldData.EmailSubject,
      signerEmailBody: fieldData.EmailBody,
      pageNumber: fieldData.SignPosition.Page,
      positionX: fieldData.SignPosition.PosX,
      positionY: fieldData.SignPosition.PosY,
      widthX: fieldData.SignPosition.SizeX,
      widthY: fieldData.SignPosition.SizeY,
    });

    this.setState({ signatureType: fieldData.SignType });
    this.setState({ signerDNI: fieldData.DNI });
    this.setState({ fullName: fieldData.FullName });
    this.setState({ signerEmail: fieldData.Email });
    this.setState({ signerPhone: fieldData.PhoneNumber });
    this.setState({ signerEmailSubject: fieldData.EmailSubject });
    this.setState({ signerEmailBody: fieldData.EmailBody });
    this.setState({ pageNumber: fieldData.SignPosition.Page });
    this.setState({ positionX: fieldData.SignPosition.PosX });
    this.setState({ positionY: fieldData.SignPosition.PosY });
    this.setState({ widthX: fieldData.SignPosition.SizeX });
    this.setState({ widthY: fieldData.SignPosition.SizeY });
    this.setState({ editFlag: "edit" });
  };

  saveUpdate = () => {
    var fieldData1 = this.state.signerData.map((d) => {
      // console.log("id-->", d.id);
      // console.log("id111-->", this.state.editId);
      if (d.Id === this.state.editId) {
        return {
          Id: d.Id,
          DNI: this.state.signerDNI,
          FullName: this.state.fullName,
          Email: this.state.signerEmail,
          PhoneNumber: this.state.signerPhone,
          DeviceName: this.state.signerDevice,
          EmailSubject: this.state.signerEmailSubject,
          EmailBody: this.state.signerEmailBody,
          SignType: this.state.signatureType,
          SignPosition: {
            Page: this.state.pageNumber,
            PosX: this.state.positionX,
            PosY: this.state.positionY,
            SizeX: this.state.widthX,
            SizeY: this.state.widthY,
          },
          SignStatus: "Unsigned",
          DynamicSigner: d.DynamicSigner,
        };
      }
      return d;
    });
    console.log("fdata1---->", fieldData1);

    this.setState({ signerData: fieldData1, editFlag: "" });

    this.props.form.setFieldsValue({
      signerDNI: "",
      fullName: "",
      signerEmail: "",
      signerPhone: "",
      signerDevice: "",
      signatureType: "",
      signerEmailSubject: "",
      signerEmailBody: "",
      pageNumber: "",
      positionX: "",
      positionY: "",
      widthX: "",
      widthY: "",
    });
  };

  handleSaveProcedureData = (e) => {
    e.preventDefault();
    // var procedureData = [];
    this.props.form.validateFieldsAndScroll(
      [
        "processName",
        "areaName",
        "departmentName",
        "serviceName",
        "processConfig",
        "instructionEmail",
        "moreAPIKey",
        "moreClientID",
        "dataCaptureForm",
        "inspectionForm",
        "configVidsigner",
        "sendMailby",
      ],
      (err, values) => {
        if (!err) {
          let identityId = "";
          let userdata = localStorage.getItem(branchName + "_data");
          if (userdata != "" && userdata != null) {
            let userData = JSON.parse(userdata);
            if (
              userData != "" &&
              userData != null &&
              userData["IdentityId"] != undefined
            ) {
              identityId = userData["IdentityId"];
            }
          }

          var procedureData = {
            Id: this.state.editProcedure ? this.state.procedureId : 0,
            Name: this.state.processName,
            AreaId: this.state.areaName,
            DepartmentId: this.state.departmentName,
            ServiceId: this.state.serviceName,
            ProcessId: this.state.processConfig,
            Type: this.state.processType,
            IsVidsignerConfig: this.state.configVidsigner,
            SentMailBy: this.state.sendMailby,
            ToEmail: this.state.configEmail,
            EmailSubject: this.state.configEmailSubject,
            EmailBody: this.state.configEmailBody,
            GiaFilterType: this.state.inspectionType,
            WorkInstructionEmail: this.state.editProcedure
              ? this.state.instructionEmailId
              : this.state.instructionEmail,
            MoreAppApiKey: this.state.moreAPIKey,
            MoreAppClientId: this.state.moreClientID,
            Username: this.state.userName,
            Password: this.state.password,
            UrlType: this.state.vidsignerType,
            DataCaptureFormId: this.state.dataCaptureForm,
            DataCaptureLables: this.state.datacaptureLabelsArr,
            InspectionLables: this.state.inspectorLabelsArr,
            InspectionValidationFiled: this.state.inspectionValidation,
            InspectionFormId: this.state.inspectionForm,
            DatasourceMapping: this.state.mappingValue,
            VidsginerConfig: this.state.signerData,
            UserId: identityId,
          };

          console.log("save procedure----->", procedureData);

          const procedureDataForm = new FormData();
          procedureDataForm.append(
            "BusinessProcedure",
            JSON.stringify(procedureData)
          );
          if (Object.entries(this.state.uploadfile).length !== 0) {
            procedureDataForm.append("DocumentTemplate", this.state.uploadfile);
          }

          var procedure_name = this.state.processName;
          var area_name = this.state.areaName;
          var department_name = this.state.departmentName;
          var service_name = this.state.serviceName;
          var process_config = this.state.processConfig;
          var process_type = this.state.processType;
          var instruction_email = this.state.instructionEmail;
          var more_api_key = this.state.moreAPIKey;
          var more_client_id = this.state.moreClientID;
          var username = this.state.userName;
          var password = this.state.password;
          var vidsigner_type = this.state.vidsignerType;
          var data_capture_form = this.state.dataCaptureForm;
          var inspection_validation = this.state.inspectionValidation;
          var inspection_form = this.state.inspectionForm;

          if (
            procedure_name !== "" &&
            area_name !== "" &&
            department_name !== "" &&
            service_name !== "" &&
            // process_config !== "" &&
            process_type !== "" &&
            instruction_email !== "" &&
            more_api_key !== "" &&
            more_client_id !== "" &&
            // username !== "" &&
            // password !== "" &&
            // vidsigner_type !== "" &&
            data_capture_form !== "" &&
            identityId !== ""
          ) {
            if (this.state.editProcedure) {
              this.props.updateProcedureData(procedureDataForm);
            } else {
              this.props.saveProcedureData(procedureDataForm);
            }
          } else {
            message.error(
              this.props.intl.formatMessage({ id: "global.AllRequired" })
            );
          }
        }
      }
    );
  };

  render() {
    var docs = "";
    var moreApplables = this.props.moreAppFormData;
    let quodPathname = window.location.hostname;
    console.log("config signer--->", this.state.configVidsigner);

    console.log("send by email---->", this.state.sendMailby);

    // console.log("mapping value---->", this.state.mappingValue);

    const uploadDoc = {
      beforeUpload: (file) => {
        let fileExt = file.name.split(".");
        fileExt = fileExt[fileExt.length - 1];
        const isFileExt =
          fileExt.toLowerCase() === "doc" || fileExt.toLowerCase() === "docx";
        const isExcelFile =
          file.type === "doc" ||
          file.type === "docx" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (!isExcelFile && !isFileExt) {
          message.error(
            this.props.intl.formatMessage({ id: "global.UploadWord" })
          );
        } else {
          // var data_url = new Blob([file], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
          // pdfURL = window.URL.createObjectURL(data_url);
          this.setState({ uploadfile: file });
        }
        return false;
      },
    };

    if (this.props.showErrorMsg) {
      message.error(
        this.props.intl.formatMessage({ id: "addProcedure.KeyIdRequired" })
      );
      this.props.getMoreAppFormDataFail(false);
    }

    if (this.state.editProcedure) {
      var docURL = this.state.DocURL;
      if (quodPathname === "www.motumquod.com") {
        console.log("motumquod---->");
        var docStartURL = docURL.replace(
          "C:\\inetpub\\wwwroot\\",
          "https://www.motumquod.com/"
        );
      } else {
        console.log("motumlabs---->");
        var docStartURL = docURL.replace(
          "C:\\inetpub\\wwwroot\\MotumStag\\",
          "https://www.motumlabs.com/"
        );
      }

      var docMiddleURL = docStartURL.replaceAll("\\", "/");
      var docFinalURL = docMiddleURL.replaceAll(/ /g, "%20");
      docs = [{ uri: docFinalURL }];
    }

    if (this.props.location.state) {
      if (this.props.location.state.passProcedureData.length !== 0) {
        if (this.props.DropDownData.length !== 0) {
          if (this.props.location.state.passProcedureData.Area.Id !== 0) {
            var departmentArray = this.props.DropDownData.find((areaId) => {
              return (
                areaId.Id ===
                this.props.location.state.passProcedureData.Area.Id
              );
            });
          }
          if (
            this.state.departmentArr.length === 0 &&
            departmentArray !== undefined
          ) {
            if (departmentArray.Department.length != 0) {
              this.setState({ departmentArr: departmentArray.Department });
            }
            if (
              this.props.location.state.passProcedureData.Department.Id !== 0
            ) {
              var serviceArray = departmentArray.Department.find(
                (departmentId) => {
                  return (
                    departmentId.Id ===
                    this.props.location.state.passProcedureData.Department.Id
                  );
                }
              );
            }
            if (
              this.state.serviceArr.length === 0 &&
              serviceArray !== undefined
            ) {
              if (serviceArray.Serivce.length != 0) {
                this.setState({ serviceArr: serviceArray.Serivce });
              }
            }
          }
        }
        if (this.props.moreAppFormData.length !== 0) {
          this.props.moreAppFormData.map((item, index) => {
            if (
              this.props.location.state.passProcedureData.DataCaptureFormId !==
              ""
            ) {
              var dataCaptureFormArray = this.props.moreAppFormData[
                index
              ].Forms.find((formId) => {
                return (
                  formId.FormId ===
                  this.props.location.state.passProcedureData.DataCaptureFormId
                );
              });
            }
            if (
              this.state.booleanFieldsArr.length === 0 &&
              dataCaptureFormArray !== undefined
            ) {
              if (dataCaptureFormArray.BooleanFileds.length != 0) {
                this.setState({
                  booleanFieldsArr: dataCaptureFormArray.BooleanFileds,
                });
              }
            }
            if (
              this.state.configFieldsArr.length === 0 &&
              dataCaptureFormArray !== undefined
            ) {
              if (dataCaptureFormArray.FormFileds.length != 0) {
                this.setState({
                  configFieldsArr: dataCaptureFormArray.FormFileds,
                });
              }
            }
            // console.log("DATA CAPTURE length", this.state.configFieldsArr.length);
            if (
              this.state.configFieldsArr.length === 0 &&
              this.state.processType === "oneFormProcess" &&
              dataCaptureFormArray !== undefined
            ) {
              if (dataCaptureFormArray.FormFileds.length != 0) {
                this.setState({
                  inspectionFieldsArr: dataCaptureFormArray.FormFileds,
                });
              }
            }
            // console.log("DATA CAPTURE Config", this.state.configFieldsArr);
            // console.log("DATA CAPTURE inspectionArr", this.state.inspectionFieldsArr);
            if (
              this.state.inspectionFieldsArr.length === 0 &&
              this.state.processType === "oneFormWorkInstruction" &&
              dataCaptureFormArray !== undefined
            ) {
              if (dataCaptureFormArray.FormFileds.length != 0) {
                this.setState({
                  inspectionFieldsArr: dataCaptureFormArray.FormFileds,
                });
              }
            }
            if (
              this.props.location.state.passProcedureData.InspectionFormId !==
              ""
            ) {
              var inspectionFormArray = this.props.moreAppFormData[
                index
              ].Forms.find((formId) => {
                return (
                  formId.FormId ===
                  this.props.location.state.passProcedureData.InspectionFormId
                );
              });
            }
            if (
              this.state.inspectionFieldsArr.length === 0 &&
              inspectionFormArray !== undefined
            ) {
              if (inspectionFormArray.FormFileds.length != 0) {
                this.setState({
                  inspectionFieldsArr: inspectionFormArray.FormFileds,
                });
              }
            }
          });
        }
      }
    }

    const { getFieldDecorator } = this.props.form;
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
    const columns = [
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "FullName",
        key: "FullName",
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
        title: <IntlMessages id="column.Device" />,
        dataIndex: "DeviceName",
        key: "DeviceName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.signType" />,
        dataIndex: "SignType",
        key: "SignType",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => (
          <span className="">
            {text === "bio" ? (
              <IntlMessages id="signatureType.bio" />
            ) : text === "emailandsms" ? (
              <IntlMessages id="signatureType.remote" />
            ) : (
              <IntlMessages id="signatureType.digital" />
            )}
          </span>
        ),
      },
      {
        title: <IntlMessages id="procedures.dynamicSign" />,
        dataIndex: "DynamicSigner",
        key: "DynamicSigner",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.positionX" />,
        dataIndex: "SignPosition.PosX",
        key: "SignPosition.PosX",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.positionY" />,
        dataIndex: "SignPosition.PosY",
        key: "SignPosition.PosY",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.widthX" />,
        dataIndex: "SignPosition.SizeX",
        key: "SignPosition.SizeX",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.widthY" />,
        dataIndex: "SignPosition.SizeY",
        key: "SignPosition.SizeY",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="procedures.pageNumber" />,
        dataIndex: "SignPosition.Page",
        key: "SignPosition.Page",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.Action" />,
        key: "document",
        align: "center",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.delete">
              {(title) => (
                <span>
                  <span className="gx-link">
                    <Button
                      onClick={() => this.onEditField(record.Id)}
                      className="arrow-btn gx-link"
                      style={{ paddingRight: "0px" }}
                    >
                      <img
                        src={require("assets/images/edit.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                    <Button
                      onClick={() => this.onDeleteSigner(record.Id)}
                      className="arrow-btn gx-link"
                      style={{ paddingRight: "0px" }}
                    >
                      <img
                        src={require("assets/images/trash.png")}
                        className="document-icons"
                        title={title}
                      />
                    </Button>
                  </span>
                </span>
              )}
            </FormattedMessage>
          </div>
        ),
      },
    ];

    const steps = [
      {
        content: (
          <div className="first-content gx-mt-4">
            <Form
              ref={(ref) => {
                this.form = ref;
              }}
              onSubmit={this.handleOk}
            >
              <Row>
                <span className="cust-title-step">PROCESS</span>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.processName" />}
                  >
                    {getFieldDecorator("processName", {
                      initialValue: this.state.processName,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.processName" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ processName: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="areaAdd.areaName" />}
                  >
                    {getFieldDecorator("areaName", {
                      initialValue: this.state.areaName,
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
                        onChange={(value, event) =>
                          this.setState({ areaName: `${value}` })
                        }
                      >
                        {this.props.DropDownData
                          ? this.props.DropDownData.map((item) => {
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
                            })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="departmentAdd.departmentName" />}
                  >
                    {getFieldDecorator("departmentName", {
                      initialValue: this.state.departmentName,
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
                        onChange={(value, event) =>
                          this.setState({ departmentName: `${value}` })
                        }
                      >
                        {this.state.departmentArr.map((item) => {
                          return (
                            <Option
                              onClick={(e) =>
                                this.handleDepartmentChange(item.Serivce)
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
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="serviceAdd.serviceName" />}
                  >
                    {getFieldDecorator("serviceName", {
                      initialValue: this.state.serviceName,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.serviceAdd.serviceName" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ serviceName: `${value}` })
                        }
                      >
                        {this.state.serviceArr.map((item) => {
                          return (
                            <Option key={item.Id} value={item.Id}>
                              {item.Name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.processConfig" />}
                  >
                    {getFieldDecorator("processConfig", {
                      initialValue: this.state.processConfig,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.processConfig" />
                          ),
                        },
                      ],
                    })(
                      <Select onChange={(value) => this.handleGiaFilter(value)}>
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
                    )}
                  </FormItem>
                </Col>
                {this.state.processConfigType === "GIA" ? (
                  <Col lg={24} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label={<IntlMessages id="procedures.inspectiontype" />}
                    >
                      {getFieldDecorator("inspectionType", {
                        initialValue: this.state.inspectionType,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.procedureAdd.inspectionType" />
                            ),
                          },
                        ],
                      })(
                        <Select
                          onChange={(value, event) =>
                            this.setState({ inspectionType: `${value}` })
                          }
                        >
                          <Option value="Validation">
                            <IntlMessages id="inspectionType.validation" />
                          </Option>
                          <Option value="Inspection">
                            {" "}
                            <IntlMessages id="inspectionType.inspection" />
                          </Option>
                          {/* <Option value="Both">
                            {" "}
                            <IntlMessages id="inspectionType.both" />
                          </Option> */}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                ) : (
                  ""
                )}

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.processType" />}
                  >
                    {getFieldDecorator("processType", {
                      initialValue: this.state.processType,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.processType" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value) =>
                          this.handleProcessTypeChange(value)
                        }
                      >
                        <Option key="twoFormProcess" value="twoFormProcess">
                          <IntlMessages id="processType.twoFormProcess" />
                        </Option>
                        <Option key="oneFormProcess" value="oneFormProcess">
                          <IntlMessages id="processType.oneFormProcess" />
                        </Option>
                        <Option
                          key="oneFormWorkInstruction"
                          value="oneFormWorkInstruction"
                        >
                          <IntlMessages id="processType.oneFormWorkInstruction" />
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.configVidsigner" />}
                  >
                    {getFieldDecorator("configVidsigner", {
                      initialValue: this.state.configVidsigner,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.configVidsigner" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ configVidsigner: value })
                        }
                      >
                        <Option key="Yes" value={true}>
                          <IntlMessages id="configVidsigner.yes" />
                        </Option>
                        <Option key="No" value={false}>
                          <IntlMessages id="configVidsigner.no" />
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.sendMailBy" />}
                  >
                    {getFieldDecorator("sendMailby", {
                      initialValue: this.state.sendMailby,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.sendMailby" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ sendMailby: `${value}` })
                        }
                      >
                        <Option key="Vidsigner" value="Vidsigner">
                          <IntlMessages id="sendmailby.vidsigner" />
                        </Option>
                        <Option key="Molins" value="Molins">
                          <IntlMessages id="sendmailby.molins" />
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <span className="cust-title-step">MOREAPP</span>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.moreAPIKey" />}
                  >
                    {getFieldDecorator("moreAPIKey", {
                      initialValue: this.state.moreAPIKey,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.moreAPIKey" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ moreAPIKey: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.moreClientID" />}
                  >
                    {getFieldDecorator("moreClientID", {
                      initialValue: this.state.moreClientID,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.moreClientID" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ moreClientID: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.instructionEmail" />}
                  >
                    {getFieldDecorator("instructionEmail", {
                      initialValue: this.state.instructionEmail,

                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.EmailIsRequired" />
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
                          this.setState({ instructionEmail: `${value}` })
                        }
                        notFoundContent={null}
                      >
                        {Object.keys(this.state.identityList).length > 0
                          ? this.state.identityList.map((item) => {
                              return (
                                <Option value={item.id}>
                                  {item.Name} {item.FatherSurname} ({item.Email}
                                  )
                                </Option>
                              );
                            })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                {this.state.configVidsigner === true ? (
                  <>
                    {" "}
                    <span className="cust-title-step">VIDSIGNER</span>
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="procedures.userName" />}
                      >
                        {getFieldDecorator("userName", {
                          initialValue: this.state.userName,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.procedureAdd.userName" />
                              ),
                            },
                          ],
                        })(
                          <Input
                            required
                            onChange={(event) =>
                              this.setState({ userName: event.target.value })
                            }
                            margin="none"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="procedures.password" />}
                      >
                        {getFieldDecorator("password", {
                          initialValue: this.state.password,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.procedureAdd.password" />
                              ),
                            },
                          ],
                        })(
                          <Input
                            type="password"
                            required
                            onChange={(event) =>
                              this.setState({ password: event.target.value })
                            }
                            margin="none"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="procedures.vidsignerType" />}
                      >
                        {getFieldDecorator("vidsignerType", {
                          initialValue: this.state.vidsignerType,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.procedureAdd.vidsignerType" />
                              ),
                            },
                          ],
                        })(
                          <Select
                            onChange={(value, event) =>
                              this.setState({ vidsignerType: `${value}` })
                            }
                          >
                            <Option key="Production" value="Production">
                              <IntlMessages id="vidsignerType.production" />
                            </Option>
                            <Option key="PreProduction" value="PreProduction">
                              <IntlMessages id="vidsignerType.preProduction" />
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </>
                ) : (
                  ""
                )}
              </Row>
            </Form>
          </div>
        ),
      },
      {
        content: (
          <div className="second-content gx-mt-4">
            {this.state.processType === "twoFormProcess" ? (
              <Row>
                <Col lg={12} xs={24}>
                  <FormItem
                    {...formItemLayoutdiff}
                    label={<IntlMessages id="procedures.dataCaptureForm" />}
                  >
                    {getFieldDecorator("dataCaptureForm", {
                      initialValue: this.state.dataCaptureForm,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.dataCaptureForm" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ dataCaptureForm: `${value}` })
                        }
                        // onChange={this.handleProcedureChnage}
                      >
                        {this.props.moreAppFormData
                          ? this.props.moreAppFormData.map((item, index) => {
                              return (
                                <OptGroup
                                  key={item.FolderName}
                                  label={item.FolderName}
                                >
                                  {this.props.moreAppFormData[index].Forms.map(
                                    (item) => {
                                      return (
                                        <Option
                                          onClick={(e) =>
                                            this.handleDataFormChange(
                                              item.BooleanFileds,
                                              item.FormFileds,
                                              item.Labels
                                            )
                                          }
                                          key={item.FormId}
                                          value={item.FormId}
                                        >
                                          {item.FormName}
                                        </Option>
                                      );
                                    }
                                  )}
                                </OptGroup>
                              );
                            })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={12} xs={24}>
                  <FormItem
                    {...formItemLayoutdiff}
                    label={
                      <IntlMessages id="procedures.inspectionValidation" />
                    }
                  >
                    {getFieldDecorator("inspectionValidation", {
                      initialValue: this.state.inspectionValidation,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.inspectionValidation" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ inspectionValidation: `${value}` })
                        }
                      >
                        {this.state.booleanFieldsArr.map((item) => {
                          return (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.inspectionForm" />}
                  >
                    {getFieldDecorator("inspectionForm", {
                      initialValue: this.state.inspectionForm,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.inspectionForm" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ inspectionForm: `${value}` })
                        }
                      >
                        {this.props.moreAppFormData
                          ? this.props.moreAppFormData.map((item, index) => {
                              return (
                                <OptGroup
                                  key={item.FolderName}
                                  label={item.FolderName}
                                >
                                  {this.props.moreAppFormData[index].Forms.map(
                                    (item) => {
                                      return (
                                        <Option
                                          onClick={(e) =>
                                            this.handleInspectionFormChange(
                                              item.FormFileds
                                            )
                                          }
                                          key={item.FormId}
                                          value={item.FormId}
                                        >
                                          {item.FormName}
                                        </Option>
                                      );
                                    }
                                  )}
                                </OptGroup>
                              );
                            })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <Row>
                    <Col lg={5} xs={24}>
                      <h5 className="form-map-title">
                        <IntlMessages id="procedures.inspectionFormMapping" />
                      </h5>
                    </Col>
                    <Col lg={19} xs={24}>
                      {this.state.mappingValue.map((el, i) => (
                        <Row key={i}>
                          <Col lg={10} xs={24}>
                            <FormItem
                              {...formItemLayoutdiff2}
                              label={
                                <IntlMessages id="procedures.inspectionField" />
                              }
                            >
                              {getFieldDecorator("InspectionField[" + i + "]", {
                                initialValue: el.InspectionField
                                  ? el.InspectionField
                                  : "",
                                rules: [
                                  {
                                    required: i === 0 ? true : false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.inspectionField" />
                                    ),
                                  },
                                ],
                              })(
                                <Select
                                  name={"InspectionField[" + i + "]"}
                                  onChange={(value) =>
                                    this.handleChange(
                                      value,
                                      "InspectionField",
                                      i
                                    )
                                  }
                                >
                                  {this.state.inspectionFieldsArr.map(
                                    (item) => {
                                      return (
                                        <Option key={item} value={item}>
                                          {item}
                                        </Option>
                                      );
                                    }
                                  )}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={10} xs={24}>
                            <FormItem
                              {...formItemLayoutdiff2}
                              label={
                                <IntlMessages id="procedures.dataConfig" />
                              }
                            >
                              {getFieldDecorator("DataConfig[" + i + "]", {
                                initialValue: el.DataConfig
                                  ? el.DataConfig
                                  : "",
                                rules: [
                                  {
                                    required: i === 0 ? true : false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.dataConfig" />
                                    ),
                                  },
                                ],
                              })(
                                <Select
                                  name={"DataConfig[" + i + "]"}
                                  onChange={(value) =>
                                    this.handleChange(value, "DataConfig", i)
                                  }
                                >
                                  {this.state.configFieldsArr.map((item) => {
                                    return (
                                      <Option key={item} value={item}>
                                        {item}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={4} xs={24}>
                            {i ? (
                              <div className="cust-remove-btn btn-cont">
                                <Button
                                  onClick={() => this.removeOnClick(i)}
                                  className="gx-mb-0"
                                  type="danger"
                                >
                                  <i className="icon icon-trash"></i>{" "}
                                  {<IntlMessages id="global.remove" />}
                                </Button>
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </Col>
                <Col lg={24} xs={24}>
                  <div className="btn-cont">
                    <Button
                      onClick={() => this.addClick()}
                      className="gx-mb-0 add-role-btn"
                      type="primary"
                    >
                      <i className="icon icon-add"></i>{" "}
                      {<IntlMessages id="global.add" />}
                    </Button>
                  </div>
                </Col>
              </Row>
            ) : this.state.processType === "oneFormProcess" ? (
              <Row>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.dataCaptureForm" />}
                  >
                    {getFieldDecorator("dataCaptureForm", {
                      initialValue: this.state.dataCaptureForm,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.dataCaptureForm" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ dataCaptureForm: `${value}` })
                        }
                      >
                        {this.props.moreAppFormData
                          ? this.props.moreAppFormData.map((item, index) => {
                              return (
                                <OptGroup
                                  key={item.FolderName}
                                  label={item.FolderName}
                                >
                                  {this.props.moreAppFormData[index].Forms.map(
                                    (item) => {
                                      return (
                                        <Option
                                          onClick={(e) =>
                                            this.handleDataFormChange(
                                              item.BooleanFileds,
                                              item.FormFileds,
                                              item.Labels
                                            )
                                          }
                                          key={item.FormId}
                                          value={item.FormId}
                                        >
                                          {item.FormName}
                                        </Option>
                                      );
                                    }
                                  )}
                                </OptGroup>
                              );
                            })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedures.dataCaptureForm" />}
                  >
                    {getFieldDecorator("dataCaptureForm", {
                      initialValue: this.state.dataCaptureForm,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureAdd.dataCaptureForm" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ dataCaptureForm: `${value}` })
                        }
                      >
                        {this.props.moreAppFormData
                          ? this.props.moreAppFormData.map((item, index) => {
                              return (
                                <OptGroup
                                  key={item.FolderName}
                                  label={item.FolderName}
                                >
                                  {this.props.moreAppFormData[index].Forms.map(
                                    (item) => {
                                      return (
                                        <Option
                                          onClick={(e) =>
                                            this.handleDataFormChange(
                                              item.BooleanFileds,
                                              item.FormFileds,
                                              item.Labels
                                            )
                                          }
                                          key={item.FormId}
                                          value={item.FormId}
                                        >
                                          {item.FormName}
                                        </Option>
                                      );
                                    }
                                  )}
                                </OptGroup>
                              );
                            })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <Row>
                    <Col lg={5} xs={24}>
                      <h5 className="form-map-title">
                        <IntlMessages id="procedures.inspectionFormMapping" />
                      </h5>
                    </Col>
                    <Col lg={19} xs={24}>
                      {this.state.mappingValue.map((el, i) => (
                        <Row key={i}>
                          <Col lg={10} xs={24}>
                            <FormItem
                              {...formItemLayoutdiff2}
                              label={
                                <IntlMessages id="procedures.inspectionField" />
                              }
                            >
                              {getFieldDecorator("InspectionField[" + i + "]", {
                                initialValue: el.InspectionField
                                  ? el.InspectionField
                                  : "",
                                rules: [
                                  {
                                    required: i === 0 ? true : false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.inspectionField" />
                                    ),
                                  },
                                ],
                              })(
                                <Select
                                  name={"InspectionField[" + i + "]"}
                                  onChange={(value) =>
                                    this.handleChange(
                                      value,
                                      "InspectionField",
                                      i
                                    )
                                  }
                                >
                                  {this.state.inspectionFieldsArr.map(
                                    (item) => {
                                      return (
                                        <Option key={item} value={item}>
                                          {item}
                                        </Option>
                                      );
                                    }
                                  )}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={10} xs={24}>
                            <FormItem
                              {...formItemLayoutdiff2}
                              label={
                                <IntlMessages id="procedures.dataConfig" />
                              }
                            >
                              {getFieldDecorator("DataConfig[" + i + "]", {
                                initialValue: el.DataConfig
                                  ? el.DataConfig
                                  : "",
                                rules: [
                                  {
                                    required: i === 0 ? true : false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.dataConfig" />
                                    ),
                                  },
                                ],
                              })(
                                <Select
                                  name={"DataConfig[" + i + "]"}
                                  onChange={(value) =>
                                    this.handleChange(value, "DataConfig", i)
                                  }
                                >
                                  {this.state.configFieldsArr.map((item) => {
                                    return (
                                      <Option key={item} value={item}>
                                        {item}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={4} xs={24}>
                            {i ? (
                              <div className="cust-remove-btn btn-cont">
                                <Button
                                  onClick={() => this.removeOnClick(i)}
                                  className="gx-mb-0"
                                  type="danger"
                                >
                                  <i className="icon icon-trash"></i>{" "}
                                  {<IntlMessages id="global.remove" />}
                                </Button>
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </Col>
                <Col lg={24} xs={24}>
                  <div className="btn-cont">
                    <Button
                      onClick={() => this.addClick()}
                      className="gx-mb-0 add-role-btn"
                      type="primary"
                    >
                      <i className="icon icon-add"></i>{" "}
                      {<IntlMessages id="global.add" />}
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </div>
        ),
      },

      {
        content: (
          <div className="third-content gx-mt-4">
            <Row>
              <Col lg={12} xs={24}>
                <FormItem
                  {...formItemLayoutNew}
                  label={<IntlMessages id="procedures.signatureType" />}
                >
                  {getFieldDecorator("signatureType", {
                    initialValue: this.state.signatureType,
                    rules: [
                      {
                        required: false,
                        // message: <IntlMessages id="required.procedureAdd.signatureType"/>,
                      },
                    ],
                  })(
                    <Select
                      onChange={(value, event) =>
                        this.setState({ signatureType: `${value}` })
                      }
                    >
                      <Option key="bio" value="bio">
                        <IntlMessages id="signatureType.bio" />
                      </Option>
                      <Option key="emailandsms" value="emailandsms">
                        <IntlMessages id="signatureType.remote" />
                      </Option>
                      <Option key="mobile" value="mobile">
                        <IntlMessages id="signatureType.digital" />
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={24}>
                <h5 className="signer_detail_title">
                  <IntlMessages id="procedures.signerDetails" />
                </h5>
              </Col>
              <Col lg={21} xs={24}>
                <Row className="sign_type">
                  <Col lg={4} xs={24}>
                    <h5 className="form-map-title">
                      <span className="cust-mandatory-asterik">*</span>{" "}
                      <IntlMessages id="procedures.fullName" />
                    </h5>
                  </Col>
                  <Col lg={20} xs={24}>
                    <Row>
                      <Col lg={11} xs={24}>
                        <FormItem {...formItemLayoutdiff2}>
                          {getFieldDecorator("fullName", {
                            initialValue: this.state.fullName,
                            rules: [
                              {
                                required: true,
                                message: (
                                  <IntlMessages id="required.procedureAdd.fullName" />
                                ),
                                whitespace: true,
                              },
                            ],
                          })(
                            <Input
                              required
                              onChange={(event) =>
                                this.setState({
                                  fullName: event.target.value,
                                })
                              }
                              margin="none"
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={2} xs={24} style={{ textAlign: "center" }}>
                        <span className="text_or">Or</span>
                      </Col>
                      <Col lg={11} xs={24}>
                        <FormItem {...formItemLayoutdiff2}>
                          {getFieldDecorator("fullNameOr", {
                            initialValue: fullNameOr,
                            rules: [
                              {
                                required: false,
                                // message: <IntlMessages id="required.procedureAdd.participents"/>,
                              },
                            ],
                          })(
                            <Select
                              onChange={(value, event) =>
                                this.handleOrDropDown(value, "fullNameOr")
                              }
                            >
                              {this.state.inspectionFieldsArr.map((item) => {
                                return (
                                  <Option key={item} value={item}>
                                    {item}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col lg={21} xs={24}>
                <Row className="sign_type">
                  <Col lg={4} xs={24}>
                    <h5 className="form-map-title">
                      <span className="cust-mandatory-asterik">*</span>{" "}
                      <IntlMessages id="procedures.signerDNI" />
                    </h5>
                  </Col>
                  <Col lg={20} xs={24}>
                    <Row>
                      <Col lg={11} xs={24}>
                        <FormItem {...formItemLayoutdiff2}>
                          {getFieldDecorator("signerDNI", {
                            initialValue: this.state.signerDNI,
                            rules: [
                              {
                                required: true,
                                message: (
                                  <IntlMessages id="required.procedureAdd.signerDNI" />
                                ),
                              },
                            ],
                          })(
                            <Input
                              required
                              onChange={(event) =>
                                this.setState({
                                  signerDNI: event.target.value,
                                })
                              }
                              margin="none"
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={2} xs={24} style={{ textAlign: "center" }}>
                        <span className="text_or">Or</span>
                      </Col>
                      <Col lg={11} xs={24}>
                        <FormItem {...formItemLayoutdiff2}>
                          {getFieldDecorator("signerDNIOr", {
                            initialValue: signerDNIOr,
                            rules: [
                              {
                                required: false,
                                // message: <IntlMessages id="required.procedureAdd.participents"/>,
                              },
                            ],
                          })(
                            <Select
                              onChange={(value, event) =>
                                this.handleOrDropDown(value, "signerDNIOr")
                              }
                            >
                              {this.state.inspectionFieldsArr.map((item) => {
                                return (
                                  <Option key={item} value={item}>
                                    {item}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              {this.state.signatureType === "bio" ? (
                <Col lg={21} xs={24}>
                  <Row className="sign_type">
                    <Col lg={4} xs={24}>
                      <h5 className="form-map-title">
                        <span className="cust-mandatory-asterik">*</span>
                        <IntlMessages id="procedures.signerDevice" />
                      </h5>
                    </Col>
                    <Col lg={20} xs={24}>
                      <Row>
                        <Col lg={11} xs={24}>
                          <FormItem {...formItemLayoutdiff2}>
                            {getFieldDecorator("signerDevice", {
                              initialValue: this.state.signerDevice,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.procedureAdd.signerDevice" />
                                  ),
                                },
                              ],
                            })(
                              <Select
                                onChange={(value, event) =>
                                  this.setState({
                                    signerDevice: `${value}`,
                                  })
                                }
                              >
                                {this.props.deviceData
                                  ? this.props.deviceData.map((item) => {
                                      return (
                                        <Option
                                          key={item.DeviceName}
                                          value={item.DeviceName}
                                        >
                                          {item.DeviceName}
                                        </Option>
                                      );
                                    })
                                  : null}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              ) : (
                <Col lg={21} xs={24}>
                  <Row className="sign_type">
                    <Col lg={4} xs={24}>
                      <h5 className="form-map-title">
                        <span className="cust-mandatory-asterik">*</span>
                        <IntlMessages id="procedures.signerPhone" />
                      </h5>
                    </Col>
                    <Col lg={20} xs={24}>
                      <Row>
                        <Col lg={11} xs={24}>
                          <FormItem {...formItemLayoutdiff2}>
                            {getFieldDecorator("signerPhone", {
                              initialValue: this.state.signerPhone,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.procedureAdd.signerPhone" />
                                  ),
                                },
                              ],
                            })(
                              <Input
                                onChange={(event) =>
                                  this.setState({
                                    signerPhone: event.target.value,
                                  })
                                }
                                margin="none"
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col lg={2} xs={24} style={{ textAlign: "center" }}>
                          <span className="text_or">Or</span>
                        </Col>
                        <Col lg={11} xs={24}>
                          <FormItem {...formItemLayoutdiff2}>
                            {getFieldDecorator("signerPhoneOr", {
                              initialValue: signerPhoneOr,
                              rules: [
                                {
                                  required: false,
                                  // message: <IntlMessages id="required.procedureAdd.participents"/>,
                                },
                              ],
                            })(
                              <Select
                                onChange={(value, event) =>
                                  this.handleOrDropDown(value, "signerPhoneOr")
                                }
                              >
                                {this.state.inspectionFieldsArr.map((item) => {
                                  return (
                                    <Option key={item} value={item}>
                                      {item}
                                    </Option>
                                  );
                                })}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col lg={21} xs={24}>
                <Row className="sign_type">
                  <Col lg={4} xs={24}>
                    <h5 className="form-map-title">
                      <span className="cust-mandatory-asterik">*</span>
                      <IntlMessages id="procedures.signerEmail" />
                    </h5>
                  </Col>
                  <Col lg={20} xs={24}>
                    <Row>
                      <Col lg={11} xs={24}>
                        <FormItem {...formItemLayoutdiff2}>
                          {getFieldDecorator("signerEmail", {
                            initialValue: this.state.signerEmail,
                            rules: [
                              {
                                required: true,
                                message: (
                                  <IntlMessages id="required.procedureAdd.signerEmail" />
                                ),
                              },
                            ],
                          })(
                            <Input
                              required
                              onChange={(event) =>
                                this.setState({
                                  signerEmail: event.target.value,
                                })
                              }
                              margin="none"
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={2} xs={24} style={{ textAlign: "center" }}>
                        <span className="text_or">Or</span>
                      </Col>
                      <Col lg={11} xs={24}>
                        <FormItem {...formItemLayoutdiff2}>
                          {getFieldDecorator("signerEmailOr", {
                            initialValue: signerEmailOr,
                            rules: [
                              {
                                required: false,
                                // message: <IntlMessages id="required.procedureAdd.participents"/>,
                              },
                            ],
                          })(
                            <Select
                              onChange={(value, event) =>
                                this.handleOrDropDown(value, "signerEmailOr")
                              }
                            >
                              {this.state.inspectionFieldsArr.map((item) => {
                                return (
                                  <Option key={item} value={item}>
                                    {item}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col lg={21} xs={24}>
                <Row className="sign_type sign_position">
                  <Col lg={4} xs={24}>
                    <h5 className="form-map-title">
                      <span className="cust-mandatory-asterik">*</span>
                      <IntlMessages id="procedures.signPosition" />
                    </h5>
                  </Col>
                  <Col lg={20} xs={24}>
                    <Row>
                      <Col lg={5} xs={12}>
                        <FormattedMessage id="column.positionX">
                          {(placeholder) => (
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("positionX", {
                                initialValue: this.state.positionX,
                                rules: [
                                  {
                                    required:
                                      this.state.positionY !== ""
                                        ? true
                                        : false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.positionX" />
                                    ),
                                    whitespace: true,
                                    pattern: new RegExp(/^[0-9]+$/),
                                  },
                                ],
                              })(
                                <Input
                                  required
                                  min="0"
                                  type="number"
                                  placeholder={placeholder}
                                  onChange={(event) =>
                                    this.setState({
                                      positionX: event.target.value,
                                    })
                                  }
                                  margin="none"
                                />
                              )}
                            </FormItem>
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col lg={5} xs={12}>
                        <FormattedMessage id="column.positionY">
                          {(placeholder) => (
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("positionY", {
                                initialValue: this.state.positionY,
                                rules: [
                                  {
                                    required:
                                      this.state.positionX !== ""
                                        ? true
                                        : false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.positionY" />
                                    ),
                                    whitespace: true,
                                    pattern: new RegExp(/^[0-9]+$/),
                                  },
                                ],
                              })(
                                <Input
                                  required
                                  type="number"
                                  placeholder={placeholder}
                                  onChange={(event) =>
                                    this.setState({
                                      positionY: event.target.value,
                                    })
                                  }
                                  margin="none"
                                />
                              )}
                            </FormItem>
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col lg={4} xs={12}>
                        <FormattedMessage id="column.widthX">
                          {(placeholder) => (
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("widthX", {
                                initialValue: this.state.widthX,
                                rules: [
                                  {
                                    required: true,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.widthX" />
                                    ),
                                    whitespace: true,
                                    pattern: new RegExp(/^[0-9]+$/),
                                  },
                                ],
                              })(
                                <Input
                                  required
                                  type="number"
                                  placeholder={placeholder}
                                  onChange={(event) =>
                                    this.setState({
                                      widthX: event.target.value,
                                    })
                                  }
                                  margin="none"
                                />
                              )}
                            </FormItem>
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col lg={4} xs={12}>
                        <FormattedMessage id="column.widthY">
                          {(placeholder) => (
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("widthY", {
                                initialValue: this.state.widthY,
                                rules: [
                                  {
                                    required: true,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.widthY" />
                                    ),
                                    whitespace: true,
                                    pattern: new RegExp(/^[0-9]+$/),
                                  },
                                ],
                              })(
                                <Input
                                  required
                                  type="number"
                                  placeholder={placeholder}
                                  onChange={(event) =>
                                    this.setState({
                                      widthY: event.target.value,
                                    })
                                  }
                                  margin="none"
                                />
                              )}
                            </FormItem>
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col lg={6} xs={12}>
                        <FormattedMessage id="procedures.pageNumber">
                          {(placeholder) => (
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("pageNumber", {
                                initialValue: this.state.pageNumber,
                                rules: [
                                  {
                                    required: true,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.pageNumber" />
                                    ),
                                    whitespace: true,
                                    pattern: new RegExp(/^[0-9]+$/),
                                  },
                                ],
                              })(
                                <Input
                                  required
                                  type="number"
                                  placeholder={placeholder}
                                  onChange={(event) =>
                                    this.setState({
                                      pageNumber: event.target.value,
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
                  </Col>
                </Row>
              </Col>

              {this.state.signatureType === "emailandsms" ||
              this.state.signatureType === "mobile" ? (
                <>
                  <Col lg={21} xs={24}>
                    <Row className="sign_type">
                      <Col lg={4} xs={24}>
                        <h5 className="form-map-title">
                          <span className="cust-mandatory-asterik">*</span>
                          <IntlMessages id="procedures.signerEmailSubject" />
                        </h5>
                      </Col>
                      <Col lg={20} xs={24}>
                        <Row>
                          <Col lg={24} xs={24}>
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("signerEmailSubject", {
                                initialValue: this.state.signerEmailSubject,
                                rules: [
                                  {
                                    required: false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.signerEmailSubject" />
                                    ),
                                  },
                                ],
                              })(
                                <Input
                                  required
                                  onChange={(event) =>
                                    this.setState({
                                      signerEmailSubject: event.target.value,
                                    })
                                  }
                                  margin="none"
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={21} xs={24}>
                    <Row className="sign_type">
                      <Col lg={4} xs={24}>
                        <h5 className="form-map-title">
                          <span className="cust-mandatory-asterik">*</span>
                          <IntlMessages id="procedures.signerEmailBody" />
                        </h5>
                      </Col>
                      <Col lg={20} xs={24}>
                        <Row>
                          <Col lg={24} xs={24}>
                            <FormItem {...formItemLayoutdiff2}>
                              {getFieldDecorator("signerEmailBody", {
                                initialValue: this.state.signerEmailBody,
                                rules: [
                                  {
                                    required: false,
                                    message: (
                                      <IntlMessages id="required.procedureAdd.signerEmailBody" />
                                    ),
                                  },
                                ],
                              })(
                                <Input
                                  type="textarea"
                                  required
                                  onChange={(event) =>
                                    this.setState({
                                      signerEmailBody: event.target.value,
                                    })
                                  }
                                  margin="none"
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </>
              ) : (
                ""
              )}

              <Col lg={21} xs={24}>
                <div className="btn-cont">
                  {this.state.editFlag === "edit" ? (
                    <Button
                      onClick={this.saveUpdate}
                      className="gx-mb-0 add-role-btn"
                      type="primary"
                    >
                      <IntlMessages id="additentity.save" />
                    </Button>
                  ) : (
                    <Button
                      onClick={this.addSignerData}
                      className="gx-mb-0 add-role-btn"
                      type="primary"
                    >
                      <IntlMessages id="global.add" />
                    </Button>
                  )}

                  {/* <Button
            onClick={this.addSignerData}
            className="gx-mb-0 add-role-btn"
            type="primary"
          >
            <i className="icon icon-add"></i>
            <IntlMessages id="global.add" />
          </Button> */}
                </div>
              </Col>
            </Row>
            <Table
              rowKey="Id"
              className="gx-table-responsive procedure_table"
              columns={columns}
              dataSource={this.state.signerData}
              size="middle"
              style={{ whiteSpace: "pre" }}
              scroll={{ x: true }}
            />
          </div>
        ),
      },
      {
        content: (
          <div className="third-content gx-mt-4">
            <Row>
              <Col lg={8} xs={24} className="cust-sidebar-editor">
                {(this.state.processType === "oneFormProcess" ||
                  this.state.processType === "oneFormWorkInstruction") &&
                this.state.inspectionFieldsArr.length > 0
                  ? this.state.inspectionFieldsArr.map((item) => {
                      return <Tag key={item}>[{item}]</Tag>;
                    })
                  : this.state.processType === "twoFormProcess" &&
                    this.state.configFieldsArr.length > 0
                  ? this.state.configFieldsArr.map((item) => {
                      return <Tag key={item}>[{item}]</Tag>;
                    })
                  : null}
                {dynamicSignerData.length > 0
                  ? dynamicSignerData.map((item) => {
                      return <Tag key={item}>{item}</Tag>;
                    })
                  : null}
              </Col>
              {/* <Col lg={16} xs={24}>
              <CKEditor
                activeClass="p10"
                content={this.state.finalDoc}
                events={{
                  'change': this.onContentChange.bind(this)
                }}
              />
            </Col> */}
              <Col
                lg={16}
                xs={24}
                className="col-upload"
                style={{ padding: "10px 0 0 40px" }}
              >
                {/* <h5><IntlMessages id="administrative.countries"/> :</h5> */}
                {/* <div className="dropbox"> */}

                <FormItem className="cust-center-upload">
                  {getFieldDecorator("UploadDoc", {
                    initialValue: this.state.uploadfile,
                    rules: [
                      {
                        required: false,
                        message: (
                          <IntlMessages id="required.procedureAdd.pageNumber" />
                        ),
                      },
                    ],
                  })(
                    <Upload
                      {...uploadDoc}
                      accept=".docx"
                      name="files"
                      showUploadList={true}
                      multiple={false}
                    >
                      <Button>
                        <Icon type="upload" />{" "}
                        <IntlMessages id="bulksignature.ClicktoUpload" />
                      </Button>
                    </Upload>
                    // <Upload.Dragger accept=".doc,.docx" name="files" {...uploadDoc} multiple={false} showUploadList={true}>
                    //   <p className="ant-upload-drag-icon">
                    //     <Icon type="inbox"/>
                    //   </p>
                    //   <p className="ant-upload-hint" style={{padding: '0px 10px 0px 10px'}}><IntlMessages id="administrative.dragfile"/></p>
                    // </Upload.Dragger>
                  )}
                  {/* <span style={{padding: '9px 5px 0 0'}}>
                    <center><a href="https://www.motumlabs.com/Motum/veolia-template/CountryExcel.xlsx" className="arrow-btn gx-link"><IntlMessages id="excelDownload.download"/></a></center>
                  </span> */}
                </FormItem>
                {/* </div> */}

                {this.state.editProcedure ? (
                  <center>
                    <DocViewer
                      pluginRenderers={DocViewerRenderers}
                      documents={docs}
                      className="my-doc-viewer-style"
                      config={{ header: { disableFileName: true } }}
                    />
                  </center>
                ) : null}
              </Col>
            </Row>
          </div>
        ),
      },

      {
        content: (
          <div className="third-content gx-mt-4">
            <span className="cust-title-step">EMAIL CONFIGURATION</span>
            <Row>
              <Col
                lg={24}
                xs={24}
                className="col-upload"
                style={{ padding: "10px 0 0 5px" }}
              >
                <Col lg={22} xs={24}>
                  <Row className="sign_type">
                    <Col lg={6} xs={24}>
                      <h5 className="form-map-title">
                        <span className="cust-mandatory-asterik">*</span>
                        <IntlMessages id="procedures.configToEmail" />
                      </h5>
                    </Col>
                    <Col lg={18} xs={24}>
                      <Row>
                        <Col lg={24} xs={24}>
                          <FormItem {...formItemLayoutdiff2}>
                            {getFieldDecorator("configEmail", {
                              initialValue: this.state.configEmail,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.EmailIsRequired" />
                                  ),
                                },
                              ],
                            })(
                              <Input
                                required
                                onChange={(event) =>
                                  this.setState({
                                    configEmail: event.target.value,
                                  })
                                }
                                margin="none"
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                <Col lg={22} xs={24}>
                  <Row className="sign_type">
                    <Col lg={6} xs={24}>
                      <h5 className="form-map-title">
                        <span className="cust-mandatory-asterik">*</span>
                        <IntlMessages id="procedures.signerEmailSubject" />
                      </h5>
                    </Col>
                    <Col lg={18} xs={24}>
                      <Row>
                        <Col lg={24} xs={24}>
                          <FormItem {...formItemLayoutdiff2}>
                            {getFieldDecorator("configEmailSubject", {
                              initialValue: this.state.configEmailSubject,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.procedureAdd.signerEmailSubject" />
                                  ),
                                },
                              ],
                            })(
                              <Input
                                required
                                onChange={(event) =>
                                  this.setState({
                                    configEmailSubject: event.target.value,
                                  })
                                }
                                margin="none"
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                <Col lg={22} xs={24}>
                  <Row className="sign_type">
                    <Col lg={6} xs={24}>
                      <h5 className="form-map-title">
                        <span className="cust-mandatory-asterik">*</span>
                        <IntlMessages id="procedures.signerEmailBody" />
                      </h5>
                    </Col>
                    <Col lg={18} xs={24}>
                      <Row>
                        <Col lg={24} xs={24}>
                          <FormItem {...formItemLayoutdiff2}>
                            {getFieldDecorator("configEmailBody", {
                              initialValue: this.state.configEmailBody,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.procedureAdd.signerEmailBody" />
                                  ),
                                },
                              ],
                            })(
                              <CKEditor
                                activeClass="p10"
                                //  onChange={(event) => this.setState({profile: event.target.value})}
                                content={this.state.configEmailBody}
                                events={{
                                  change: this.onEditorChange,
                                }}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Col>

              {/* <Col lg={8} xs={24} className="cust-sidebar-editor">
                {(this.state.processType === "oneFormProcess" ||
                  this.state.processType === "oneFormWorkInstruction") &&
                this.state.inspectionFieldsArr.length > 0
                  ? this.state.inspectionFieldsArr.map((item) => {
                      return <Tag key={item}>[{item}]</Tag>;
                    })
                  : this.state.processType === "twoFormProcess" &&
                    this.state.configFieldsArr.length > 0
                  ? this.state.configFieldsArr.map((item) => {
                      return <Tag key={item}>[{item}]</Tag>;
                    })
                  : null}
                {dynamicSignerData.length > 0
                  ? dynamicSignerData.map((item) => {
                      return <Tag key={item}>{item}</Tag>;
                    })
                  : null}
              </Col> */}
            </Row>
          </div>
        ),
      },
    ];

    const { current } = this.state;
    var showSteps = [];
    var editSteps = [];

    editSteps =
      this.state.configVidsigner === true ? steps : steps.splice(2, 1);

    showSteps =
      this.state.sendMailby === "Vidsigner" &&
      this.state.configVidsigner === true
        ? steps.splice(4, 1)
        : this.state.sendMailby === "Vidsigner" &&
          this.state.configVidsigner === false
        ? steps.splice(3, 1)
        : steps;

    console.log("steps--->", steps);

    return (
      <div className="ant-card gx-card ant-card-bordered">
        <div className="ant-card-head cust-card-head">
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
              {this.state.procedureId !== "" ? (
                <IntlMessages id="procedureEdit.editProcedure" />
              ) : (
                <IntlMessages id="procedureAdd.addProcedure" />
              )}
            </div>
          </div>
        </div>
        <div className="ant-card-body">
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="step-contents">
            {steps[this.state.current].content}
          </div>
          <hr />
          <div className="steps-action text-right">
            {this.state.current > 0 && (
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => this.prev()}
                className="gx-mb-0"
              >
                <IntlMessages id="button.Previous" />
              </Button>
            )}
            {this.state.current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => this.next1()}
                className="gx-mb-0"
              >
                <IntlMessages id="button.Next" />
              </Button>
            )}
            {this.state.current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={this.handleSaveProcedureData}
                className="gx-mb-0"
              >
                <IntlMessages id="button.Submit" />
              </Button>
            )}
          </div>
        </div>
        <Modal
          className=""
          title={<IntlMessages id="signerDelete.title" />}
          visible={this.state.signerDeleteModal}
          destroyOnClose={true}
          onCancel={() => this.cancelDeleteSigner()}
          onOk={() => this.confirmDeleteSigner()}
          okText={<IntlMessages id="button.delete" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <div className="mail-successbox">
                <h3 className="err-text">
                  <IntlMessages id="signerDelete.message" />
                </h3>
              </div>
            </div>
          </div>
        </Modal>
        {this.props.loader ? (
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
  getMoreAppFormData,
  getMoreAppFormDataFail,
  getDeviceData,
  saveProcedureData,
  updateProcedureData,
  getDropDownData,
  processNamesForDropDownList,
  getProcessData,
};

const addProcedureForm = Form.create()(AddProcedure);

const mapStateToProps = (state) => {
  return {
    DropDownData: state.departmentReducers.get_dropdown_res,
    moreAppFormData: state.businessProceduresReducers.get_formdata_res,
    showErrorMsg: state.businessProceduresReducers.get_formdata_status,
    deviceData: state.businessProceduresReducers.get_device_res,
    loader: state.businessProceduresReducers.loader,
    processDropDownList: state.processReducers.get_process_dropdown,
    getProcessDataList: state.processReducers.get_process_res,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(addProcedureForm));
