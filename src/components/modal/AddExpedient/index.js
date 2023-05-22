import React from "react";
import {
  Row,
  Col,
  Input,
  Modal,
  Select,
  Radio,
  TimePicker,
  message,
  Upload,
  Button,
  Form,
  Card,
  DatePicker,
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import {
  get_expedients,
  get_expedient_form,
  open_expedient_modal,
  close_expedient_modal,
} from "./../../../appRedux/actions/ExpedientsActions";
import { baseURL, branchName } from "./../../../util/config";
import IdentityList from "./../../../routes/main/home/Crypto/identitylist";
import IntlMessages from "util/IntlMessages";
import { FormattedMessage, injectIntl } from "react-intl";
import DayPicker, { DateUtils } from "react-day-picker";
import { Multiselect } from "multiselect-react-dropdown";
import "react-day-picker/lib/style.css";

var expedient_value = "";
var expedient_form_control = {};
let userId = "";
let langName = "";
var dateArray = [];
var datetimeArray = [];
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const plainOptions = [
  { label: <IntlMessages id="addexpedient.optionyes" />, value: "yes" },
  { label: <IntlMessages id="addexpedient.optionno" />, value: "no" },
];

// function buildFormData(formData, data, parentKey) {
//   if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
//     Object.keys(data).forEach(key => {
//       buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
//     });
//   } else {
//     const value = data == null ? '' : data;

//     formData.append(parentKey, value);
//   }
// }

class AddExpedient extends React.Component {
  constructor(props) {
    super(props);

    const { id, dni, sanidad, dni2, dni3, dni4, name } = props.contact;

    this.handleDayClick = this.handleDayClick.bind(this);

    this.state = {
      id,
      dni,
      sanidad,
      dni2,
      dni3,
      dni4,
      name,
      changed_expedient_value: "",
      formData: "",
      expedientForm: "",
      uploadfile: [],
      uploadfilemember: [],
      signatureRequired: false,
      expedientData: "",
      stateFrequenceType: "",
      stateFrequenceEvery: "",
      selectedDays: [],
      addOwnerParticipantState: false,
      status_owner: true,
      status_participant: true,
      frequency_value: "Default",
      frequency_type: "Daily",
      options: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednessday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      startRange: "",
      endRange: "",
      ExpedientName: "",
      signRequireForClosingExpedient: "",
      signtypeownerChange: "",
      docgenrationType: "",
      MaxParticipate: 0,
      OwnerList: [],
      ParticipantList: [],
      showtime: false,
      timestring: "",
    };
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays }, () => {
      dateArray = [];
      datetimeArray = [];
      selectedDays.forEach((key) => {
        if (this.state.timeString !== "") {
          dateArray.push(this.formatDate(key));
          datetimeArray.push(
            this.formatDate(key) + " " + this.state.timeString
          );
        } else {
          dateArray.push(this.formatDate(key));
        }
      });
      this.setState({});
    });
  }

  get_expedientFormFunction() {
    this.props.get_expedient_form();
  }

  componentDidMount() {
    this.get_expedientFormFunction();
    //this.props.get_identities({'pageNumber': 1, sortBy : '-id', 'perPage' : '10', 'filterTag' : '', 'searchTerm' : ''});
  }
  handlesignatureChange = (value) => {
    // var selected_value = `${value}`;
    this.setState({ signRequireForClosingExpedient: value });
  };
  handletypeownerChange = (value) => {
    // var selected_value = `${value}`;
    this.setState({ signtypeownerChange: value });
  };
  docgenrationTypechange = (value) => {
    this.setState({ docgenrationType: value });
  };
  handleSaveExpedientData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(["DNI"], (err, values) => {
      if (!err) {
        if (expedient_value === "") {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error(
            this.props.intl.formatMessage({ id: "addExpedient.ExpedientType" })
          );
          return false;
        }

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

        var submitExpedientFormData = {
          // "DNI": this.state.dni,
          expedientType: expedient_value,
          expedientName: this.state.ExpedientName,
          signRequireForClosingExpedient:
            this.state.signRequireForClosingExpedient,
          signatureTypeOfOwner: this.state.signtypeownerChange,
          docgenrationType: this.state.docgenrationType,
          ownerDNI: this.state.OwnerList,
          participantDNI: this.state.ParticipantList,
          frequencyType: this.state.frequency_value,
          customDates: datetimeArray,
          licenseId: userId,
          FormControls: expedient_form_control,
        };
        const expedientDataForm = new FormData();
        expedientDataForm.append(
          "ExpedientDetail",
          JSON.stringify(submitExpedientFormData)
        );
        if (Object.entries(this.state.uploadfile).length !== 0) {
          expedientDataForm.append("DocOwners", this.state.uploadfile);
        }
        if (Object.entries(this.state.uploadfilemember).length !== 0) {
          expedientDataForm.append(
            "DocParticipants",
            this.state.uploadfilemember
          );
        }
        // else {
        //   message.destroy()
        //   message.config({
        //     maxCount: 1,
        //   });
        //   message.error('Please upload participant file.');
        //   return false;
        // }
        if (
          Object.entries(this.state.uploadfile).length === 0 &&
          this.state.OwnerList.length === 0
        ) {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error(
            this.props.intl.formatMessage({ id: "addExpedient.SelectOwner" })
          );
          this.setState({ calldone: false });
          return false;
        }
        if (
          Object.entries(this.state.uploadfilemember).length === 0 &&
          this.state.ParticipantList.length === 0
        ) {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error(
            this.props.intl.formatMessage({
              id: "addExpedient.SelectParticipant",
            })
          );
          this.setState({ calldone: false });
          return false;
        }
        // for (var key of  expedientDataForm.entries()) {
        //     //console.log(key[0] + ', ' + key[1]);
        // }

        var submitUrl = baseURL + "PostCustomExpedient?lang=" + langName;

        let authBasic = "";
        authBasic = localStorage.getItem("setAuthToken");

        const requestOptions = {
          method: "POST",
          headers: {
            //'Content-Type': 'multipart/form-data'
            Authorization: "Basic " + authBasic,
          },
          mimeType: "multipart/form-data",
          body: expedientDataForm,
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
                this.props.close_expedient_modal(1);
                dateArray = [];
                datetimeArray = [];
                this.setState({
                  dni: "",
                  expedientData: "",
                  signatureRequired: false,
                  ExpedientName: "",
                  signRequireForClosingExpedient: "",
                  signtypeownerChange: "",
                  docgenrationType: "",
                  OwnerList: [],
                  ParticipantList: [],
                  frequency_type: "",
                });
                expedient_form_control = {};
                this.get_expedientsById();
              } else {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                message.error(response_message);
              }
            } else {
              message.destroy();
              message.config({
                maxCount: 1,
              });
              message.error(
                this.props.intl.formatMessage({ id: "global.TryAgain" })
              );
            }
          });
      }
    });
  };

  get_expedientsById(
    pageNumber = "",
    sortBy = "",
    status = "",
    perPage = "10"
  ) {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && sortBy === "" && status !== "" && perPage !== "")
    ) {
      this.props.get_expedients({
        pageNumber: 1,
        sortBy: "+VisitId",
        status: status,
        perPage: perPage,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      this.props.get_expedients({
        pageNumber: pageNumber,
        sortBy: sortBy,
        status: status,
        perPage: perPage,
      });
    }
  }

  handleExpedientFormData = (e) => {
    var id = e.target.getAttribute("boxid");
    var value = e.target.value;
    expedient_form_control = expedient_form_control.map(
      (singleObjectValue, key) => {
        if (singleObjectValue.id === id) {
          singleObjectValue.UserValue = value;
        } else {
          singleObjectValue = singleObjectValue;
        }
        return singleObjectValue;
      }
    );
  };

  handleExpedientFormSelectBoxData = (
    value,
    id,
    signatureRequiredValue = ""
  ) => {
    expedient_form_control = expedient_form_control.map(
      (singleObjectValue, key) => {
        if (singleObjectValue.id === id) {
          if (
            signatureRequiredValue === "signatureRequiredYes" &&
            value === "No"
          ) {
            this.setState({ signatureRequired: true }, () =>
              console.log(
                "expedientFormData 4=> ",
                this.state.signatureRequired
              )
            );
          } else if (
            signatureRequiredValue === "signatureRequiredYes" &&
            value === "Yes"
          ) {
            this.setState({ signatureRequired: false }, () =>
              console.log(
                "expedientFormData 5=> ",
                this.state.signatureRequired
              )
            );
          }
          //if(showHideNextDropdown)
          singleObjectValue.UserValue = value;
        } else {
          singleObjectValue = singleObjectValue;
        }
        return singleObjectValue;
      }
    );
  };

  nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  handleExpedientChange = (value) => {
    expedient_value = `${value}`;
    const expedientData = this.props.get_expedientFormData.find(
      (singleExpedient) => {
        return singleExpedient.Id == expedient_value;
      }
    );
    expedient_form_control = expedientData.FormControls;
    const date = new Date();
    const date1 = date.getDate();
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const [{ value: month }, , { value: day }, , { value: year }] =
      dateTimeFormat.formatToParts(date);

    this.setState(
      {
        expedientData,
        MaxParticipate: expedientData.docParticipants,
        ExpedientName:
          expedientData.expedientName +
          " " +
          day +
          this.nth(date1) +
          " " +
          month +
          " " +
          year,
      },
      () => console.log("expedientFormData 10=> ", this.state.expedientData)
    );
  };

  componentDidUpdate() {
    if (this.props.expedientmodalclosecall === 1) {
      dateArray = [];
      datetimeArray = [];
      this.setState({
        dni: "",
        expedientData: "",
        signatureRequired: false,
        ExpedientName: "",
        signRequireForClosingExpedient: "",
        signtypeownerChange: "",
        docgenrationType: "",
        OwnerList: [],
        ParticipantList: [],
        frequency_type: "",
        frequency_value: "Default",
      });
      expedient_form_control = {};
      this.props.close_expedient_modal(2);
    }
  }

  onAddOwnerParticipant = () => {
    this.setState({ addOwnerParticipantState: true });
  };
  removeparticipatefile = () => {
    this.setState({ uploadfilemember: [], status_participant: true });
  };
  removeownerfile = () => {
    this.setState({ uploadfile: [], status_owner: true });
  };
  onAddParticipant = () => {
    this.setState({ addParticipantState: true });
  };
  onOwnerParticipantClose = () => {
    this.setState({ addOwnerParticipantState: false });
  };
  onAddParticipantClose = () => {
    this.setState({ addParticipantState: false });
  };
  onSaveOwnerParticipant = (Listmember) => {
    this.setState({
      addOwnerParticipantState: false,
      OwnerList: Listmember,
      uploadfile: [],
    });
  };
  onSaveParticipant = (Listmember) => {
    if (this.state.MaxParticipate === Listmember.length) {
      this.setState({
        addParticipantState: false,
        ParticipantList: Listmember,
        uploadfilemember: [],
      });
    } else {
      message.error(
        this.props.intl.formatMessage({ id: "addExpedient.Select" }) +
          this.state.MaxParticipate +
          this.props.intl.formatMessage({ id: "addExpedient.Participate" })
      );
    }
  };

  ShowHideOwnerButton = () => {
    if (this.state.status_owner === true) {
      this.setState({ status_owner: false });
    }
  };

  ShowHideParticipantButton = () => {
    if (this.state.status_participant === true) {
      this.setState({ status_participant: false });
    }
  };

  handleFrequencyChange = (value) => {
    var selected_value = `${value}`;
    this.setState({ frequency_value: selected_value });
  };

  handleFrequencyTypeChange = (value) => {
    var selected_type = `${value}`;
    this.setState({ frequency_type: selected_type });
  };
  formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };
  handleWeekdates = (values) => {
    var indexvalues = [];
    if (values.includes("Sunday")) {
      indexvalues.push(0);
    }
    if (values.includes("Monday")) {
      indexvalues.push(1);
    }
    if (values.includes("Tuesday")) {
      indexvalues.push(2);
    }
    if (values.includes("Wednessday")) {
      indexvalues.push(3);
    }
    if (values.includes("Thursday")) {
      indexvalues.push(4);
    }
    if (values.includes("Friday")) {
      indexvalues.push(5);
    }
    if (values.includes("Saturday")) {
      indexvalues.push(6);
    }
    var currentDate = this.state.startRange;
    var endDate = this.state.endRange;
    var numberofdays = 86400000;
    dateArray = [];
    datetimeArray = [];
    while (currentDate.getTime() <= endDate.getTime()) {
      if (indexvalues.includes(currentDate.getDay())) {
        if (this.state.timeString !== "") {
          dateArray.push(this.formatDate(currentDate));
          datetimeArray.push(
            this.formatDate(currentDate) + " " + this.state.timeString
          );
        } else {
          dateArray.push(this.formatDate(currentDate));
        }
      }
      currentDate = new Date(currentDate.getTime() + numberofdays);
    }
  };

  handleautoselect = (e) => {
    if (e.target.value === "yes") {
      this.setState({ showtime: true });
    } else {
      this.setState({ showtime: false });
      this.timechangehandle({}, "00:00:00 AM");
    }
  };
  timechangehandle = (e, timeString) => {
    datetimeArray = [];
    dateArray.forEach((singledate) => {
      datetimeArray.push(singledate + " " + timeString);
    });
    this.setState({ timeString: timeString });
  };

  handleDailydates = (e) => {
    var currentDate = this.state.startRange;
    var endDate = this.state.endRange;
    var days = e.target.value;
    var numberofdays = days * 86400000;
    dateArray = [];
    datetimeArray = [];
    while (currentDate.getTime() <= endDate.getTime()) {
      if (this.state.timeString !== "") {
        dateArray.push(this.formatDate(currentDate));
        datetimeArray.push(
          this.formatDate(currentDate) + " " + this.state.timeString
        );
      } else {
        dateArray.push(this.formatDate(currentDate));
      }
      currentDate = new Date(currentDate.getTime() + numberofdays);
    }
  };

  disabledDate = (current) => {
    // Can not select days before today
    return moment().add(-1, "days") >= current;
  };

  getStartEndDate = (date, dateString) => {
    var starting_date = dateString[0];
    var ending_date = dateString[1];

    var date_start = new Date(starting_date);
    var s_date = date_start.getDate();
    var s_month = date_start.getMonth() + 1;
    var s_year = date_start.getFullYear();

    var Sdate = s_year + "-" + s_month + "-" + s_date;

    var date_end = new Date(ending_date);
    var e_date = date_end.getDate();
    var e_month = date_end.getMonth() + 1;
    var e_year = date_end.getFullYear();

    var Edate = e_year + "-" + e_month + "-" + e_date;

    this.setState({ startRange: new Date(Sdate) });
    this.setState({ endRange: new Date(Edate) });
  };

  render() {
    const fileuploadprops = {
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
          this.setState((state) => ({
            uploadfile: file,
            status_owner: false,
            OwnerList: [],
          }));
        }
        return false;
      },
    };
    const fileuploadpropsmember = {
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
          this.setState((state) => ({
            uploadfilemember: file,
            status_participant: false,
            ParticipantList: [],
          }));
        }
        return false;
      },
    };

    const Option = Select.Option;
    const { onExpedientClose, open, contact } = this.props;
    const { options, addOwnerParticipantState, addParticipantState } =
      this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        className="cust-exp-modal"
        destroyOnClose={true}
        title={<IntlMessages id="addexpedient.title" />}
        toggle={onExpedientClose}
        visible={open}
        maskClosable={false}
        closable={true}
        okText={<IntlMessages id="additentity.save" />}
        onOk={this.handleSaveExpedientData}
        okButtonProps={{ selected_expedient_value: expedient_value }}
        onCancel={onExpedientClose}
      >
        <Form onSubmit={this.handleSaveExpedientData} preserve={false}>
          <div className="gx-modal-box-row cust-dni add-expidient-cust">
            <div className="gx-modal-box-form-item">
              <div className="gx-form-group">
                <Row>
                  <Col lg={12}>
                    <label>
                      <IntlMessages id="addexpedient.ExpedientType" />
                    </label>
                    <Select
                      className="ant-input"
                      onChange={this.handleExpedientChange}
                      defaultValue={
                        <IntlMessages id="addexpedient.ExpedientType" />
                      }
                      margin="none"
                    >
                      {/* {expedientList} */}
                      {this.props.get_expedientFormData.length &&
                        this.props.get_expedientFormData.map((value, key) => {
                          return (
                            <Option key={key} value={value.Id}>
                              {value.expedientName}
                            </Option>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col lg={12}>
                    <label>
                      <IntlMessages id="addexpedient.ExpedientName" />
                    </label>
                    {getFieldDecorator("Expedient Name", {
                      initialValue: this.state.ExpedientName,
                      rules: [
                        {
                          required: true,
                          message: "Expedient Name is Required.",
                          whitespace: true,
                        },
                      ],
                    })(
                      <Input
                        className="ant-input"
                        // required
                        // placeholder="Expedient Name"
                        onChange={(event) =>
                          this.setState({ ExpedientName: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12}>
                    <FormItem
                      label={<IntlMessages id="addexpedient.UploadOwnerList" />}
                      name="upload"
                    >
                      {getFieldDecorator("Upload Owner List", {
                        initialValue: contact.dni,
                      })(
                        <Upload
                          {...fileuploadprops}
                          showUploadList={false}
                          multiple={false}
                        >
                          <Button>
                            {this.state.uploadfile.length !== 0 ? (
                              <IntlMessages id="addexpedient.FileUploaded" />
                            ) : (
                              <IntlMessages id="addexpedient.ClicktoUpload" />
                            )}
                          </Button>
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12}>
                    <FormItem
                      label={
                        <IntlMessages id="addexpedient.UploadParticipantList" />
                      }
                      name="upload"
                    >
                      {getFieldDecorator("Upload Participant List", {
                        initialValue: contact.dni,
                      })(
                        <Upload
                          {...fileuploadpropsmember}
                          showUploadList={false}
                          multiple={false}
                        >
                          <Button>
                            {this.state.uploadfilemember.length !== 0 ? (
                              <IntlMessages id="addexpedient.FileUploaded" />
                            ) : (
                              <IntlMessages id="addexpedient.ClicktoUpload" />
                            )}
                          </Button>
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12}>
                    {this.state.status_owner === true ? (
                      <Button
                        type="dashed"
                        className="full_width_input"
                        onClick={this.onAddOwnerParticipant}
                      >
                        {this.state.OwnerList.length > 0 ? (
                          <p>
                            {this.state.OwnerList.length}{" "}
                            <IntlMessages id="addexpedient.selected" />
                          </p>
                        ) : (
                          <IntlMessages id="addexpedient.AddOwnerList" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="dashed"
                        className="full_width_input"
                        onClick={this.removeownerfile}
                      >
                        <IntlMessages id="addexpedient.RemoveOwnerFile" />
                      </Button>
                    )}
                  </Col>

                  <Col lg={12}>
                    {this.state.status_participant === true ? (
                      <Button
                        type="dashed"
                        className="full_width_input"
                        onClick={this.onAddParticipant}
                      >
                        {this.state.ParticipantList.length > 0 ? (
                          <p>
                            {this.state.ParticipantList.length}{" "}
                            <IntlMessages id="addexpedient.selected" />
                          </p>
                        ) : (
                          <IntlMessages id="addexpedient.AddParticipantList" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="dashed"
                        className="full_width_input"
                        onClick={this.removeparticipatefile}
                      >
                        <IntlMessages id="addexpedient.RemoveParticipantFile" />
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12}>
                    <FormattedMessage id="placeholder.SignatureForClosing">
                      {(placeholder) => (
                        <Select
                          onChange={this.handlesignatureChange}
                          className="ant-input"
                          placeholder={placeholder}
                          margin="none"
                        >
                          <Option value="Yes">
                            <IntlMessages id="addexpedient.optionyes" />
                          </Option>
                          <Option value="No">
                            <IntlMessages id="addexpedient.optionno" />
                          </Option>
                        </Select>
                      )}
                    </FormattedMessage>
                  </Col>
                  <Col lg={12}>
                    <FormattedMessage id="placeholder.SignatureTypeOwner">
                      {(placeholder) => (
                        <Select
                          onChange={this.handletypeownerChange}
                          className="ant-input"
                          placeholder={placeholder}
                          margin="none"
                          disabled={
                            !(
                              this.state.signRequireForClosingExpedient ===
                              "Yes"
                            )
                          }
                        >
                          <Option value="Bio - Each document for each owner">
                            <IntlMessages id="addexpedient.optionBioEDEO" />
                          </Option>
                          <Option value="Bio - Single document for all owner">
                            <IntlMessages id="addexpedient.optionBioSDAO" />
                          </Option>
                          <Option value="Remote - Each document for each owner">
                            <IntlMessages id="addexpedient.optionRemoteEDEO" />
                          </Option>
                          <Option value="Remote - Single document for all owner">
                            <IntlMessages id="addexpedient.optionRemoteSDAO" />
                          </Option>
                        </Select>
                      )}
                    </FormattedMessage>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <p className="cus-frequency">
                    <IntlMessages id="addexpedient.Frequency" />
                  </p>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Select
                      className="ant-input"
                      required
                      onChange={this.handleFrequencyChange}
                      defaultValue="Default"
                    >
                      <Option value="Default">
                        <IntlMessages id="addexpedient.Default" />
                      </Option>
                      <Option value="Custom">
                        <IntlMessages id="addexpedient.Custom" />
                      </Option>
                    </Select>
                  </Col>
                  <Col lg={12}>
                    <FormattedMessage id="placeholder.DocGenType">
                      {(placeholder) => (
                        <Select
                          onChange={this.docgenrationTypechange}
                          className="ant-input"
                          placeholder={placeholder}
                          margin="none"
                        >
                          <Option value="Single document for whole expedient">
                            <IntlMessages id="addexpedient.optionSDWE" />
                          </Option>
                          <Option value="Each document for each participant">
                            <IntlMessages id="addexpedient.optionEDEP" />
                          </Option>
                          <Option value="Document for single day/session">
                            <IntlMessages id="addexpedient.optionDSDS" />
                          </Option>
                          <Option value="Online signature document">
                            <IntlMessages id="addexpedient.optionOSD" />
                          </Option>
                          <Option value="No document">
                            <IntlMessages id="addexpedient.optionND" />
                          </Option>
                          <Option value="Document but no signature">
                            <IntlMessages id="addexpedient.optionDBNS" />
                          </Option>
                        </Select>
                      )}
                    </FormattedMessage>
                  </Col>
                </Row>
              </div>
              {this.state.frequency_value === "Default" ? null : (
                <div className="gx-form-group">
                  <Row>
                    <Col lg={24}>
                      <Card>
                        <p className="frequency_title">Frequency</p>
                        <div className="cust_date_rangepicker">
                          <RangePicker
                            className="full_width_input"
                            disabledDate={this.disabledDate}
                            separator="_"
                            onChange={this.getStartEndDate}
                          />
                        </div>
                        <Row>
                          <Col lg={12}>
                            <Select
                              className="ant-input"
                              onChange={this.handleFrequencyTypeChange}
                              defaultValue={
                                <IntlMessages id="addexpedient.Daily" />
                              }
                              disabled={
                                !(this.state.startRange && this.state.endRange)
                              }
                              margin="none"
                            >
                              <Option key="daily" value="Daily">
                                <IntlMessages id="addexpedient.Daily" />
                              </Option>
                              <Option key="weekly" value="Weekly">
                                <IntlMessages id="addexpedient.Weekly" />
                              </Option>
                              <Option key="monthly" value="Monthly">
                                <IntlMessages id="addexpedient.Monthly" />
                              </Option>
                            </Select>
                          </Col>

                          {this.state.frequency_type === "Daily" ? (
                            <FormattedMessage id="addexpedient.Every">
                              {(placeholder) => (
                                <Col lg={12}>
                                  {getFieldDecorator("Every", {
                                    rules: [
                                      {
                                        required: true,
                                        message: (
                                          <IntlMessages id="addexpedient.EveryisRequired" />
                                        ),
                                        whitespace: true,
                                      },
                                    ],
                                  })(
                                    <Input
                                      className="ant-input"
                                      onChange={this.handleDailydates}
                                      placeholder={placeholder}
                                      disabled={
                                        !(
                                          this.state.startRange &&
                                          this.state.endRange
                                        )
                                      }
                                      margin="none"
                                    />
                                  )}
                                  <p className="day_week_title">
                                    <IntlMessages id="addexpedient.Days" />
                                  </p>
                                </Col>
                              )}
                            </FormattedMessage>
                          ) : null}
                          {this.state.frequency_type === "Weekly" ? (
                            <FormattedMessage id="sidebar.dataEntry.select">
                              {(placeholder) => (
                                <Col lg={12}>
                                  {getFieldDecorator("Select", {
                                    rules: [
                                      {
                                        required: true,
                                        message: (
                                          <IntlMessages id="addexpedient.EveryisRequired" />
                                        ),
                                        whitespace: true,
                                      },
                                    ],
                                  })(
                                    <Multiselect
                                      placeholder={placeholder}
                                      onSelect={this.handleWeekdates}
                                      options={options}
                                      isObject={false}
                                    />
                                  )}
                                  <p className="day_week_title">
                                    <IntlMessages id="addexpedient.Weeks" />
                                  </p>
                                </Col>
                              )}
                            </FormattedMessage>
                          ) : null}
                          {this.state.frequency_type === "Monthly" ? (
                            <Col lg={12}>
                              <DayPicker
                                selectedDays={this.state.selectedDays}
                                onDayClick={this.handleDayClick}
                                disabledDays={[
                                  {
                                    before: new Date(this.state.startRange),
                                    after: new Date(this.state.endRange),
                                  },
                                ]}
                              />
                            </Col>
                          ) : null}
                        </Row>
                        <div className="gx-form-group cust-exp-radio">
                          <Row>
                            <Col lg={24}>
                              <FormItem
                                label={
                                  <IntlMessages id="addexpedient.autosign" />
                                }
                                name="auto_signature"
                              >
                                <RadioGroup
                                  options={plainOptions}
                                  onChange={this.handleautoselect}
                                />
                              </FormItem>
                            </Col>
                          </Row>
                        </div>
                        <div className="gx-form-group cust-exp-timepick">
                          <Row>
                            <Col lg={24}>
                              {this.state.showtime ? (
                                <FormItem
                                  label={
                                    <IntlMessages id="addexpedient.autosigntime" />
                                  }
                                  name="send_signature_time"
                                >
                                  <TimePicker
                                    format={"hh:00:00 A"}
                                    onChange={this.timechangehandle}
                                    use12Hours
                                  />
                                </FormItem>
                              ) : null}
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
              {/* <div className="gx-form-group">
                <Row>
                  <Col lg={12}>
                    <FormItem label="Oficina" name="oficina"></FormItem>
                    {getFieldDecorator('Oficina', {
                      initialValue: contact.dni,
                      rules: [{
                        required: true, 
                        message: 'Oficina is Required.',
                        whitespace: true
                      }],
                    })(
                      <Input className="ant-input" 
                      // required
                      placeholder="Oficina"
                      onChange={(event) => this.setState({dni: event.target.value})}
                      margin="none"/>
                    )}
                  </Col>
                  <Col lg={12}>
                    <FormItem label="Curso" name="curso"></FormItem>
                    {getFieldDecorator('Curso', {
                      initialValue: contact.dni,
                      rules: [{
                        required: true, 
                        message: 'Curso is Required.',
                        whitespace: true
                      }],
                    })(
                      <Input className="ant-input" 
                      // required
                      placeholder="Curso"
                      onChange={(event) => this.setState({dni: event.target.value})}
                      margin="none"/>
                    )}
                  </Col>
                </Row>
              </div> */}
              {this.state.expedientData &&
                this.state.expedientData.FormControls.length > 0 &&
                this.state.expedientData.FormControls.forEach((value, key) => {
                  //const checkedString = '';
                  if (value.Type.toLowerCase() == "textbox") {
                    return (
                      <div className="gx-form-group">
                        <Input
                          required
                          placeholder={value.DisplayName}
                          onChange={this.handleExpedientFormData}
                          boxid={value.id}
                          margin="none"
                        />
                      </div>
                    );
                  } else if (value.Type.toLowerCase() == "combobox") {
                    const checkedString = value.DisplayName.slice(
                      0,
                      value.DisplayName.indexOf("(")
                    );
                    //var optionValues = '';
                    const optionValues = value.DefaultValue.split(";");
                    const optionsData = optionValues.map((value, key) => {
                      return (
                        <option key={key} optionboxid={value.id} value={value}>
                          {value}
                        </option>
                      );
                    });
                    if (checkedString == "Signature Require") {
                      return (
                        <div className="gx-form-group">
                          <Select
                            className="ant-input"
                            placeholder={value.DisplayName}
                            onChange={(e) =>
                              this.handleExpedientFormSelectBoxData(
                                e,
                                value.id,
                                "signatureRequiredYes"
                              )
                            }
                            margin="none"
                          >
                            {optionsData}
                          </Select>
                        </div>
                      );
                    } else if (checkedString == "Signature Type") {
                      return (
                        <div className="gx-form-group">
                          <Select
                            className="ant-input"
                            disabled={this.state.signatureRequired}
                            placeholder={value.DisplayName}
                            onChange={(e) =>
                              this.handleExpedientFormSelectBoxData(
                                e,
                                value.id,
                                ""
                              )
                            }
                            margin="none"
                          >
                            {optionsData}
                          </Select>
                        </div>
                      );
                    } else {
                      return (
                        <div className="gx-form-group">
                          <Select
                            className="ant-input"
                            placeholder={value.DisplayName}
                            onChange={(e) =>
                              this.handleExpedientFormSelectBoxData(
                                e,
                                value.id,
                                ""
                              )
                            }
                            margin="none"
                          >
                            {optionsData}
                          </Select>
                        </div>
                      );
                    }
                  }
                })}
              <div id="display_expedient_form"></div>
            </div>
          </div>
        </Form>
        <IdentityList
          open={addOwnerParticipantState}
          onSaveOwnerParticipant={this.onSaveOwnerParticipant}
          onOwnerParticipantClose={this.onOwnerParticipantClose}
        />
        <IdentityList
          open={addParticipantState}
          onSaveOwnerParticipant={this.onSaveParticipant}
          onOwnerParticipantClose={this.onAddParticipantClose}
        />
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_expedients,
  get_expedient_form,
  //get_identities,
  open_expedient_modal,
  close_expedient_modal,
  //hideMessage,
  //setstatustoinitial,
};

const viewExpedientForm = Form.create()(AddExpedient);
const mapStateToProps = (state) => {
  return {
    get_expedientFormData: state.expedientsReducers.get_expedient_form_res,
    expedientmodalclosecall: state.expedientsReducers.expedientmodalclosecall,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewExpedientForm));
