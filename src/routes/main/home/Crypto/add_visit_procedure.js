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
  InputNumber,
  List,
} from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { webURL, branchName } from "../../../../util/config";

import IntlMessages from "util/IntlMessages";
import {
  getMoreAppFormData,
  // getDeviceData,
  // saveProcedureData,
  // updateProcedureData,
  getMoreAppFormDataFail,
} from "../../../../appRedux/actions/BusinessProceduresActions";
// import { getDropDownData } from "../../../../appRedux/actions/DepartmentActions";
import {
  getVisitProcedure,
  addProcessData,
  clearData,
  updateProcessData,
  setStatusToInitial,
} from "../../../../appRedux/actions/VisitProcedureAction";
import { getGeneralSettings } from "./../../../../appRedux/actions/GeneralSettingsAction";
import CircularProgress from "../../../../components/CircularProgress/index";

import { FormattedMessage, injectIntl } from "react-intl";

import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

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

var processColumns = [];
var precessConfigById = [];
var dynamicTagData = [];
let items = [];
let signNoList = [];
let signerArrNo = [];
var multiFile = [];

var licenseId = "";
var deviceId = "";
let langName = "";
let apikey = "";
let clientId = "";
// var pdfURL = null;

class AddVisitProcedure extends Component {
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
      processType: "",
      participateNo: "",
      signerNo: "",
      signType: "",
      identityCheck: "",
      externalLink: "",
      custodyPeriod: "",
      periodValue: "",
      copyEmail: "",
      emailList: "",
      fontFamily: "",
      fontSize: "",
      smsAlert: "",
      smsProcess: "",
      smsText: "",
      senderList: "",
      supportModal: "",
      moreAppFormId: "",
      workInstructionMappings: "",

      // areaName: "",
      // departmentName: "",
      // serviceName: "",
      // processConfig: "",

      // instructionEmail: "",
      // moreAPIKey: "",
      // moreClientID: "",
      // userName: "",
      // password: "",
      // vidsignerType: "",
      // dataCaptureForm: "",
      inspectionValidation: "",
      // inspectionForm: "",
      // signatureType: "bio",
      // fullName: "",
      // signerDNI: "",
      // signerDevice: null,
      // signerPhone: null,
      // signerEmail: "",
      positionX: "",
      positionY: "",
      widthX: "",
      widthY: "",
      pageNo: "",
      selectSignNo: "",
      // departmentArr: [],
      serviceArr: [],

