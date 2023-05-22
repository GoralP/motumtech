import React, { Component } from "react";
import {
  Card,
  Table,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  message,
  Form,
  Select,
  Modal,
  Radio,
  Tabs,
  Popover,
} from "antd";
import { connect } from "react-redux";
import { baseURL, branchName } from "./../../../../util/config";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";
import DateForGetReport from "./../../../helper/DateForGetReport";
import TimeWithoutDateHelper from "./../../../helper/TimeWithoutDateHelper";
import IntlMessages from "util/IntlMessages";
import {
  get_visits,
  hideMessage,
  setstatustoinitial,
  saveVisitData,
  get_reportvisit,
  get_procedure_type,
  readDeskoServiceData,
  getIdentityDetails,
  getScheduleVisit,
  getScheduleVisitSuccess,
  addVisitStatusChange,
  addIdentityStatusChange,
  getScheduledVisitStatusChange,
  changeSaveTypeStatus,
  changeSavingTypeStatus,
  closeModalAfterSuccess,
  getScheduleVisitsList,
  getEventAndInvitees,
  getScheduleStatusChange,
} from "./../../../../appRedux/actions/VisitsActions";
import VisDocuments from "./visdocuments";
import { FormattedMessage, injectIntl } from "react-intl";
import CircularProgress from "./../../../../components/CircularProgress/index";
import AddIdentity from "components/modal/AddIdentity";
import { openmodal } from "./../../../../appRedux/actions/IdentitiesActions";
import { webURL } from "util/config";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "moment/locale/ca";

const today = new Date();
let licenseId = "";
let langName = "";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

var doChange = true;
var dniExist = true;
var addIdentityModel = true;
var tempoSch = true;
var tempoSchVisT = true;

var DeskoData = "";
var deskoDNI = "";
var deskoFirstName = "";
var deskoFatherSurName = "";
var deskoMotherSurName = "";
var deskoNICSNo = "";
var newDeskoData = "";

var visitAdd = "";
var identityAdd = "";
var IdentitySurname;
var Surname = "";
var newSurname = "";
var visitCloseVisit = "";
var visitDocument = "";
var visitExportExcel = "";

var closeVisitIds = [];

let timeout;
let currentValue;

// start get host list on 3 character type API
function fetchList(keyword, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = keyword;

  function fake() {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
    };
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined
      ) {
        licenseId = userData["id"];
      }
    }

    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");

    fetch(
      baseURL +
        "GetInternalIdentites?LicenseId=" +
        licenseId +
        "&searchKeyword=" +
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
            callback(res.data);
          } else {
            // Do nothing
            // console.log("RESULT BLANK =>", res);
          }
        }
      });
  }
  timeout = setTimeout(fake, 300);
}
// end get host list on 3 character type API

// set localizer for big calendar
const localizer = BigCalendar.momentLocalizer(moment);

// to set 24 hour formate
const calForm = {
  timeGutterFormat: "HH:mm",
};

class Visit extends Component {
  constructor() {
    super();

    this.state = {
      addDocumentsState: false,
      addIdentityState: false,
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
      dni_number: "",
      visitor_name: "",
      visitor_surname: "",
      visitor_fathersurname: "",
      visitor_secondsurname: "",
      visitor_company_name: "",
      visitor_email: "",
      procedure_type: "",
      addVisitModal: false,
      addType: "Desko",
      saveType: "",
      visitSubmit: false,
      hostList: [],
      host_id: "",
      host_name: "",
      host_surname: "",
      host_company_name: "",
      host_email: "",
      host_phone: "",
      tabKey: "1",
      events: [],
      editIdentityFlag: "",
      editVisitFlag: "",
      editVisit: false,
      visitId: "",
      event_name: "",
      identity_email: "",
      identity_phone: "",
      identity_FatherSurname: "",
      identity_SecondSurname: "",
      isEnableButton: false,
      DNIButtonStatus: false,
      Identity_Id: "",
      contact: {
        id: "",
        dni: "",
        company_name: "",
        name: "",
        identifier: "",
        surname: "",
        landline: "",
        second_surname: "",
        card_number: "",
        email: "",
        mobile: "",
        type: "",
        radioValue: "",
      },
    };
    // this.moveEvent = this.moveEvent.bind(this);
  }

