import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Settings from "./Settings";
import Auth from "./Auth";
import Notes from "./Notes";
import Contact from "./Contact";
import Common from "./Common";
import visitsReducers from "./VisitsReducers";
import employeesReducers from "./EmployeesReducers";
import proceduresReducers from "./ProceduresReducers";
import businessProceduresReducers from "./BusinessProceduresReducers";
import documentsReducers from "./DocumentsReducers";
import reportsReducers from "./ReportsReducers";
import inspectionsReducers from "./InspectionsReducers";
import identitiesReducers from "./IdentitiesReducers";
import selidentitiesReducers from "./SelidentitiesReducers";
import expedientsReducers from "./ExpedientsReducers";
import expdocumentsReducers from "./ExpdocumentsReducers";
import docdocumentsReducers from "./DocdocumentsReducers";
import alldocumentsReducers from "./AlldocumentsReducers";
import getreportsReducers from "./GetreportsReducers";
import areaReducers from "./AreaReducers";
import departmentReducers from "./DepartmentReducers";
import serviceReducers from "./ServiceReducers";
import processReducers from "./ProcessReducers";
import rolePermissionReducers from "./RolePermissionReducers";
import generalSettingsReducers from "./GeneralSettingsReducers";
import visitProcedureReducers from "./VisitProcedureReducers";
import logManagementReducers from "./LogManagementReducers";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    settings: Settings,
    auth: Auth,
    notes: Notes,
    contact: Contact,
    common: Common,
    visitsReducers: visitsReducers,
    employeesReducers: employeesReducers,
    proceduresReducers: proceduresReducers,
    businessProceduresReducers: businessProceduresReducers,
    documentsReducers: documentsReducers,
    reportsReducers: reportsReducers,
    inspectionsReducers: inspectionsReducers,
    identitiesReducers: identitiesReducers,
    selidentitiesReducers: selidentitiesReducers,
    expedientsReducers: expedientsReducers,
    expdocumentsReducers: expdocumentsReducers,
    docdocumentsReducers: docdocumentsReducers,
    alldocumentsReducers: alldocumentsReducers,
    getreportsReducers: getreportsReducers,
    areaReducers: areaReducers,
    departmentReducers: departmentReducers,
    serviceReducers: serviceReducers,
    processReducers: processReducers,
    rolePermissionReducers: rolePermissionReducers,
    generalSettingsReducers: generalSettingsReducers,
    visitProcedureReducers: visitProcedureReducers,
    logManagementReducers: logManagementReducers,
  });

export default createRootReducer;
