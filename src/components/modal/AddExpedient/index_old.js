import React from "react";
import {
  Avatar,
  Input,
  Modal,
  Select,
  Empty,
  message,
  Upload,
  Button,
  Icon,
  Form,
} from "antd";
import { connect } from "react-redux";
import {
  get_expedients,
  get_expedient_form,
  close_expedient_modal,
} from "./../../../appRedux/actions/ExpedientsActions";
import IntlMessages from "util/IntlMessages";
import { baseURL } from "./../../../util/config";

var expedientArr = [];
var expedientList = "";
var expedient_value = "";
var expedient_form_control = {};
let userId = "";
const FormItem = Form.Item;
//var showHideSignatureDropdownType = false;

function buildFormData(formData, data, parentKey) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? "" : data;

    formData.append(parentKey, value);
  }
}

class AddExpedient extends React.Component {
  constructor(props) {
    super(props);

    const { id, dni, sanidad, dni2, dni3, dni4, name } = props.contact;
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
      //fileList: [],
      uploadfile: {},
      signatureRequired: false,
      expedientData: "",
    };
  }

  get_expedientFormFunction() {
    this.props.get_expedient_form();
  }

  componentDidMount() {
    //this.props.setstatustoinitial();
    this.get_expedientFormFunction();
  }

  handleSaveExpedientData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(["DNI"], (err, values) => {
      if (!err) {
        if (expedient_value == "") {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error("Expedient Type Is Required.");
          return false;
        }
        //console.log('selectedFiles => ', this.state.fileList, ' || uploadfile =>', this.state.uploadfile);
        //return false;
        //console.log('on save button data || expedient_form_control => ', expedient_form_control, ' || expedient_value => ', expedient_value, ' || dni => ', this.state.dni);

        let userdata = localStorage.getItem(branchName + "_data");
        if (userdata != "" && userdata != null) {
          let userData = JSON.parse(userdata);
          if (
            userData != "" &&
            userData != null &&
            userData["id"] != undefined
          ) {
            userId = userData["id"];
          }
        }

        var submitExpedientFormData = {
          DNI: this.state.dni,
          expedientType: expedient_value,
          licenseId: userId,
          FormControls: expedient_form_control,
        };
        const expedientDataForm = new FormData();
        expedientDataForm.append(
          "ExpedientDetail",
          JSON.stringify(submitExpedientFormData)
        );
        if (Object.entries(this.state.uploadfile).length != 0) {
          expedientDataForm.append("DocParticipant", this.state.uploadfile);
        } else {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error("Please upload participant file.");
          return false;
        }

        for (var key of expedientDataForm.entries()) {
          //console.log(key[0] + ', ' + key[1]);
        }

        let authBasic = "";
        authBasic = localStorage.getItem("setAuthToken");
        var submitUrl = baseURL + "CreateExpedient";

        const requestOptions = {
          method: "POST",
          headers: { Authorization: "Basic " + authBasic },
          mimeType: "multipart/form-data",
          body: expedientDataForm,
        };
        //console.log('addExpedient 1=> ', submitUrl, requestOptions);
        fetch(submitUrl, requestOptions)
          .then((response) => {
            //console.log('addExpedient 1.1=> ',response); //first consume it in console.log
            if (response.ok) {
              //console.log('addExpedient 2=> ',response, response.data); //first consume it in console.log
              return response.json(); //then consume it again, the error happens
            }
          })
          .then((data) => {
            console.log("addExpedient 3=> ", data);
            if (data != undefined) {
              var parsed_response = data;
              var response_status = parsed_response.status;
              var response_message = parsed_response.message;
              if (response_status) {
                message.destroy();
                message.config({
                  maxCount: 1,
                });
                message.success(response_message);
                this.props.close_expedient_modal();
                //console.log('addExpedient modal closed call => ');
                this.setState({
                  dni: "",
                  expedientData: "",
                  signatureRequired: false,
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
              message.error("Something went wrong, Please try again.");
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
      this.props.status == "Initial" ||
      (pageNumber == "" && sortBy == "" && status != "" && perPage != "")
    ) {
      this.props.get_expedients({
        pageNumber: 1,
        sortBy: "+VisitId",
        status: status,
        perPage: perPage,
      });
    } else {
      if (pageNumber == "") {
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
    //console.log('expedient_form_control Old => ', expedient_form_control);
    expedient_form_control = expedient_form_control.map(
      (singleObjectValue, key) => {
        //console.log('expedient_form_control singleObjectValue => ', singleObjectValue);
        if (singleObjectValue.id == id) {
          singleObjectValue.UserValue = value;
          //console.log('expedient_form_control map function => ', value, key, singleObjectValue.UserValue);
        } else {
          singleObjectValue = singleObjectValue;
        }
        return singleObjectValue;
      }
    );
    //console.log('expedient_form_control New => ', expedient_form_control);
    //console.log('form data => ', id, ' || ', value);
    //console.log('expedientFormData => ', e, e.target.placeholder, e.target.getAttribute("boxid"));
  };

  handleExpedientFormSelectBoxData = (
    value,
    id,
    signatureRequiredValue = ""
  ) => {
    // var tempexpedient_value = `${value}`;
    //console.log('expedientFormData 1=> ', value);
    //console.log('expedientFormData 2=> ', id);
    //console.log('expedientFormData 3=> ', signatureRequiredValue);
    //signatureRequired

    expedient_form_control = expedient_form_control.map(
      (singleObjectValue, key) => {
        //console.log('expedient_form_control singleObjectValue => ', singleObjectValue);
        if (singleObjectValue.id == id) {
          if (
            signatureRequiredValue == "signatureRequiredYes" &&
            value == "No"
          ) {
            //this.setState({signatureRequired: true});
            //showHideSignatureDropdownType = true;
            this.setState({ signatureRequired: true }, () =>
              console.log(
                "expedientFormData 4=> ",
                this.state.signatureRequired
              )
            );
            //console.log('expedientFormData 4=> ', this.state.signatureRequired);
          } else if (
            signatureRequiredValue == "signatureRequiredYes" &&
            value == "Yes"
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
          //console.log('expedient_form_control map function => ', value, key, singleObjectValue.UserValue);
        } else {
          singleObjectValue = singleObjectValue;
        }
        return singleObjectValue;
      }
    );
    //console.log('expedient_form_control New => ', expedient_form_control);
  };

  handleExpedientChange = (value) => {
    expedient_value = `${value}`;
    //console.log('expedient_value => ', expedient_value);
    const expedientData = this.props.get_expedientFormData.find(
      (singleExpedient) => {
        return singleExpedient.Id == expedient_value;
      }
    );
    expedient_form_control = expedientData.FormControls;
    this.setState({ expedientData }, () =>
      console.log("expedientFormData 10=> ", this.state.expedientData)
    );
  };

  componentDidUpdate() {
    // if(this.props.get_expedientFormData != ''){
    //    expedientList =  this.props.get_expedientFormData.map((value,key)=>{
    //       return (
    //         <option key={key} value={value.Id}>{value.expedientName}</option>
    //       )
    //    })
    // }
  }

  render() {
    //const { fileList } = this.state;
    const { uploadfile } = this.state;
    const fileuploadprops = {
      beforeUpload: (file) => {
        this.setState((state) => ({
          //fileList: [...state.fileList, file],
          uploadfile: file,
        }));
        //this.setState({uploadfile: file});
        return false;
      },
      //fileList,
    };
    //console.log('get_expedientFormData => ', this.props.get_expedientFormData, ' || expedientArr => ', expedientArr);
    const Option = Select.Option;
    const { onSaveExpedient, onExpedientClose, open, contact } = this.props;
    const { id, dni, sanidad, dni2, dni3, dni4, name } = this.state;
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
    return (
      <Modal
        title="Add Expedient"
        toggle={onExpedientClose}
        visible={open}
        maskClosable={false}
        closable={true}
        okText="Save"
        destroyOnClose={true}
        onOk={this.handleSaveExpedientData}
        okButtonProps={{ selected_expedient_value: expedient_value }}
        onCancel={onExpedientClose}
      >
        <Form onSubmit={this.handleSaveExpedientData}>
          <div className="gx-modal-box-row cust-dni">
            <div className="gx-modal-box-form-item">
              <div className="gx-form-group">
                <FormItem>
                  {getFieldDecorator("DNI", {
                    rules: [
                      {
                        required: true,
                        message: "DNI is Required.",
                        whitespace: true,
                      },
                    ],
                  })(
                    <Input
                      // required
                      placeholder="DNI*"
                      onChange={(event) =>
                        this.setState({ dni: event.target.value })
                      }
                      margin="none"
                    />
                  )}
                </FormItem>
                {/* <Input
                  required
                  placeholder="DNI*"
                  onChange={(event) => this.setState({dni: event.target.value})}
                  defaultValue={dni}
                  margin="none"/> */}
              </div>
              <div className="gx-form-group">
                <Select
                  className="ant-input"
                  onChange={this.handleExpedientChange}
                  defaultValue=""
                  margin="none"
                >
                  {/* {expedientList} */}
                  {this.props.get_expedientFormData.length &&
                    this.props.get_expedientFormData.map((value, key) => {
                      return (
                        <option key={key} value={value.Id}>
                          {value.expedientName}
                        </option>
                      );
                    })}
                </Select>
              </div>
              <Upload {...fileuploadprops}>
                <Button>
                  <Icon type="upload" /> Browse
                </Button>
              </Upload>
              {this.state.expedientData &&
                this.state.expedientData.FormControls.length > 0 &&
                this.state.expedientData.FormControls.map((value, key) => {
                  //const checkedString = '';
                  if (value.Type == "textBox") {
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
                  } else if (value.Type == "combobox") {
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
              {/* {this.state.expedientForm} */}
              <div id="display_expedient_form"></div>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_expedients,
  get_expedient_form,
  close_expedient_modal,
  //hideMessage,
  //setstatustoinitial,
};

const viewExpedientForm = Form.create()(AddExpedient);
const mapStateToProps = (state) => {
  return {
    getExpedientsData: state.expedientsReducers.get_expedients_res,
    get_expedientFormData: state.expedientsReducers.get_expedient_form_res,
    //loader : state.expedientsReducers.loader,
    //showSuccessMessage : state.expedientsReducers.showSuccessMessage,
    //successMessage : state.expedientsReducers.successMessage,
    //authUser : state.auth.authUser,
    //showMessage : state.expedientsReducers.showMessage,
    //alertMessage : state.expedientsReducers.alertMessage,
    //status : state.expedientsReducers.status,
  };
};

//export default AddExpedient;
export default connect(mapStateToProps, mapDispatchToProps)(viewExpedientForm);