  get_visitsById(pageNumber = "", sortBy = "-VisitId", perPage = "10") {
    if (this.props.status === "Initial") {
      this.props.get_visits({
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
              this.props.get_reportvisit(condition);
            }
          }
        );
      } else {
        this.props.get_visits({
          pageNumber: pageNumber,
          sortBy: sortBy,
          perPage: perPage,
        });
      }
    }
  }

  componentDidMount() {
    doChange = true;
    dniExist = true;
    let userdata = localStorage.getItem(branchName + "_data");
    langName = localStorage.getItem(branchName + "_language");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_add = userData.Permission.Visit.Visit_Add;
      let permit_identity_add = userData.Permission.Employees.Identity_Add;
      let permit_close_visit = userData.Permission.Visit.Visit_CloseVisit;
      let permit_visit_document = userData.Permission.Visit.Visit_Document;
      let permit_export_excel = userData.Permission.Visit.Visit_ExportExcel;
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined &&
        permit_add !== undefined &&
        permit_close_visit !== undefined &&
        permit_visit_document !== undefined &&
        permit_export_excel !== undefined &&
        permit_identity_add !== undefined
      ) {
        licenseId = userData["id"];
        visitAdd = permit_add;
        identityAdd = permit_identity_add;
        visitCloseVisit = permit_close_visit;
        visitDocument = permit_visit_document;
        visitExportExcel = permit_export_excel;
      }
    }
    this.props.setstatustoinitial();
    this.get_visitsById();
    this.props.getScheduleVisitsList();
    this.props.get_procedure_type();
    this.interval = setInterval(() => {
      this.props.readDeskoServiceData();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onAddIdentity = () => {
    this.setState({
      contact: {
        id: this.state.Identity_Id,
        dni: this.state.dni_number,
        company_name: this.state.visitor_company_name,
        name: deskoFirstName ? deskoFirstName : this.state.visitor_name,
        identifier: "",
        surname: deskoFatherSurName
          ? deskoFatherSurName
          : this.state.visitor_fathersurname,
        landline: "",
        second_surname: deskoMotherSurName
          ? deskoMotherSurName
          : this.state.visitor_secondsurname,
        card_number: deskoNICSNo,
        email: this.state.identity_email,
        mobile: this.state.identity_phone,
        type: "",
        radioValue: "",
      },
    });
    this.props.openmodal();
    this.setState({ addVisitModal: true });
    //editVisitFlag
    this.setState({ addIdentityState: true });
    if (this.state.editVisitFlag == "edit") {
      this.setState({ editIdentityFlag: "edit" });
    } else {
      this.setState({ editIdentityFlag: "" });
    }
  };

  onIdentityClose = () => {
    // addIdentityModel = true;
    this.setState({ addIdentityState: false });
  };

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
          this.props.get_reportvisit(condition);
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
    this.get_visitsById(pagination.current, sortBy, pagination.pageSize);
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
    let authBasic = "";
    authBasic = localStorage.getItem("setAuthToken");
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["StartDate", "EndDate"],
      (err, values) => {
        if (!err) {
          var dniNumber = this.state.dni;
          var startingDate = DateForGetReport(this.state.startValue);
          var endingDate = DateForGetReport(this.state.endValue);

          fetch(
            baseURL +
              "ExportVisitExcel?licenseId=" +
              licenseId +
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
            if (this.props.getVisitsData.TotalCount === 0) {
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

  onAddVisit = () => {
    this.setState({ dni_number: "" });
    this.setState({ event_name: "" });

    this.setState({
      visitor_name: "",
      visitor_surname: "",
      visitor_company_name: "",
      visitor_email: "",
    });
    this.setState({
      host_name: "",
      host_surname: "",
      host_company_name: "",
      host_email: "",
      host_phone: "",
    });

    this.setState({ procedure_type: "" });
    this.props.form.setFieldsValue({ ProcedureType: "" });

    this.setState({ addType: "Normal" });
    this.setState({ addVisitModal: true });

    this.setState({ editVisit: false });
    this.setState({ visitId: "" });
    this.setState({ editIdentityFlag: "" });
    // this.setState({'isEnableButton': true});
  };
  closeAddVisit = () => {
    // reset the schedule list on edit
    this.props.getScheduleVisitSuccess({ data: "" });

    this.setState({ dni_number: "" });
    this.setState({ event_name: "" });

    this.setState({
      visitor_name: "",
      visitor_surname: "",
      visitor_company_name: "",
      visitor_email: "",
    });
    this.setState({
      host_name: "",
      host_surname: "",
      host_company_name: "",
      host_email: "",
      host_phone: "",
    });

    this.setState({ procedure_type: "" });
    this.setState({ saveType: "" });
    this.setState({ editVisitFlag: "" });
    this.setState({ editVisit: false });
    this.setState({ visitId: "" });
    this.setState({ addVisitModal: false });
    // deskoDNI = '';
    if (this.props.getDeskoServiceData !== "") {
      doChange = true;
      this.setState({ dni_number: deskoDNI });
      this.setState({ event_name: "" });

      this.setState({
        visitor_name: "",
        visitor_surname: "",
        visitor_company_name: "",
        visitor_email: "",
      });
      this.setState({
        host_name: "",
        host_surname: "",
        host_company_name: "",
        host_email: "",
        host_phone: "",
      });

      this.setState({ procedure_type: "" });
      this.props.form.setFieldsValue({ DNI: deskoDNI });
      this.props.form.setFieldsValue({
        VisitorName: "",
        VisitorSurName: "",
        VisitorCompanyName: "",
        VisitorEmail: "",
      });
      this.props.form.setFieldsValue({
        HostName: "",
        HostSurName: "",
        hostCompanyName: "",
        HostEmail: "",
        HostPhone: "",
      });
      this.props.form.setFieldsValue({ ProcedureType: "" });
    }
  };

  handleVisitSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["DNI", "HostName", "ProcedureType", "radiationValue"],
      (err, values) => {
        if (!err) {
          var visitData = "";
          if (this.state.saveType === "PostVisit") {
            visitData = {
              DNI: this.state.dni_number,
              HostName: this.state.host_name,
              HostId: this.state.host_id,
              CompanyName: this.state.visitor_company_name,
              ProcedureType: this.state.procedure_type,
              licenseId: licenseId,
              deviceId: "Web",
              IdentityLevel: "",
            };
          } else if (this.state.saveType === "UpdateVisit") {
            visitData = {
              VisitId: this.state.visitId,
              DNI: this.state.dni_number,
              HostName: this.state.host_name,
              HostId: this.state.host_id,
              CompanyName: this.state.visitor_company_name,
              ProcedureType: this.state.procedure_type,
              licenseId: licenseId,
              deviceId: "Web",
              IdentityLevel: "",
            };
          }

          if (
            this.state.dni_number !== "" &&
            this.state.host_name !== "" &&
            this.state.procedure_type !== ""
          ) {
            if (this.state.addType === "Normal") {
              this.props.saveVisitData({
                saveType: this.state.saveType,
                data: visitData,
              });
              this.setState({ addVisitModal: false });
              this.setState({ saveType: "" });
              // doChange = true;
              // dniExist = true;
            } else {
              // addIdentityModel = true;
              this.props.saveVisitData({
                saveType: this.state.saveType,
                data: visitData,
              });
              this.setState({ saveType: "" });
              // doChange = true;
              // dniExist = true;
            }
            // this.props.getScheduleVisitsList();
          } else {
            message.error(
              this.props.intl.formatMessage({ id: "global.TryAgain" })
            );
          }
        }
      }
    );
  };

  closeSelectedVisit = () => {
    var finalClosedVisitIds = "";
    langName = localStorage.getItem(branchName + "_language");
    finalClosedVisitIds = closeVisitIds.map((value, key) => {
      return value.VisitId;
    });
    if (finalClosedVisitIds.length <= 0) {
      message.error(this.props.intl.formatMessage({ id: "visit.VisitSelect" }));
      return false;
    }

    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
      body: JSON.stringify(finalClosedVisitIds),
    };
    fetch(baseURL + "CloseVisit?licenseId=" + licenseId, requestOptions)
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
            message.success(response_message);
            // return(<Redirect to="/dashboard"/>);
            // this.interval = setInterval(() => {
            //   window.location.reload();
            // }, 4000);
            this.props.history.push({
              pathname: "/" + webURL + "main/home/visit",
            });
          } else {
            message.error(response_message);
          }
        } else {
          message.error(
            this.props.intl.formatMessage({ id: "global.TryAgain" })
          );
        }
      });
  };

  handleGetScheduleVisit = () => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll(["DNI"], (err, values) => {
      if (!err) {
        if (this.state.dni_number !== "") {
          this.props.getIdentityDetails({ DNI: this.state.dni_number });
        } else {
          message.error(
            this.props.intl.formatMessage({ id: "global.TryAgain" })
          );
        }
      }
    });
  };

  handleSearchHost = (search) => {
    var keyword = search.trim();
    if (keyword && keyword.length >= 3) {
      fetchList(keyword, (data) => {
        this.setState({ hostList: data });
      });
    }
  };

  handleHostChange = (hostItem) => {
    this.setState({
      host_id: hostItem.Id,
      host_surname: hostItem.Surname,
      host_company_name: hostItem.CompanyName,
      host_email: hostItem.Email,
      host_phone: hostItem.PhoneNumber,
    });
  };

  handleScheduleChange = (item) => {
    this.setState({
      host_id: item.HostId,
      event_name: item.EventName,
      host_name: item.HostName,
      host_surname: item.HostFullSurName,
      host_company_name: item.HostCompanyName,
      host_email: item.Email,
      host_phone: item.PhoneNumber,
      procedure_type: item.ProcedureType,
      editVisit: true,
    });
  };

  editSelectedEvent = (event) => {
    let eventData = this.props.getScheduleList.visitList.find((singleEvent) => {
      return singleEvent.VisitId === event.id;
    });
    if (eventData !== undefined && eventData !== "") {
      // console.log("eventdata",eventData);
      // reset the schedule list on edit
      this.props.getScheduleVisitSuccess({ data: "" });
      if (eventData.DNI !== null) {
        this.setState({
          dni_number: eventData.DNI,
          event_name: eventData.EventName,
          visitor_name: eventData.Name,
          visitor_surname: eventData.FullSurName,
          visitor_company_name: eventData.CompanyName,
          visitor_email: eventData.Email,
          visitId: eventData.VisitId,
          host_name: eventData.HostName,
          host_email: eventData.HostEmail,
          host_company_name: eventData.HostCompanyName,
          host_phone: eventData.HostPhoneNumber,
          procedure_type: eventData.ProcedureType,
          editVisitFlag: "edit",
          editVisit: true,
          saveType: "UpdateVisit",
          addVisitModal: true,
          isEnableButton: event.isEnable,
        });
      } else {
        newSurname = JSON.stringify(eventData.FullSurName);
        Surname = newSurname.replaceAll('"', "");
        IdentitySurname = Surname.split(" ");
        // console.log("Surname",IdentitySurname);
        this.setState({
          dni_number: "",
          DNIButtonStatus: true,
          event_name: eventData.EventName,
          visitor_name: eventData.Name,
          visitor_surname: eventData.FullSurName,
          visitor_fathersurname: IdentitySurname[0],
          visitor_secondsurname: IdentitySurname[1],
          visitor_company_name: eventData.CompanyName,
          visitor_email: eventData.Email,
          visitId: eventData.VisitId,
          identity_email: eventData.Email,
          identity_phone: eventData.PhoneNumber,
          host_id: eventData.HostId,
          host_name: eventData.HostName,
          host_email: eventData.HostEmail,
          host_company_name: eventData.HostCompanyName,
          host_phone: eventData.HostPhoneNumber,
          procedure_type: eventData.ProcedureType,
          editVisitFlag: "edit",
          editVisit: true,
          saveType: "UpdateVisit",
          addVisitModal: true,
          Identity_Id: eventData.IdentityId,
          isEnableButton: event.isEnable,
        });
      }
    }
  };

  // set color, based on event get from BE
  eventStyleGetter = (event) => {
    var style = {
      backgroundColor: event.Color.toLowerCase(),
    };
    return {
      style: style,
    };
  };

  // Aysnc API call without response for get events & invitees
  handleGetEventAndInvitees = () => {
    this.props.getEventAndInvitees();
  };

  // popup jsx for event on hover
  handleEnablePopover = (event) => {
    return (
      <div>
        <Row>
          <Col lg={12} xs={24}>
            <span>
              <IntlMessages id="addVisit.Visitor" />:{" "}
              <p>
                {event.visitorName} {event.visitorSurname}
              </p>
            </span>
          </Col>
          <Col lg={12} xs={24}>
            <span>
              <IntlMessages id="column.host" />: <p>{event.hostName}</p>
            </span>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    var { addDocumentsState, startValue, endValue, endOpen, addIdentityState } =
      this.state;

    //change calendar view table language according to select language
    let calenderCult = "";
    if (langName == "English") {
      calenderCult = "en";
    } else if (langName == "Spanish") {
      calenderCult = "es";
    } else if (langName == "Catalan") {
      calenderCult = "ca";
    }

    // to set starting from monday
    moment.locale(calenderCult, {
      week: {
        dow: 1,
        doy: 1,
      },
    });

    //start of edit visit state changes
    if (
      this.props.getScheduleStatus === true &&
      this.state.editVisitFlag === "edit"
    ) {
      let eventDataAgain = this.props.getScheduleList.visitList.find(
        (singleEvent) => {
          return singleEvent.VisitId === this.state.visitId;
        }
      );
      if (eventDataAgain !== undefined && eventDataAgain !== "") {
        this.setState({
          dni_number: eventDataAgain.DNI,
          event_name: eventDataAgain.EventName,
          visitor_name: eventDataAgain.Name,
          visitor_surname: eventDataAgain.FullSurName,
          visitor_company_name: eventDataAgain.CompanyName,
          visitor_email: eventDataAgain.Email,
          visitId: eventDataAgain.VisitId,
          host_name: eventDataAgain.HostName,
          host_email: eventDataAgain.HostEmail,
          host_company_name: eventDataAgain.HostCompanyName,
          host_phone: eventDataAgain.HostPhoneNumber,
          procedure_type: eventDataAgain.ProcedureType,
          saveType: "UpdateVisit",
        });
      } else {
        this.setState({
          DNIButtonStatus: false,
          disableDNIBox: false,
        });
      }
      this.props.getScheduleStatusChange();
    }
    //end of edit visit state changes
    //check have permission for add visit & add identity
    if (visitAdd === true && identityAdd === true) {
      //check desko have data
      if (
        this.props.getDeskoServiceData !== "" &&
        this.props.getDeskoServiceData !== null &&
        this.props.getDeskoServiceData !== undefined
      ) {
        if (JSON.stringify(this.props.getDeskoServiceData) != newDeskoData) {
          newDeskoData = JSON.stringify(this.props.getDeskoServiceData);
          DeskoData = this.props.getDeskoServiceData.split(";");
          if (DeskoData.length > 0) {
            this.setState({ dni_number: DeskoData[0] });
            deskoDNI = DeskoData[0];
            deskoFatherSurName = DeskoData[1];
            deskoMotherSurName = DeskoData[2];
            deskoFirstName = DeskoData[3];
            deskoNICSNo = DeskoData[4];
            doChange = true;
            addIdentityModel = true;
            dniExist = true;
            tempoSchVisT = true;
            tempoSch = true;
          } else {
            deskoDNI = "";
            deskoFatherSurName = "";
            deskoMotherSurName = "";
            deskoFirstName = "";
            deskoNICSNo = "";
          }
          // console.log("DeskoData =>", deskoDNI,deskoFirstName,deskoFatherSurName,deskoMotherSurName);
        }
        if (this.props.addVisitStatus) {
          this.setState({ addVisitModal: true, dni_number: deskoDNI });
          this.props.addVisitStatusChange(false);
          this.props.getIdentityDetails({ DNI: deskoDNI });
          // if (tempoDet && deskoDNI !== '') {
          //   this.props.getIdentityDetails({DNI: deskoDNI});
          //   tempoDet = false;
          // }
        }
      }

      if (this.props.getIdentityData.status === false) {
        // if (this.state.DNIButtonStatus) {
        //   // console.log("Vasudev");
        //   this.setState({DNIButtonStatus: false, disableDNIBox: true});
        //   this.props.addIdentityStatusChange(false);
        // } else {
        if (this.props.addIdentityStatus) {
          this.setState({ saveType: "" });
          this.onAddIdentity();
          this.props.addIdentityStatusChange(false);
          // addIdentityModel = false;
        }
        // }
      } else if (this.props.getIdentityData.status === true) {
        // if (this.state.DNIButtonStatus) {
        //   this.setState({visitor_name: this.props.getIdentityData.data.Name, visitor_surname: this.props.getIdentityData.data.FatherSurname, visitor_company_name: this.props.getIdentityData.data.CompanyName, DNIButtonStatus: false});
        //   this.setState({saveType: 'UpdateVisit'});
        //   this.props.getScheduledVisitStatusChange(false);
        // } else {
        if (this.props.scheduledVisitStatus) {
          this.setState({
            visitor_name: this.props.getIdentityData.data.Name,
            visitor_surname: this.props.getIdentityData.data.FatherSurname,
            visitor_company_name: this.props.getIdentityData.data.CompanyName,
            visitor_email: this.props.getIdentityData.data.Email,
            event_name: this.state.event_name,
          });
          this.props.getScheduleVisit({
            IdentityId: this.props.getIdentityData.data.id,
          });
          this.props.getScheduledVisitStatusChange(false);
        }
        // }
      }

      if (this.props.getScheduleVisitData.data) {
        if (
          this.props.getScheduleVisitData.data.length > 0 &&
          this.props.getScheduleVisitData.status === true
        ) {
          if (this.props.saveTypeStatus) {
            this.setState({ saveType: "UpdateVisit", editVisitFlag: "edit" });
            // set state values for already scheduled visits
            this.setState({
              visitId: this.props.getScheduleVisitData.data[0].VisitId,
              host_id: this.props.getScheduleVisitData.data[0].HostId,
              event_name: this.props.getScheduleVisitData.data[0].EventName,
              host_name: this.props.getScheduleVisitData.data[0].HostName,
              host_surname:
                this.props.getScheduleVisitData.data[0].HostFullSurName,
              host_company_name:
                this.props.getScheduleVisitData.data[0].HostCompanyName,
              host_email: this.props.getScheduleVisitData.data[0].HostEmail,
              host_phone:
                this.props.getScheduleVisitData.data[0].HostPhoneNumber,
              visitor_surname:
                this.props.getScheduleVisitData.data[0].FullSurName,
              editVisit: true,
            });
            this.props.changeSaveTypeStatus(false);
            // tempoSchVisT = false;
          }
        } else if (this.props.getScheduleVisitData.data.length === 0) {
          if (this.props.savingTypeStatus) {
            this.setState({ saveType: "PostVisit" });
            this.props.changeSavingTypeStatus(false);
          }
        }
      }

      if (this.props.saveVisitSuccess.status === true) {
        if (this.props.closeModal) {
          this.setState({ addVisitModal: false, addIdentityState: false });
          // dniExist = false;
          this.props.closeModalAfterSuccess(false);
        }
      }
    }

    //close modal after save identity
    if (this.props.modalclosecall) {
      addIdentityState = false;
    }
    //Visit listing
    var visitsData = this.props.getVisitsData;
    var visitData = "";
    var events = [];

    var scheduleListData = [];
    var scheduleListsData = this.props.getScheduleList;

    if (!scheduleListsData) {
      // Object is empty (Would return true in this example)
    } else {
      scheduleListData = scheduleListsData.visitList;

      if (scheduleListData.length > 0) {
        scheduleListData.map((item) => {
          if (item.ScheduleTime !== null && item.ScheduleEndTime !== null) {
            events.push({
              id: item.VisitId,
              title: item.EventName,
              visitorName: item.Name,
              visitorSurname: item.FullSurName,
              hostName: item.HostName,
              start: new Date(item.ScheduleTime),
              end: new Date(item.ScheduleEndTime),
              isEnable: item.IsEnable,
              Color: item.Color,
            });
          }
        });
      }
    }
    if (!visitsData) {
      // Object is empty (Would return true in this example)
    } else {
      visitData = visitsData.visitList;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = visitsData.TotalCount;
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
        title: <IntlMessages id="column.host" />,
        dataIndex: "HostName",
        key: "HostName",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.date" />,
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => DateWithoutTimeHelper(text),
      },
      {
        title: <IntlMessages id="column.VisitTime" />,
        dataIndex: "Date",
        key: "VisitTime",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => TimeWithoutDateHelper(text),
      },
      {
        title: <IntlMessages id="column.DepartureTime" />,
        dataIndex: "DepartureTime",
        key: "DepartureTime",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (text) => TimeWithoutDateHelper(text),
      },
      {
        title: <IntlMessages id="column.document" />,
        key: "document",
        fixed: "right",
        render: (text, record) => (
          <span>
            <span className="gx-link">
              {visitDocument === true ? (
                <Button
                  onClick={this.onAddDocuments}
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
                </Button>
              ) : (
                <Button
                  disabled
                  value={record.VisitId}
                  className="arrow-btn gx-link"
                >
                  <IntlMessages id="actiondocument.Detail" />
                </Button>
              )}
            </span>
            {/*<span className="gx-link">Action 一 {record.name}</span>
          <Divider type="vertical"/>
          <span className="gx-link">Delete</span>
          <Divider type="vertical"/>
          <span className="gx-link ant-dropdown-link">
            More actions <Icon type="down"/>
          </span>*/}
          </span>
        ),
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        closeVisitIds = selectedRows;
      },
      getCheckboxProps: (record) => ({
        FullName: record.FullName,
      }),
    };

    const callback = (key) => {
      this.setState({ tabKey: key });
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        title={<IntlMessages id="visit.title" />}
        extra={
          <div className="card-extra-form">
            {/* <div class="ant-card-head-title" style={{ display: "block",fontSize: "large"}}></div>  */}
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
                {visitExportExcel === true ? (
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
                {visitAdd === true ? (
                  <Button
                    className="gx-mb-0"
                    type="primary"
                    style={{ float: "right" }}
                    onClick={() => this.onAddVisit()}
                  >
                    <IntlMessages id="visitAdd.addVisit" />
                  </Button>
                ) : (
                  <Button
                    className="gx-mb-0"
                    type="primary"
                    style={{ float: "right" }}
                    disabled
                  >
                    <IntlMessages id="visitAdd.addVisit" />
                  </Button>
                )}
              </FormItem>
              <FormItem>
                {visitCloseVisit === true ? (
                  <Button
                    className="float-btn-right cust-last-btns"
                    type="primary"
                    onClick={this.closeSelectedVisit}
                  >
                    <IntlMessages id="visit.closeSelectedVisit" />
                  </Button>
                ) : (
                  <Button
                    className="float-btn-right cust-last-btns"
                    type="primary"
                    disabled
                  >
                    <IntlMessages id="visit.closeSelectedVisit" />
                  </Button>
                )}
              </FormItem>
            </Form>
          </div>
        }
      >
        {/* start refresh button call */}
        <FormItem style={{ justifyContent: "flex-end", marginBottom: "0" }}>
          <Button
            className="inline-btn"
            type="primary"
            onClick={() => this.handleGetEventAndInvitees()}
          >
            <IntlMessages id="button.Refresh" />
          </Button>
        </FormItem>
        {/* end refresh button call */}
        {/* start list view & calendar view */}
        <Tabs
          defaultActiveKey="1"
          activeKey={this.state.tabKey}
          onChange={callback}
        >
          <TabPane tab={<IntlMessages id="visitView.listView" />} key="1">
            <Table
              className="gx-table-responsive"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={visitData}
              onChange={this.handleTableChange}
              pagination={this.state.pagination}
              loading={this.state.loading}
              // scroll={{ x: true, y: 400 }}
              // style={{ whiteSpace: "pre" }}
              scroll={{ x: true }}
            />
          </TabPane>
          <TabPane tab={<IntlMessages id="visitView.calendarView" />} key="2">
            <BigCalendar
              localizer={localizer}
              culture={calenderCult}
              formats={calForm}
              startAccessor={"start"}
              endAccessor={"end"}
              selectable
              events={events}
              // onEventDrop={this.moveEvent}
              resizable
              // onEventResize={this.resizeEvent}
              views={["week", "day"]}
              defaultView={BigCalendar.Views.WEEK}
              messages={{
                today: <IntlMessages id="calendar.today" />,
                previous: <IntlMessages id="calendar.previous" />,
                next: <IntlMessages id="calendar.next" />,
                week: <IntlMessages id="calendar.week" />,
                day: <IntlMessages id="calendar.day" />,
              }}
              onSelectEvent={this.editSelectedEvent}
              eventPropGetter={this.eventStyleGetter}
              popup={false}
              components={{
                eventWrapper: ({ event, children }) => (
                  <div
                    onMouseOver={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Popover
                      placement="rightTop"
                      content={this.handleEnablePopover(event)}
                      title={event.title}
                    >
                      {children}
                    </Popover>
                  </div>
                ),
              }}
              // defaultDate={new Date(2015, 3, 12)}
              // start time 7:00am
              min={
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  7
                )
              }
              // end time 9:00pm
              max={
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  22
                )
              }
            />
          </TabPane>
        </Tabs>
        {/* end list view & calendar view */}
        <VisDocuments
          open={addDocumentsState}
          visit_id={this.state.visit_id}
          onDocumentsClose={this.onDocumentsClose}
        />
        {/* start add/edit visit modal */}
        <Modal
          title={
            this.state.editVisitFlag === "edit" ? (
              <IntlMessages id="visitEdit.editVisit" />
            ) : (
              <IntlMessages id="visitAdd.addVisit" />
            )
          }
          maskClosable={false}
          onCancel={this.closeAddVisit}
          visible={this.state.addVisitModal}
          closable={true}
          cancelText={<IntlMessages id="globalButton.cancel" />}
          footer={[
            this.state.editVisitFlag !== "edit" || this.state.isEnableButton ? (
              <Button
                key="submit"
                type="primary"
                onClick={this.handleVisitSubmit}
              >
                <IntlMessages id="additentity.save" />
              </Button>
            ) : (
              <Button disabled key="submit" type="primary">
                <IntlMessages id="additentity.save" />
              </Button>
            ),
          ]}
          destroyOnClose={true}
          className="cust-modal-width"
        >
          <div className="gx-modal-box-row">
            <div className="gx-modal-box-form-item">
              <Form>
                <div className="gx-form-group cust-form-visit">
                  <Row>
                    <Col lg={24} xs={24}>
                      <h3>
                        <IntlMessages id="addVisit.Visitor" />
                      </h3>
                    </Col>
                    <Col lg={24} xs={24}>
                      <label>
                        <sup>
                          <span style={{ color: "red", fontSize: "10px" }}>
                            *
                          </span>
                        </sup>{" "}
                        <IntlMessages id="column.DNI" /> :
                      </label>
                      <FormItem>
                        {getFieldDecorator("DNI", {
                          initialValue: this.state.dni_number,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.visitAdd.dni" />
                              ),
                              whitespace: true,
                            },
                          ],
                        })(
                          <Input
                            required
                            onChange={(event) =>
                              this.setState({ dni_number: event.target.value })
                            }
                            margin="none"
                          />
                        )}
                      </FormItem>
                      {/* {this.state.editVisitFlag === 'edit' ? <hr></hr> : ""} */}
                    </Col>
                    {this.state.saveType === "UpdateVisit" &&
                    this.props.getScheduleVisitData.data &&
                    this.props.getScheduleVisitData.data.length > 1 ? (
                      <Col lg={24} xs={24}>
                        <FormItem>
                          {getFieldDecorator("radiationValue", {
                            initialValue: this.state.visitId,
                            rules: [
                              {
                                required: true,
                                message: "Please Choose your option!",
                              },
                            ],
                          })(
                            <RadioGroup
                              name={"radiationValue"}
                              onChange={(event) =>
                                this.setState({ visitId: event.target.value })
                              }
                            >
                              {this.props.getScheduleVisitData.data.length > 1
                                ? this.props.getScheduleVisitData.data.map(
                                    (item) => {
                                      return (
                                        <Radio
                                          onClick={(e) =>
                                            this.handleScheduleChange(item)
                                          }
                                          value={item.VisitId}
                                        >
                                          {item.HostName} [
                                          {DateWithoutTimeHelper(
                                            item.ScheduleTime
                                          )}{" "}
                                          {TimeWithoutDateHelper(
                                            item.ScheduleTime
                                          )}{" "}
                                          to{" "}
                                          {DateWithoutTimeHelper(
                                            item.ScheduleEndTime
                                          )}{" "}
                                          {TimeWithoutDateHelper(
                                            item.ScheduleEndTime
                                          )}
                                          ]
                                        </Radio>
                                      );
                                    }
                                  )
                                : null}
                            </RadioGroup>
                          )}
                        </FormItem>
                      </Col>
                    ) : null}
                    {this.state.saveType === "PostVisit" ||
                    this.state.editVisit ? (
                      <>
                        {this.state.saveType === "UpdateVisit" ? (
                          <Col lg={24} xs={24}>
                            <label>
                              <IntlMessages id="visitAdd.eventName" /> :
                            </label>
                            <FormItem>
                              {getFieldDecorator("EventName", {
                                initialValue: this.state.event_name,
                              })(<Input disabled margin="none" />)}
                            </FormItem>
                          </Col>
                        ) : null}
                        <Col lg={12} xs={24}>
                          <label>
                            <IntlMessages id="addidentity.Name" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("VisitorName", {
                              initialValue: this.state.visitor_name,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                        </Col>
                        <Col lg={12} xs={24}>
                          <label>
                            <IntlMessages id="column.surname" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("VisitorSurName", {
                              initialValue: this.state.visitor_surname,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                        </Col>
                        <Col lg={24} xs={24}>
                          <label>
                            <IntlMessages id="visitAdd.companyName" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("VisitorCompanyName", {
                              initialValue: this.state.visitor_company_name,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                          {/* <hr></hr> */}
                        </Col>
                        <Col lg={24} xs={24}>
                          <label>
                            <IntlMessages id="column.email" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("VisitorEmail", {
                              initialValue: this.state.visitor_email,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                          {/* <hr></hr> */}
                        </Col>
                      </>
                    ) : null}
                    {this.state.editVisitFlag !== "edit" ||
                    this.state.DNIButtonStatus ? (
                      <Col lg={24} xs={24}>
                        <FormItem>
                          <Button
                            style={{ float: "right" }}
                            className="inline-btn"
                            type="primary"
                            onClick={this.handleGetScheduleVisit}
                          >
                            <IntlMessages id="globalButton.submit" />
                          </Button>
                        </FormItem>
                        {/* <hr></hr> */}
                      </Col>
                    ) : null}
                    {this.state.saveType === "PostVisit" ||
                    this.state.editVisit ? (
                      <>
                        <Col lg={24} xs={24}>
                          {this.state.editVisitFlag === "edit" ? <hr></hr> : ""}
                          <h3>
                            <IntlMessages id="column.host" />
                          </h3>
                        </Col>
                        <Col lg={24} xs={24}>
                          <label>
                            <sup>
                              <span style={{ color: "red", fontSize: "10px" }}>
                                *
                              </span>
                            </sup>{" "}
                            <IntlMessages id="visitAdd.hostName" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("HostName", {
                              initialValue: this.state.host_name,
                              rules: [
                                {
                                  required: true,
                                  message: (
                                    <IntlMessages id="required.visitAdd.hostName" />
                                  ),
                                },
                              ],
                            })(
                              <Select
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={true}
                                filterOption={false}
                                onSearch={this.handleSearchHost}
                                onChange={(value, event) =>
                                  this.setState({ host_name: `${value}` })
                                }
                                notFoundContent={null}
                              >
                                {this.state.hostList.length > 0
                                  ? this.state.hostList.map((item) => {
                                      let fullname =
                                        item.Name + " " + item.Surname;
                                      return (
                                        <Option
                                          onClick={(e) =>
                                            this.handleHostChange(item)
                                          }
                                          value={fullname}
                                        >
                                          {fullname}
                                        </Option>
                                      );
                                    })
                                  : null}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        {/* <Col lg={12} xs={24}>
                        <label><IntlMessages id="column.surname"/> :</label>
                        <FormItem>
                          {getFieldDecorator('HostSurName', {
                            initialValue: this.state.host_surname,
                          })(
                            <Input disabled margin="none"/>
                          )}
                        </FormItem>
                      </Col> */}
                        <Col lg={12} xs={24}>
                          <label>
                            <IntlMessages id="visitAdd.companyName" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("HostCompanyName", {
                              initialValue: this.state.host_company_name,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                        </Col>
                        <Col lg={12} xs={24}>
                          <label>
                            <IntlMessages id="identityDetail.PhoneNumber" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("HostPhone", {
                              initialValue: this.state.host_phone,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                        </Col>
                        <Col lg={24} xs={24}>
                          <label>
                            <IntlMessages id="column.email" /> :
                          </label>
                          <FormItem>
                            {getFieldDecorator("HostEmail", {
                              initialValue: this.state.host_email,
                            })(<Input disabled margin="none" />)}
                          </FormItem>
                          <hr></hr>
                        </Col>
                      </>
                    ) : null}
                    <Col lg={24} xs={24}>
                      <label>
                        <sup>
                          <span style={{ color: "red", fontSize: "10px" }}>
                            *
                          </span>
                        </sup>{" "}
                        <IntlMessages id="visitAdd.procedureType" /> :
                      </label>
                      <FormItem>
                        {getFieldDecorator("ProcedureType", {
                          initialValue: this.state.procedure_type,
                          rules: [
                            {
                              required: true,
                              message: (
                                <IntlMessages id="required.visitAdd.ProcedureType" />
                              ),
                            },
                          ],
                        })(
                          <Select
                            onChange={(value, event) =>
                              this.setState({ procedure_type: `${value}` })
                            }
                          >
                            {this.props.getProcedureType.map((item) => {
                              return (
                                <Option value={item.Id}>
                                  {item.ProcedureName}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
        {/* end add/edit visit modal */}
        {/* start add identity modal */}
        <AddIdentity
          open={addIdentityState}
          editIdentityFlag={this.state.editIdentityFlag}
          contact={this.state.contact}
          onIdentityClose={this.onIdentityClose}
        />
        {/* end add identity modal */}
        {/* start loader */}
        {this.props.loader ? (
          <div className="gx-loader-view">
            <CircularProgress />
          </div>
        ) : null}
        {/* end loader */}
      </Card>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_visits,
  hideMessage,
  setstatustoinitial,
  get_reportvisit,
  get_procedure_type,
  saveVisitData,
  readDeskoServiceData,
  openmodal,
  getIdentityDetails,
  getScheduleStatusChange,
  getScheduleVisit,
  getScheduleVisitSuccess,
  getScheduleVisitsList,
  addVisitStatusChange,
  addIdentityStatusChange,
  getScheduledVisitStatusChange,
  changeSaveTypeStatus,
  changeSavingTypeStatus,
  closeModalAfterSuccess,
  getEventAndInvitees,
};

const viewVisitReportForm = Form.create()(Visit);

const mapStateToProps = (state) => {
  return {
    getVisitsData: state.visitsReducers.get_visits_res,
    getScheduleList: state.visitsReducers.get_schedule_list,
    loader: state.visitsReducers.loader,
    showSuccessMessage: state.visitsReducers.showSuccessMessage,
    successMessage: state.visitsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.visitsReducers.showMessage,
    alertMessage: state.visitsReducers.alertMessage,
    status: state.visitsReducers.status,
    getProcedureType: state.visitsReducers.get_procedure_type_res,
    getDeskoServiceData: state.visitsReducers.get_desko_service_res,
    addVisitStatus: state.visitsReducers.addVisit,
    getScheduleStatus: state.visitsReducers.get_schedule_status,
    getIdentityData: state.visitsReducers.get_identity_details,
    addIdentityStatus: state.visitsReducers.addIdentity,
    scheduledVisitStatus: state.visitsReducers.getScheduledVisit,
    getScheduleVisitData: state.visitsReducers.get_scheduled_visit,
    saveTypeStatus: state.visitsReducers.saveTypeStatus,
    savingTypeStatus: state.visitsReducers.savingTypeStatus,
    saveVisitSuccess: state.visitsReducers.save_visit_success,
    closeModal: state.visitsReducers.closeModal,
    saveVisitUnsuccess: state.visitsReducers.save_visit_unsuccess,
    modalclosecall: state.identitiesReducers.modalclosecall,
    eventCast: state.visitsReducers.eventCast,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewVisitReportForm));
