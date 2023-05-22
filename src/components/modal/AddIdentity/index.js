import React from "react";
import {
  Input,
  Modal,
  Row,
  Col,
  Select,
  Radio,
  message,
  Form,
  DatePicker,
} from "antd";
import { baseURL, branchName } from "./../../../util/config";
import { connect } from "react-redux";
import {
  get_identities,
  closemodal,
} from "./../../../appRedux/actions/IdentitiesActions";
import {
  setGlobaldata,
  getScheduleVisitsList,
} from "./../../../appRedux/actions/VisitsActions";
import IntlMessages from "util/IntlMessages";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { injectIntl } from "react-intl";
import moment from "moment";

let userId = "";
let langName = "";
const FormItem = Form.Item;
let timeout;
let currentValue;
let identityId = "";
let test = "";

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

class AddIdentity extends React.Component {
  constructor(props) {
    super(props);

    const {
      id,
      dni,
      company_name,
      name,
      identifier,
      surname,
      landline,
      second_surname,
      card_number,
      email,
      mobile,
      extType,
      birthDate,
      parentId,
      radioValue,
      isMinor,
      parentName,
    } = props.contact;
    this.state = {
      id,
      dni,
      company_name,
      name,
      identifier,
      surname,
      landline,
      second_surname,
      card_number,
      email,
      mobile,
      parentName,
      extType,
      birthDate,
      isMinor,

      parentId,
      radioValue,
      birthdayYears: "",

      licenseId: 2,
      identityList: [],
      formType: "add",
      modalclosestart: false,
      searchWord: "",
    };
    if (props.contact.id !== "") {
      this.setState({ formType: "edit" });
    }
  }

  handleAnyValidation = (rule, value, callback) => {
    if (value && isNaN(value)) {
      callback("Only numbers can be entered");
    } else if (value && (value.length < 10 || value.length > 10)) {
      callback("Mobile number must be 10 digits");
    } else {
      callback();
    }
  };

  handlePhonenumberValidation = (rule, value, callback) => {
    if (value && isNaN(value)) {
      callback("Only numbers can be entered");
    } else if (value && (value.length < 8 || value.length > 8)) {
      callback("Mobile number must be 8 digits");
    } else {
      callback();
    }
  };

  handlecardNumberValidation = (rule, value, callback) => {
    if (value && isNaN(value)) {
      callback("Only numbers can be entered");
    } else {
      callback();
    }
  };

  handleChangeBirthdate = (date, dateString) => {
    this.setState({ birthDate: dateString });

    var bday = new Date(dateString);
    var today = new Date();
    var distance = today.getFullYear() - bday.getFullYear();

    if (distance < 18) {
      this.setState({ birthdayYears: distance });

      this.props.contact.isMinor = true;
    } else {
      this.setState({ birthdayYears: "" });
      this.props.contact.isMinor = false;
    }
  };

  handleSearchUser = (search) => {
    var keyword = search.trim();
    if (keyword && keyword.length >= 3) {
      fetchList(keyword, (data) => {
        this.setState({ identityList: data });
      });
    }
  };

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["DNI", "Name", "Surname", "SecondSurname", "Email", "Mobile"],
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
          console.log("e.currentTarget", e.currentTarget);
          var methodType = "";
          var editType = "";
          var saveRecordType = e.currentTarget.getAttribute("editflag");
          var editId = e.currentTarget.getAttribute("id");
          var editDni = e.currentTarget.getAttribute("dni");
          var editCompany_name = e.currentTarget.getAttribute("company_name");
          var editName = e.currentTarget.getAttribute("name");
          var editIdentifier = e.currentTarget.getAttribute("identifier");
          var editSurname = e.currentTarget.getAttribute("surname");
          var editLandline = e.currentTarget.getAttribute("landline");
          var editSecond_surname =
            e.currentTarget.getAttribute("second_surname");
          var editCard_number = e.currentTarget.getAttribute("card_number");
          var editEmail = e.currentTarget.getAttribute("email");
          var editMobile = e.currentTarget.getAttribute("mobile");
          var tempEditType = e.currentTarget.getAttribute("extType");
          var editBirthDate = e.currentTarget.getAttribute("birthDate");
          var editParentId = e.currentTarget.getAttribute("parentId");
          var editRadioValue = e.currentTarget.getAttribute("radioValue");
          var is_blackList = false;
          var is_whiteList = false;
          var tempRadioValue = this.state.radioValue
            ? this.state.radioValue
            : editRadioValue;
          if (tempRadioValue === "blacklisted") {
            is_blackList = true;
          } else if (tempRadioValue === "whitelisted") {
            is_whiteList = true;
          }
          if (
            tempEditType === null ||
            tempEditType === undefined ||
            tempEditType === ""
          ) {
            editType = "External";
          }

