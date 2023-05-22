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
  Checkbox,
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import {
  get_procedures,
  get_procedure_form,
  open_procedure_modal,
  close_procedure_modal,
} from "./../../../appRedux/actions/ProceduresActions";
import { baseURL } from "./../../../util/config";
import IdentityList from "./../../../routes/main/home/Crypto/identitylist";
import IntlMessages from "util/IntlMessages";
import { FormattedMessage } from "react-intl";
import DayPicker, { DateUtils } from "react-day-picker";
import { Multiselect } from "multiselect-react-dropdown";
import "react-day-picker/lib/style.css";

var procedure_value = "";
let userId = "";
let langName = "";
var dateArray = [];
var datetimeArray = [];
var FormControlsList = [];

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const plainOptions = [
  { label: <IntlMessages id="addexpedient.optionyes" />, value: "yes" },
  { label: <IntlMessages id="addexpedient.optionno" />, value: "no" },
];

class AddProcedure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      procedureDNI: "",
      procedureDNI2: "",
      procedureDNI3: "",
      isSigner2: false,
      isSigner3: false,
      procedureForm: "",
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
      ProcedureName: "",
      signRequireForClosingProcedure: "",
      signtypeownerChange: "",
      docgenrationType: "",
      MaxParticipate: 0,
      OwnerList: [],
      ParticipantList: [],
      showtime: false,
      timestring: "",
    };
  }

  get_proceddureFormFunction() {
    this.props.get_procedure_form();
  }

  componentDidMount() {
    this.get_proceddureFormFunction();
  }

  handleSaveProcedureData = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(["DNI"], (err, values) => {
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

        if (procedure_value === "") {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error("Procedure Type Is Required.");
          return false;
        }
        var signerList = [
          {
            DNI: this.state.procedureDNI2,
            isSigner: this.state.isSigner2,
          },
          {
            DNI: this.state.procedureDNI3,
            isSigner: this.state.isSigner3,
          },
        ];
        var submitProcedureFormData = {
          DNI: this.state.procedureDNI,
          procedureType: procedure_value,
          licenseId: userId,
          deviceId: null,
          SignerList: signerList,
          FormControls: FormControlsList,
        };
        console.log("submitProcedureFormData=>", submitProcedureFormData);

        var submitUrl = baseURL + "SaveProcedure?lang=" + langName;

        // const requestOptions = {
        //   method: 'POST', submitProcedureFormData,
        //   headers: { 'Content-Type': 'application/json'
        //   }
        // };
        fetch(submitUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + authBasic,
          },
          body: JSON.stringify(submitProcedureFormData),
        })
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
                this.props.close_procedure_modal(1);
                FormControlsList = [];
                this.setState({
                  procedureDNI: "",
                  procedureDNI2: "",
                  procedureDNI3: "",
                  isSigner2: false,
                  isSigner3: false,
                  procedureForm: "",
                });
                this.get_proceduresById();
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

  get_proceduresById(
    pageNumber = "",
    sortBy = "",
    status = "",
    perPage = "10"
  ) {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && sortBy === "" && status !== "" && perPage !== "")
    ) {
      this.props.get_procedures({
        pageNumber: 1,
        sortBy: "+Id",
        status: status,
        perPage: perPage,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      this.props.get_procedures({
        pageNumber: pageNumber,
        sortBy: sortBy,
        status: status,
        perPage: perPage,
      });
    }
  }

  handleProcedureChange = (value) => {
    procedure_value = `${value}`;
    const procedureData = this.props.get_procedureFormData.find(
      (singleProcedure) => {
        return singleProcedure.ProcedureId == procedure_value;
      }
    );

    var tempProcedureForm = "";
    tempProcedureForm = procedureData.FormControls.map((value, key) => {
      if (value.Type == "textBox") {
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
                      value.Type
                    )
                  }
                  margin="none"
                />
              </Col>
            </Row>
          </div>
        );
      } else if (value.Type == "textArea") {
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
                      value.Type
                    )
                  }
                  margin="none"
                />
              </Col>
            </Row>
          </div>
        );
      } else if (value.Type == "comboBox") {
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
                      value.Type
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
      }
    });
    this.setState({ procedureForm: tempProcedureForm });
  };

  handleSetFieldValue = (e, procedure_id, key, type) => {
    var procedureData = this.props.get_procedureFormData.find((procedureId) => {
      return procedureId.ProcedureId == procedure_id;
    });

    var tempFormData = "";
    if (procedureData) {
      tempFormData = procedureData.FormControls[key];
      if (type === "comboBox") {
        tempFormData.UserValue = e;
      } else {
        tempFormData.UserValue = e.target.value;
      }
    }
    procedureData.FormControls[key] = tempFormData;
    FormControlsList = procedureData.FormControls;
    console.log("procedureData=>", procedureData.FormControls);
  };

  componentDidUpdate() {
    if (this.props.proceduremodalclosecall === 1) {
      this.setState({
        procedureDNI: "",
        procedureDNI2: "",
        procedureDNI3: "",
        isSigner2: false,
        isSigner3: false,
        procedureForm: "",
      });
      this.props.close_procedure_modal(2);
    }
  }

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

  render() {
    const { onProcedureClose, open } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        destroyOnClose={true}
        title={<IntlMessages id="addprocedure.title" />}
        toggle={onProcedureClose}
        visible={open}
        maskClosable={false}
        closable={true}
        okText={<IntlMessages id="additentity.save" />}
        onOk={this.handleSaveProcedureData}
        okButtonProps={{ selected_procedure_value: procedure_value }}
        onCancel={onProcedureClose}
        width="500px"
      >
        <Form onSubmit={this.handleSaveProcedureData} preserve={false}>
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
                          message: <IntlMessages id="required.DNIIsRequired" />,
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
                  <Col lg={16}>
                    <label>
                      <IntlMessages id="DNI2" />
                    </label>
                    {getFieldDecorator("DNI2", {
                      initialValue: this.state.procedureDNI2,
                      rules: [
                        {
                          required: true,
                          message: <IntlMessages id="required.DNIIsRequired" />,
                          whitespace: true,
                        },
                      ],
                    })(
                      <Input
                        className="ant-input"
                        // required
                        // placeholder="Expedient Name"
                        onChange={(event) =>
                          this.setState({ procedureDNI2: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </Col>
                  <Col lg={8}>
                    <Checkbox
                      onChange={(event) => this.handleChangeSigner2(event)}
                    >
                      <IntlMessages id="addprocedure.isSigner" />
                    </Checkbox>
                  </Col>
                </Row>
              </div>
              <div className="gx-form-group">
                <Row>
                  <Col lg={16}>
                    <label>
                      <IntlMessages id="DNI3" />
                    </label>
                    {getFieldDecorator("DNI3", {
                      initialValue: this.state.procedureDNI3,
                      rules: [
                        {
                          required: true,
                          message: <IntlMessages id="required.DNIIsRequired" />,
                          whitespace: true,
                        },
                      ],
                    })(
                      <Input
                        className="ant-input"
                        // required
                        // placeholder="Expedient Name"
                        onChange={(event) =>
                          this.setState({ procedureDNI3: event.target.value })
                        }
                        margin="none"
                      />
                    )}
                  </Col>
                  <Col lg={8}>
                    <Checkbox
                      onChange={(event) => this.handleChangeSigner3(event)}
                    >
                      <IntlMessages id="addprocedure.isSigner" />
                    </Checkbox>
                  </Col>
                </Row>
              </div>
              {this.state.procedureForm}
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
  get_procedures,
  get_procedure_form,
  //get_identities,
  open_procedure_modal,
  close_procedure_modal,
  //hideMessage,
  //setstatustoinitial,
};

const viewProcedureForm = Form.create()(AddProcedure);
const mapStateToProps = (state) => {
  return {
    get_procedureFormData: state.proceduresReducers.get_procedure_form_res,
    proceduremodalclosecall: state.proceduresReducers.proceduremodalclosecall,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(viewProcedureForm);