      booleanFieldsArr: [],
      configFieldsArr: [],
      datacaptureLabelsArr: [],
      inspectorLabelsArr: [],
      mappingValue: [{ InspectionField: "", DataConfig: "" }],
      signerData: [],
      fieldLogData: [],
      signerId: "",
      customFieldId: "",
      prodcedureSelect: "",
      signerDeleteModal: false,
      uploadfile: [],
      DocURL: "",
      editProcedure: false,
      fieldType: "",
      fieldVal: "",
      name: "",
      editFlag: "",
      editId: "",
      actionEdit: "",
      templateNo: "",
      startingDoc:
        '<!DOCTYPE html><html><head><title></title></head><body><div style="box-sizing:border-box; margin-bottom:0; margin-left:auto; margin-right:auto; margin-top:0; padding:50px; width:850px;font-family: arial;">',
      finalDoc:
        '<table border="0" cellpadding="0" cellspacing="0" style="width:750px"><tbody><tr><td><img alt="logo-img" src="https://initzero.tech/axe-images/Acta-logo.jpg" style="float:left; height:80px; width:auto" /></td><td style="text-align:right"><p>AREA DE DESENVOLUPAMENT I PROMOCIO ECONOMICA</p><p>Placa del Mercat, 5-6</p><p>Tel. 93 680 03 70</p></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" style="width:750px"><tbody><tr><td style="width:500px">&nbsp;</td><td style="width:250px"><table border="1" cellpadding="5" cellspacing="0" style="width:250px"><tbody><tr><td colspan="2" style="text-align:left">Expedient:<br />&nbsp;</td></tr><tr><td style="text-align:left">Full<br /> &nbsp;</td><td style="text-align:left">de<br /> &nbsp;</td></tr></tbody></table></td></tr></tbody></table><h3>ACTA D&#39;INSPECCIO</h3><table border="1" cellpadding="15" cellspacing="0" style="width:750px"><tbody><tr><td><p>A Violins de Rei, a les&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; hores del dia&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; de/d&#39;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; de 20 ,<br /> s&#39;ha presentat el/la funcionari/a municipal&nbsp;Violins&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;a :<br /> Nom comercial:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;<br /> Nom/ rao social:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;NIF:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br /> Carrer:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;num&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;local&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<br /> Es present en/na:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br /> amb DNI num.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; en qualitat de:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br /> a qui se li demana que faciliti el servei i el presencil.<br /> El/la funcionarila municipal constata que es desenvolupa I&#39;activitat de&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>Per la/les quails es disposa de Ilicencia, permis municipal o comunicaciO previa de l&#39;activitat&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p></td></tr><tr><td>Observations:<br /><br /><br /><br /> &nbsp;</td></tr><tr> <td>En aquest acte es confereix audiencia per un termini de <strong>deu dies hateiis</strong>, de conformitat amb allo establert en l&#39;article 84 de la Llei 30/1992, de 26 de novembre, de regim juridic de les administracions publiques i del procediment administratiu comu, <strong>com a tramit previ a l&#39;adopcio, d&#39;ordre de cessament</strong>.durant el qual pot al-legar el que cregui oportu i presentar els documents i justificacions que estimi pertinents. De conformitat amb les Llei 20/2009 i 11/2009 aprovades per la Generalitat de Catalunya i de l&#39;Ordenanca municipal d&#39;activitats, no es-podra exercir l&#39;activitat mentre no disposi de l&#39;autoritzacia, Ilicencia o comunicacio previa corresponent.<br /><br /> Corn a comprovant de les actuations realitzades, s&#39;aixeca aquesta acta, per duplicat, que signen el/lafuncionari/a i la persona fieressada, a la qual es Iliura un exemplar.<br /><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<strong>El/la&nbsp;furApnari/a&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;La&nbsp;persona interessada</strong><br /><br /> &nbsp;</td></tr></tbody></table><p>&nbsp;</p>',
      endingDoc: "</div></body></html>",
    };
  }

  componentDidMount() {
    langName = localStorage.getItem(branchName + "_language");

    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined
      ) {
        licenseId = userData["id"];
        deviceId = userData["deviceId"];
      }
      this.props.getGeneralSettings();
    }

    if (this.props.location.state) {
      const action = this.props.location.state.actionFlag;
      this.setState({ actionEdit: action });
    }

    this.props.getVisitProcedure();

    this.props.setStatusToInitial();
  }

  next1 = () => {
    if (this.state.current === 0) {
      this.props.form.validateFieldsAndScroll(
        [
          "processName",
          "processType",
          "participateNo",
          "moreAppFormId",
          "templateNo",
          "signerNo",
          "signType",
          "identityCheck",
          "externalLink",
          "custodyPeriod",
          "periodValue",
          "copyEmail",
          "emailList",
          "fontFamily",
          "fontSize",
          "smsAlert",
          "smsProcess",
          "smsText",
          "senderList",
          "InspectionField[0]",
          "DataConfig[0]",
        ],
        (err, values) => {
          if (!err) {
            const current = this.state.current + 1;

            this.setState({ current });

            for (let i = 1; i <= this.state.templateNo; i++) {
              items.push(i);
            }

            for (let i = 1; i <= this.state.signerNo; i++) {
              signNoList.push(i);
            }
          }
        }
      );
    } else if (this.state.current === 1) {
      const current = this.state.current + 1;
      this.setState({ current });
    } else if (this.state.current === 2) {
      const current = this.state.current + 1;
      this.setState({ current });
      dynamicTagData = [];
      if (this.state.fieldLogData.length !== 0) {
        this.state.fieldLogData.map((item) => {
          // console.log("arr--->", arr);
          if (item.Name !== undefined && item.Name !== null) {
            var str = item.Name;
            var replaceStr = str.replace(/txt|file|cmb|txtarea/g, "VAR");
            dynamicTagData.push(replaceStr);
          }
        });
      }
    } else if (this.state.current === 3) {
      this.props.form.validateFieldsAndScroll(["UploadDoc"], (err, values) => {
        if (!err) {
          const current = this.state.current + 1;
          this.setState({ current });
        }
      });
    }
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
    if (current === 0) {
      items = [];
      signNoList = [];
    }
  };

  handleProcessType = (value) => {
    this.setState({ mappingValue: [{ InspectionField: "", DataConfig: "" }] });
    this.setState({ processType: `${value}` });
    var generalData = this.props.generalSettingsData;
    if (value === "MOREAPPV3") {
      if (generalData != null) {
        apikey = generalData.MoreAppKey;
        clientId = generalData.MoreAppClientId;
      }
    }

    if (value === "MOREAPPV3") {
      this.props.getMoreAppFormData({
        ApiKey: apikey,
        ClientId: clientId,
      });
    }
  };

  handleSurrpotMode = (value) => {
    // this.setState({
    //   mappingValue: [{ InspectionField: "", DataConfig: "" }],
    // });
    this.setState({ supportModal: `${value}` });
  };

  handleGoBack = () => {
    this.props.history.push({
      pathname: "/" + webURL + "main/home/visit-procedure-management",
    });
  };

  onContentChange = (evt) => {
    const newContent = evt.editor.getData();
    var completeDoc =
      this.state.startingDoc + newContent + this.state.endingDoc;
    this.setState({
      finalDoc: completeDoc,
    });
  };

  handleParticipate = (value) => {
    this.setState({ participateNo: value });
    signerArrNo = [];

    for (let i = 1; i <= value; i++) {
      signerArrNo.push(i);
    }
  };

  handleTemplate = (value) => {
    this.setState({ templateNo: value });
    items = [];
  };

  handleSignerNo = (value) => {
    this.setState({ signerNo: value });
    signNoList = [];
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

    console.log("mapping name---->", this.state.mappingValue);
  }

  addSignerData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["pageNo", "positionX", "positionY", "widthX", "widthY"],
      (err, values) => {
        if (!err) {
          var newSignerData = this.state.signerData;

          if (this.state.positionX !== "" && this.state.positionY !== "") {
            var participateId = newSignerData.length + 1;
            newSignerData.push({
              id: newSignerData.length + 1,
              TemplateId: this.state.selectTemplate,
              SignNo: this.state.selectSignNo,
              page: this.state.pageNo,
              doc_sig_posX: this.state.positionX,
              doc_sig_posY: this.state.positionY,
              doc_sig_sizeX: this.state.widthX,
              doc_sig_sizeY: this.state.widthY,
              licenseId: licenseId,
              deviceId: deviceId,
            });
          }

          console.log("sign", newSignerData);
          this.setState({
            signerData: newSignerData,
            // participateNo: "",
            pageNo: "",
            selectTemplate: "",
            selectSignNo: "",

            positionX: "",
            positionY: "",
            widthX: "",
            widthY: "",
          });
          this.props.form.setFieldsValue({
            // participateNo: "",
            pageNo: "",
            selectTemplate: "",
            selectSignNo: "",
            positionX: "",
            positionY: "",
            widthX: "",
            widthY: "",
          });
        }
      }
    );
  };

  addFieldData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["name", "fieldType"],
      (err, values) => {
        if (!err) {
          var newfieldLogData = this.state.fieldLogData;
          var tagGenerate = "";
          var str = this.state.name;
          var replaced = str.split(" ").join("_");

          if (this.state.fieldType === "TextBox") {
            tagGenerate = "txt_" + replaced;
          } else if (this.state.fieldType === "TextArea") {
            tagGenerate = "txtarea_" + replaced;
          } else if (this.state.fieldType === "ComboBox") {
            tagGenerate = "cmb_" + replaced;
          } else if (this.state.fieldType === "FileUpload") {
            tagGenerate = "file_" + replaced;
          }

          newfieldLogData.push({
            Id: 0,
            Name: tagGenerate,
            DisplayName: this.state.name,
            Type: this.state.fieldType,
            DefaultValue: this.state.fieldVal,
            licenseId: licenseId,
            deviceId: deviceId,
          });
          this.setState({
            fieldLogData: newfieldLogData,
            name: "",
            fieldType: "",
            fieldVal: "",
          });
          this.props.form.setFieldsValue({
            name: "",
            fieldType: "",
            fieldVal: "",
          });
        }
      }
    );
  };

  saveUpdate = () => {
    var tagGenerate = "";
    var str = this.state.name;
    var replaced = str.split(" ").join("_");
    tagGenerate = "var_" + replaced;

    var fieldData1 = this.state.fieldLogData.map((d) => {
      // console.log("id-->", d.id);
      // console.log("id111-->", this.state.editId);
      if (d.id === this.state.editId) {
        return {
          id: d.id,
          Name: tagGenerate,
          DisplayName: this.state.name,
          Type: this.state.fieldType,
          DefaultValue:
            this.state.fieldType == "TextBox" ||
            this.state.fieldType == "TextArea" ||
            this.state.fieldType == "FileUpload"
              ? ""
              : this.state.fieldVal,
          licenseId: licenseId,
          deviceId: deviceId,
        };
      }
      return d;
    });
    console.log("fdata1---->", fieldData1);

    this.setState({ fieldLogData: fieldData1, editFlag: "" });

    this.props.form.setFieldsValue({
      name: "",
      fieldType: "",
      fieldVal: "",
    });
  };

  onEditField = (a_id) => {
    var fieldData = this.state.fieldLogData.find((singleField) => {
      // console.log("singleField--->", singleField.id);
      return singleField.id === a_id;
    });
    console.log("fieldata--->", fieldData.id);
    this.setState({ editId: fieldData.id });

    this.props.form.setFieldsValue({
      name: fieldData.DisplayName,
      fieldType: fieldData.Type,
      fieldVal: fieldData.DefaultValue,
    });

    this.setState({ name: fieldData.DisplayName });
    this.setState({ fieldType: fieldData.Type });
    this.setState({ fieldVal: fieldData.DefaultValue });
    this.setState({ editFlag: "edit" });
  };

  onDeleteSigner = (signer_id) => {
    this.setState({ signerDeleteModal: true });
    this.setState({ signerId: signer_id });

    console.log("id--->", signer_id);
  };

  onDeleteFieldLog = (field_id) => {
    this.setState({ fieldDeleteModal: true });
    this.setState({ customFieldId: field_id });
  };

  confirmDeleteSigner = () => {
    var deleteSignerData = this.state.signerData;
    if (deleteSignerData.length > 0) {
      var signerLength = deleteSignerData.length;
      var signerArr = deleteSignerData.findIndex((singleSigner) => {
        return singleSigner.id === this.state.signerId;
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

  confirmDeleteField = () => {
    var deleteFieldData = this.state.fieldLogData;
    if (deleteFieldData.length > 0) {
      var fieldLength = deleteFieldData.length;
      var fieldArr = deleteFieldData.findIndex((singleField) => {
        return singleField.id === this.state.customFieldId;
      });
      if (fieldArr !== -1) deleteFieldData.splice(fieldArr, 1);
      if (fieldLength !== deleteFieldData.length) {
        message.error(
          this.props.intl.formatMessage({ id: "addProcedure.fieldDelete" })
        );
      }
      this.setState({
        fieldLogDatasignerData: deleteFieldData,
        fieldDeleteModal: false,
      });
    }
  };

  cancelDeleteSigner = (e) => {
    this.setState({ signerId: "" });
    this.setState({ signerDeleteModal: false });
  };

  cancelDeleteField = (e) => {
    this.setState({ customFieldId: "" });
    this.setState({ fieldDeleteModal: false });
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

  handleSaveProcedureData = (e) => {
    e.preventDefault();

    var procedureData = {
      Id: this.state.editProcedure ? this.state.procedureId : 0,
      procedureName: this.state.processName,
      doc_type: this.state.processType,
      SupportMode: this.state.supportModal,
      MoreAppFormId: this.state.moreAppFormId,
      WorkInstructionMappings: this.state.mappingValue,
      numberOfTemplate: this.state.templateNo,
      doc_participants: this.state.participateNo,

      doc_signers: this.state.signerNo,
      sigNo: this.state.signerNo,
      doc_sig_type: this.state.signType,
      identity_level: "",
      identity_checklist: this.state.identityCheck,
      external_check: this.state.externalLink,
      doc_copyByEmail: this.state.copyEmail,
      doc_listEmails: this.state.emailList,
      FontFamily: this.state.fontFamily,
      FontSize: this.state.fontSize,
      CustodyPeriod: this.state.custodyPeriod,
      CustodyValue: this.state.periodValue,
      SMS_Alert: this.state.smsAlert,
      SMS_Process: this.state.smsProcess,
      SMS_Text: this.state.smsText,
      SMS_Senderlist: this.state.senderList,
      other_template: this.state.prodcedureSelect,
      FormControlConfigDTO: this.state.fieldLogData,
      ProcedureConfigDTO: this.state.signerData,
      licenseId: licenseId,
      deviceId: deviceId,
    };

    console.log("procedure data--->", procedureData);
    const procedureDataForm = new FormData();
    procedureDataForm.append("Procedure", JSON.stringify(procedureData));
    // if (Object.entries(this.state.uploadfile).length !== 0) {
    //   procedureDataForm.append("ProcedureTemplate", multiFile);
    // }
    if (multiFile.length !== 0) {
      for (let i = 0; i < multiFile.length; i++) {
        procedureDataForm.append("ProcedureTemplate", multiFile[i]);
      }
    }

    // console.log("procedure data2222----->", procedureData);

    // if (Object.entries(this.state.uploadfile).length !== 0) {
    //   procedureDataForm.append("ProcedureTemplate", multiFile);
    // }
    if (this.state.editProcedure) {
      this.props.updateProcessData(procedureDataForm);
      items = [];
      signNoList = [];
    } else {
      this.props.addProcessData(procedureDataForm);
      items = [];
      signNoList = [];
    }
  };

  render() {
    var docs = "";

    console.log("edit procedure--->", this.state.editProcedure);

    precessConfigById = this.props.getProcedureById;

    console.log("current--->", this.state.current);

    // console.log("generaldata---->", generalData);

    // if (generalData != null) {
    //   apikey = generalData.MoreAppKey;
    //   clientId = generalData.MoreAppClientId;
    // }

    if (precessConfigById !== null) {
      // var url = precessConfigById.doc_template;
      // var filename = url.substring(url.lastIndexOf("\\") + 1);
      // console.log("1231----->", filename);
      var participateId = precessConfigById.ProcedureConfigDTO.length + 1;
      // console.log("participat--->", participateId);

      this.setState({
        procedureId: precessConfigById.id,
        processName: precessConfigById.procedureName,
        processType: precessConfigById.doc_type,
        supportModal: precessConfigById.SupportMode,
        moreAppFormId: precessConfigById.MoreAppFormId,
        mappingValue: precessConfigById.WorkInstructionMappings,
        templateNo: precessConfigById.numberOfTemplate,
        participateNo: precessConfigById.doc_participants,
        signerNo: precessConfigById.doc_signers,
        signType: precessConfigById.doc_sig_type,
        identityCheck: precessConfigById.identity_checklist,
        externalLink: precessConfigById.external_check,
        custodyPeriod: precessConfigById.CustodyPeriod,
        periodValue: precessConfigById.CustodyValue,
        copyEmail: precessConfigById.doc_copyByEmail,
        emailList: precessConfigById.doc_listEmails,
        fontFamily: precessConfigById.FontFamily,
        fontSize: precessConfigById.FontSize,
        smsAlert: precessConfigById.SMS_Alert,
        smsProcess: precessConfigById.SMS_Process,
        smsText: precessConfigById.SMS_Text,
        senderList: precessConfigById.SMS_Senderlist,
        signerData: precessConfigById.ProcedureConfigDTO,
        fieldLogData: precessConfigById.FormControlConfigDTO,
        ParticipateNo: participateId,
        finalDoc: precessConfigById.doc_template,
        DocURL: precessConfigById.doc_template,
        prodcedureSelect: precessConfigById.other_template,
        editProcedure: true,
      });

      this.props.clearData();
    }

    const uploadDoc = {
      beforeUpload: (file, name, i) => {
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

    if (this.state.uploadfile != "") {
      multiFile.push(this.state.uploadfile);
      this.setState({ uploadfile: "" });
    }

    // console.log("multi file", multiFile);

    if (this.props.showErrorMsg) {
      message.error(
        this.props.intl.formatMessage({ id: "addProcedure.KeyIdRequired" })
      );
      this.props.getMoreAppFormDataFail(false);
    }

    if (this.state.editProcedure) {
      var docURL = this.state.DocURL;
      let lastCommaIndex = docURL.lastIndexOf(";");
      console.log("last index--->", lastCommaIndex + 1);
      let word = docURL.slice(lastCommaIndex + 1).trim();
      // console.log("word", word);
      var docStartURL = word.replace(
        "C:\\inetpub\\wwwroot\\MotumStag\\",
        "https://www.motumlabs.com/"
      );
      var docMiddleURL = docStartURL.replaceAll("\\", "/");
      var docFinalURL = docMiddleURL.replaceAll(/ /g, "%20");
      docs = [{ uri: docFinalURL }];

      // console.log("docs---->", docs);
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

    // if (this.props.moreAppFormData.length !== 0) {
    //   this.props.moreAppFormData.map((item, index) => {
    //     var dataCaptureFormArray = this.props.moreAppFormData[index].Forms.find(
    //       (formId) => {
    //         return (
    //           formId.FormId ===
    //           this.props.location.state.passProcedureData.DataCaptureFormId
    //         );
    //       }
    //     );

    //     if (
    //       this.state.booleanFieldsArr.length === 0 &&
    //       dataCaptureFormArray !== undefined
    //     ) {
    //       if (dataCaptureFormArray.BooleanFileds.length != 0) {
    //         this.setState({
    //           booleanFieldsArr: dataCaptureFormArray.BooleanFileds,
    //         });
    //       }
    //     }
    //     if (
    //       this.state.configFieldsArr.length === 0 &&
    //       dataCaptureFormArray !== undefined
    //     ) {
    //       if (dataCaptureFormArray.FormFileds.length != 0) {
    //         this.setState({
    //           configFieldsArr: dataCaptureFormArray.FormFileds,
    //         });
    //       }
    //     }
    //     // console.log("DATA CAPTURE length", this.state.configFieldsArr.length);
    //     if (
    //       this.state.configFieldsArr.length === 0 &&
    //       this.state.processType === "WorkInstruction" &&
    //       dataCaptureFormArray !== undefined
    //     ) {
    //       if (dataCaptureFormArray.FormFileds.length != 0) {
    //         this.setState({
    //           inspectionFieldsArr: dataCaptureFormArray.FormFileds,
    //         });
    //       }
    //     }
    //     // console.log("DATA CAPTURE Config", this.state.configFieldsArr);
    //     // console.log("DATA CAPTURE inspectionArr", this.state.inspectionFieldsArr);
    //     if (
    //       this.state.inspectionFieldsArr.length === 0 &&
    //       this.state.processType === "WorkInstruction" &&
    //       dataCaptureFormArray !== undefined
    //     ) {
    //       if (dataCaptureFormArray.FormFileds.length != 0) {
    //         this.setState({
    //           inspectionFieldsArr: dataCaptureFormArray.FormFileds,
    //         });
    //       }
    //     }

    //     var inspectionFormArray = this.props.moreAppFormData[index].Forms.find(
    //       (formId) => {
    //         return (
    //           formId.FormId ===
    //           this.props.location.state.passProcedureData.InspectionFormId
    //         );
    //       }
    //     );

    //     if (
    //       this.state.inspectionFieldsArr.length === 0 &&
    //       inspectionFormArray !== undefined
    //     ) {
    //       if (inspectionFormArray.FormFileds.length != 0) {
    //         this.setState({
    //           inspectionFieldsArr: inspectionFormArray.FormFileds,
    //         });
    //       }
    //     }
    //   });
    // }

    const columns = [
      // {
      //   title: <IntlMessages id="visitmanagement.participateCol" />,
      //   dataIndex: "ParticipateNo",
      //   key: "ParticipateNo",
      //   sorter: true,
      //   sortDirections: ["ascend", "descend", "ascend"],
      //   render: (text) => <span className="">{text}</span>,
      // },
      {
        title: <IntlMessages id="visitmanagement.templateNoCol" />,
        dataIndex: "TemplateId",
        key: "TemplateId",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">Template {text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.signNoCol" />,
        dataIndex: "SignNo",
        key: "SignNo",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">Signer {text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.pagenumber" />,
        dataIndex: "page",
        key: "page",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="column.positionX" />,
        dataIndex: "doc_sig_posX",
        key: "doc_sig_posX",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.positionY" />,
        dataIndex: "doc_sig_posY",
        key: "doc_sig_posY",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.widthX" />,
        dataIndex: "doc_sig_sizeX",
        key: "doc_sig_sizeX",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.widthY" />,
        dataIndex: "doc_sig_sizeY",
        key: "doc_sig_sizeY",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="column.Action" />,
        key: "document",
        align: "center",
        fixed: "right",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.delete">
              {(title) => (
                <span>
                  <span className="gx-link">
                    <Button
                      onClick={() => this.onDeleteSigner(record.id)}
                      className="arrow-btn gx-link"
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
            3
          </div>
        ),
      },
    ];

    const customColumns = [
      {
        title: <IntlMessages id="visitmanagement.field" />,
        dataIndex: "DisplayName",
        key: "DisplayName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.type" />,
        dataIndex: "Type",
        key: "Type",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.defaultvalues" />,
        dataIndex: "DefaultValue",
        key: "DefaultValue",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="visitmanagement.tag" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="column.Action" />,
        key: "document",
        align: "center",
        fixed: "right",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.delete">
              {(title) => (
                <span>
                  <span className="gx-link">
                    <Button
                      onClick={() => this.onEditField(record.id)}
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
                      onClick={() => this.onDeleteFieldLog(record.id)}
                      className="arrow-btn gx-link"
                      style={{ paddingLeft: "0px" }}
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
                <span className="cust-title-step">
                  <IntlMessages id="visitmanagement.generalconfiguration" />
                </span>
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
                    label={<IntlMessages id="visit.processtype" />}
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
                      <Select onChange={this.handleProcessType}>
                        <Option value="VISIT">VISIT</Option>
                        <Option value="GENERAL">GENERAL</Option>
                        <Option value="GENERALV2">GENERALV2</Option>
                        <Option value="EXPEDIENT">EXPEDIENT</Option>
                        <Option value="INSPECTION">INSPECTION</Option>
                        <Option value="MOREAPP">MOREAPP</Option>
                        <Option value="MOREAPPV2">MOREAPPV2</Option>
                        <Option value="MOREAPPV3">MOREAPPV3</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {this.state.processType === "MOREAPPV3" ? (
                  <Col lg={24} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label={<IntlMessages id="visit.supportModal" />}
                    >
                      {getFieldDecorator("supportModal", {
                        initialValue: this.state.supportModal,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.visit.supportModal" />
                            ),
                          },
                        ],
                      })(
                        <Select
                          // onChange={(value, event) =>
                          //   this.setState({ supportModal: `${value}` })
                          // }
                          onChange={this.handleSurrpotMode}
                        >
                          <Option value="FormSendingLink">
                            FormSendingLink
                          </Option>
                          <Option value="WorkInstruction">
                            WorkInstruction
                          </Option>
                          <Option value="Both">Both</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                ) : (
                  ""
                )}

                {this.state.supportModal === "FormSendingLink" ||
                this.state.supportModal === "WorkInstruction" ||
                this.state.supportModal === "Both" ? (
                  <>
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="visit.moreAppFormId" />}
                      >
                        {getFieldDecorator("moreAppFormId", {
                          initialValue: this.state.moreAppFormId,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.visit.moreAppFormId" />
                              ),
                            },
                          ],
                        })(
                          <Select
                            onChange={(value, event) =>
                              this.setState({ moreAppFormId: `${value}` })
                            }
                          >
                            {this.props.moreAppFormData
                              ? this.props.moreAppFormData.map(
                                  (item, index) => {
                                    return (
                                      <OptGroup
                                        key={item.FolderName}
                                        label={item.FolderName}
                                      >
                                        {this.props.moreAppFormData[
                                          index
                                        ].Forms.map((item) => {
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
                                        })}
                                      </OptGroup>
                                    );
                                  }
                                )
                              : null}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </>
                ) : (
                  ""
                )}

                {this.state.supportModal === "WorkInstruction" ||
                this.state.supportModal === "Both" ? (
                  <Col lg={24} xs={24}>
                    <Row>
                      <Col lg={5} xs={24}>
                        {/* <h5 className="form-map-title"> */}
                        <span style={{ marginTop: "15px" }}>
                          <IntlMessages id="visit.workInstructionMappings" />
                        </span>
                        {/* </h5> */}
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
                                {getFieldDecorator(
                                  "InspectionField[" + i + "]",
                                  {
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
                                  }
                                )(
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
                                    {this.state.inspectionFieldsArr
                                      ? this.state.inspectionFieldsArr.map(
                                          (item) => {
                                            return (
                                              <Option key={item} value={item}>
                                                {item}
                                              </Option>
                                            );
                                          }
                                        )
                                      : ""}
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
                                    {/* {this.state.configFieldsArr
                                      ? this.state.configFieldsArr.map(
                                          (item) => {
                                            return (
                                              <Option key={item} value={item}>
                                                {item}
                                              </Option>
                                            );
                                          }
                                        )
                                      : ""} */}

                                    <Option value="id">id</Option>
                                    <Option value="Name">Name</Option>
                                    <Option value="FatherSurname">
                                      FatherSurname
                                    </Option>
                                    <Option value="MotherSurname">
                                      MotherSurname
                                    </Option>
                                    <Option value="DNI">DNI</Option>
                                    <Option value="Email">Email</Option>
                                    <Option value="CompanyName">
                                      CompanyName
                                    </Option>
                                    <Option value="PhoneNumber">
                                      PhoneNumber
                                    </Option>
                                    <Option value="MobileNumber">
                                      MobileNumber
                                    </Option>
                                    <Option value="RegisterDate">
                                      RegisterDate
                                    </Option>
                                    <Option value="NICSNo ">NICSNo</Option>
                                    <Option value="identifier ">
                                      identifier
                                    </Option>
                                    <Option value="type ">type</Option>
                                    <Option value="IS_BlackList ">
                                      IS_BlackList
                                    </Option>
                                    <Option value="IS_WhiteList  ">
                                      IS_WhiteList
                                    </Option>
                                    <Option value="BirthDate ">
                                      BirthDate
                                    </Option>
                                    <Option value="IsMinore  ">IsMinore</Option>
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
                      <Col lg={24} xs={24} style={{ marginBottom: "10px" }}>
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
                  </Col>
                ) : (
                  ""
                )}

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visit.participate" />}
                  >
                    {getFieldDecorator("participateNo", {
                      initialValue: this.state.participateNo,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visit.participate" />
                          ),
                        },
                      ],
                    })(
                      <InputNumber
                        required
                        style={{ width: "100%" }}
                        onChange={this.handleParticipate}
                        // onChange={(value) =>
                        //   this.setState({ participateNo: value })
                        // }
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.signerno" />}
                  >
                    {getFieldDecorator("signerNo", {
                      initialValue: this.state.signerNo,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.signerno" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        // onChange={(value, event) =>
                        //   this.setState({ signerNo: `${value}` })
                        // }
                        onChange={this.handleSignerNo}
                      >
                        {signerArrNo != null &&
                          signerArrNo.map((item) => {
                            return <Option value={item}>{item}</Option>;
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visit.templateNo" />}
                  >
                    {getFieldDecorator("templateNo", {
                      initialValue: this.state.templateNo,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visit.templateNo" />
                          ),
                        },
                      ],
                    })(
                      <InputNumber
                        required
                        style={{ width: "100%" }}
                        onChange={this.handleTemplate}
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.signtype" />}
                  >
                    {getFieldDecorator("signType", {
                      initialValue: this.state.signType,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.signtype" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ signType: event.target.value })
                        }
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visit.identity" />}
                  >
                    {getFieldDecorator("identityCheck", {
                      initialValue: this.state.identityCheck,
                      rules: [
                        {
                          required: false,
                          message: (
                            <IntlMessages id="required.visit.identity" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ identityCheck: `${value}` })
                        }
                      >
                        <Option value="BLACK">BLACK</Option>
                        <Option value="WHITE">WHITE</Option>
                        <Option value="">None</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.externallink" />}
                  >
                    {getFieldDecorator("externalLink", {
                      initialValue: this.state.externalLink,
                      rules: [
                        {
                          required: false,
                          message: (
                            <IntlMessages id="required.visitmanagement.externallink" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        onChange={(event) =>
                          this.setState({ externalLink: event.target.value })
                        }
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.coustodyperiod" />}
                  >
                    {getFieldDecorator("custodyPeriod", {
                      initialValue: this.state.custodyPeriod,
                      rules: [
                        {
                          required: false,
                          message: (
                            <IntlMessages id="required.visitmanagement.coustodyperiod" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ custodyPeriod: `${value}` })
                        }
                      >
                        <Option value="Horas">Horas</Option>
                        <Option value="Dias">Dias</Option>
                        <Option value="Semans">Semans</Option>
                        <Option value="Para siempre">Para siempre</Option>
                        <Option value="Meses">Meses</Option>
                        <Option value="">None</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.periodvalue" />}
                  >
                    {getFieldDecorator("periodValue", {
                      initialValue: this.state.periodValue,
                      rules: [
                        {
                          required: false,
                          message: (
                            <IntlMessages id="required.visitmanagement.periodvalue" />
                          ),
                        },
                      ],
                    })(
                      <InputNumber
                        onChange={(value) =>
                          this.setState({ periodValue: value })
                        }
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormItem>
                </Col>

                <span className="cust-title-step">
                  <IntlMessages id="visitmanagement.vidsignerconfiguration" />
                </span>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visit.copyemail" />}
                  >
                    {getFieldDecorator("copyEmail", {
                      initialValue: this.state.copyEmail,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visit.copyemail" />
                          ),
                        },
                      ],
                    })(
                      <Radio.Group
                        defaultValue={this.state.radioValue}
                        onChange={(event) =>
                          this.setState({
                            copyEmail: event.target.value,
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
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.emaillist" />}
                  >
                    {getFieldDecorator("emailList", {
                      initialValue: this.state.emailList,
                      rules: [
                        {
                          required: false,
                          message: (
                            <IntlMessages id="required.visitmanagement.emaillist" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({ emailList: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.fontfamily" />}
                  >
                    {getFieldDecorator("fontFamily", {
                      initialValue: this.state.fontFamily,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.fontfamily" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        onChange={(event) =>
                          this.setState({
                            fontFamily: event.target.value,
                          })
                        }
                        margin="none"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.fontsize" />}
                  >
                    {getFieldDecorator("fontSize", {
                      initialValue: this.state.fontSize,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.fontsize" />
                          ),
                        },
                      ],
                    })(
                      <InputNumber
                        onChange={(value) =>
                          this.setState({
                            fontSize: value,
                          })
                        }
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormItem>
                </Col>
                <span className="cust-title-step">
                  <IntlMessages id="visitmanagement.smsconfiguration" />
                </span>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="visitmanagement.smsalert" />}
                  >
                    {getFieldDecorator("smsAlert", {
                      initialValue: this.state.smsAlert,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.smsalert" />
                          ),
                        },
                      ],
                    })(
                      <Radio.Group
                        defaultValue={this.state.radioValue}
                        onChange={(event) =>
                          this.setState({
                            smsAlert: event.target.value,
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
                    )}
                  </FormItem>
                </Col>

                {this.state.smsAlert === true && (
                  <>
                    {" "}
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="visitmanagement.smsprocess" />}
                      >
                        {getFieldDecorator("smsProcess", {
                          initialValue: this.state.smsProcess,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.visitmanagement.smsprocess" />
                              ),
                            },
                          ],
                        })(
                          <Select
                            onChange={(value, event) =>
                              this.setState({ smsProcess: `${value}` })
                            }
                          >
                            <Option value="On Complition">On Complition</Option>
                            <Option value="On Rejection">On Rejection</Option>
                            <Option value="On Each Step">On Each Step</Option>
                            <Option value="None">None</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="visitmanagement.smstext" />}
                      >
                        {getFieldDecorator("smsText", {
                          initialValue: this.state.smsText,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.visitmanagement.smstext" />
                              ),
                            },
                          ],
                        })(
                          <Input
                            required
                            onChange={(event) =>
                              this.setState({ smsText: event.target.value })
                            }
                            margin="none"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col lg={24} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={<IntlMessages id="visitmanagement.senderlist" />}
                      >
                        {getFieldDecorator("senderList", {
                          initialValue: this.state.senderList,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.visitmanagement.senderlist" />
                              ),
                            },
                          ],
                        })(
                          <Input
                            required
                            onChange={(event) =>
                              this.setState({ senderList: event.target.value })
                            }
                            margin="none"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          </div>
        ),
      },

      {
        content: (
          <div className="second-content gx-mt-4">
            <Card className="ant-card gx-card ant-card-bordered">
              <Row>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayoutNew}
                    label={<IntlMessages id="visitmanagement.selectTemplate" />}
                  >
                    {getFieldDecorator("selectTemplate", {
                      initialValue: this.state.selectTemplate,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.selectTemplate" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ selectTemplate: `${value}` })
                        }
                      >
                        {items != null &&
                          items.map((item) => {
                            return (
                              <Option value={item}>Tamplate {item}</Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayoutNew}
                    label={<IntlMessages id="visitmanagement.selectSignNo" />}
                  >
                    {getFieldDecorator("selectSignNo", {
                      initialValue: this.state.selectSignNo,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.selectSignNo" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ selectSignNo: `${value}` })
                        }
                      >
                        {signNoList != null &&
                          signNoList.map((item) => {
                            return <Option value={item}>Signer {item}</Option>;
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayoutNew}
                    label={
                      <>
                        <IntlMessages id="visitmanagement.pagenumber" />
                      </>
                    }
                  >
                    {getFieldDecorator("pageNo", {
                      initialValue: this.state.pageNo,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.pagenumber" />
                          ),
                        },
                      ],
                    })(
                      <InputNumber
                        onChange={(value) => this.setState({ pageNo: value })}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <Row className="sign_type sign_position">
                    <Col lg={7} xs={24}>
                      <h5 className="form-map-title">
                        <span className="cust-mandatory-asterik">*</span>
                        <IntlMessages id="procedures.signPosition" /> :
                      </h5>
                    </Col>
                    <Col lg={16} xs={24}>
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
                                        this.state.positionX !== ""
                                          ? false
                                          : true,
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
                                        this.state.positionY !== ""
                                          ? false
                                          : true,
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
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col lg={7} xs={12}></Col>
                <Col lg={16} xs={24}>
                  <div>
                    <Button
                      onClick={this.addSignerData}
                      className="gx-mb-0 add-role-btn"
                      type="primary"
                    >
                      <i className="icon icon-add"></i>
                      <IntlMessages id="global.add" />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card
              className="ant-card gx-card ant-card-bordered table-signer"
              title={<IntlMessages id="visitmanagement.signerList" />}
            >
              <Table
                rowKey="Id"
                className="gx-table-responsive procedure_table"
                columns={columns}
                dataSource={this.state.signerData}
                size="middle"
                // scroll={{ x: 1100, y: 300 }}
                scroll={{ x: true }}
              />
            </Card>
          </div>
        ),
      },

      {
        content: (
          <div className="third-content gx-mt-4">
            <Card className="ant-card gx-card ant-card-bordered">
              <Row>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayoutNew}
                    label={<IntlMessages id="visitmanagement.name" />}
                  >
                    {getFieldDecorator("name", {
                      initialValue: this.state.name,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.name" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        onChange={(event) =>
                          this.setState({ name: event.target.value })
                        }
                      />
                    )}
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayoutNew}
                    label={<IntlMessages id="visitmanagement.type" />}
                  >
                    {getFieldDecorator("fieldType", {
                      initialValue: this.state.fieldType,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.Type" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ fieldType: `${value}` })
                        }
                      >
                        <Option value="TextBox">Text Box</Option>
                        <Option value="TextArea">Text Area</Option>
                        <Option value="ComboBox">Combo Box</Option>
                        <Option value="FileUpload">File Upload</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                {this.state.fieldType === "ComboBox" && (
                  <Col lg={24} xs={24}>
                    <FormItem
                      {...formItemLayoutNew}
                      label={<IntlMessages id="visitmanagement.value" />}
                    >
                      {getFieldDecorator("fieldVal", {
                        initialValue: this.state.fieldVal,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.visitmanagement.value" />
                            ),
                          },
                        ],
                      })(
                        <Input
                          onChange={(event) =>
                            this.setState({ fieldVal: event.target.value })
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                )}

                <Col lg={7} xs={12}></Col>
                <Col lg={16} xs={24}>
                  <div>
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
                        onClick={this.addFieldData}
                        className="gx-mb-0 add-role-btn"
                        type="primary"
                      >
                        <IntlMessages id="global.add" />
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
            <Card
              className="ant-card gx-card ant-card-bordered table-signer"
              title={<IntlMessages id="visitmanagement.fieldLog" />}
            >
              <Table
                rowKey="Id"
                className="gx-table-responsive procedure_table"
                columns={customColumns}
                dataSource={this.state.fieldLogData}
                size="middle"
                // scroll={{ x: 1100, y: 300 }}
                scroll={{ x: true }}
              />
            </Card>
          </div>
        ),
      },

      {
        content: (
          <div className="third-content gx-mt-4">
            {/* <Row>
              <Col lg={16} xs={24}>
                <FormItem
                  {...formItemLayoutNew}
                  label={<IntlMessages id="visitmanagement.selectTemplate" />}
                >
                  {getFieldDecorator("selectTemplae", {
                    initialValue: this.state.selectTemplate,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages id="required.visitmanagement.selectTemplate" />
                        ),
                      },
                    ],
                  })(
                    <Select
                      onChange={(value, event) =>
                        this.setState({ selectTemplate: `${value}` })
                      }
                    >
                      {items != null &&
                        items.map((item) => {
                          return <Option value={item}>{item}</Option>;
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row> */}
            <Row>
              <Col lg={16} xs={24}>
                {items != null &&
                  items.map((item, i) => (
                    <Row>
                      <Col lg={7} xs={24}>
                        <label>
                          <h3 style={{ fontWeight: "700", paddingTop: "6px" }}>
                            <IntlMessages id="assignment.uploadTemplate" />
                            {item} :
                          </h3>
                        </label>
                      </Col>
                      <Col
                        lg={17}
                        xs={24}
                        className="col-upload"
                        style={{
                          padding: "0px 0 0 0px",
                          marginBottom: "0px",
                          marginTop: "0px",
                        }}
                      >
                        <FormItem
                          // className="cust-center-upload"
                          {...formItemLayoutNew}
                          style={{ marginBottom: "0px", marginTop: "0px" }}
                        >
                          {
                            getFieldDecorator("UploadDoc", {
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
                                maxCount={1}
                                showUploadList={true}
                                style={{
                                  marginBottom: "0px",
                                  marginTop: "0px",
                                }}
                              >
                                <Button>
                                  <Icon type="upload" />
                                  <IntlMessages id="bulksignature.ClicktoUpload" />
                                </Button>
                              </Upload>
                            )

                            // <Upload.Dragger accept=".doc,.docx" name="files" {...uploadDoc} multiple={false} showUploadList={true}>
                            //   <p className="ant-upload-drag-icon">
                            //     <Icon type="inbox"/>
                            //   </p>
                            //   <p className="ant-upload-hint" style={{padding: '0px 10px 0px 10px'}}><IntlMessages id="administrative.dragfile"/></p>
                            // </Upload.Dragger>
                          }
                          {/* <span style={{padding: '9px 5px 0 0'}}>
                    <center><a href="https://www.motumlabs.com/Motum/veolia-template/CountryExcel.xlsx" className="arrow-btn gx-link"><IntlMessages id="excelDownload.download"/></a></center>
                  </span> */}
                        </FormItem>
                        {/* </div> */}

                        {/* {this.state.editProcedure ? (
                        <center>
                          <DocViewer
                            pluginRenderers={DocViewerRenderers}
                            documents={docs}
                            className="my-doc-viewer-style"
                            config={{ header: { disableFileName: true } }}
                          />
                        </center>
                      ) : null} */}
                      </Col>
                    </Row>
                  ))}
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

              <Col lg={6} xs={24} className="cust-sidebar-editor">
                <h3 style={{ fontWeight: "700" }}>
                  <IntlMessages id="visitmanagement.tags" /> :
                </h3>
                <Tag>[VAR_DNI]</Tag>
                <Tag>[VAR_HoraVisita]</Tag>
                <Tag>[VAR_IDIdentidadVis]</Tag>
                <Tag>[VAR_FechaVisita]</Tag>
                <Tag>[VAR_IDVisita]</Tag>
                <Tag>[VAR_ReceptorVis]</Tag>
                <Tag>[VAR_HoraFinVisita]</Tag>
                <Tag>[VAR_TipoDocumento]</Tag>
                <Tag>[VAR_CreadaPor]</Tag>
                <Tag>[VAR_FechaCreaciónVis]</Tag>
                <Tag>[VAR_Receptor]</Tag>
                <Tag>[VAR_FechaVisita_dia]</Tag>
                <Tag>[VAR_FechaVisita_mes]</Tag>
                <Tag>[VAR_FechaVisita_año]</Tag>
                <Tag>[VAR_FechaVisita_fecha]</Tag>
                <Tag>[VAR_IDIdentidad]</Tag>
                <Tag>[VAR_NombreID]</Tag>
                <Tag>[VAR_Apellido1ID]</Tag>
                <Tag>[VAR_Apellido2ID]</Tag>
                <Tag>[VAR_Mail]</Tag>
                <Tag>[VAR_IDEmpresa]</Tag>
                <Tag>[VAR_IDTelefono]</Tag>
                <Tag>[VAR_IDMovil]</Tag>
                <Tag>[VAR_IDFechaRegistro]</Tag>
                <Tag>[VAR_IDNCIS]</Tag>
                <Tag>[VAR_IDCreadaPor]</Tag>
                <Tag>[VAR_IDisActiva]</Tag>
                <Tag>[VAR_IDGDPR]</Tag>
                <Tag>[VAR_IDEmpleado]</Tag>
                <Tag>[VAR_IDListaDocs]</Tag>
                {dynamicTagData.length > 0
                  ? dynamicTagData.map((item) => {
                      return <Tag key={item}>[{item}]</Tag>;
                    })
                  : ""}
              </Col>
            </Row>
          </div>
        ),
      },

      {
        content: (
          <div className="third-content gx-mt-4">
            <Card className="ant-card gx-card ant-card-bordered">
              <Row>
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayoutNew}
                    label={
                      <IntlMessages id="visitmanagement.selectProcedure" />
                    }
                  >
                    {getFieldDecorator("procedureSelect", {
                      initialValue: this.state.prodcedureSelect,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.visitmanagement.selectProcedure" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        mode="multiple"
                        allowClear
                        onChange={(value, event) =>
                          this.setState({ prodcedureSelect: `${value}` })
                        }
                      >
                        {this.props.getProcessList != null &&
                          this.props.getProcessList.map((item) => {
                            return (
                              <Option value={item.ProcedureName}>
                                {item.ProcedureName}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            {/* <Card
              className="ant-card gx-card ant-card-bordered table-signer"
              title="Signer List"
            >
              <Table
                rowKey="Id"
                className="gx-table-responsive procedure_table"
                columns={columns}
                dataSource={this.state.signerData}
                size="middle"
              />
            </Card> */}
          </div>
        ),
      },
    ];

    const { current } = this.state;
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
              {/* {this.state.current === 0 ? (
                <IntlMessages id="visitmanagement.addProcessConfig" />
              ) : (
                this.state.current === 1 && <IntlMessages id="column.surname" />
              )} */}

              {this.state.editProcedure ? (
                this.state.current === 0 ? (
                  <IntlMessages id="visitmanagement.editProcessConfig" />
                ) : this.state.current === 1 ? (
                  <IntlMessages id="visitmanagement.editvidsignerConfig" />
                ) : this.state.current === 2 ? (
                  <IntlMessages id="visitmanagement.editcustomfield" />
                ) : this.state.current === 3 ? (
                  <IntlMessages id="visitmanagement.editdocumenttemplete" />
                ) : (
                  <IntlMessages id="visitmanagement.editdependentprocedure" />
                )
              ) : this.state.current === 0 ? (
                <IntlMessages id="visitmanagement.addProcessConfig" />
              ) : this.state.current === 1 ? (
                <IntlMessages id="visitmanagement.vidsignerConfig" />
              ) : this.state.current === 2 ? (
                <IntlMessages id="visitmanagement.customfield" />
              ) : this.state.current === 3 ? (
                <IntlMessages id="visitmanagement.documenttemplete" />
              ) : (
                <IntlMessages id="visitmanagement.dependentprocedure" />
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

        <Modal
          className=""
          title={<IntlMessages id="fieldDelete.title" />}
          visible={this.state.fieldDeleteModal}
          destroyOnClose={true}
          onCancel={() => this.cancelDeleteField()}
          onOk={() => this.confirmDeleteField()}
          okText={<IntlMessages id="button.delete" />}
          cancelText={<IntlMessages id="globalButton.cancel" />}
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <div className="mail-successbox">
                <h3 className="err-text">
                  <IntlMessages id="fieldDelete.message" />
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
  // getDeviceData,
  // saveProcedureData,
  // updateProcedureData,
  // getDropDownData,
  getGeneralSettings,
  getVisitProcedure,
  addProcessData,
  updateProcessData,
  clearData,
  setStatusToInitial,
};

const addVisitProcedureForm = Form.create()(AddVisitProcedure);

const mapStateToProps = (state) => {
  return {
    DropDownData: state.departmentReducers.get_dropdown_res,
    moreAppFormData: state.businessProceduresReducers.get_formdata_res,
    showErrorMsg: state.businessProceduresReducers.get_formdata_status,
    deviceData: state.businessProceduresReducers.get_device_res,
    loader: state.visitProcedureReducers.loader,
    processDropDownList: state.processReducers.get_process_dropdown,
    getProcessDataList: state.processReducers.get_process_res,
    getProcessList: state.visitProcedureReducers.selectProcedure.procedureData,
    getProcedureById:
      state.visitProcedureReducers.procedureById.procedureconfigByID,
    generalSettingsData:
      state.generalSettingsReducers.getGeneralData.generalData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(addVisitProcedureForm));
