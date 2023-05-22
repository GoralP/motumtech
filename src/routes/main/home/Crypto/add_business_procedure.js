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
} from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { webURL, branchName } from "../../../../util/config";

import IntlMessages from "util/IntlMessages";

import {
  getVisitProcedure,
  addProcessData,
  clearData,
  updateProcessData,
  setStatusToInitial,
} from "../../../../appRedux/actions/VisitProcedureAction";
import {
  open_selidentity_modal,
  close_selidentity_modal,
} from "./../../../../appRedux/actions/SelidentitiesActions";
import { close_bulksignature_modal } from "./../../../../appRedux/actions/IdentitiesActions";
import CircularProgress from "../../../../components/CircularProgress/index";
import SelectParticipant from "./selectparticipant";

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

var licenseId = "";
var deviceId = "";
let langName = "";
// var pdfURL = null;

class AddBusinessProcedure extends Component {
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
      status: "",
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

      positionX: "",
      positionY: "",
      widthX: "",
      widthY: "",
      pageNo: "",

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
      addDocumentsState: false,
      addBulkSignatureState: false,
      SelectedList: [],
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
        ],
        (err, values) => {
          if (!err) {
            const current = this.state.current + 1;

            this.setState({ current });
          }
        }
      );
    } else if (this.state.current === 1) {
      const current = this.state.current + 1;
      this.setState({ current });
      // this.props.form.validateFieldsAndScroll(
      //   ["pageNo", "positionX", "positionY", "widthX", "widthY"],
      //   (err, values) => {
      //     if (!err) {
      //       const current = this.state.current + 1;
      //       this.setState({ current });
      //     }
      //   }
      // );
    } else if (this.state.current === 2) {
      const current = this.state.current + 1;
      this.setState({ current });
      dynamicTagData = [];
      if (this.state.fieldLogData.length !== 0) {
        this.state.fieldLogData.map((item) => {
          if (item.Name !== undefined && item.Name !== null) {
            dynamicTagData.push(item.Name);
          }
        });
      }

      // this.props.form.validateFieldsAndScroll(
      //   ["name", "fieldType"],
      //   (err, values) => {
      //     if (!err) {
      //       dynamicTagData = [];
      //       if (this.state.fieldLogData.length !== 0) {
      //         this.state.fieldLogData.map((item) => {
      //           if (item.Name !== undefined && item.Name !== null) {
      //             dynamicTagData.push(item.Name);
      //           }
      //         });

      //         const current = this.state.current + 1;
      //         this.setState({ current });
      //       }
      //     }
      //   }
      // );
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
  };

  handleGoBack = () => {
    this.props.history.push({
      pathname: "/" + webURL + "main/home/visit_procedure_management",
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
              Id: newSignerData.length + 1,
              ParticipateNo: "Participate " + participateId,

              page: this.state.pageNo,
              doc_sig_posX: this.state.positionX,
              doc_sig_posY: this.state.positionY,
              doc_sig_sizeX: this.state.widthX,
              doc_sig_sizeY: this.state.widthY,
              licenseId: licenseId,
              deviceId: deviceId,
            });
          }
          this.setState({
            signerData: newSignerData,
            participateNo: "",
            pageNo: "",

            positionX: "",
            positionY: "",
            widthX: "",
            widthY: "",
          });
          this.props.form.setFieldsValue({
            participateNo: "",
            pageNo: "",

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
          tagGenerate = "VAR_" + replaced;

          newfieldLogData.push({
            Id: newfieldLogData.length + 1,
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
      console.log("id-->", d.Id);
      console.log("id111-->", this.state.editId);
      if (d.Id === this.state.editId) {
        return {
          Id: d.Id,
          Name: tagGenerate,
          DisplayName: this.state.name,
          Type: this.state.fieldType,
          DefaultValue:
            this.state.fieldType == "TextBox" ||
            this.state.fieldType == "TextArea"
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
      return singleField.Id === a_id;
    });
    this.setState({ editId: fieldData.Id });

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

  confirmDeleteField = () => {
    var deleteFieldData = this.state.fieldLogData;
    if (deleteFieldData.length > 0) {
      var fieldLength = deleteFieldData.length;
      var fieldArr = deleteFieldData.findIndex((singleField) => {
        return singleField.Id === this.state.customFieldId;
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

  handleSaveProcedureData = (e) => {
    e.preventDefault();

    var procedureData = {
      Id: this.state.editProcedure ? this.state.procedureId : 0,
      procedureName: this.state.processName,
      doc_type: this.state.processType,
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

    const procedureDataForm = new FormData();
    procedureDataForm.append("Procedure", JSON.stringify(procedureData));
    if (Object.entries(this.state.uploadfile).length !== 0) {
      procedureDataForm.append("ProcedureTemplate", this.state.uploadfile);
    }

    // console.log("procedure data2222----->", procedureData);
    if (this.state.editProcedure) {
      this.props.updateProcessData(procedureDataForm);
    } else {
      this.props.addProcessData(procedureDataForm);
    }
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

  render() {
    var { addIdentityState, addDocumentsState, addBulkSignatureState } =
      this.state;

    if (this.props.modalclosecall) {
      addIdentityState = false;
    }
    var docs = "";

    precessConfigById = this.props.getProcedureById;

    if (precessConfigById !== null) {
      // var url = precessConfigById.doc_template;
      // var filename = url.substring(url.lastIndexOf("\\") + 1);
      // console.log("1231----->", filename);
      var participateId = precessConfigById.ProcedureConfigDTO.length + 1;
      console.log("participat--->", participateId);

      this.setState({
        procedureId: precessConfigById.id,
        processName: precessConfigById.procedureName,
        processType: precessConfigById.doc_type,
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
      var docStartURL = docURL.replace(
        "C:\\inetpub\\wwwroot\\MotumStag\\",
        "https://www.motumlabs.com/"
      );
      var docMiddleURL = docStartURL.replaceAll("\\", "/");
      var docFinalURL = docMiddleURL.replaceAll(/ /g, "%20");
      docs = [{ uri: docFinalURL }];
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
        title: <IntlMessages id="businessProcedure.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="businessProcedure.dni" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },

      {
        title: <IntlMessages id="businessProcedure.mobileno" />,
        dataIndex: "MobileNumber",
        key: "MobileNumber",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="businessProcedure.email" />,
        dataIndex: "Email",
        key: "Email",
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
                      onClick={() => this.onDeleteSigner(record.Id)}
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
                      onClick={() => this.onDeleteFieldLog(record.Id)}
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
                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <IntlMessages id="businessProcedure.nameOfProcedure" />
                    }
                  >
                    {getFieldDecorator("processName", {
                      initialValue: this.state.processName,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.businessProcedure.nameOfProcedure" />
                          ),
                        },
                      ],
                    })(
                      <Input
                        required
                        style={{
                          width: 686,
                          marginRight: "10px",
                        }}
                        onChange={(event) =>
                          this.setState({ processName: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                    <Button
                      type="primary"
                      style={{ width: "190px", marginTop: "10px" }}
                      onClick={this.onAddDocuments}
                    >
                      Select Participant
                    </Button>
                  </FormItem>
                </Col>

                <Col lg={24} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={<IntlMessages id="procedureManagement.status" />}
                  >
                    {getFieldDecorator("status", {
                      initialValue: this.state.status,
                      rules: [
                        {
                          required: true,
                          message: (
                            <IntlMessages id="required.procedureManagement.status" />
                          ),
                        },
                      ],
                    })(
                      <Select
                        onChange={(value, event) =>
                          this.setState({ status: `${value}` })
                        }
                      >
                        <Option value="VISIT">VISIT</Option>
                        <Option value="GENERAL">GENERAL</Option>
                        <Option value="GENERALV2">GENERALV2</Option>
                        <Option value="EXPEDIENT">EXPEDIENT</Option>
                        <Option value="INSPECTION">INSPECTION</Option>
                        <Option value="MOREAPP">MOREAPP</Option>
                        <Option value="MOREAPPV2">MOREAPPV2</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <span className="cust-title-step">
                  <IntlMessages id="businessProcedure.participant" />
                </span>

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

            <Table
              rowKey="Id"
              className="gx-table-responsive procedure_table"
              columns={columns}
              dataSource={this.state.SelectedList}
              size="middle"
            />
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
              />
            </Card>
          </div>
        ),
      },

      {
        content: (
          <div className="third-content gx-mt-4">
            <Row>
              <Col lg={6} xs={24}>
                <label>
                  <h3 style={{ fontWeight: "700", paddingTop: "17px" }}>
                    <IntlMessages id="assignment.upload" /> :
                  </h3>
                </label>
              </Col>
              <Col
                lg={10}
                xs={24}
                className="col-upload"
                style={{ padding: "10px 0 0 0px" }}
              >
                <FormItem
                  // className="cust-center-upload"
                  {...formItemLayoutNew}
                >
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
                <Tag>[VVAR_IDEmpleado]</Tag>
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

              {this.state.procedureId !== "" ? (
                <IntlMessages id="procedureEdit.editBusinessProcedure" />
              ) : (
                <IntlMessages id="sidebar.businessProcedureManagement" />
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

        <SelectParticipant
          open={addDocumentsState}
          onAddBulkSignature={this.onAddBulkSignature}
          identity_data={this.props.getSelidentitiesData}
          onDocumentsClose={this.onDocumentsClose}
        />

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
  getVisitProcedure,
  addProcessData,
  updateProcessData,
  clearData,
  setStatusToInitial,
  open_selidentity_modal,
  close_selidentity_modal,
  close_bulksignature_modal,
};

const addBusinessProcedureForm = Form.create()(AddBusinessProcedure);

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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(addBusinessProcedureForm));
