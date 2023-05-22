import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    VISITS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_VISITS,
    GET_VISITS_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    GET_VISITS_REPORT,
    GET_VISITS_REPORT_SUCCESS_DATA,
    SET_GLOBALDATA,
    SAVE_VISIT_DATA,
    GET_PROCEDURE_TYPE,
    GET_PROCEDURE_TYPE_SUCCESS,
    READ_DESKO_SERVICE_DATA,
    GET_DESKO_SERVICE_DATA_SUCCESS,
    SAVE_VISIT_DATA_SUCCESS,
    SAVE_VISIT_DATA_UNSUCCESS,
    GET_IDENTITY_DETAIL,
    GET_IDENTITY_DETAIL_SUCCESS_DATA,
    GET_SCHEDULE_VISIT,
    GET_SCHEDULE_VISIT_SUCCESS_DATA,
    ADD_VISIT_STATUS_CHANGE,
    ADD_IDENTITY_STATUS_CHANGE,
    GET_SCHEDULED_VISIT_STATUS_CHANGE,
    SAVE_TYPE_STATUS_CHANGE,
    CLOSE_MODAL_AFTER_SUCCESS,
    SAVING_TYPE_STATUS_CHANGE,
    GET_SCHEDULE_VISITS_LIST,
    GET_SCHEDULE_VISIT_LIST_SUCCESS_DATA,
    GET_EVENT_AND_INVITEES,
    GET_SCHEDULE_STATUS_CHANGE,
    GET_SCHEDULE_STATUS_SUCCESS,
    CLEAR_DESKO_DATA
  } from "constants/ActionTypes";

  export const get_visits = (visit) => {
    return {
      type: GET_VISITS,
      payload: visit
    };
  };

  export const getVisitsSuccess = (data) => {
    return {
      type: GET_VISITS_SUCCESS_DATA,
      payload: data
    };
  };

  export const readDeskoServiceData = () => {
    return {
      type: READ_DESKO_SERVICE_DATA
    };
  };

  export const getDeskoServiceDataSuccess = (data) => {
    return {
      type: GET_DESKO_SERVICE_DATA_SUCCESS,
      payload: data
    };
  };

  export const clearData = () => {
    return {
      type: CLEAR_DESKO_DATA
    };
  };

  export const addVisitStatusChange = (data) => {
    return {
      type: ADD_VISIT_STATUS_CHANGE,
      payload: data
    };
  };

  export const addIdentityStatusChange = (data) => {
    return {
      type: ADD_IDENTITY_STATUS_CHANGE,
      payload: data
    };
  };

  export const getScheduledVisitStatusChange = (data) => {
    return {
      type: GET_SCHEDULED_VISIT_STATUS_CHANGE,
      payload: data
    };
  };

  export const getScheduleStatusChange = () => {
    return {
      type: GET_SCHEDULE_STATUS_CHANGE
    };
  };

  export const getIdentityDetails = (data) => {
    return {
      type: GET_IDENTITY_DETAIL,
      payload: data
    };
  };

  export const getIdentityDetailsSuccess = (data) => {
    return {
      type: GET_IDENTITY_DETAIL_SUCCESS_DATA,
      payload: data
    };
  };

  export const getScheduleVisit = (data) => {
    return {
      type: GET_SCHEDULE_VISIT,
      payload: data
    };
  };

  export const getScheduleVisitSuccess = (data) => {
    return {
      type: GET_SCHEDULE_VISIT_SUCCESS_DATA,
      payload: data
    };
  };

  export const getScheduleVisitsList = () => {
    return {
      type: GET_SCHEDULE_VISITS_LIST
    };
  };

  export const getEventAndInvitees = () => {
    return {
      type: GET_EVENT_AND_INVITEES
    };
  };

  export const getScheduleVisitsListSuccess = (data) => {
    return {
      type: GET_SCHEDULE_VISIT_LIST_SUCCESS_DATA,
      payload: data
    };
  };

  export const getScheduleStatusSuccess = () => {
    return {
      type: GET_SCHEDULE_STATUS_SUCCESS
    };
  };

  export const changeSaveTypeStatus = (data) => {
    return {
      type: SAVE_TYPE_STATUS_CHANGE,
      payload: data
    };
  };

  export const changeSavingTypeStatus = (data) => {
    return {
      type: SAVING_TYPE_STATUS_CHANGE,
      payload: data
    };
  };

  export const get_procedure_type = () => {
    return {
      type: GET_PROCEDURE_TYPE,
    };
  };

  export const getProcedureTypeSuccess = (data) => {
    return {
      type: GET_PROCEDURE_TYPE_SUCCESS,
      payload: data
    };
  };

  export const saveVisitData = (Data) => {
    return {
      type: SAVE_VISIT_DATA,
      payload: Data
    };
  };

  export const saveVisitSuccess = (data) => {
    return {
      type: SAVE_VISIT_DATA_SUCCESS,
      payload: data
    };
  };

  export const closeModalAfterSuccess = (data) => {
    return {
      type: CLOSE_MODAL_AFTER_SUCCESS,
      payload: data
    };
  };

  export const saveVisitUnSuccess = (data) => {
    return {
      type: SAVE_VISIT_DATA_UNSUCCESS,
      payload: data
    };
  };

  export const setGlobaldata = (globaldata) => {
    return {
      type: SET_GLOBALDATA,
      payload: globaldata
    };
  };

  export const getVisitreportSuccess = (report) => {
    return {
      type: GET_VISITS_REPORT_SUCCESS_DATA,
      payload: report
    };
  };

  export const get_reportvisit = (condition) => {
    return {
      type: GET_VISITS_REPORT,
      payload: condition
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showVisitorsLoader = () => {
    return {
      type: ON_SHOW_LOADER,
    };
  };
  
  export const showErrorMessage = (message) => {
    return {
      type: SHOW_MESSAGE,
      payload: message
    };
  };
  
  export const showSuccessMessage = (message) => {
    return {
      type: VISITS_STATUS_SHOW_SUCCESS_MESSAGE,
      payload: message
    };
  };
  
  export const showAuthLoader = () => {
    return {
      type: ON_SHOW_LOADER,
    };
  };
  
  export const hideMessage = () => {
    return {
      type: HIDE_MESSAGE,
    };
  };
  
  export const hideAuthLoader = () => {
    return {
      type: ON_HIDE_LOADER,
    };
  };