          console.log("edit parent id---->", editParentId);

          var submitUrl = "";
          var dataobject = "";
          if (saveRecordType === "edit") {
            methodType = "PUT";
            submitUrl = baseURL + "UpdateIdentity?lang=" + langName;

            var finalDni = this.state.dni ? this.state.dni : editDni;
            var finalName = this.state.name ? this.state.name : editName;
            var finalFatherSurname = this.state.surname
              ? this.state.surname
              : editSurname;
            var finalMotherSurname = this.state.second_surname
              ? this.state.second_surname
              : editSecond_surname;
            var finalEmail = this.state.email ? this.state.email : editEmail;
            var finalCompanyName = this.state.company_name
              ? this.state.company_name
              : editCompany_name;
            var finalPhoneNumber = this.state.landline
              ? this.state.landline
              : editLandline;
            var finalMobileNumber = this.state.mobile
              ? this.state.mobile
              : editMobile;
            var finalNICSNo = this.state.card_number
              ? this.state.card_number
              : editCard_number;
            var finalIdentifier = this.state.identifier
              ? this.state.identifier
              : editIdentifier;
            var finalBirthDate = this.state.birthDate
              ? this.state.birthDate
              : editBirthDate;
            var finalParentId = this.state.parentId
              ? this.state.parentId
              : this.props.contact.parentId;
            var finalType = this.state.extType
              ? this.state.extType
              : tempEditType;
            var finalIsMinor =
              this.props.contact.isMinor == true ? true : false;
            var finalParentName = this.state.parentName
              ? this.state.parentName
              : this.props.contact.parentName;

            // console.log("parent name---->", finalParentName);
            // console.log("final parent id---->", finalParentId);

            dataobject = {
              id: editId,
              DNI: finalDni,
              Name: finalName,
              FatherSurname: finalFatherSurname,
              MotherSurname: finalMotherSurname,
              Email: finalEmail,
              CompanyName: finalCompanyName,
              PhoneNumber: finalPhoneNumber,
              MobileNumber: finalMobileNumber,
              NICSNo: finalNICSNo,
              identifier: finalIdentifier,
              BirthDate: finalBirthDate,
              ParentId: finalParentId,
              IsMinore: finalIsMinor,
              Type: finalType,
              ParentName: finalParentName,
              licenseId: userId,
              IS_BlackList: is_blackList,
              IS_WhiteList: is_whiteList,
            };
          } else {
            dataobject = {
              DNI: this.state.dni ? this.state.dni : this.props.contact.dni,
              Name: this.state.name ? this.state.name : this.props.contact.name,
              FatherSurname: this.state.surname
                ? this.state.surname
                : this.props.contact.surname,
              MotherSurname: this.state.second_surname
                ? this.state.second_surname
                : this.props.contact.second_surname,
              Email: this.state.email,
              CompanyName: this.state.company_name
                ? this.state.company_name
                : this.props.contact.company_name,
              PhoneNumber: this.state.landline,
              MobileNumber: this.state.mobile,
              NICSNo: this.state.card_number
                ? this.state.card_number
                : this.props.contact.card_number,
              identifier: this.state.identifier,
              BirthDate: this.state.birthDate
                ? this.state.birthDate
                : this.props.contact.birthDate,
              ParentId: this.state.parentId
                ? this.state.parentId
                : this.props.contact.parentId,
              ParentName: this.state.parentName
                ? this.state.parentName
                : this.props.contact.parentName,
              // // BirthDate: this.state.birthDate,
              // ParentId: this.state.parentId,
              IsMinore: this.state.birthdayYears != "" ? true : false,
              Type: this.state.extType ? this.state.extType : "External",
              licenseId: userId,
              IS_BlackList: is_blackList,
              IS_WhiteList: is_whiteList,
            };

            methodType = "POST";
            submitUrl = baseURL + "addIdentity?lang=" + langName;
          }
          if (this.state.mobile) {
            if (this.state.mobile.length < 9) {
              message.destroy();
              message.config({
                maxCount: 1,
              });
              message.error(
                this.props.intl.formatMessage({
                  id: "addIdentity.MobileRequired",
                })
              );
              return false;
            }
          } else {
            if (editMobile.length < 9) {
              message.destroy();
              message.config({
                maxCount: 1,
              });
              message.error(
                this.props.intl.formatMessage({
                  id: "addIdentity.MobileRequired",
                })
              );
              return false;
            }
          }

