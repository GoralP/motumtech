import { all } from "redux-saga/effects";
import authSagas from "./Auth";
import notesSagas from "./Notes";
import visitsSagas from "./VisitsSagas";
import employeesSagas from "./EmployeesSagas";
import proceduresSagas from "./ProceduresSagas";
import businessProceduresSagas from "./BusinessProceduresSagas";
import documentsSagas from "./DocumentsSagas";
import reportsSagas from "./ReportsSagas";
import inspectionsSagas from "./InspectionsSagas";
import identitiesSagas from "./IdentitiesSagas";
import selidentitiesSagas from "./SelidentitiesSagas";
import expedientsSagas from "./ExpedientsSagas";
import expdocumentsSagas from "./ExpdocumentsSagas";
import docdocumentsSagas from "./DocdocumentsSagas";
import alldocumentsSagas from "./AlldocumentsSagas";
import getreportsSagas from "./GetreportsSagas";
import areaSagas from "./AreaSagas";
import departmentSagas from "./DepartmentSagas";
import serviceSagas from "./ServiceSagas";
import processSagas from "./ProcessSagas";
import rolePermissionSagas from "./RolePermissionSagas";
import generalSettingsSagas from "./GeneralSettingsSagas";
import visitProcedureSagas from "./VisitProcedureSagas";
import logManagementSagas from "./LogManagementSagas";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    notesSagas(),
    visitsSagas(),
    employeesSagas(),
    proceduresSagas(),
    businessProceduresSagas(),
    documentsSagas(),
    reportsSagas(),
    inspectionsSagas(),
    identitiesSagas(),
    selidentitiesSagas(),
    expedientsSagas(),
    expdocumentsSagas(),
    docdocumentsSagas(),
    alldocumentsSagas(),
    getreportsSagas(),
    areaSagas(),
    departmentSagas(),
    serviceSagas(),
    processSagas(),
    rolePermissionSagas(),
    generalSettingsSagas(),
    visitProcedureSagas(),
    logManagementSagas(),
  ]);
}
