import React, { Component } from "react";
import { Col, Row, Card } from "antd";
import { Link } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import Widget from "components/Widget/index";
import IntlMessages from "util/IntlMessages";
import { webURL, branchName } from "util/config";
import { connect } from "react-redux";
import {
  readDeskoServiceData,
  clearData,
} from "./../../../../appRedux/actions/VisitsActions";

var newDeskoData = "";
var permitVisit = "";
var permitProcedure = "";
var permitIdentity = "";
var permitExpedient = "";
var permitInspection = "";
let businessprocedureList = "";

class Home extends Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.readDeskoServiceData();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      let permit_visit = userData.Permission.Visit.Visit_List;
      let businessprocedure_list =
        userData.Permission.BusinessProcedure.BusinessProcedure_List;
      let permit_procedure = userData.Permission.Procedure.Procedure_List;
      let permit_identity = userData.Permission.Employees.Identity_List;
      let permit_expedient = userData.Permission.Expedient.Expedient_List;
      let permit_inspection = userData.Permission.Inspection.Inspection_List;
      if (
        userData !== "" &&
        userData !== null &&
        permit_visit !== undefined &&
        permit_procedure !== undefined &&
        permit_identity !== undefined &&
        permit_expedient !== undefined &&
        permit_inspection !== undefined &&
        businessprocedure_list !== undefined
      ) {
        permitVisit = permit_visit;
        permitProcedure = permit_procedure;
        permitIdentity = permit_identity;
        permitExpedient = permit_expedient;
        permitInspection = permit_inspection;
        businessprocedureList = businessprocedure_list;
      }
    }

    if (
      this.props.getDeskoServiceData !== "" &&
      this.props.getDeskoServiceData !== null &&
      this.props.getDeskoServiceData !== undefined
    ) {
      if (JSON.stringify(this.props.getDeskoServiceData) == newDeskoData) {
        this.props.clearData();
        newDeskoData = "";
      } else if (
        JSON.stringify(this.props.getDeskoServiceData) != newDeskoData
      ) {
        newDeskoData = JSON.stringify(this.props.getDeskoServiceData);
        this.props.history.push({
          pathname: "/" + webURL + "main/home/visit",
        });
      }
    }

    return (
      <Auxiliary>
        <Row>
          <Col lg={24} md={24} sm={24} xs={24}>
            <Card
              className="welcome-div gx-card"
              title={<IntlMessages id="dashboard.welcomemsg" />}
            >
              {/* <Row>
                {language === 'English' ? <div className="cust-dynamic-html ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12" dangerouslySetInnerHTML={{__html: applicationMessageEng}} /> : language === 'Spanish' ? <div className="cust-dynamic-html ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12" dangerouslySetInnerHTML={{__html: applicationMessageSpa}} /> : <div className="cust-dynamic-html ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12" dangerouslySetInnerHTML={{__html: applicationMessageCat}} />}
                <Col lg={12} md={12} sm={12} xs={24}>
                  <div>
                    <img src={require('assets/images/dashboard/vector_smart_object.png')} alt='' className="dashboard-image"/>
                  </div>
                </Col>
              </Row> */}
              <Row>
                <Col lg={12} md={12} sm={12} xs={24}>
                  <h2 className="welcome-header">
                    <IntlMessages id="dashboard.welcomefirst" />
                  </h2>
                  <h2 className="welcome-header">
                    <IntlMessages id="dashboard.welcomesecond" />
                  </h2>
                  <h2 className="welcome-header">
                    <IntlMessages id="dashboard.welcomethird" />
                  </h2>
                  <h2 className="welcome-header">
                    <IntlMessages id="dashboard.welcomeforth" />
                  </h2>
                </Col>
                <Col lg={12} md={12} sm={12} xs={24}>
                  <div>
                    <img
                      src={require("assets/images/dashboard/vector_smart_object.png")}
                      alt="dashboard"
                      className="dashboard-image"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row className="custom-horizontal-scroll">
          {permitVisit === true ? (
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Link to={`/${webURL}main/home/visit`}>
                <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                  <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                    <i
                      className={`icon icon-ckeditor gx-fs-xxl gx-mr-2`}
                      style={{ fontSize: 40 }}
                    />
                  </div>
                  <h2 className="gx-mb-0 gx-text-white">
                    <IntlMessages id="dashboard.visit" />
                  </h2>
                </Widget>
              </Link>
            </Col>
          ) : null}

          {permitProcedure === true ? (
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Link to={`/${webURL}main/home/procedure`}>
                <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                  <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                    <i
                      className={`icon icon-culture-calendar gx-fs-xxl gx-mr-2`}
                      style={{ fontSize: 40 }}
                    />
                  </div>
                  <h2 className="gx-mb-0 gx-text-white">
                    <IntlMessages id="dashboard.process" />
                  </h2>
                </Widget>
              </Link>
            </Col>
          ) : null}

          {/* <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <Link to="/main/home/employee-work-log">
              <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                  <i className={`icon icon-profile gx-fs-xxl gx-mr-2`} style={{fontSize: 40}}/> */}
          {/*<Button onClick={this.onAddEmployee} className="arrow-btn">
                    <i className="icon icon-long-arrow-right gx-fs-xxl arrow"/>
                  </Button>
                  <EmployeeCheck open={addEmployeeState} contact={{
                      'id': 1,
                      'dni': '',
                    }} onSaveEmployee={this.onSaveEmployee}
                        onEmployeeClose={this.onEmployeeClose}/>*/}
          {/* </div>
                <h2 className="gx-mb-0 gx-text-white"><IntlMessages id="dashboard.employeeWorkBook"/></h2>
              </Widget>
            </Link>
          </Col> */}

          {permitIdentity === true ? (
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Link to={`/${webURL}main/home/employee`}>
                <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                  <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                    <i
                      className={`icon icon-auth-screen gx-fs-xxl gx-mr-2`}
                      style={{ fontSize: 40 }}
                    />
                  </div>
                  <h2 className="gx-mb-0 gx-text-white">
                    <IntlMessages id="dashboard.identity" />
                  </h2>
                </Widget>
              </Link>
            </Col>
          ) : null}

          {businessprocedureList === true ? (
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Link to={`/${webURL}main/home/business-procedure`}>
                <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                  <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                    <i
                      className={`icon icon-ckeditor gx-fs-xxl gx-mr-2`}
                      style={{ fontSize: 40 }}
                    />
                  </div>
                  <h2 className="gx-mb-0 gx-text-white">
                    <IntlMessages id="sidebar.procedures" />
                  </h2>
                </Widget>
              </Link>
            </Col>
          ) : null}

          {permitExpedient === true ? (
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Link to={`/${webURL}main/home/expedient`}>
                <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                  <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                    <i
                      className={`icon icon-tasks gx-fs-xxl gx-mr-2`}
                      style={{ fontSize: 40 }}
                    />
                  </div>
                  <h2 className="gx-mb-0 gx-text-white">
                    <IntlMessages id="dashboard.expedient" />
                  </h2>
                </Widget>
              </Link>
            </Col>
          ) : null}

          {permitInspection === true ? (
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Link to={`/${webURL}main/home/inspection`}>
                <Widget styleName="gx-blue-cyan-gradient gx-text-white gx-card-1367-p">
                  <div className="gx-flex-row gx-justify-content-between gx-mb-2">
                    <i
                      className={`icon icon-refer gx-fs-xxl gx-mr-2`}
                      style={{ fontSize: 40 }}
                    />
                  </div>
                  <h2 className="gx-mb-0 gx-text-white">
                    <IntlMessages id="dashboard.inspection" />
                  </h2>
                </Widget>
              </Link>
            </Col>
          ) : null}
        </Row>
      </Auxiliary>
    );
  }
}

const mapDispatchToProps = {
  readDeskoServiceData,
  clearData,
};
const mapStateToProps = (state) => {
  return {
    getDeskoServiceData: state.visitsReducers.get_desko_service_res,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
// export default Home;