          let authBasic = "";

          authBasic = localStorage.getItem("setAuthToken");
          const requestOptions = {
            method: methodType,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + authBasic,
            },
            body: JSON.stringify(dataobject),
          };

          fetch(submitUrl, requestOptions)
            .then((response) => {
              if (response.ok) {
                return response.json(); //then consume it again, the error happens
              }
            })
            .then((data) => {
              console.log("data--->", data);
              var parsed_response = data;
              var response_status = parsed_response.status;
              var response_message = parsed_response.message;
              if (response_status) {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                message.success(response_message);
                this.setState({
                  modalclosestart: true,
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
                  extType: "",
                  birthDate: "",
                  parentId: "",
                  parentName: "",
                  radioValue: "",
                });
                this.props.closemodal();
                this.props.getScheduleVisitsList();
                let pageURL = window.location.href;
                let lastURLSegment = pageURL.substr(
                  pageURL.lastIndexOf("/") + 1
                );
                if (lastURLSegment === "identities") {
                  this.get_identitiesById();
                } else {
                  this.get_identitiesById();
                  this.searchGlobalrecords("");
                }
                // this.get_identitiesById();
                // this.searchGlobalrecords('');
              } else {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                message.error(response_message);
              }
            });
        }
      }
    );
  };

  searchGlobalrecords = (e) => {
    if (e === "") {
      e = localStorage.getItem("searchWord");
    }
    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");

    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    };

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

    fetch(
      baseURL +
        "Searchall?licenceId=" +
        userId +
        "&searchKeyWord=" +
        e +
        "&lang=" +
        langName,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.props.setGlobaldata(data.data);
      });
  };

  get_identitiesById(
    pageNumber = "",
    sortBy = "-id",
    perPage = "10",
    filterTag = "",
    searchTerm = ""
  ) {
    /*var {editFilterSorting} = this.props;
    if(editFilterSorting.pageNumber != '') {
      pageNumber = editFilterSorting.pageNumber;
    }
    if(editFilterSorting.sortBy != '') {
      sortBy = editFilterSorting.sortBy;
    }
    if(editFilterSorting.perPage != '') {
      perPage = editFilterSorting.perPage;
    }
    if(editFilterSorting.filterTag != '') {
      filterTag = editFilterSorting.filterTag;
    }
    if(editFilterSorting.searchTerm != '') {
      searchTerm = editFilterSorting.searchTerm;
    }*/
    //console.log('search value state=> ', this.state.searchTerm, ' || filter value state => ', this.state.filterTag);

    if (this.props.status === "Initial") {
      this.props.get_identities({
        pageNumber: 1,
        sortBy: "-id",
        perPage: perPage,
        filterTag: filterTag,
        searchTerm: searchTerm,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-id";
      }
      this.props.get_identities({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        filterTag: filterTag,
        searchTerm: searchTerm,
      });
    }
  }
  render() {
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    var { onIdentityClose, open } = this.props;
    var { contact, editIdentityFlag } = this.props;

    console.log("birthdate---->", this.state.birthDate);

    var modalTitle = "";

    // console.log("edit type==>", contact.parentId);
    // console.log("props==>", this.props.contact.parentId);

    var disableDniield = false;
    if (editIdentityFlag === "") {
      modalTitle = <IntlMessages id="identity.addidentity" />;
    } else {
      modalTitle = <IntlMessages id="identity.editidentity" />;
      disableDniield = true;
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={modalTitle}
        maskClosable={false}
        toggle={onIdentityClose}
        visible={open}
        closable={true}
        okText={<IntlMessages id="additentity.save" />}
        destroyOnClose={true}
        onOk={this.handleOk}
        okButtonProps={{
          editFlag: editIdentityFlag,
          id: contact.id,
          dni: contact.dni,
          company_name: contact.company_name,
          name: contact.name,
          identifier: contact.identifier,
          surname: contact.surname,
          landline: contact.landline,
          second_surname: contact.second_surname,
          card_number: contact.card_number,
          email: contact.email,
          mobile: contact.mobile,
          extType: contact.extType,
          birthDate: contact.birthDate,
          parentId: contact.parentId,
          radioValue: contact.radioValue,
        }}
        onCancel={onIdentityClose}
        className="cust-modal-width"
      >
        <div className="gx-modal-box-row">
          <div className="gx-modal-box-form-item">
            <Form onSubmit={this.handleOk}>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12} xs={24}>
                    <lable>
                      <sup>
                        <span style={{ color: "red", fontSize: "10px" }}>
                          *
                        </span>
                      </sup>{" "}
                      <IntlMessages id="addidentity.DNI" /> :
                    </lable>
                    <FormItem>
                      {getFieldDecorator("DNI", {
                        initialValue: contact.dni,
                        rules: [
                          {
                            required: false,
                            message: (
                              <IntlMessages id="required.DNIIsRequired" />
                            ),
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          disabled={disableDniield}
                          onChange={(event) =>
                            this.setState({ dni: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12} xs={24}>
                    <lable>
                      {" "}
                      <IntlMessages id="addidentity.CompanyName" /> :
                    </lable>
                    <FormItem>
                      {getFieldDecorator("CompanyName", {
                        initialValue: contact.company_name,
                        rules: [
                          {
                            message: "Company Name is Required.",
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          // placeholder="Company Name (Optional)"
                          onChange={(event) =>
                            this.setState({ company_name: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12} xs={24}>
                    <lable>
                      <sup>
                        <span style={{ color: "red", fontSize: "10px" }}>
                          *
                        </span>
                      </sup>{" "}
                      <IntlMessages id="addidentity.Name" /> :
                    </lable>
                    <FormItem>
                      {getFieldDecorator("Name", {
                        initialValue: contact.name,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.NameIsRequired" />
                            ),
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          required
                          // placeholder="Name*"
                          onChange={(event) =>
                            this.setState({ name: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12} xs={24}>
                    <lable>
                      {" "}
                      <IntlMessages id="addidentity.Identifier" /> :
                    </lable>
                    <FormItem>
                      {getFieldDecorator("Identifier", {
                        initialValue: contact.identifier,
                        rules: [
                          {
                            message: "Invalid Identifier.",
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          required
                          // placeholder="Identifier (Optional)"
                          onChange={(event) =>
                            this.setState({ identifier: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12} xs={24}>
                    <lable>
                      <sup>
                        <span style={{ color: "red", fontSize: "10px" }}>
                          *
                        </span>
                      </sup>{" "}
                      <IntlMessages id="addidentity.Surname" /> :
                    </lable>
                    <FormItem>
                      {getFieldDecorator("Surname", {
                        initialValue: contact.surname,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.SurnameIsRequired" />
                            ),
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          // placeholder="Surname*"
                          onChange={(event) =>
                            this.setState({ surname: event.target.value })
                          }
                          margin="normal"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12} xs={24}>
                    <label>
                      <IntlMessages id="addidentity.Landline" /> :
                    </label>
                    <FormItem>
                      {getFieldDecorator("Landline", {
                        initialValue: contact.landline,
                        rules: [
                          {
                            message: "Invalid Landline.",
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          required
                          // placeholder="Landline (Optional)"
                          onChange={(event) =>
                            this.setState({ landline: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12} xs={24}>
                    <label>
                      <sup>
                        <span style={{ color: "red", fontSize: "10px" }}>
                          *
                        </span>
                      </sup>{" "}
                      <IntlMessages id="addidentity.SecondSurname" /> :
                    </label>
                    <FormItem>
                      {getFieldDecorator("SecondSurname", {
                        initialValue: contact.second_surname,
                        rules: [
                          {
                            required: true,
                            message: (
                              <IntlMessages id="required.SecondSurnameIsRequired" />
                            ),
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          // placeholder="Second Surname*"
                          onChange={(event) =>
                            this.setState({
                              second_surname: event.target.value,
                            })
                          }
                          margin="normal"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12} xs={24}>
                    <label>
                      <IntlMessages id="addidentity.CardNumber" /> :
                    </label>
                    <FormItem>
                      {getFieldDecorator("CardNumber", {
                        initialValue: contact.card_number,
                        rules: [
                          {
                            message: "Invalid Card Number.",
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input
                          required
                          // placeholder="Card Number (Optional)"
                          onChange={(event) =>
                            this.setState({ card_number: event.target.value })
                          }
                          margin="none"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <label>
                  <sup>
                    <span style={{ color: "red", fontSize: "10px" }}>*</span>
                  </sup>{" "}
                  <IntlMessages id="addidentity.Email" /> :
                </label>
                <FormItem>
                  {getFieldDecorator("Email", {
                    initialValue: contact.email,
                    rules: [
                      {
                        type: "email",
                        message: (
                          <IntlMessages id="addidentity.EmailErrorMessage" />
                        ),
                      },
                      {
                        required: true,
                        message: <IntlMessages id="required.EmailIsRequired" />,
                        whitespace: true,
                      },
                    ],
                  })(
                    <Input
                      required
                      // placeholder="Email*"
                      onChange={(event) =>
                        this.setState({ email: event.target.value })
                      }
                      margin="none"
                    />
                  )}
                </FormItem>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={12} xs={24}>
                    <label>
                      <sup>
                        <span style={{ color: "red", fontSize: "10px" }}>
                          *
                        </span>
                      </sup>
                      <IntlMessages id="addidentity.Mobile" /> :
                    </label>
                    <FormItem>
                      {getFieldDecorator("Mobile", {
                        initialValue: contact.mobile,
                        rules: [
                          {
                            required: true,
                            message: <IntlMessages id="required.mobileno" />,
                            whitespace: true,
                          },
                        ],
                      })(
                        <PhoneInput
                          inputProps={{
                            required: true,
                          }}
                          country={"es"}
                          onChange={(countryCode) =>
                            this.setState({ mobile: countryCode })
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                  {/* <Col lg={12} xs={24}>
                    <label> &nbsp; </label>
                    <Select
                      className="ant-input"
                      onChange={(value, event) =>
                        this.setState({ type: `${value}` })
                      }
                      // placeholder="Select Any Option"
                      defaultValue={contact.type ? contact.type : "External"}
                      margin="none"
                    >
                      <Option value="Internal">
                        <IntlMessages id="additentity.internal" />
                      </Option>
                      <Option value="External">
                        <IntlMessages id="additentity.external" />
                      </Option>
                    </Select>
                  </Col> */}

                  <Col lg={12} xs={24}>
                    <label>
                      <label> &nbsp; </label>
                    </label>
                    <FormItem>
                      {getFieldDecorator("extType", {
                        initialValue: contact.extType,

                        rules: [
                          {
                            required: false,
                          },
                        ],
                      })(
                        <Select
                          onChange={(value, event) =>
                            this.setState({ extType: `${value}` })
                          }
                        >
                          <Option value="Internal">
                            <IntlMessages id="additentity.internal" />
                          </Option>
                          <Option value="External">
                            <IntlMessages id="additentity.external" />
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>

              <div className="gx-form-group">
                <Row>
                  <Col lg={12} xs={24}>
                    <lable>
                      <sup>
                        <span style={{ color: "red", fontSize: "10px" }}>
                          *
                        </span>
                      </sup>{" "}
                      <IntlMessages id="addidentity.birthdate" /> :
                    </lable>
                    <FormItem>
                      {getFieldDecorator("BirthDate", {
                        initialValue:
                          contact.birthDate != null ||
                          this.state.birthDate != ""
                            ? moment(contact.birthDate)
                            : "",
                        rules: [
                          {
                            type: "object",
                            required: true,
                            message: <IntlMessages id="required.birthdate" />,
                            whitespace: true,
                          },
                        ],
                      })(
                        <DatePicker
                          className="inline-inputs"
                          format="YYYY-MM-DD"
                          onChange={this.handleChangeBirthdate}
                        />
                      )}
                    </FormItem>
                  </Col>
                  {this.state.birthdayYears != "" ||
                  (this.props.contact.isMinor != false &&
                    this.props.contact.isMinor != null) ? (
                    <Col lg={12} xs={24}>
                      <label>
                        <IntlMessages id="addidentity.ParentId" /> :
                      </label>
                      <FormItem>
                        {getFieldDecorator("parentId", {
                          initialValue: contact.parentName,

                          rules: [
                            {
                              required: true,
                              message: <IntlMessages id="required.ParentId" />,
                            },
                          ],
                        })(
                          <Select
                            showSearch
                            defaultActiveFirstOption={false}
                            showArrow={true}
                            filterOption={false}
                            onSearch={this.handleSearchUser}
                            onChange={(value, event) => {
                              this.setState({ parentId: `${value}` });
                            }}
                            notFoundContent={null}
                          >
                            {Object.keys(this.state.identityList).length > 0
                              ? this.state.identityList.map((item) => {
                                  return (
                                    <Option
                                      onClick={(e) =>
                                        this.setState({ parentName: item.DNI })
                                      }
                                      value={item.id}
                                    >
                                      {item.DNI}
                                    </Option>
                                  );
                                })
                              : null}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
              </div>

              <div className="gx-form-group">
                <FormItem>
                  {getFieldDecorator("radioValue", {
                    initialValue: contact.radioValue ? contact.radioValue : "",
                    rules: [
                      {
                        required: true,
                        message: "Please Choose your option!",
                      },
                    ],
                  })(
                    <RadioGroup
                      name={"radioValue"}
                      onChange={(event) =>
                        this.setState({ radioValue: event.target.value })
                      }
                    >
                      <Radio value={"blacklisted"}>
                        <IntlMessages id="additentity.blackListed" />
                      </Radio>
                      <Radio value={"whitelisted"}>
                        <IntlMessages id="additentity.whiteListed" />
                      </Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}
const mapDispatchToProps = {
  get_identities,
  closemodal,
  setGlobaldata,
  getScheduleVisitsList,
};
const viewIdentityForm = Form.create()(AddIdentity);
const mapStateToProps = (state) => {
  return {
    getIdentitiesData: state.identitiesReducers.get_identities_res,
    loader: state.identitiesReducers.loader,
    showSuccessMessage: state.identitiesReducers.showSuccessMessage,
    successMessage: state.identitiesReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.identitiesReducers.showMessage,
    alertMessage: state.identitiesReducers.alertMessage,
    status: state.identitiesReducers.status,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(viewIdentityForm));
