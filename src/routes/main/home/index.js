import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import { branchName } from "util/config";
import { useDispatch } from "react-redux";
import {
  userSignOut,
  // userRolePermissionByUserId
} from "appRedux/actions/Auth";

const Home = ({ match }) => {
  const dispatch = useDispatch();
  // let IdentityId = '';
  // let identityList = '';
  let visitList = "";
  let procedureList = "";
  let expedientList = "";
  let inspectionList = "";
  let businessprocedureList = "";
  let businessprocedureAdd = "";
  let areaList = "";
  let departmentList = "";
  let serviceList = "";
  let processList = "";
  let giaCongigurationList = "";
  let userdata = localStorage.getItem(branchName + "_data");
  let userData = JSON.parse(userdata);

  if (userData !== null) {
    if (userData) {
      if (userdata !== "" && userdata !== null) {
        // let identity_list = userData.Permission.Employees.Identity_List;
        let visit_list = userData.licenceVisit;
        let procedure_list = userData.licenceProcedure;
        let expedient_list = userData.licenceExpedient;
        let inspection_list = userData.licenceInspection;
        let businessprocedure_list =
          userData.Permission.BusinessProcedure.BusinessProcedure_List;
        let businessprocedure_add =
          userData.Permission.BusinessProcedure.BusinessProcedure_Add;
        let area_list = userData.Permission.Area.Area_List;
        let department_list = userData.Permission.Department.Department_List;
        let service_list = userData.Permission.Services.Service_List;
        let process_list = userData.Permission.ProcessData.Process_List;
        let Giaconfiguration_List =
          userData.Permission.GiaConfiguration.Giaconfiguration_List;
        if (
          userData !== "" &&
          userData !== null &&
          visit_list !== undefined &&
          procedure_list !== undefined &&
          expedient_list !== undefined &&
          inspection_list !== undefined &&
          area_list !== undefined &&
          department_list !== undefined &&
          service_list !== undefined &&
          process_list !== undefined &&
          businessprocedure_list !== undefined &&
          businessprocedure_add !== undefined &&
          Giaconfiguration_List != undefined
        ) {
          // IdentityId = userData['IdentityId'];
          // identityList = identity_list;
          visitList = visit_list;
          procedureList = procedure_list;
          expedientList = expedient_list;
          inspectionList = inspection_list;
          areaList = area_list;
          departmentList = department_list;
          serviceList = service_list;
          processList = process_list;
          businessprocedureList = businessprocedure_list;
          businessprocedureAdd = businessprocedure_add;
          giaCongigurationList = Giaconfiguration_List;
        }
      }
    } else {
      dispatch(userSignOut());
    }
  } else {
    dispatch(userSignOut());
  }

  useEffect(() => {
    // if (IdentityId) {
    //   dispatch(userRolePermissionByUserId(IdentityId));
    // }
  }, []);

  return (
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/crypto`} />
      <Route
        path={`${match.url}/crypto`}
        component={asyncComponent(() => import("./Crypto/index"))}
      />
      <Route
        path={`${match.url}/employee`}
        component={asyncComponent(() => import("./Crypto/identities"))}
      />

      {visitList === true ? (
        <Route
          path={`${match.url}/visit`}
          component={asyncComponent(() => import("./Crypto/visit"))}
        />
      ) : null}

      <Route
        path={`${match.url}/employee-work-log`}
        component={asyncComponent(() => import("./Crypto/employee_work_log"))}
      />

      {procedureList === true ? (
        <Route
          path={`${match.url}/procedure`}
          component={asyncComponent(() => import("./Crypto/procedure"))}
        />
      ) : null}
      {businessprocedureList === true ? (
        <Route
          path={`${match.url}/business-procedure`}
          component={asyncComponent(() =>
            import("./Crypto/business_procedure")
          )}
        />
      ) : null}
      {businessprocedureAdd === true ? (
        <Route
          path={`${match.url}/add-procedure`}
          component={asyncComponent(() => import("./Crypto/add_procedure"))}
        />
      ) : null}
      {businessprocedureList === true ? (
        <Route
          path={`${match.url}/procedure-detail`}
          component={asyncComponent(() => import("./Crypto/procedure_detail"))}
        />
      ) : null}
      {businessprocedureList === true ? (
        <Route
          path={`${match.url}/inspection-detail`}
          component={asyncComponent(() =>
            import("./Crypto/instruction_detail")
          )}
        />
      ) : null}
      {businessprocedureList === true ? (
        <Route
          path={`${match.url}/procedure-launch`}
          component={asyncComponent(() => import("./Crypto/procedure_launch"))}
        />
      ) : null}

      {expedientList === true ? (
        <Route
          path={`${match.url}/expedient`}
          component={asyncComponent(() => import("./Crypto/expedient"))}
        />
      ) : null}

      {inspectionList === true ? (
        <Route
          path={`${match.url}/inspection`}
          component={asyncComponent(() => import("./Crypto/inspection"))}
        />
      ) : null}

      <Route
        path={`${match.url}/document`}
        component={asyncComponent(() => import("./Crypto/document"))}
      />
      <Route
        path={`${match.url}/user-reports`}
        component={asyncComponent(() => import("./Crypto/reports"))}
      />
      <Route
        path={`${match.url}/out-look-setting`}
        component={asyncComponent(() => import("./Crypto/out_look_setting"))}
      />
      <Route
        path={`${match.url}/active-directory-setting`}
        component={asyncComponent(() =>
          import("./Crypto/active_directory_setting")
        )}
      />
      <Route
        path={`${match.url}/setting`}
        component={asyncComponent(() => import("./Crypto/setting"))}
      />
      <Route
        path={`${match.url}/help`}
        component={asyncComponent(() => import("./Crypto/help"))}
      />
      <Route
        path={`${match.url}/global_search`}
        component={asyncComponent(() => import("./Crypto/global_search"))}
      />
      {areaList === true ? (
        <Route
          path={`${match.url}/area`}
          component={asyncComponent(() => import("./Crypto/area"))}
        />
      ) : null}
      {departmentList === true ? (
        <Route
          path={`${match.url}/department`}
          component={asyncComponent(() => import("./Crypto/department"))}
        />
      ) : null}
      {serviceList === true ? (
        <Route
          path={`${match.url}/services`}
          component={asyncComponent(() => import("./Crypto/services"))}
        />
      ) : null}
      <Route
        path={`${match.url}/role-and-permission`}
        component={asyncComponent(() => import("./Crypto/role_and_permission"))}
      />
      <Route
        path={`${match.url}/change-password`}
        component={asyncComponent(() => import("./Crypto/change_password"))}
      />
      {processList === true ? (
        <Route
          path={`${match.url}/process`}
          component={asyncComponent(() => import("./Crypto/process"))}
        />
      ) : null}
      {giaCongigurationList === true ? (
        <Route
          path={`${match.url}/giaconfiguration`}
          component={asyncComponent(() => import("./Crypto/gia_configuration"))}
        />
      ) : (
        ""
      )}
      <Route
        path={`${match.url}/general-settings`}
        component={asyncComponent(() => import("./Crypto/general_settings"))}
      />
      <Route
        path={`${match.url}/visit-procedure-management`}
        component={asyncComponent(() =>
          import("./Crypto/visit_procedure_management")
        )}
      />
      <Route
        path={`${match.url}/add-visit-procedure`}
        component={asyncComponent(() => import("./Crypto/add_visit_procedure"))}
      />

      <Route
        path={`${match.url}/add-business-procedure`}
        component={asyncComponent(() =>
          import("./Crypto/add_business_procedure")
        )}
      />

      <Route
        path={`${match.url}/log-management`}
        component={asyncComponent(() => import("./Crypto/log_management"))}
      />

      <Route
        path={`${match.url}/business-procedure-management`}
        component={asyncComponent(() =>
          import("./Crypto/business_procedure_management")
        )}
      />
    </Switch>
  );
};
export default Home;
