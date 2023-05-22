import React, { Component } from "react";
import {
  Divider,
  Table,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  message,
  Form,
  Modal,
  Select,
} from "antd";
import { connect } from "react-redux";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { webURL } from "./../../../../util/config";

const FormItem = Form.Item;
const { Search } = Input;
const Option = Select.Option;
var searchDetailProcedure = "";

class InstructionDetail extends Component {
  constructor() {
    super();
    this.state = {
      openInstructionViewModel: false,
      detailViewInstruction: [],
      columnTitle: "",
      procedure_type: "",
    };
  }

  handleViewInstructionDetail = (record, columnName) => {
    var recordArr = [];
    if (record.length === undefined) {
      recordArr = this.state.detailViewInstruction;
      recordArr.push(record);
    } else {
      recordArr = record;
    }
    this.setState({ columnTitle: columnName });
    this.setState({ detailViewInstruction: recordArr });
    this.setState({ openInstructionViewModel: true });
  };

  closeViewInstructionDetail = () => {
    this.setState({ detailViewInstruction: [] });
    this.setState({ openInstructionViewModel: false });
  };

  // componentDidMount() {
  //   this.setState({process_type})
  // }

  handleGoBack = () => {
    this.props.history.push({
      pathname: "/" + webURL + "main/home/procedure-detail",
      state: {
        passProcedureDetailData: this.props.location.state.backProcedureData,
      },
    });
  };

  render() {
    var proceduresData = this.props.location.state.passInstructionData;
    var process_type = this.props.location.state.processType;
    var procedureDetailData = [];
    console.log("pr-data---->", process_type);

    if (!proceduresData) {
      // Object is empty (Would return true in this example)
    } else {
      if (process_type === "oneFormWorkInstruction") {
        procedureDetailData.push(proceduresData.DataCaptureJson);
        console.log("test11");
      } else {
        procedureDetailData.push(proceduresData.InspectionJson);
        console.log("test22");
      }
      console.log("procedure data type---->", procedureDetailData);
      // procedureDetailData.push(proceduresData.InspectionJson);
    }

    var columns = [];
    if (procedureDetailData) {
      procedureDetailData.map((item, index) => {
        if (index === 0) {
          {
            if (process_type === "oneFormWorkInstruction") {
              Object.keys(item).map((key) => {
                if (key !== "Id" && key !== "documentPath") {
                  columns.push({
                    title: key,
                    dataIndex: key,
                    key: key,
                    render: (text, record) => (
                      <div>
                        <span className="">
                          {text === "" || text === null ? (
                            ""
                          ) : record[key].length === 0 ? (
                            <span>
                              <center>-</center>
                            </span>
                          ) : typeof text === "object" ? (
                            <span className="gx-link">
                              <Button
                                onClick={() =>
                                  this.handleViewInstructionDetail(
                                    record[key],
                                    key
                                  )
                                }
                                className="arrow-btn gx-link"
                                value={record.Id}
                              >
                                <IntlMessages id="procedureAction.viewDetail" />
                              </Button>
                            </span>
                          ) : typeof text === "boolean" ? (
                            text === true ? (
                              "True"
                            ) : (
                              "False"
                            )
                          ) : (
                            text
                          )}
                        </span>
                      </div>
                    ),
                  });
                }
              });
            } else {
              Object.keys(item).map((key) => {
                if (key !== "Id" && key !== "documentPath") {
                  columns.push({
                    title: key,
                    dataIndex: key,
                    key: key,
                    render: (text, record) => (
                      <div>
                        <span className="">
                          {text === "" || text === null ? (
                            ""
                          ) : record[key].length === 0 ? (
                            <span>
                              <center>-</center>
                            </span>
                          ) : typeof text === "object" ? (
                            <span className="gx-link">
                              <Button
                                onClick={() =>
                                  this.handleViewInstructionDetail(
                                    record[key],
                                    key
                                  )
                                }
                                className="arrow-btn gx-link"
                                value={record.Id}
                              >
                                <IntlMessages id="procedureAction.viewDetail" />
                              </Button>
                            </span>
                          ) : typeof text === "boolean" ? (
                            text === true ? (
                              "True"
                            ) : (
                              "False"
                            )
                          ) : (
                            text
                          )}
                        </span>
                      </div>
                    ),
                  });
                }
              });
            }
          }
        }
      });
    }

    return (
      <div className="ant-card gx-card ant-card-bordered custo_head_wrap">
        <div className="ant-card-head">
          <div className="ant-card-head-wrapper cust-head-arrow-title">
            <span
              className="gx-text-primary gx-fs-md gx-pointer gx-d-block"
              onClick={() => this.handleGoBack()}
            >
              <i
                className={`icon icon-long-arrow-left cust-gx-fs-xxl gx-d-inline-flex gx-vertical-align-middle`}
              />
            </span>
            <div className="ant-card-head-title cust-card-head-title">
              {this.props.location.state.backProcedureData.Name}
            </div>
          </div>
        </div>
        <div className="ant-card-body">
          <Table
            className="gx-table-responsive"
            columns={columns}
            dataSource={procedureDetailData}
            // scroll={{ x: true, y: 400 }}
            // style={{ whiteSpace: "pre" }}
            scroll={{ x: true }}
          />
          <Modal
            title={this.state.columnTitle}
            visible={this.state.openInstructionViewModel}
            destroyOnClose={true}
            onCancel={this.closeViewInstructionDetail}
            footer={null}
            width={700}
            className="cust-modal-width cust-session-modal detail-modal"
          >
            {this.state.detailViewInstruction.map((item) => {
              if (typeof item === "object") {
                return (
                  <>
                    <Row className="detail-row">
                      {Object.keys(item).map((key, index) => {
                        if (index % 2 === 0) {
                          return (
                            <Col lg={12}>
                              <div className="det-row">
                                <span>
                                  <b>{key}</b> :{" "}
                                  <span style={{ color: "#afafaf" }}>
                                    {item[key]}
                                  </span>
                                </span>
                              </div>
                            </Col>
                          );
                        } else {
                          return (
                            <Col lg={12}>
                              <div className="det-row">
                                <span>
                                  <b>{key}</b> :{" "}
                                  <span style={{ color: "#afafaf" }}>
                                    {item[key]}
                                  </span>
                                </span>
                              </div>
                            </Col>
                          );
                        }
                      })}
                    </Row>
                  </>
                );
              } else {
                return (
                  <Row className="detail-row">
                    <Col lg={24}>
                      <div className="det-row">
                        <label>{item}</label>
                      </div>
                    </Col>
                  </Row>
                );
              }
            })}
          </Modal>
          {this.props.loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {};

const viewDetailedInstructionForm = Form.create()(InstructionDetail);

const mapStateToProps = (state) => {
  return {};
};

// export default Inspection;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(viewDetailedInstructionForm);
