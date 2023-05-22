import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    INSPECTIONS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_INSPECTIONS,
    GET_INSPECTIONS_SUCCESS_DATA,
    GET_INSPECTIONS_REPORT,
    GET_INSPECTIONS_REPORT_SUCCESS_DATA,
    GET_CALENDAR,
    GET_CALENDAR_SUCCESS_DATA,
    GET_INITIAL_SIGNIN_STATUS,
    GET_INITIAL_SIGNIN_STATUS_SUCCESS,
    SAVE_CALENDAR_DATA,
    SAVE_CALENDAR_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    VALIDATE_INITIAL_DIRECTORY,
    VALIDATE_INITIAL_DIRECTORY_SUCCESS,
    SET_DIRECTORY_TOKEN,
    SET_DIRECTORY_TOKEN_SUCCESS
  } from "constants/ActionTypes";
   
  export const get_inspections = (inspection) => {
    return {
      type: GET_INSPECTIONS,
      payload: inspection
    };
  };

  export const getInspectionsSuccess = (data) => {
    return {
      type: GET_INSPECTIONS_SUCCESS_DATA,
      payload: data
    };
  };

  export const getCalendar = (param) => {
    return {
      type: GET_CALENDAR,
      payload: param
    };
  };
  
  export const getCalendarSuccess = (data) => {
    return {
      type: GET_CALENDAR_SUCCESS_DATA,
      payload: data
    };
  };

  export const getInitialSigninStatus = () => {
    return {
      type: GET_INITIAL_SIGNIN_STATUS
      // payload: code
    };
  };
  
  export const getInitialSigninStatusSuccess = (data) => {
    return {
      type: GET_INITIAL_SIGNIN_STATUS_SUCCESS,
      payload: data
    };
  };

  export const validateInitialDirectory = () => {
    return {
      type: VALIDATE_INITIAL_DIRECTORY
      // payload: code
    };
  };
  
  export const validateInitialDirectorySuccess = (data) => {
    return {
      type: VALIDATE_INITIAL_DIRECTORY_SUCCESS,
      payload: data
    };
  };

  export const setDirectoryToken = (param) => {
    return {
      type: SET_DIRECTORY_TOKEN,
      payload: param
    };
  };
  
  export const setDirectoryTokenSuccess = (data) => {
    return {
      type: SET_DIRECTORY_TOKEN_SUCCESS,
      payload: data
    };
  };

  export const saveCalendarData = (data) => {
    return {
      type: SAVE_CALENDAR_DATA,
      payload: data
    };
  };

  export const saveCalendarSuccess = () => {
    return {
      type: SAVE_CALENDAR_SUCCESS_DATA
    };
  };

  export const getInspectionreportSuccess = (report) => {
    return {
      type: GET_INSPECTIONS_REPORT_SUCCESS_DATA,
      payload: report
    };
  };

  export const get_reportinspection = (condition) => {
    return {
      type: GET_INSPECTIONS_REPORT,
      payload: condition
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showInspectorsLoader = () => {
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
      type: INSPECTIONS_STATUS_SHOW_SUCCESS_MESSAGE,
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